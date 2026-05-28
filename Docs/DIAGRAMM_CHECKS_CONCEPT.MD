# Diagramm Checks Konzept und aktueller Implementierungsstand

Stand: 2026-05-19

Dieses Dokument beschreibt den aktuellen Stand der Diagramm-Checks im Projekt. Die Implementierung liegt im Wesentlichen in:

- `src/check/runDiagramCheck.ts`
- `src/check/checkContext.ts`
- `src/check/rules.ts`
- `src/check/componentSpecificRules.ts`
- `src/sidebar/DiagramCheckPage.tsx`

Die Checks sind aktuell als Beta-Funktion in der Sidebar sichtbar. Sie werden manuell ueber den Button "Diagramm jetzt pruefen" gestartet. Die UI zeigt gefundene Issues gruppiert an und kann betroffene Komponenten und Wires im Diagramm hervorheben.

## Ablauf

1. Die Sidebar erzeugt ueber `createDiagramExportJson(reactFlow)` ein JSON-Modell aus dem aktuellen React-Flow-Diagramm.
2. `runDiagramCheck(jsonData)` parst dieses Modell.
3. Falls keine Nodes vorhanden sind, wird sofort ein einzelnes Info-Issue `diagram-empty` erzeugt.
4. Fuer nicht leere Diagramme erzeugt `createDiagramCheckContext(nodes, edges)` einen technischen Check-Kontext mit Handles, Netzen, Klassifikationen und Hilfsfunktionen.
5. Danach laufen alle Regeln aus `diagramCheckRules` ueber diesen Kontext.
6. Die UI rendert die Issues. Beim Aufklappen eines Issues werden dessen Targets im Diagramm markiert.

## Datenmodell fuer Checks

### CheckHandle

Jeder sichtbare Anschluss einer Komponente wird zu einem `CheckHandle`.

Ein `CheckHandle` enthaelt unter anderem:

- `node`: die React-Flow-Node der Komponente
- `handle`: die eigentlichen Handle-Daten aus der Komponentendefinition
- `rawFunctions`: die direkt am Handle definierten Funktionen
- `functions`: aktuell identisch zu `rawFunctions`, aber als Erweiterungspunkt vorhanden
- `connectedEdges`: alle Wires, die an diesem Handle haengen
- `voltageOut`: abgeleitete Ausgangsspannung
- `voltageMin` / `voltageMax`: erlaubter Eingangs-Spannungsbereich

Nur sichtbare Handles werden beruecksichtigt. Handles werden ausgefiltert, wenn ihre `hideConditions` anhand der aktuellen `selectFields` der Komponente greifen. Es werden sowohl `data.handles` als auch `data.repeatedHandleArray` einer Node einbezogen. Konkrete wiederholte Handles aus `data.repeatedHandleArray`, z.B. `R_middle_4`, sind aus Template-Handles wie `R_middle` erzeugt. Fuer die Pruefung muessen sie die fachlichen Metadaten des Templates erben koennen, insbesondere `functions`, Toleranzen, `Vout`/`VoutDependency`, `controllableBy`, `mustBeConnected` und `hideConditions`, weil aeltere gespeicherte Diagramme diese Werte an den konkreten Middle-Handles teilweise nicht enthalten.

### Funktionen an Handles

Die Check-Logik arbeitet stark ueber `handle.functions`. Relevante Funktionsgruppen sind aktuell:

- Versorgung: `suppl_out`, `suppl_in`, `gnd`
- Digitale Signale: `dig_out`, `dig_in`, `dig_clock_out`, `dig_clock_in`, `dig_backup_out`, `dig_backup_in`
- PWM: `pwm_out`, `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W`, `pwm_in_WW`
- Analog: `an_out`, `an_in`
- Audio: `audio_out`, `audio_in`
- USB: `usb_power_out`, `usb_full`
- Ethernet: `eth`
- RS485: `rs485_A`, `rs485_B`
- Netzspannung: `line_out`, `line_in`, `neutral_out`, `neutral_in`, `pe_out`, `pe_in`

### Steuerbeziehungen an Handles

`HandleDataType` besitzt ein optionales Attribut `controllableBy?: string`.

Dieses Attribut beschreibt keine elektrische Verbindung, sondern eine funktionale Abhaengigkeit: Wenn ein Ausgangs-Handle benutzt wird, muss ein anderes Handle derselben Komponente als Steuer-/Enable-Eingang angeschlossen sein. Der Wert ist die `hid` des steuernden Handles.

Beispiel:

- Ein geschalteter Versorgungsausgang `VOUT1` bekommt `controllableBy: "EN1"`.
- Ein PWM-Lastausgang `PWMOUT1` bekommt `controllableBy: "PWMIN1"`.
- Ein Relais-Ausgang `VOUT2` bekommt `controllableBy: "CTRL1"`.

Das Attribut soll bewusst generisch bleiben und nicht nur fuer Versorgung gelten. Es kann auf `suppl_out`, `pwm_out` oder spaeter andere geschaltete/steuerbare Ausgangstypen gesetzt werden. Die eigentliche Regel entscheidet dann ueber die Funktionen des referenzierten Steuer-Handles, ob es sich um ein digitales Steuernetz handelt.

Wenn der referenzierte Steuer-Handle ueber `data.internalConnections` mit `kind === 'short'` mit einem anderen Handle verbunden ist, gelten beide Handles als gleichwertige Steuerpunkte. Es reicht dann, wenn einer dieser kurzgeschlossenen Steuer-Handles in einem digitalen Netz liegt. Damit koennen z.B. intern gebrueckte Enable-Pins modelliert werden, ohne fuer jeden geschalteten Ausgang mehrere Controller-Referenzen pflegen zu muessen.

### Spannungsdaten

Ausgangsspannungen werden fuer Handles mit Ausgangsfunktion abgeleitet:

- Wenn `handle.Vout` eine Zahl groesser 0 ist, wird diese verwendet.
- Wenn `handle.VoutDependency` auf ein Input-Feld zeigt und dieses einen numerischen Wert hat, wird dieser Wert verwendet.
- Fuer `suppl_out` wird zusaetzlich das Input-Feld `source_voltage` als Fallback genutzt.
- `resolveVoltageOut()` kann bei abhaengigen Ausgaengen die Spannung rekursiv ueber versorgende, extern erreichbare Handles aufloesen.

Eingangstoleranzen werden fuer Eingangs-Handles aus `tolVmin` und `tolVmax` uebernommen. Ein Eingang ohne definierte Grenzen akzeptiert jede aufgeloeste Spannung.

## Netzaufbau

Die Netze werden aktuell in vier Sichten aufgebaut. Diese Schichtung ist wichtig, weil unterschiedliche Regeln unterschiedlich weit "durch" Komponenten schauen muessen und weil Sicherungen je nach Check entweder als verbindende Schutzkomponente oder als trennende Netzgrenze betrachtet werden muessen.

### 1. Elementary Nets

Elementary Nets bilden die reine elektrische Verbindung ueber Wires und passive Verbindungsknoten.

Regeln:

- Zuerst wird fuer jedes sichtbare Handle ein Union-Find-Knoten erzeugt.
- Jede Wire mit gueltigem `sourceHandle` und `targetHandle` verbindet die beiden Handle-Knoten.
- Wires, deren Source- oder Target-Handle im aktuellen sichtbaren Handle-Set nicht existiert, werden ignoriert.
- Passive Verbindungsknoten verbinden alle ihre Handles intern miteinander.

Aktuell gelten diese Komponenten als passive Verbindungsknoten:

- `SolderJoint`
- `WAGO_2X`
- `WAGO_3X`

Nach dem Gruppieren werden nur Elementary Nets behalten, die mindestens eine Wire enthalten. Reine unverdrahtete Einzel-Handles werden nicht als Netz in die Netzliste aufgenommen.

### 2. Fused Nets

Fused Nets gruppieren Elementary Nets ueber interne Sicherungsverbindungen.

Regeln:

- Jede Komponente kann `data.internalConnections` definieren.
- Aktuell werden nur interne Verbindungen mit `kind === 'fuse'` ausgewertet.
- Wenn `fromHandle` und `toHandle` existieren und in unterschiedlichen Elementary Nets liegen, werden diese Child-Nets verbunden.

Damit werden Netze auf beiden Seiten einer Sicherung fuer die Check-Logik als zusammenhaengende versorgungsbezogene Gruppe betrachtet, ohne die Sicherung als einfache Wire modellieren zu muessen.

### 3. Component-Linked Nets

Component-Linked Nets gruppieren Fused Nets zusaetzlich ueber bestimmte interne Beziehungen innerhalb einer Komponente. Diese Schicht ist die Hauptgrundlage fuer die Network Rules.

Interne Verknuepfung erfolgt aktuell, wenn zwei Handles derselben Node in unterschiedlichen Fused Nets liegen und eine der folgenden Bedingungen gilt:

- Die Komponente definiert in `data.internalConnections` eine harte Kurzschlussverbindung mit `kind === 'short'` zwischen den beiden Handles.
- Beide Handles haben `gnd`.
- Ein `suppl_out` ist von einem `suppl_in` abhaengig: `suppl_out.VoutDependency === suppl_in.hid`.
- Zwei `suppl_out`-Handles haben feste Ausgangsspannungen, die sich um weniger als 0.5 V unterscheiden.
- Zwei `suppl_out`-Handles verwenden dieselbe `VoutDependency`, die als Input-Feld der Komponente existiert.
- Bei LED-Komponenten (`node.data.group === 'led'`) werden mehrere `suppl_in`-Handles derselben Komponente verbunden.
- Bei einem `Resistor` werden zwei Netze verbunden, wenn beide angrenzenden Fused Nets als digitale Netze klassifiziert sind.

`kind === 'short'` ist fuer explizite, harte interne Pin-Bruecken gedacht, z.B. wenn zwei Signal- oder Enable-Pins auf der Platine direkt miteinander verbunden sind. GND-Pins sollen nicht explizit als `short` modelliert werden, weil GND-Handles derselben Komponente bereits automatisch verbunden werden.

Diese Layer-Logik erlaubt z.B.:

- gemeinsame GND-Bezuege innerhalb einer Komponente zu erkennen
- weitergereichte Versorgungsausgaenge von echten unabhaengigen Quellen zu unterscheiden
- LED-Streifen mit mehreren Einspeisepunkten als einen Verbraucherzusammenhang zu behandeln
- digitale Signale ueber einen Serienwiderstand hinweg als erreichbar zu betrachten

### 4. Component-Linked Elementary based Nets

Component-Linked Elementary based Nets sind die vierte Netzsicht. Sie werden analog zu Component-Linked Nets aufgebaut, verwenden als Ausgangspunkt aber Elementary Nets statt Fused Nets.

Der fachliche Unterschied ist bewusst: Sicherungen (`internalConnections.kind === 'fuse'`) verbinden diese Netze nicht. Eine Sicherung bleibt hier eine trennende Grenze. Dadurch teilen Fuses ein Component-Linked Net in mehrere separate Netze, sofern die beiden Seiten nicht ueber Wires, passive Verbindungsknoten oder andere interne Component-Link-Regeln ohne Fuse wieder zusammenhaengen.

Zweck dieser Sicht:

- Checks koennen erkennen, welche Bereiche wirklich ohne Sicherung direkt miteinander verbunden sind.
- Sicherungs-Bypass- und Schutzbereichsregeln bekommen eine Netzsicht, in der die Sicherung selbst nicht schon die beiden Seiten zusammenfasst.
- Versorgungspfade koennen getrennt betrachtet werden, wenn mehrere abgesicherte Abgaenge aus derselben Quelle kommen.
- Fehler wie "Quelle und Verbraucher liegen im selben Component-Linked Net" koennen bei Bedarf feiner bewertet werden: einmal inklusive Sicherungen (`Component-Linked Nets`) und einmal ohne Sicherungsbruecken (`Component-Linked Elementary based Nets`).

Aufbau:

1. Ausgangspunkt sind die vorhandenen Elementary Nets.
2. Fuer jedes Elementary Net wird ein Union-Find-Knoten erzeugt.
3. Danach werden dieselben Component-Link-Regeln angewendet wie bei Component-Linked Nets, aber immer auf Basis der Elementary-Net-Zugehoerigkeit.
4. `kind === 'fuse'` wird dabei explizit ignoriert. Eine Fuse darf in dieser Schicht keine Union-Verbindung erzeugen.
5. `kind === 'short'` bleibt weiterhin eine harte interne Verbindung und verbindet die betroffenen Elementary-basierten Netze.
6. Automatische interne Beziehungen wie gemeinsame GND-Handles, abhaengige `suppl_out`-zu-`suppl_in`-Pfade, gleiche feste `suppl_out`-Spannungen, gleiche `VoutDependency`, LED-`suppl_in`-Gruppierung und digitale Resistor-Pass-Throughs werden analog zur bestehenden Component-Linked-Logik angewendet.
7. Nach dem Gruppieren entstehen Netze mit derselben Struktur wie bestehende `CheckNet`s: `handles`, `edges`, `componentIds`, `sourceHandles`, `sinkHandles`, `classifications` und `childNetIds`.

Wichtig ist die Reihenfolge: Diese Netzsicht soll nicht aus Fused Nets abgeleitet werden, weil dann die Information verloren waere, welche Elementary Nets nur durch eine Sicherung zusammengekommen sind. Sie muss direkt parallel zum Fused-Net-Aufbau aus Elementary Nets entstehen.

Beispiel:

- PSU `V+` speist Eingang einer Sicherung.
- Ausgang der Sicherung geht zu einem LED-Strip.
- Die Fuse-Komponente definiert `internalConnections.kind === 'fuse'` zwischen Eingang und Ausgang.

Ergebnis:

- Elementary Nets: eine Seite vor der Sicherung, eine Seite nach der Sicherung.
- Fused Nets: beide Seiten werden zu einem Fused Net gruppiert.
- Component-Linked Nets: beide Seiten bleiben als zusammenhaengender versorgungsbezogener Kontext sichtbar.
- Component-Linked Elementary based Nets: beide Seiten bleiben getrennt, solange keine zusaetzliche direkte Verbindung die Sicherung umgeht.

Wenn dieselben beiden Sicherungsseiten zusaetzlich extern per Wire, SolderJoint, WAGO oder durch eine interne `short`-Verbindung verbunden sind, liegen sie auch in Component-Linked Elementary based Nets im selben Netz. Genau dieser Unterschied ist fuer Bypass-Erkennung und Schutzbereichsgrenzen relevant.

Technische Einbindung:

- `DiagramCheckContext` besitzt zusaetzlich zu `elementaryNets`, `fusedNets` und `componentLinkedNets` eine Liste `componentLinkedElementaryBasedNets`.
- Die Lookup-Funktion `getComponentLinkedElementaryBasedNetByHandle(handle)` erlaubt Regeln, explizit diese Netzsicht anzufordern.
- Bestehende Network Rules bleiben zunaechst auf `context.componentLinkedNets`, damit sich das aktuelle Verhalten nicht aendert.
- Neue oder angepasste Regeln waehlen bewusst die passende Netzsicht:
  - Component-Linked Nets fuer allgemeine elektrische/versorgungsbezogene Zusammenhaenge inklusive Sicherungen.
  - Component-Linked Elementary based Nets fuer Schutzbereichs-, Fuse-Bypass- und "direkt verbunden ohne Sicherung"-Checks.
- Die Regel `fuseBypassed` verwendet diese Netzsicht, damit auch Bypaesse erkannt werden, die nicht schon im selben Elementary Net liegen, sondern ueber andere Component-Link-Regeln ohne Fuse entstehen.
- Im Debug-Modus wird diese Netzsicht zusammen mit Elementary, Fused und Component-Linked Nets angezeigt, damit Unterschiede zwischen abgesicherten und direkt verbundenen Bereichen nachvollziehbar sind.

## Netzklassifikation

Jedes Netz wird anhand der enthaltenen Handles klassifiziert. Ein Netz kann mehrere Klassifikationen haben; genau daraus entstehen viele Fehlerchecks.

Aktuelle Klassifikationen:

- `gnd_net_type`: mindestens ein Handle hat `gnd`
- `suppl_net_type`: mindestens ein Handle hat `suppl_out`
- `digital_net_type`: mindestens ein exklusiver digitaler Ausgang liegt im Netz
- `pwm_net_type`: mindestens ein exklusiver `pwm_out`
- `analog_net_type`: mindestens ein exklusiver `an_out`
- `audio_net_type`: mindestens ein exklusiver `audio_out`
- `eth_net_type`: mindestens ein Handle hat `eth`
- `usb_net_type`: mindestens ein exklusiver `usb_power_out`
- `rs485_a_net_type`: mindestens ein Handle hat `rs485_A`
- `rs485_b_net_type`: mindestens ein Handle hat `rs485_B`
- `N_net_type`: mindestens ein Handle hat `neutral_out`
- `L_net_type`: mindestens ein Handle hat `line_out`
- `PE_net_type`: mindestens ein Handle hat `pe_out`

"Exklusiv" bedeutet hier: Das Handle hat genau eine klassifikationsrelevante Funktion und diese Funktion gehoert zur jeweiligen Gruppe. Das verhindert, dass Mehrzweck-Handles zu aggressiv als Signalquelle klassifiziert werden.

Ein Netz speichert ausserdem:

- `handles`: alle enthaltenen CheckHandles
- `edges`: alle enthaltenen Wires
- `componentIds`: alle beteiligten Komponenten
- `sourceHandles`: Handles mit Ausgangs-/Quellfunktion
- `sinkHandles`: Handles mit Eingangs-/Senkenfunktion
- `childNetIds`: IDs der gruppierten Netze aus der vorherigen Schicht

## Erreichbarkeits-Hilfsfunktionen

Neben den Netzen gibt es Reachability-Funktionen, die fuer einige Checks genutzt werden.

### `powerReachableHandles(handle)`

Startet bei einem Handle und folgt:

- Elementary-Net-Verbindungen
- internen Kurzschlussverbindungen `internalConnections.kind === 'short'`
- internen Sicherungsverbindungen
- internen `suppl_in`-zu-`suppl_in`-Verbindungen derselben Komponente

### `externallyPowerReachableHandles(handle)`

Startet nur ueber externe Wires aus der Komponente heraus und bleibt danach ausserhalb der Ausgangskomponente. Diese Funktion wird fuer abhaengige Spannungsausgaenge genutzt, um die externe Quelle zu finden, ohne die eigene Komponente als Quelle zu zaehlen.

### `signalReachableHandles(handle)`

Startet bei einem Handle und folgt:

- Elementary-Net-Verbindungen
- internen Kurzschlussverbindungen `internalConnections.kind === 'short'`
- Serien-Signal-Pass-Through durch `Resistor`, wenn die Komponente genau zwei Handles besitzt

Diese Funktion wird unter anderem genutzt, um digitale Quellen hinter Serienwiderstaenden zu erkennen.

## Network Rules

Network Rules laufen auf `context.componentLinkedNets`.

### `groundMissing`

Fehler, wenn es im Diagramm mindestens einen `gnd`-Handle gibt, aber kein Component-Linked Net mit `gnd_net_type`.

Das bedeutet: Ground-Pins existieren, aber keiner ist verdrahtet bzw. in einem erkannten Ground-Netz.

### `groundMultiple`

Fehler, wenn es zwei oder mehr getrennte Component-Linked Ground-Netze gibt.

Alle betroffenen Ground-Netze werden als Targets markiert. Die betroffenen Netze werden fuer nachgelagerte Prioritaetschecks blockiert, damit nicht zusaetzlich generische Mischfehler auf denselben Netzen entstehen.

### `mainsLowVoltageMixed`

Fehler, wenn ein Netz gleichzeitig Netzspannung (`L_net_type` oder `N_net_type`) und Kleinspannungs-/Signal-Klassifikationen enthaelt.

Wichtig: Diese Regel erkennt nur Mischungen, bei denen die Kleinspannungsseite selbst eine Netzklassifikation beitraegt. Da z.B. `suppl_net_type` aktuell ueber `suppl_out` entsteht, kann eine Verbindung von `line_out` auf einen reinen `suppl_in`-Eingang ohne weitere Quelle durch diese Regel allein unentdeckt bleiben. Dafuer ist die vorgeschlagene Regel `mainsWireConnectedToLowVoltageComponent` wichtig.

Als Kleinspannungs-/Signal-Klassifikationen gelten:

- `gnd_net_type`
- `suppl_net_type`
- `digital_net_type`
- `pwm_net_type`
- `analog_net_type`
- `audio_net_type`
- `eth_net_type`
- `usb_net_type`
- `rs485_a_net_type`
- `rs485_b_net_type`

### `peActiveMixed`

Fehler, wenn ein `PE_net_type` mit aktiven Leitungen oder Signalen gemischt ist.

Als aktive oder Signal-Klassifikationen gelten:

- `L_net_type`
- `N_net_type`
- `suppl_net_type`
- `digital_net_type`
- `pwm_net_type`
- `analog_net_type`
- `audio_net_type`
- `eth_net_type`
- `usb_net_type`
- `rs485_a_net_type`
- `rs485_b_net_type`

### `rs485Mixed`

Fehler, wenn ein Netz gleichzeitig `rs485_a_net_type` und `rs485_b_net_type` hat.

### `mixedClassifications`

Generischer Fehler, wenn ein Netz mehr als eine Klassifikation hat und nicht bereits durch einen priorisierten Sonderfall blockiert wurde.

Priorisierte Sonderfaelle sind aktuell:

- mehrere Ground-Netze
- Netzspannung mit Kleinspannung/Signal
- PE mit aktiven Leitungen/Signal
- RS485 A mit RS485 B

### `multipleSupplySources`

Fehler, wenn ein Supply-Netz mehrere unabhaengige Spannungsquellen enthaelt.

Dabei werden nicht alle `suppl_out` gleich behandelt. Ausgeschlossen werden weitergeleitete Ausgaenge:

- `suppl_out`, dessen `VoutDependency` auf einen `suppl_in` derselben Komponente zeigt
- `suppl_out`, der ueber eine interne `fuse`-Connection von einem `suppl_in` derselben Komponente kommt

Die verbleibenden Quellen werden nach einem Source-Key gruppiert:

- feste `Vout`-Spannung
- Input-Feld-Abhaengigkeit
- aufgeloeste Spannung
- als Fallback Handle-ID

Wenn mehr als ein unabhaengiger Source-Key vorhanden ist, wird ein Fehler erzeugt.

Das gilt auch fuer DCDC-Eingaenge: Ein DCDC-`suppl_in` darf in einem Supply-Netz nicht gleichzeitig mehrere unabhaengige PSU-/Spannungsquellen erreichen. Der Simulationssolver modelliert keine Stromteilung zwischen mehreren Eingangsquellen; der Diagramm-Check soll solche Aufbauten deshalb vor der Simulation als `multipleSupplySources` melden. Mehrere DCDC-Wandler an derselben einzelnen PSU sind dagegen erlaubt, weil sie keine mehreren Quellen in dasselbe Eingangsnetz bringen.

### `signalSinkWithoutSource`

Fehler, wenn ein Signal-Eingang verdrahtet ist, aber das Netz nicht als passendes Signalnetz klassifiziert ist.

Aktuelle Signaldefinitionen:

- Digital: Quellen `dig_out`, `dig_clock_out`, `dig_backup_out`; Senken `dig_in`, `dig_clock_in`, `dig_backup_in`
- PWM: Quelle `pwm_out`; Senken `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W`, `pwm_in_WW`
- Analog: Quelle `an_out`; Senke `an_in`
- Audio: Quelle `audio_out`; Senke `audio_in`
- USB: Quelle `usb_power_out`; Senke `usb_full`

USB ist dabei ein optionaler Power-Pair-Steckverbinder. Ein verdrahtetes oder unverdrahtetes `usb_full` ohne erreichbares `usb_power_out` erzeugt keinen `signalSinkWithoutSource`-Fehler; der USB-Port gilt dann fuer die Versorgung als nicht verwendet, z.B. weil dort nur Daten laufen. Wenn ein `usb_power_out` erreichbar ist, wird die Verbindung nicht als normales Signal, sondern als USB-Power-Sonderfall bewertet. Strukturfehler wie Verzweigungen oder mehrere USB-Senken sollen deshalb nicht als `signalSinkWithoutSource`, sondern als eigene USB-Power-Meldung erscheinen.

Hinweis zu analogen LED-Streifen: `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W` und `pwm_in_WW` werden dort aktuell als negativ geschaltete Lastanschluesse verwendet, nicht als klassische Logiksignal-Eingaenge. Fuer diese Handles sollten Spannungs-/Signalchecks perspektivisch anders arbeiten als bei reinen PWM-Logikpins, z.B. ueber eine eigene Lastanschluss-Funktion oder ueber Komponentenmetadaten, die Common-Anode-LED-Lasten von Signalinputs unterscheiden. Bis dahin sollten fehlende `tolVmin`/`tolVmax` an diesen analogen Strip-Pins nicht automatisch als Definitionsfehler bewertet werden.

Digitale Senken haben eine Sonderbehandlung: Sie gelten auch dann als aufgeloest, wenn ueber `signalReachableHandles()` eine digitale Quelle erreichbar ist oder eine gueltige Bias-Verbindung existiert.

Eine digitale Bias-Verbindung gilt als gueltig, wenn:

- erreichbare digitale Senken vorhanden sind,
- und entweder GND erreichbar ist und die Zielspannung 0 V erlaubt,
- oder ein `suppl_out` erreichbar ist, dessen aufgeloeste Spannung in den erlaubten Bereich der digitalen Senke passt.

Passive Signal-Komponenten `Kerko` und `Resistor` werden dabei nicht als digitale Bias-Ziele betrachtet.

LED-Backup-Eingaenge haben eine zusaetzliche Sonderbehandlung: Ein `dig_backup_in` eines LED-Streifens gilt fuer `signalSinkWithoutSource` als aufgeloest, wenn sein Netz `gnd_net_type` hat und der zugehoerige `dig_in`/`DATA_start` nicht von einem vorgelagerten LED-Streifen gespeist wird. Damit wird der empfohlene Anschluss des ersten Backup-Eingangs an GND nicht faelschlich als fehlende digitale Quelle gemeldet. Wird der Data-Eingang dagegen von einem vorherigen LED-Streifen gespeist, muss der Backup-Eingang weiterhin vom passenden `dig_backup_out` dieses vorgelagerten Streifens kommen.

### `digitalSignalVoltageMismatch`

Fehler, wenn ein digitaler Eingang mit einer digitalen Quelle verbunden ist, deren aufgeloeste Ausgangsspannung ausserhalb von `tolVmin` / `tolVmax` des Eingangs liegt.

Geprueft wird, wenn:

- das Netz als digitales Netz klassifiziert ist, oder
- das Netz keine Klassifikation hat, aber fuer den Eingang digitale Quellen ueber `signalReachableHandles()` gefunden wurden.

Quellen ohne aufloesbare Spannung erzeugen keinen Mismatch.

### `multipleSignalSources`

Fehler, wenn ein klassifiziertes Signalnetz mehr als eine passende Quelle enthaelt.

Geprueft wird fuer dieselben Signaldefinitionen wie bei `signalSinkWithoutSource`. Es werden nur `sourceHandles` des Netzes betrachtet.

### USB-Power-Sonderfall

USB-Netze sind fachlich gleichzeitig Signal-/Steckverbinder-Netze und potenzielle 5-V-Versorgungsnetze. Fuer Diagramm-Checks bleibt die Klassifikation `usb_net_type` bestehen: Quelle ist `usb_power_out`, Senke ist `usb_full`. Zusaetzlich gelten fuer simulierbare USB-Versorgung diese Regeln:

- Eine USB-Wire braucht fuer die Simulation physikalische Wire-Daten. `wireWithoutPhysicalParameters` soll deshalb neben `suppl_net_type` und `gnd_net_type` auch `usb_net_type` betrachten. Laenge und Querschnitt gelten pro USB-Leiter.
- Ein `usb_full` ohne erreichbares `usb_power_out` ist kein Fehler. Der USB-Port wird dann fuer Versorgung und Simulation ignoriert.
- USB-Power ist Point-to-Point: In einem aktiven USB-Power-Netz darf genau ein `usb_power_out` mit genau einem `usb_full` verbunden sein. Verzweigungen, passive Verteiler, mehrere `usb_full`-Senken oder mehrere `usb_power_out`-Quellen sind Diagrammfehler.
- Wenn die USB-Quellspannung aufloesbar ist, soll sie gegen `tolVmin`/`tolVmax` der `usb_full`-Senke geprueft werden. Fuer `PSU_USB` ist die Quelle 5 V.
- USB darf nicht still in normale `suppl_out`/`gnd`-Netze umgedeutet werden. Eine Verbindung zwischen USB-Power und normalen Supply/GND-Anschluessen ist nur dann als interne Komponentenbeziehung erlaubt, wenn die Komponentendefinition dies explizit ueber einen USB-Power-Pair-Simulationsport und konkrete Simulationselemente modelliert: `USB.GND` per `shortBridge` nach lokalem GND und `USB.VBUS` per ideal sperrender `diode` mit ca. `0.4 V` Vorwaertsspannung nach lokalem V+.
- Die Check-Logik selbst soll aus dieser internen USB-Diode keine normale externe Supply-Quelle fuer andere USB-Netze ableiten. Fuer Diagramm-Checks bleibt `usb_full` ein USB-Senkenhandle; die elektrische Aktivierung lokaler V+-Pfade ist Aufgabe des Simulationsmodells.

Vorgeschlagene eigene Meldung: `usbPowerPairInvalid`.

Ausloeser:

- aktives USB-Power-Netz mit mehr oder weniger als genau einem `usb_power_out`;
- aktives USB-Power-Netz mit mehr oder weniger als genau einem `usb_full`;
- passive Verzweigungskomponenten oder mehr als eine sichtbare USB-Wire im Pfad zwischen Quelle und Senke;
- Kombination aus USB-Power und normalen Supply/GND-Handles, die nicht als explizite interne `usbPowerPair`-Modellierung derselben Verbraucherkomponente beschrieben ist.

Severity: `error`, weil der Simulationssolver nur eine eindeutige Punkt-zu-Punkt-USB-Versorgung modellieren soll.

### `supplyInputWithoutSource`

Fehler, wenn ein Netz `suppl_in`-Handles enthaelt, aber keine unabhaengige Supply-Quelle erkannt wird.

`usb_full` wird hier explizit aus den Supply-Inputs herausgefiltert, weil USB separat als USB-Netz behandelt wird.

Wenn eine Komponente zusaetzlich zu `usb_full` einen separaten V+-Eingang besitzt, bleibt dieser V+-Eingang ein normaler `suppl_in` und wird weiterhin durch `supplyInputWithoutSource` geprueft. Ein vorhandenes, aber quellloses oder ungenutztes USB-Kabel darf diese Meldung nicht unterdruecken. Eine gueltige Point-to-Point-USB-Power-Verbindung wird ebenfalls nicht als Quelle fuer ein externes normales Supply-Netz gewertet; die USB-Versorgung wirkt nur innerhalb der explizit modellierten Verbraucherkomponente.

Diese Netzmeldung hat Vorrang vor der komponentenbezogenen Meldung `powerMissing`, wenn ein Versorgungseingang bereits verdrahtet ist, der angeschlossene Versorgungspfad aber keine echte Quelle erreicht. In diesem Fall beschreibt `supplyInputWithoutSource` die Ursache praeziser: Nicht die Komponente an sich ist unverdrahtet, sondern das konkrete Supply-Netz hat keine Quelle.

### `supplySourceWithoutConsumer`

Warnung, wenn ein Supply-Netz eine Quelle enthaelt, aber keinen `suppl_in`-Verbraucher und keinen digitalen Bias-Consumer.

Diese Regel ist als Hinweis gedacht: Ein Versorgungsausgang ist verdrahtet, aber es haengt kein erkannter Verbraucher daran.

### `supplyVoltageMismatch`

Fehler, wenn ein Component-Linked-Supply-Netz genau eine unabhaengige Quelle hat, deren Spannung ausserhalb der erlaubten Bereiche eines oder mehrerer angeschlossener Pins liegt.

Die Regel betrachtet alle Handles im Supply-Netz, die `tolVmin` und/oder `tolVmax` als numerische Toleranzgrenze definieren. Damit werden nicht nur klassische `suppl_in`-Eingaenge erkannt, sondern auch andere toleranzbehaftete Pins, z.B. digitale Eingangs-/Enable-Pins oder weitergefuehrte Board-Anschluesse, wenn sie versehentlich oder absichtlich an ein Supply-Netz angeschlossen sind.

Passive Verbindungskomponenten wie WAGO- und SolderJoint-Knoten werden fuer diese Toleranzpruefung ignoriert, weil ihre Pin-Toleranzen nicht als Verbrauchergrenze gemeint sind.

Quellen ohne aufloesbare Spannung werden nicht geprueft. Bei mehreren unabhaengigen Supply-Quellen gewinnt weiterhin `multipleSupplySources`, weil dann keine eindeutige angelegte Spannung fuer das Netz bestimmbar ist.

## Component Rules

Component Rules laufen pro Node bzw. pro Gruppe von Handles einer Node.

### `requiredPinUnconnected`

Fehler, wenn ein sichtbarer Handle `mustBeConnected === true` hat und keine Wire daran haengt.

### `groundMissing`

Fehler, wenn eine Komponente GND-Handles besitzt, aber keiner dieser Handles in einem Netz mit `gnd_net_type` liegt.

Das ist eine komponentenbezogene Variante zu den Ground-Netzregeln und markiert gezielt die betroffene Komponente.

### `powerMissing`

Fehler, wenn eine Komponente Versorgung braucht, aber keine externe Versorgung erkannt wird.

Eine Komponente hat Versorgungsbedarf, wenn sie mindestens einen dieser Anschluesse hat:

- `suppl_in`, aber nicht `usb_full`
- `usb_full`

Als versorgt gilt sie, wenn:

- mindestens ein `suppl_in` in einem Supply-Netz liegt, das einen `suppl_out` einer anderen Komponente enthaelt, oder
- mindestens ein `usb_full` in einem aktiven USB-Power-Netz liegt, in dem genau ein erreichbares `usb_power_out` vorhanden ist.

Ein bloss verbundenes `usb_full` ohne erreichbares `usb_power_out` gilt nicht als Versorgung und unterdrueckt `powerMissing` nicht. Wenn die Komponente parallel einen normalen V+-Eingang besitzt und dieser nicht angeschlossen ist, aber eine gueltige USB-Power-Verbindung vorhanden ist, gilt die Komponente fuer `powerMissing` als versorgt; die Bewertung des nicht genutzten separaten V+-Eingangs bleibt dann Aufgabe von Pflichtpin- oder componentspezifischen Regeln, nicht von `supplyInputWithoutSource`.

Wenn mindestens ein Nicht-USB-`suppl_in` bereits angeschlossen ist, aber keine externe Quelle erreicht, wird `powerMissing` im normalen Nutzer-Modus nicht zusaetzlich erzeugt. Dann ist `supplyInputWithoutSource` die bessere Meldung, weil sie das betroffene Netz und die angeschlossenen Versorgungseingaenge zusammenfasst. `powerMissing` bleibt fuer Faelle zustaendig, in denen eine Komponente Versorgung braucht, aber gar kein passender Versorgungspfad angeschlossen ist.

### `mainsInputMissing`

Fehler, wenn eine Komponente Netzspannungs-Eingaenge hat, diese aber nicht mit dem passenden Netztyp verbunden sind.

Aktuelle Zuordnung:

- `line_in` braucht `L_net_type`
- `neutral_in` braucht `N_net_type`
- `pe_in` braucht `PE_net_type`

## Komponentenspezifische Regeln

### `sn74Ahct125nUsedChannelInputMissing`

Diese Regel gilt nur fuer `SN74AHCT125N`.

Die vier Kanaele werden fest beschrieben:

- Kanal 1: `1OE`, `1A`, `1Y`
- Kanal 2: `2OE`, `2A`, `2Y`
- Kanal 3: `3OE`, `3A`, `3Y`
- Kanal 4: `4OE`, `4A`, `4Y`

Ein Kanal gilt als verwendet, wenn:

- der Ausgang `Y` eine Wire hat,
- und ueber `signalReachableHandles(output)` mindestens ein anderer `dig_in` erreichbar ist.

Wenn ein verwendeter Kanal erkannt wurde, werden zwei Dinge geprueft:

- Der zugehoerige `A`-Eingang muss in einem Netz mit einem anderen `dig_out` liegen.
- Der zugehoerige `/OE`-Pin muss entweder in einem Netz mit einem anderen `dig_out` liegen oder mit GND verbunden sein.

Fehlt eine dieser Bedingungen, wird ein Fehler erzeugt.

### `sn74Ahct125nDirectLedOutputMissingSeriesResistor`

Diese Regel gilt nur fuer `SN74AHCT125N`.

Sie erzeugt eine Warnung, wenn ein `dig_out`-Ausgang des SN74AHCT125N direkt mit einem digitalen LED-Eingang verbunden ist:

- Ziel-Handle liegt an einer LED-Komponente (`node.data.group === 'led'`).
- Ziel-Handle hat `dig_in` oder `dig_clock_in`.
- SN74-Ausgang und LED-Eingang liegen im selben Elementary Net.

Die Elementary-Net-Bedingung ist bewusst: Wenn im Signalpfad ein `Resistor` liegt, sind SN74-Ausgang und LED-Eingang nicht mehr im selben Elementary Net, auch wenn sie ueber `signalReachableHandles()` bzw. Component-Linked Nets weiterhin als digital verbunden gelten. Dadurch wird nur die direkte Verbindung ohne Serienwiderstand gemeldet.

Severity: `warning`, weil die Schaltung funktional arbeiten kann, aber fuer LED-Data-/Clock-Leitungen am SN74AHCT125N-Ausgang typischerweise ein Serienwiderstand von ca. 68 Ohm empfohlen ist.

## Priorisierung der bestehenden Regeln

Die folgende Tabelle beschreibt, wie die aktuell implementierten Regeln in einem kuenftigen Deduplizierungs- und Sortierkonzept priorisiert werden sollten.

Empfohlene Bedeutung:

- `Severity`: sichtbare fachliche Schwere.
- `Specificity`: wie konkret die Meldung ist. Hoeher gewinnt gegen generischere Meldungen im selben Scope.
- `Sort-Prioritaet`: Reihenfolge innerhalb sichtbarer Meldungen. Niedrigere Zahl bedeutet weiter oben.
- `Scope`: Ebene fuer Deduplizierung und Suppression.

| Regel | Severity | Specificity | Sort-Prioritaet | Scope | Priorisierung / Suppression |
| --- | --- | ---: | ---: | --- | --- |
| `diagram-empty` | `info` | 80 | 100 | `diagram` | Sollte allein angezeigt werden, wenn keine Nodes existieren. Alle anderen Regeln laufen dann nicht. |
| `groundMissing` (Network) | `error` | 50 | 30 | `diagram` | Wichtiger Basisfehler ohne einzelnes Netz als Scope. Sollte nicht durch komponentenbezogene Ground-Meldungen unterdrueckt werden, kann aber im UI vor diesen stehen. |
| `groundMultiple` | `error` | 70 | 20 | `diagram` | Betrifft mehrere Netze gemeinsam. Darf generische Mixed-Classification-Meldungen fuer betroffene Ground-Netze unterdruecken, aber keine spezifischen Sicherheitsfehler wie Mains-/PE-/Polarity-Mischungen. |
| `mainsLowVoltageMixed` | `error` | 90 | 5 | `net` | Sicherheitskritisch. Muss vor generischen Netzfehlern stehen und `mixedClassifications` fuer dasselbe Netz unterdruecken. |
| `peActiveMixed` | `error` | 90 | 6 | `net` | Sicherheitskritisch. Muss `mixedClassifications` fuer dasselbe Netz unterdruecken. |
| `rs485Mixed` | `error` | 80 | 25 | `net` | Spezifischer als `mixedClassifications`; soll diese fuer dasselbe Netz unterdruecken. |
| `mixedClassifications` | `error` | 20 | 80 | `net` | Fallback-Regel. Nur anzeigen, wenn kein spezifischer Mischfehler fuer dasselbe Netz existiert. |
| `multipleSupplySources` | `error` | 70 | 35 | `net` | Konkreter Supply-Fehler. Sollte vor `supplyVoltageMismatch` stehen, weil bei mehreren Quellen die eindeutige Spannung nicht bestimmbar ist. Deckt auch mehrere unabhaengige PSU-/Spannungsquellen am selben DCDC-Eingang ab. |
| `usbPowerPairInvalid` | `error` | 80 | 39 | `net`/`edge`/`handle` | USB-Power ist nur als genau eine Quelle zu genau einer Senke zulaessig. Gewinnt vor generischen USB-`signalSinkWithoutSource`- oder `multipleSignalSources`-Meldungen. |
| `signalSinkWithoutSource` | `error` | 60 | 50 | `net`/`handle` | Sollte pro betroffenem Signaltyp und Netz erscheinen. Kann durch spezifischere Signalfehler wie `mixedDigitalSignalTypes` oder `dataDirectionWrong` unterdrueckt werden. |
| `digitalSignalVoltageMismatch` | `error` | 75 | 45 | `handle` | Konkreter als allgemeine Signalquellen-Regeln. Sollte nicht durch `signalSinkWithoutSource` verdeckt werden. |
| `multipleSignalSources` | `error` | 65 | 55 | `net` | Wichtig, aber nach sicherheits- und versorgungsbezogenen Fehlern. Kann durch spezifischere Direction-/Subtype-Regeln unterdrueckt werden. |
| `supplyInputWithoutSource` | `error` | 60 | 40 | `net` | Grundlegender Versorgungsfehler. Gewinnt vor komponentenbezogenem `powerMissing`, wenn ein Versorgungseingang bereits angeschlossen ist, aber das Netz keine Quelle hat. |
| `supplySourceWithoutConsumer` | `warning` | 45 | 120 | `net` | Hinweischarakter. Sollte von konkreten Fehlern im selben Netz unterdrueckt werden, z.B. Mischfehler oder mehrere Quellen. |
| `supplyVoltageMismatch` | `error` | 75 | 42 | `net`/`handle` | Konkreter Spannungsfehler. Sollte nur laufen/anzeigen, wenn genau eine Quelle bekannt ist und keine priorisierten Netzmischfehler existieren. |
| `requiredPinUnconnected` | `error` | 70 | 32 | `handle` | Sehr konkret. Sollte fuer Pflichtpins sichtbar bleiben und weichere Vollstaendigkeitswarnungen desselben Bauteils, z.B. `componentHasOnlyOneTerminalConnected`, unterdruecken. |
| `groundMissing` (Component) | `error` | 55 | 60 | `component` | Konkrete Komponentenperspektive. Kann zusammen mit Network-`groundMissing` auftreten; spaeter ggf. als Detail unter einer globalen Ground-Meldung gruppieren. |
| `powerMissing` | `error` | 55 | 58 | `component` | Zustaendig fuer Komponenten ohne angeschlossenen Versorgungspfad. Wenn ein angeschlossener Versorgungspfad keine Quelle hat, ist `supplyInputWithoutSource` die praezisere Meldung. |
| `mainsInputMissing` | `error` | 70 | 12 | `component`/`handle` | Sicherheitsrelevant und konkret. Sollte vor allgemeinen Komponentenfehlern stehen. |
| `sn74Ahct125nUsedChannelInputMissing` | `error` | 100 | 38 | `component`/`handle` | Sehr spezifisch. Sollte allgemeinere digitale Signalfehler fuer die betroffenen Pins/Kanaele unterdruecken, aber nicht Versorgung/GND-Fehler des Chips. |
| `sn74Ahct125nDirectLedOutputMissingSeriesResistor` | `warning` | 80 | 72 | `handle` | Konkreter Aufbauhinweis fuer direkte SN74AHCT125N-zu-LED-Data-/Clock-Verbindungen. Soll nicht erscheinen, wenn ein `Resistor` im Pfad liegt. |

## Priorisierung der bestehenden Regelgruppen

Empfohlene Reihenfolge im normalen Nutzer-Modus:

1. Diagrammweite Blocker, z.B. `diagram-empty`.
2. Sicherheitskritische Netzspannungsfehler: `mainsLowVoltageMixed`, `peActiveMixed`, `mainsInputMissing`.
3. Kritische Basisnetze: `groundMultiple`, `groundMissing`.
4. Versorgungsstruktur: `multipleSupplySources`, `usbPowerPairInvalid`, `supplyInputWithoutSource`, `supplyVoltageMismatch`.
5. Pflichtpins und komponentenspezifische harte Fehler: `requiredPinUnconnected`, `sn74Ahct125nUsedChannelInputMissing`, `powerMissing`.
6. Signalintegritaet: `digitalSignalVoltageMismatch`, `signalSinkWithoutSource`, `multipleSignalSources`, `rs485Mixed`.
7. Fallbacks und Warnungen: `mixedClassifications`, `supplySourceWithoutConsumer`.

## Priorisierung und Targeting

Issues enthalten:

- `id`
- `ruleId`
- `severity`: `error`, `warning` oder `info`
- `priority` optional
- `specificity` optional
- `fingerprint` optional mit `scope`, `key` und `problem`
- `suppresses` und `suppressedBy` optional fuer explizite Suppression
- Titel, Kurzbeschreibung, Beschreibung, Empfehlung
- `targets`

Targets sind aktuell `node` oder `edge`. Ein Handle wird indirekt ueber seine Node und die angeschlossenen Edges abgebildet. Doppelte Targets werden ueber `type`, `id` und optional `handleId` dedupliziert.

Aktueller Implementierungsstand:

- `DiagramCheckIssue` ist in `src/check/diagramCheckTypes.ts` um `specificity`, `fingerprint`, `suppresses` und `suppressedBy` erweitert.
- `DiagramCheckIssue` enthaelt ausserdem `suppressed` und `suppressedByIssueIds`, damit Diagnosemodi unterdrueckte Raw-Issues markieren koennen.
- `runDiagramCheck()` sammelt alle Issues und ruft im Standardmodus danach zentral `normalizeDiagramCheckIssues()` aus `src/check/normalizeDiagramCheckIssues.ts` auf.
- Alle aktuell registrierten Netzwerk-, Komponenten- und komponentenspezifischen Regeln erzeugen Fingerprint-/Prioritaetsmetadaten gemaess der Tabelle "Priorisierung der bestehenden Regeln".
- Einige schwere Netzfehler setzen innerhalb von `runNetworkRules` weiterhin zusaetzlich `priorityBlockedNetIds`. Das ist noch als fruehe Optimierung vorhanden und verhindert bekannte Folgechecks schon vor der Normalisierung. Die zentrale Normalisierung ist aber die langfristige, regeluebergreifende Ausgabeinstanz.

## Konzept fuer eindeutige Fehlermeldungen

Status: Die langfristige Fingerprint-Normalisierung ist fuer die aktuell bestehenden Regeln implementiert. Der schaltbare Diagnosemodus ist mit den drei Modi `user-friendly`, `diagnostic` und `diagnostic-with-suppression-markers` implementiert.

### Problem

Wenn eine spezifische Regel denselben technischen Fehler genauer beschreibt als eine allgemeine Regel, kann ohne Gegenmassnahme trotzdem mehr als eine Meldung entstehen.

Beispiel:

- Eine neue Spezialregel `groundAndSupplyPolaritySwapped` meldet: "Plus und GND sind verbunden".
- Die allgemeine Regel `mixedClassifications` koennte fuer dasselbe Netz zusaetzlich melden: "Unterschiedliche Ausgangstypen verbunden".

Fuer Nutzer ist die zweite Meldung in diesem Fall nicht hilfreich. Pro eigentlichem Fehler sollte nur die beste, konkreteste Meldung sichtbar sein.

Historisch gab es nur den einfachen Ansatz `priorityBlockedNetIds`: Einige schwere Netzwerkregeln markieren ein Netz als blockiert, damit spaetere generische Netzwerkregeln fuer dieses Netz nicht mehr laufen. Dieser Mechanismus existiert weiterhin innerhalb von `runNetworkRules`, wird aber durch die zentrale Fingerprint-Normalisierung ergaenzt.

### Zielbild

Die Check-Engine sammelt Issues nicht nur, sondern normalisiert sie vor der Ausgabe:

1. Spezifische Regeln duerfen allgemeine Regeln fuer denselben Fehlerbereich verdraengen.
2. Die UI bekommt moeglichst nur eine Meldung pro Ursache.
3. Bei mehreren passenden Meldungen gewinnt die Meldung mit hoeherer Spezifitaet.
4. Technisch unterschiedliche Fehler am selben Netz duerfen weiterhin mehrere Meldungen erzeugen, wenn sie wirklich unterschiedliche Ursachen beschreiben.

### Konzept: Issue-Fingerprint und Suppression

Jedes Issue kann zusaetzlich zu `id`, `ruleId`, `severity` und `targets` eine maschinenlesbare Deduplizierungsinformation bekommen.

Implementierte optionale Felder:

```ts
type DiagramCheckIssue = {
  id: string;
  ruleId?: string;
  severity: DiagramCheckSeverity;
  priority?: number;
  specificity?: number;
  suppresses?: string[];
  suppressedBy?: string[];
  fingerprint?: {
    scope: 'net' | 'component' | 'handle' | 'edge' | 'diagram';
    key: string;
    problem: string;
  };
  title: string;
  shortDescription: string;
  description: string;
  recommendation?: string;
  targets?: DiagramCheckTarget[];
};
```

Die Idee:

- `fingerprint.scope` beschreibt, worauf sich der Fehler bezieht.
- `fingerprint.key` beschreibt das konkrete Objekt, z.B. Netz-ID, Node-ID, Edge-ID oder Handle-Key.
- `fingerprint.problem` beschreibt die Fehlerfamilie, z.B. `mixed-classification`, `polarity`, `missing-source`, `voltage-mismatch`.
- `specificity` beschreibt, wie konkret die Meldung ist. Hoeher gewinnt.
- `suppresses` kann explizite generische Problemtypen nennen, die durch dieses Issue ersetzt werden.
- `suppressedBy` kann umgekehrt ausdruecken, welche spezifischen Problemtypen dieses Issue verdraengen duerfen.

### Beispiel

Spezifische Regel:

```ts
{
  id: `network-ground-supply-swapped-${net.id}`,
  ruleId: 'network-rules',
  severity: 'error',
  specificity: 90,
  fingerprint: {
    scope: 'net',
    key: net.id,
    problem: 'polarity-ground-supply',
  },
  suppresses: ['mixed-classification'],
  ...
}
```

Allgemeine Regel:

```ts
{
  id: `network-mixed-classifications-${net.id}`,
  ruleId: 'network-rules',
  severity: 'error',
  specificity: 10,
  fingerprint: {
    scope: 'net',
    key: net.id,
    problem: 'mixed-classification',
  },
  suppressedBy: ['polarity-ground-supply', 'mains-low-voltage-mixed', 'pe-active-mixed'],
  ...
}
```

Wenn beide Issues fuer dasselbe Netz entstehen, bleibt nur `polarity-ground-supply` sichtbar.

### Deduplizierungs-Pipeline

Statt Regeln direkt ungefiltert an die UI zu geben, fuehrt `runDiagramCheck()` eine Nachverarbeitung aus:

1. Alle Regeln erzeugen zunaechst ihre Issues.
2. Issues ohne `fingerprint` bleiben sichtbar, koennen aber ueber einen Fallback-Schluessel aus `ruleId`, Titel und Targets dedupliziert werden.
3. Issues werden nach Scope und Key gruppiert.
4. Innerhalb einer Gruppe werden Suppression-Regeln angewendet:
   - Wenn Issue A in `suppresses` den `problem` von Issue B nennt, wird B entfernt.
   - Wenn Issue B in `suppressedBy` den `problem` von Issue A nennt, wird B entfernt.
5. Wenn mehrere Issues denselben Fingerprint haben, gewinnt:
   - hoehere Severity (`error` vor `warning` vor `info`),
   - danach hoehere `specificity`,
   - danach hoehere `priority`,
   - danach stabil die zuerst erzeugte Meldung.
6. Die gefilterte Liste wird nach Severity, Priority und Erzeugungsreihenfolge sortiert.

Implementierungsdetails:

- Die zentrale Funktion ist `normalizeDiagramCheckIssues()` in `src/check/normalizeDiagramCheckIssues.ts`.
- `normalizeDiagramCheckIssues()` kann mit `includeSuppressed` alle Raw-Issues zurueckgeben und unterdrueckte Issues mit `suppressed`/`suppressedByIssueIds` markieren.
- Suppression wirkt nur innerhalb desselben `fingerprint.scope` und derselben `fingerprint.key`.
- Gleiche vollstaendige Fingerprints (`scope:key:problem`) werden auf die beste Meldung reduziert.
- Der Vergleich fuer Duplikate nutzt Severity, dann `specificity`, dann niedrigere `priority`, dann stabile Erzeugungsreihenfolge.
- Die finale Sortierung nutzt Severity, dann niedrigere `priority`, dann stabile Erzeugungsreihenfolge.

Pseudo-Code:

```ts
const normalizeDiagramCheckIssues = (issues: DiagramCheckIssue[]) => {
  const visible = new Set(issues);

  issues.forEach((candidate) => {
    issues.forEach((other) => {
      if(candidate === other) return;
      if(!sameScopeAndKey(candidate, other)) return;

      const candidateProblem = candidate.fingerprint?.problem;
      const otherProblem = other.fingerprint?.problem;
      if(!candidateProblem || !otherProblem) return;

      if(candidate.suppresses?.includes(otherProblem)) {
        visible.delete(other);
      }

      if(other.suppressedBy?.includes(candidateProblem)) {
        visible.delete(other);
      }
    });
  });

  return chooseBestDuplicateFingerprints([...visible]);
};
```

### Scope-Regeln

Damit nicht versehentlich echte Mehrfachfehler verschwinden, sollte Deduplizierung nur innerhalb klarer Scopes passieren.

Empfohlene Scopes:

- `net`: gleiche `net.id`
- `component`: gleiche `node.id`
- `handle`: gleicher `handle.key`
- `edge`: gleiche `edge.id`
- `diagram`: globale Issues, z.B. leeres Diagramm

Ein komponentenbezogener Fehler sollte nicht automatisch einen netzbezogenen Fehler unterdruecken, ausser das ist explizit modelliert. Beispiel: `component-power-missing` und `network-supply-input-without-source` koennen dieselbe Ursache beschreiben, aber aus unterschiedlicher Perspektive. Wenn spaeter nur eine davon sichtbar sein soll, braucht es eine bewusste Suppression-Beziehung.

### Spezifitaetsstufen

Als einfache Konvention:

- `specificity: 90-100`: sehr konkrete Spezialregel fuer Komponente, Sicherheit oder klaren Fehler, z.B. `sn74Ahct125nUsedChannelInputMissing`, `groundAndSupplyPolaritySwapped`
- `specificity: 70-89`: konkrete fachliche Regel, z.B. `supplyVoltageMismatch`, `mixedDigitalSignalTypes`
- `specificity: 40-69`: normale Regel oder hilfreiche Warnung, z.B. `powerMissing`, `supplyVoltageUnknown`
- `specificity: 20-39`: generische Regel, z.B. `mixedClassifications`, `duplicateParallelWire`
- `specificity: 10-19`: Fallback-/Debug-Regel

Damit kann eine neue Spezialregel eingefuehrt werden, ohne alle alten Regeln manuell umzubauen.

Eine spezifischere Regel sollte eine allgemeinere Meldung aber nicht automatisch unterdruecken, wenn dadurch ein `error` nur noch als `warning` sichtbar waere. Solche Downgrades sollten nur ueber explizite `suppresses`-Beziehungen erlaubt sein.

### Alternative: Regelphasen mit Blocklisten

Eine einfachere, kurzfristig umsetzbare Variante ist eine Erweiterung von `priorityBlockedNetIds`.

Regeln laufen dann in Phasen:

1. Kritische Spezialregeln
2. Spezifische Netzregeln
3. Allgemeine Netzregeln
4. Komponentenregeln
5. Hinweise und Debug-Regeln

Jede Phase kann Blocklisten setzen:

- `blockedNetProblems: Map<netId, Set<problem>>`
- `blockedComponentProblems: Map<nodeId, Set<problem>>`
- `blockedHandleProblems: Map<handleKey, Set<problem>>`

Beispiel:

- `groundAndSupplyPolaritySwapped` setzt fuer Netz X `mixed-classification` auf blockiert.
- `mixedClassifications` prueft vor dem Erzeugen eines Issues, ob `mixed-classification` fuer Netz X blockiert ist.

Diese Variante ist leichter in die bestehende Struktur einzubauen, bleibt aber staerker an die konkrete Reihenfolge der Regeln gekoppelt. Die Fingerprint-Normalisierung ist langfristig robuster, weil Regeln unabhaengiger voneinander Issues erzeugen koennen.

### Empfehlung

Kurzfristig:

- Erledigt fuer die aktuell bestehenden Regeln: Neue und bestehende Rules koennen ueber `fingerprint`, `specificity`, `suppresses` und `suppressedBy` normalisiert werden.
- `priorityBlockedNetIds` bleibt als lokale Vorfilterung in `runNetworkRules` bestehen. Eine allgemeine Blockstruktur ist dadurch nicht mehr zwingend noetig, solange neue Regeln Fingerprints setzen.
- Besonders `mixedClassifications` ist weiterhin als Fallback modelliert: spezifische Mischfehler wie `mainsLowVoltageMixed`, `peActiveMixed` und `rs485Mixed` unterdruecken es fuer dasselbe Netz.

Langfristig:

- Erledigt: `DiagramCheckIssue` ist um `fingerprint`, `specificity`, `suppresses` und `suppressedBy` erweitert.
- Erledigt: `normalizeDiagramCheckIssues()` ist zwischen Regelausfuehrung und UI-Ausgabe eingefuehrt.
- Weiterhin gueltig: Regelimplementierungen duerfen mehrere potenzielle Issues erzeugen; die Normalisierung entscheidet, welche Meldung fuer Nutzer am besten ist.
- Erledigt: Diagnosemodus, der Raw-Issues optional sichtbar macht und unterdrueckte Issues markiert.

Damit bleibt die Regelbasis erweiterbar, ohne dass die UI bei jedem neuen Spezialcheck mehr doppelte oder widerspruechliche Meldungen zeigt.

### Schaltbarer Diagnosemodus fuer alle Issues

Status: Implementiert in `src/check/runDiagramCheck.ts`, `src/check/normalizeDiagramCheckIssues.ts` und `src/sidebar/DiagramCheckPage.tsx`.

Zusaetzlich zum normalen Nutzer-Modus gibt es einen per Schalter aktivierbaren Diagnosemodus, in dem keine oder nur minimale Deduplizierung stattfindet. In diesem Modus koennen sowohl allgemeine als auch spezifischere Meldungen angezeigt werden.

Ziel:

- pruefen, ob neue Spezialregeln tatsaechlich ausloesen
- sehen, welche generischen Regeln denselben Fehler ebenfalls erkennen
- erkennen, ob eine allgemeine Regel zu breit oder zu eng greift
- Suppression-Beziehungen testen, ohne die Rohdaten zu verlieren
- Regelentwicklung und Regressionstests einfacher machen

Historisch diskutierte Namen:

- `SHOW_ALL_DIAGRAM_CHECK_ISSUES`
- `ENABLE_DIAGRAM_CHECK_DIAGNOSTICS`
- `DIAGRAM_CHECK_DEDUPLICATION_MODE`

Implementiert ist kein reiner Boolean, sondern ein Modus:

```ts
type DiagramCheckDeduplicationMode =
  | 'user-friendly'
  | 'diagnostic'
  | 'diagnostic-with-suppression-markers';
```

Verhalten:

- `user-friendly`: Standardmodus. Issues werden normalisiert, generische Doppelmeldungen werden unterdrueckt.
- `diagnostic`: Alle erzeugten Raw-Issues bleiben sichtbar.
- `diagnostic-with-suppression-markers`: Alle erzeugten Raw-Issues bleiben sichtbar, aber im Standardmodus unterdrueckte Issues werden mit `suppressed` und `suppressedByIssueIds` markiert. Die Sidebar zeigt dafuer einen Tag und die unterdrueckenden Issue-IDs.

Moegliche Implementierung:

```ts
export function runDiagramCheck(
  jsonData: string,
  options: RunDiagramCheckOptions = {},
): DiagramCheckIssue[] {
  const deduplicationMode = options.deduplicationMode || DEFAULT_DIAGRAM_CHECK_DEDUPLICATION_MODE;
  const rawIssues = runAllDiagramCheckRules(jsonData);

  if (deduplicationMode === 'diagnostic') {
    return rawIssues;
  }

  return normalizeDiagramCheckIssues(rawIssues, {
    includeSuppressed: deduplicationMode === 'diagnostic-with-suppression-markers',
  });
}
```

Dafuer gibt `normalizeDiagramCheckIssues()` optional nicht nur die sichtbaren Issues zurueck, sondern auch Metadaten:

```ts
type NormalizedDiagramCheckIssue = DiagramCheckIssue & {
  suppressed?: boolean;
  suppressedByIssueIds?: string[];
};
```

Die UI zeigt im Diagnosemodus zusaetzlich:

- ob ein Issue im normalen Modus sichtbar waere bzw. unterdrueckt wuerde
- durch welches spezifischere Issue es unterdrueckt wuerde
- welchen `fingerprint` und welche `specificity` es hat

Der Schalter ist in der Check-Sidebar direkt unter dem Pruefbutton implementiert, wird fuer normale Nutzer aber per Debug-Konstante ausgeblendet. In `src/sidebar/DiagramCheckPage.tsx` steuert `SHOW_DIAGRAM_CHECK_DIAGNOSTICS`, ob die Auswahlflaeche fuer `user-friendly`, `diagnostic` und `diagnostic-with-suppression-markers` sichtbar ist. Standard ist `false`; damit ist nur der normale `user-friendly`-Modus verfuegbar und `runDiagramCheck()` wird auch intern mit diesem Modus aufgerufen.

Falls der Schalter spaeter anders platziert werden soll, sind geeignete Alternativen:

- Feature-Flag-Datei fuer Diagramm-Checks
- spaeter optional ein Debug-Bereich in der Regeluebersicht

## UI-Stand

Die Sidebar `DiagramCheckPage` bietet aktuell:

- Beta-Hinweis
- Button zum manuellen Starten
- Speicherung des letzten Check-Ergebnisses inklusive Diagramm-Fingerprint in `useDiagramCheckResultStore`, damit andere Bereiche wie die Simulation verifizieren koennen, ob ein aktueller Check ohne Fehler vorliegt
- normalen Nutzer-Modus `user-friendly`; die Auswahl fuer die drei Deduplizierungs-/Diagnosemodi `user-friendly`, `diagnostic` und `diagnostic-with-suppression-markers` ist nur sichtbar, wenn `SHOW_DIAGRAM_CHECK_DIAGNOSTICS` auf `true` gesetzt wird
- Regeluebersicht im Modal
- leeren Zustand vor dem ersten Check
- Erfolgsmeldung, wenn keine Issues gefunden wurden
- Collapse-Liste der Issues mit Severity-Tag
- Anzeige von Beschreibung, Empfehlung und betroffenen Elementen
- Highlighting der betroffenen Nodes und Edges beim Aufklappen eines Issues
- Diagnoseanzeige fuer Fingerprint, Specificity und Suppression-Quelle, wenn ein Diagnosemodus aktiv ist

Es gibt ausserdem einen deaktivierten Debug-Modus `SHOW_NET_DEBUG`. Wenn er lokal auf `true` gesetzt wird, zeigt die Sidebar alle Elementary, Fused, Component-Linked und Component-Linked-Elementary-based Nets inklusive Klassifikationen, Pins, Wires und Highlight-Button.

## Bekannte Grenzen des aktuellen Standes

- Die Check-Engine ist regelbasiert und keine vollstaendige elektrische Simulation.
- Netzklassifikation basiert vor allem auf Handle-Funktionen, nicht auf Bauteilphysik.
- Nur sichtbare Handles werden geprueft.
- Nicht verdrahtete Einzelhandles erzeugen keine eigenen Netze; komponentenbezogene Regeln decken solche Faelle separat ab.
- Viele interne Komponentenbeziehungen sind explizit codiert, z.B. LED-Mehrfacheinspeisungen, Fuse-Verbindungen und SN74AHCT125N-Kanaele.
- Targets zeigen aktuell Node und Wire, aber nicht separat einen konkreten Pin als eigenes UI-Ziel.
- Die Regeltexte sind i18n-basiert; die technische Regeldefinition und die sichtbaren Beschreibungen koennen auseinanderlaufen, wenn Uebersetzungen nicht mitgepflegt werden.

## Vorschlaege fuer weitere Regeln

Die folgenden Regeln waren als fachliche und technische Kandidaten fuer naechste Ausbaustufen gedacht.

Aktueller Stand:

- Implementiert: `wireConnectedToHiddenOrMissingHandle`, `mainsWireConnectedToLowVoltageComponent`, `groundAndSupplyPolaritySwapped`, `componentHasOnlyOneTerminalConnected`, `supplyVoltageUnknown`, `fuseBypassed`, `wireWithoutPhysicalParameters`, `clockedLedClockMissing`, `dataDirectionWrong`, `digitalBackupPairMismatch`, `signalOutputWithoutConsumer`, `capacitorPolarityMismatch`, `mainsConnectorIncomplete`, `protectiveEarthMissingForMetalOrMainsDevice`, `fuseCurrentMissingOrUnderspecified`, `unusedRequiredFunctionalGroup`, `controlledOutputWithoutControlInput`, `analogLedColorChannelUnconnected`, `analogLedColorChannelMultiplePwmSignals`, `duplicateParallelWire`, `isolatedComponent`, `componentDefinitionIncompleteForChecks`, `ambiguousMultiFunctionHandle`, `sn74Ahct125nDirectLedOutputMissingSeriesResistor`.
- Deaktiviert: `supplyInputOnlyInternallyPowered`, weil die Meldung bei LED-Streifen zu oft irrefuehrend war und durch `supplyInputWithoutSource` bzw. `powerMissing` besser abgedeckt wird.
- Bewusst nicht implementiert, weil im Konzept so markiert: `mixedDigitalSignalTypes`, `levelShifterSupplyMismatch`, `powerWireCrossSectionTooSmall`.
- Diagnose-/Entwicklerregeln `componentDefinitionIncompleteForChecks` und `ambiguousMultiFunctionHandle` werden technisch erzeugt, aber im normalen `user-friendly`-Modus ausgeblendet. Sie sind in `diagnostic` und `diagnostic-with-suppression-markers` sichtbar.
- Einige Regeln sind konservativ umgesetzt, um False Positives zu reduzieren: passive Verbinder wie `SolderJoint`, `WAGO_2X` und `WAGO_3X` werden z.B. bei `mainsWireConnectedToLowVoltageComponent` nicht als ungeeignete Endkomponente bewertet.

### Netz- und Signalregeln

#### `digitalBackupPairMismatch`

Warnung oder Fehler, wenn LED-Streifen mit Backup-Datenleitung nur teilweise verbunden sind.

Beispiel: Ein Streifen hat `dig_in` und `dig_backup_in`, aber nur einer der beiden Eingaenge ist angeschlossen. Bei WS2813/WS2815/WS2818/WS2805-artigen Komponenten ist das oft beabsichtigt pruefenswert, weil Backup-Line und Main-Data-Line in vielen Setups gemeinsam geplant werden muessen.

Fachliche Zielregel fuer WLED-LED-Streifen mit Backup-Datenleitung:

- Wenn der `dig_in`/`DATA_start` eines LED-Streifens nicht von einem `dig_out`/`DATA_end` eines anderen LED-Streifens gespeist wird, muss der zugehoerige `dig_backup_in`/`BACKUP_start` auf GND liegen.
- Wenn `dig_backup_in` in diesem Fall stattdessen im selben Netz wie `dig_in` liegt, ist das toleriert, aber als Warnung zu melden: empfohlen ist der Anschluss von `backup_in` an GND.
- Wenn `dig_backup_in` weder auf GND noch toleriert im selben Netz wie `dig_in` liegt, ist das ein Fehler.
- Wenn der `dig_in`/`DATA_start` eines LED-Streifens von `dig_out`/`DATA_end` eines anderen LED-Streifens gespeist wird, muss `dig_backup_in` vom `dig_backup_out`/`BACKUP_end` desselben vorgelagerten LED-Streifens gespeist werden.
- Ein `dig_backup_out` eines anderen Streifens oder ein beliebiges Backup-Netz reicht dabei nicht; die Quelle muss zur konkreten Data-Quelle passen.

Moegliche Logik:

- Komponenten mit `dig_backup_in` oder `dig_backup_out` identifizieren.
- Wenn `dig_backup_in.mustBeConnected === true`, ist der Fall bereits teilweise durch `requiredPinUnconnected` abgedeckt.
- Pro Ziel-LED-Streifen den `dig_in`-Handle und den korrespondierenden `dig_backup_in`-Handle bestimmen. Bei den aktuellen Streifen sind das z.B. `DATA_start` und `BACKUP_start`; bei wiederholten/mittleren Handles muss die Regel auf die funktionalen Start-/End-Paare normalisiert werden.
- Aus dem Netz von `dig_in` die treibenden `dig_out`-Quellen ermitteln. Falls genau eine Quelle ein anderer LED-Streifen mit `dig_backup_out` ist, gilt dieser Streifen als vorgelagertes LED-Segment.
- Fuer diesen Fall pruefen, ob das Netz von `dig_backup_in` den `dig_backup_out` desselben vorgelagerten LED-Segments enthaelt. Wenn nicht: `error`.
- Falls keine vorgelagerte LED-Quelle fuer `dig_in` gefunden wird, pruefen, ob das Netz von `dig_backup_in` eine GND-Klassifikation enthaelt. Wenn ja: kein Issue.
- Falls `dig_backup_in` im selben Netz wie `dig_in` liegt, aber nicht auf GND: `warning`, weil es toleriert ist, GND aber empfohlen wird.
- Falls `dig_backup_in` in einem anderen Nicht-GND-Netz liegt oder unverbunden ist: `error`; bei unverbundenen Pflichtpins kann `requiredPinUnconnected` die konkretere Meldung bleiben oder diese Regel als zusammenfassende LED-Meldung dienen.
- Severity: `error` fuer fehlenden/falschen Backup-Pfad, `warning` fuer tolerierten Anschluss an das Data-Netz.

#### `clockedLedClockMissing`

Fehler, wenn ein LED-Typ mit Clock-Leitung eine Datenverbindung hat, aber die Clock-Leitung fehlt.

Beispiel: APA102-artige Streifen brauchen neben `dig_in` auch `dig_clock_in`. Ein reiner Datenanschluss reicht nicht.

Bei manchen Komponenten ist der Clock-Eingang bereits ueber `mustBeConnected` abgedeckt. Diese Regel waere trotzdem sinnvoll, weil sie Data/Clock als zusammengehoerige Signalgruppe bewertet und eine klarere Meldung liefern kann als ein einzelner Pflichtpin-Fehler.

Moegliche Logik:

- Pro Komponente pruefen, ob `dig_clock_in` vorhanden ist.
- Wenn ein `dig_in` oder `dig_out` des Bauteils verdrahtet ist, muss der korrespondierende Clock-Pin ebenfalls in einem passenden digitalen Clock-Netz liegen.
- Optional auch `dig_clock_out` fuer weitergereichte Segmente pruefen.
- Fuer hintereinandergeschaltete Clock-LED-Streifen zusaetzlich die Quelle paarweise pruefen: Wenn `dig_in`/`DATA_start` eines LED-Streifens von `dig_out`/`DATA_end` eines anderen LED-Streifens gespeist wird, muss `dig_clock_in`/`Clock_start` vom `dig_clock_out`/`Clock_end` desselben vorgelagerten LED-Streifens gespeist werden.
- Ein Clock-Signal eines anderen Streifens oder ein beliebiges Clock-Netz reicht dabei nicht; Data und Clock muessen vom selben vorgelagerten Segment kommen.
- Wenn `dig_in` nicht von einem anderen LED-Streifen kommt, bleibt die bestehende generische Clock-Regel massgeblich: ein genutzter Clock-LED-Streifen braucht ein passendes Clock-Signal, typischerweise vom Controller.

#### `signalOutputWithoutConsumer`

Warnung, wenn ein Signal-Ausgang verdrahtet ist, aber keine passende Signal-Senke erreicht.

Aktuell gibt es Checks fuer Eingange ohne Quelle und mehrere Quellen. Der Gegenfall, also ein Ausgang ohne erkennbaren Verbraucher, kann auf vergessene Verbindungen oder falsch gesetzte Pin-Funktionen hinweisen.

Moegliche Logik:

- Fuer Digital, PWM, Analog, Audio, USB je Signaldefinition alle klassifizierten Signalnetze betrachten.
- Wenn passende Quellen vorhanden sind, aber keine passende Senke im Netz oder ueber `signalReachableHandles()` gefunden wird, Warnung erzeugen.
- Passive Serienkomponenten wie `Resistor` beruecksichtigen.

#### `dataDirectionWrong`

Fehler, wenn bei gerichteten LED-Signalen Ausgang-zu-Ausgang oder Eingang-zu-Eingang-Verbindungen entstehen, ohne dass eine passende Quelle-Senke-Struktur vorhanden ist.

Teilweise wird das bereits indirekt durch `multipleSignalSources` oder `signalSinkWithoutSource` erkannt. Eine eigene Regel koennte nutzerfreundlichere Meldungen liefern, z.B. "Data-Out eines LED-Streifens wurde mit Data-Out des naechsten Streifens verbunden".

Moegliche Logik:

- Digitale Netze mit nur `dig_out`-Handles und ohne `dig_in` als Ausgang-ohne-Senke melden.
- Netze mit nur `dig_in`-Handles und ohne erreichbare Quelle als Eingang-ohne-Quelle melden.
- Fuer LED-Komponenten die physischen Namen `DI`, `DO`, `BI`, `BO`, `CI`, `CO` in der Meldung hervorheben.

#### `mixedDigitalSignalTypes` NICHT IMPLEMENTIEREN

Fehler oder Warnung, wenn Main-Data, Backup-Data und Clock unplausibel miteinander vermischt werden.

Aktuell erzeugen `dig_out`, `dig_clock_out` und `dig_backup_out` alle `digital_net_type`. Dadurch wird z.B. eine Verbindung von Clock-Out auf Data-In nicht zwingend als eigener Spezialfall beschrieben.

Moegliche Logik:

- Innerhalb digitaler Netze Subtypen aus den Funktionen ableiten: `data`, `clock`, `backup`.
- Fehler, wenn ein Netz mehrere digitale Subtypen mischt, z.B. `dig_clock_out` mit `dig_in`.
- Erlaubte Sonderfaelle explizit definieren, falls es Komponenten gibt, bei denen ein Pin mehrere Rollen haben darf.

### Versorgungsregeln

#### `groundAndSupplyPolaritySwapped`

Fehler, wenn ein Netz GND- und Supply-Klassifikation gleichzeitig enthaelt und dadurch wahrscheinlich Plus und Minus verbunden wurden.

Aktuell faellt das unter `mixedClassifications`. Eine eigene Regel waere hilfreicher, weil sie den haeufigen und kritischen Fehler direkter benennt.

Moegliche Logik:

- Component-Linked Net mit `gnd_net_type` und `suppl_net_type` erkennen.
- Prioritaet hoeher als generisches `mixedClassifications`.
- Targets: alle beteiligten GND- und Supply-Handles plus Wires.

#### `supplyVoltageUnknown`

Warnung, wenn ein Supply-Netz zwar eine Quelle hat, deren Spannung aber nicht aufgeloest werden kann.

Viele weitere Checks, z.B. `supplyVoltageMismatch` und `digitalSignalVoltageMismatch`, koennen nur arbeiten, wenn `resolveVoltageOut()` eine Zahl liefert. Eine unbekannte Spannung sollte sichtbar sein.

Moegliche Logik:

- Supply-Netze mit genau einer unabhaengigen Quelle betrachten.
- Wenn `resolveVoltageOut(source)` `undefined` liefert und im Netz `suppl_in`-Verbraucher haengen, Warnung erzeugen.
- Empfehlung: Spannungswert an der Quelle oder am abhaengigen Feld setzen.

#### `supplyInputOnlyInternallyPowered`

Warnung, wenn eine Komponente nur ueber eine intern weitergereichte Versorgung als versorgt erscheint, aber keine externe Quelle erreichbar ist.

Das kann bei Komponenten mit mehreren `suppl_in`-Pins oder internen Pass-Throughs relevant sein. Ziel ist, Faelle zu erkennen, in denen eine Komponente scheinbar ein Supply-Netz hat, dieses aber nur aus Eingangs-Pins besteht.

Status: derzeit deaktiviert. Die Meldung war besonders bei LED-Streifen irrefuehrend, weil mehrere Einspeisepunkte dort normal sind und die eigentliche Ursache meist besser durch `supplyInputWithoutSource` oder `powerMissing` beschrieben wird.

Moegliche Logik:

- Pro Komponente `supplyInputHasExternalSource()` erweitern oder eigene Reachability nutzen.
- Pruefen, ob die Quelle wirklich von einer anderen Komponente mit `suppl_out` kommt.
- Severity `warning`, um False Positives bei passiven Verteilern zu vermeiden.

#### `fuseBypassed`

Warnung oder Fehler, wenn ein abgesicherter Ausgang und ein ungesicherter Eingang derselben Fuse-Komponente extern wieder zusammengeschaltet werden.

Bei Fuse-Boards kann ein Nutzer versehentlich die Sicherung umgehen, indem Eingang und Ausgang ausserhalb der Komponente verbunden werden.

Moegliche Logik:

- `internalConnections.kind === 'fuse'` als bekannte Fuse-Paare nutzen.
- Wenn `fromHandle` und `toHandle` nicht nur ueber den Fuse-Layer, sondern im selben Component-Linked Elementary based Net liegen, wurde die Sicherung extern oder ueber eine andere direkte Component-Link-Beziehung ueberbrueckt.
- Severity `error`, weil die Schutzfunktion aufgehoben ist.

#### `fuseCurrentMissingOrUnderspecified`

Info oder Warnung, wenn ein Fuse-Element bzw. Fuse-Board keine erkennbare Nennstromangabe hat.

Diese Regel wird erst richtig wertvoll, wenn Komponenten konsistent Stromwerte oder Sicherungswerte in `inputFields` tragen.

Moegliche Logik:

- Komponenten mit `internalConnections.kind === 'fuse'` oder technischer ID `miniOTOFuse` / `FUSE_Board` erkennen.
- Input-Felder fuer Sicherungswert pruefen.
- Bei fehlendem Wert Info ausgeben: "Sicherung dimensionieren".

### Komponentenregeln

#### `unusedRequiredFunctionalGroup`

Warnung, wenn eine Komponente teilweise genutzt wird, aber zugehoerige Pflichtgruppe unvollstaendig bleibt.

Beispiel: Ein Controller-Pin fuer Data ist verbunden, aber GND oder Versorgung der Zielkomponente fehlt. Einzelne fehlende Pins werden schon erkannt; eine Gruppierungsregel koennte die Ursache besser erklaeren.

Moegliche Logik:

- Komponententypen koennen optionale Gruppen definieren, z.B. LED-Eingangsgruppe: `V+`, `GND`, `DI`, optional `BI`/`CI`.
- Wenn mindestens ein Pin der Gruppe verbunden ist, muessen definierte Mindestpins der Gruppe plausibel verbunden sein.
- Erfordert wahrscheinlich zusaetzliche Metadaten in Komponentendefinitionen.

#### `digitalLedSignalGroupGroundMissing`

Fehler, wenn an einem digitalen LED-Streifen ein `data_in`- oder `clock_in`-Pin angeschlossen ist, aber der zugehoerige GND-Anschluss derselben Eingangsgruppe nicht angeschlossen ist.

Bei digitalen LED-Streifen gehoeren Daten-/Clock-Eingang und GND fachlich zur selben Einspeise- bzw. Signalgruppe. Ein Signal ohne lokalen gemeinsamen Bezug kann elektrisch unzuverlaessig sein, auch wenn die Komponente an anderer Stelle der Platine oder des Streifens einen GND-Anschluss besitzt. Die Regel soll deshalb gruppenbezogen pruefen, nicht nur komponentenweit.

Gruppenzuordnung:

- `_start`: z.B. `DATA_start`, `Clock_start`, `GND_start`
- `_end`: z.B. `DATA_end`, `Clock_end`, `GND_end`
- `_middle_N`: z.B. `DATA_middle_4`, `Clock_middle_4`, `GND_middle_4`

Moegliche Logik:

- Nur digitale LED-Komponenten betrachten, also LED-Komponenten mit `dig_in` und optional `dig_clock_in`; analoge LED-Streifen mit `pwm_in_*` sind nicht betroffen.
- Sichtbare Handles nach funktionaler Eingangsgruppe normalisieren: Suffix `_start`, `_end` oder konkretes `_middle_N`.
- Wenn ein `dig_in` oder `dig_clock_in` innerhalb einer Gruppe angeschlossen ist, muss in derselben Gruppe mindestens ein sichtbarer GND-Handle existieren und angeschlossen sein.
- Ein GND an einer anderen Gruppe derselben LED-Komponente reicht fuer diese Regel nicht aus, weil die Meldung gezielt fehlende lokale Referenz am genutzten Signalanschluss beschreibt.
- Wenn der passende GND-Handle fehlt oder durch aktuelle `hideConditions` unsichtbar ist, sollte das im Diagnosemodus als moegliches Komponenten-/Metadatenproblem erkennbar bleiben.

Targets:

- die betroffene LED-Komponente,
- der angeschlossene `data_in`-/`clock_in`-Handle,
- der erwartete GND-Handle derselben Gruppe, falls vorhanden.

Severity: `error`, weil digitale LED-Signale ohne gemeinsamen GND-Bezug am genutzten Eingang in der Praxis nicht verlaesslich funktionieren.

#### `controlledOutputWithoutControlInput`

Fehler, wenn ein steuerbarer Ausgang verwendet wird, aber sein steuernder digitaler Eingang nicht angeschlossen ist.

Diese Regel arbeitet generisch ueber das Handle-Attribut `controllableBy`. Sie ersetzt keine komponentenspezifische Sonderregel, sondern macht die Abhaengigkeit direkt an den Ausgangs-Handles deklarierbar.

Ein Ausgang gilt als verwendet, wenn:

- der sichtbare Handle `controllableBy` gesetzt hat,
- und der Handle mit mindestens einer Wire verbunden ist,
- und der Handle dadurch in einem Netz liegt. Reine unverdrahtete Handles werden nicht gemeldet.

Der referenzierte Steuer-Handle gilt als gueltig angebunden, wenn:

- der referenzierte `hid` als sichtbarer Handle derselben Komponente existiert,
- und dieser Handle in einem Netz mit `digital_net_type` liegt.

Falls der referenzierte Steuer-Handle ueber `data.internalConnections` mit `kind === 'short'` mit weiteren Handles derselben Komponente verbunden ist, werden diese Handles ebenfalls als Steuer-Alternativen betrachtet. Dann reicht es, wenn einer dieser kurzgeschlossenen Handles mit einem digitalen Netz verbunden ist. Die Short-Aufloesung sollte transitiv gedacht werden, damit auch mehrere gebrueckte Enable-Pins als eine Steuergruppe funktionieren.

Wenn `controllableBy` auf einen fehlenden oder aktuell unsichtbaren Handle zeigt, sollte die Regel als Definitions-/Konsistenzproblem behandelt werden. Im normalen Nutzer-Modus kann daraus dieselbe fachliche Meldung entstehen, im Diagnosemodus sollte aber erkennbar sein, dass die Komponentendefinition unvollstaendig oder inkonsistent ist.

Targets:

- der verwendete steuerbare Ausgang,
- der erwartete Steuer-Handle bzw. die Steuergruppe,
- die angeschlossenen Wires des Ausgangs.

Severity: `error`, weil ein verwendeter geschalteter Ausgang ohne digitale Steuerung fachlich unvollstaendig ist.

Betroffene Komponenten und Metadaten:

- `MHC_SwitchBoard`: `VOUT1`, `VOUT2`, `VOUT3` sind geschaltete Versorgungsausgaenge. Sie sollen auf `EN1` zeigen. Weil `EN1` und `EN2` per `internalConnections.kind === 'short'` verbunden sind, reicht eine digitale Verbindung an `EN1` oder `EN2`.
- `MHC_PWMBoard` / WLED PWM Board: `PWMOUT1 -> PWMIN1`, `PWMOUT2 -> PWMIN2`, `PWMOUT3 -> PWMIN3`.
- `MHC_Relay5V`, `MHC_Relay12V`, `MHC_Relay24V`: `VOUT1` und `VOUT2` (Power Output 1, NC/NO) zeigen auf `CTRL1`; `VOUT3` und `VOUT4` (Power Output 2, NC/NO) zeigen auf `CTRL2`.

#### `analogLedColorChannelUnconnected`

Warnung, wenn bei einem verwendeten analogen LED-Streifen ein kompletter Farbkanal nicht angeschlossen ist.

Analoge Streifen besitzen pro Farbe mehrere physische Anschlussmoeglichkeiten, z.B. Start, Ende und wiederholte Middle-Pins. Die wiederholten Middle-Pins werden in gespeicherten Diagrammen als konkrete Handles in `data.repeatedHandleArray` abgelegt, z.B. `R_middle_4`; sie sind keine direkte Verbindung auf dem Template-Handle `R_middle`. Fuer die Nutzbarkeit einer Farbe reicht es, wenn mindestens einer dieser konkreten oder regulaeren Handles angeschlossen ist. Wenn dagegen kein Handle einer vorhandenen Farbe verbunden ist, kann diese Farbe nicht gesteuert werden und sollte als Warnung sichtbar sein.

Gepruefte Farbkanal-Funktionen:

- `pwm_in_R`: Rot
- `pwm_in_G`: Gruen
- `pwm_in_B`: Blau
- `pwm_in_W`: Weiss
- `pwm_in_WW`: Warmweiss

Ein analoger Streifen gilt fuer diese Regel als relevant, wenn:

- die Komponente ein LED-Element ist,
- die technische ID mit `AN_` beginnt,
- und die Komponente mindestens eine Wire besitzt. Vollstaendig unverdrahtete Streifen sollen nicht sofort mehrere Farbwarnungen erzeugen; dafuer bleibt `isolatedComponent` zustaendig.

Pro vorhandener Farbe wird geprueft:

- Sammle alle sichtbaren Handles derselben Farb-Funktion innerhalb der Komponente, z.B. `R_start`, `R_end` und konkrete wiederholte Handles wie `R_middle_1`, `R_middle_2`, ...
- Falls konkrete wiederholte Handles keine eigenen `functions` enthalten, verwende die fachlichen Metadaten des zugehoerigen Template-Handles, z.B. `R_middle` fuer `R_middle_4`.
- Wenn keiner dieser Handles eine Wire hat, erzeuge eine Warnung fuer genau diese Farbe.
- Wenn mindestens einer dieser Handles verbunden ist, gilt die Farbe als steuerbar; es ist nicht erforderlich, Start, Mitte und Ende gleichzeitig zu verbinden. Eine Einspeisung bzw. Anbindung am Anfang, irgendwo in der Mitte oder am Ende ist fuer analoge Streifen grundsaetzlich zulaessig.

Targets:

- die betroffene LED-Komponente,
- alle sichtbaren Handles des fehlenden Farbkanals.

Severity: `warning`, weil der Aufbau elektrisch plausibel sein kann, aber die betroffene Farbe im Betrieb nicht steuerbar ist.

#### `analogLedColorChannelMultiplePwmSignals`

Fehler, wenn ein Farbkanal eines analogen LED-Streifens gleichzeitig an unterschiedliche PWM-Signale angeschlossen ist.

Analoge LED-Streifen haben pro Farbe mehrere gleichwertige Anschlussmoeglichkeiten am selben durchgehenden Kupfer-/LED-Kanal. Start-, Middle- und End-Pins desselben Farbkanals duerfen deshalb nicht von verschiedenen PWM-Ausgaengen getrieben werden. Das wuerde die PWM-Ausgaenge ueber den Streifenkanal gegeneinander arbeiten lassen und kann Controller, MOSFET-/PWM-Board oder Leiterbahnen belasten.

Wenn ein Anwender fuer mehr Leistung mehrere PWM-Ausgaenge verwenden moechte, muss der analoge Streifen elektrisch in separate Streifen bzw. voneinander getrennte Segmente aufgeteilt werden. Dann hat jedes Segment seinen eigenen Farbkanal und darf separat an ein PWM-Signal angeschlossen werden.

Gepruefte Farbkanal-Funktionen:

- `pwm_in_R`: Rot
- `pwm_in_G`: Gruen
- `pwm_in_B`: Blau
- `pwm_in_W`: Weiss
- `pwm_in_WW`: Warmweiss

Ein analoger Streifen gilt fuer diese Regel als relevant, wenn:

- die Komponente ein LED-Element ist,
- die technische ID mit `AN_` beginnt,
- und mindestens ein Handle des jeweiligen Farbkanals angeschlossen ist.

Pro vorhandener Farbe wird geprueft:

- Sammle alle sichtbaren Handles derselben Farb-Funktion innerhalb der Komponente, inklusive konkreter wiederholter Handles aus `data.repeatedHandleArray`.
- Ermittle fuer jeden angeschlossenen Farb-Handle das zugehoerige Netz und darin alle `pwm_out`-Quellen.
- Wenn mehr als eine eindeutige `pwm_out`-Quelle fuer denselben Farbkanal gefunden wird, erzeuge einen Fehler.
- Wenn mehrere Handles desselben Farbkanals am gleichen PWM-Signal bzw. selben PWM-Netz haengen, ist das fuer diese Regel zulaessig.
- Wenn ein einzelnes Netz bereits mehrere PWM-Quellen enthaelt, bleibt `multipleSignalSources` ebenfalls fachlich relevant; diese spezifische Komponentenregel ist fuer analoge Streifen die aussagekraeftigere Meldung.

Targets:

- die betroffene LED-Komponente,
- die angeschlossenen Handles des betroffenen Farbkanals,
- die erkannten PWM-Quellen und betroffenen Netze.

Severity: `error`, weil mehrere unterschiedliche PWM-Treiber auf demselben analogen Farbkanal elektrisch gegeneinander arbeiten koennen.

#### `componentHasOnlyOneTerminalConnected`

Warnung fuer passive Zweipol-Komponenten, bei denen nur ein Anschluss verbunden ist.

Beispiele: Widerstand, Kondensator, Sicherung. Ein einzelner angeschlossener Pin ist fast immer ein unvollstaendiger Aufbau.

Moegliche Logik:

- Komponenten mit genau zwei sichtbaren elektrischen Handles erkennen.
- Wenn genau ein Handle `connectedEdges.length > 0` hat, Warnung erzeugen.
- Ausnahmen fuer reine Markierungs-/Info-Komponenten ausschliessen.

#### `capacitorPolarityMismatch`

Fehler, wenn ein gepolter Kondensator mit Plus an GND oder Minus an Supply angeschlossen ist.

Moegliche Logik:

- Elektrolytkondensatoren ueber technische ID erkennen.
- Plus-Handle darf nicht in `gnd_net_type` liegen.
- Minus-Handle sollte in `gnd_net_type` liegen oder zumindest nicht in einem Supply-Netz mit positiver Quelle.
- Fuer Keramikkondensatoren nicht anwenden.

#### `levelShifterSupplyMismatch` NICHT IMPLEMENTIEREN

Fehler oder Warnung, wenn ein Level-Shifter mit unpassender Versorgung fuer seine Signalpegel verwendet wird.

Beispiel: SN74AHCT125N braucht eine passende Versorgung, damit 3.3-V-Eingaenge zu 5-V-Ausgaengen werden. Wenn VCC fehlt oder nicht 5 V ist, koennen digitale Pegelchecks allein irrefuehrend sein.

Moegliche Logik:

- Fuer `SN74AHCT125N` VCC- und GND-Pins identifizieren.
- VCC muss in einem Supply-Netz mit aufgeloester Spannung innerhalb der erlaubten Toleranz liegen.
- Wenn ein Kanal benutzt wird, Versorgung besonders strikt pruefen.

### Netzspannungs- und Sicherheitsregeln

#### `mainsConnectorIncomplete`

Fehler, wenn eine Netzspannungs-Komponente nur teilweise angeschlossen ist.

Beispiel: Ein Netzteil mit `line_in` und `neutral_in` hat nur L oder nur N verbunden. `mainsInputMissing` erkennt dies bereits pro Eingang, aber eine eigene Regel kann die Komponente als unvollstaendigen Netzanschluss zusammenfassen.

Moegliche Logik:

- Komponenten mit mindestens einem `line_in` oder `neutral_in` erkennen.
- Wenn einer der beiden Anschluesse verbunden ist, aber der andere fehlt, gezielte Meldung ausgeben.
- PE separat als Warnung oder Fehler je Komponententyp behandeln.

#### `protectiveEarthMissingForMetalOrMainsDevice`

Warnung oder Fehler, wenn eine Komponente mit PE-Anschluss diesen nicht verbunden hat.

Die aktuelle `mainsInputMissing`-Regel erkennt `pe_in`, wenn es nicht im passenden PE-Netz liegt. Eine separate Regel koennte fuer sicherheitsrelevante Komponenten eine hoehere Prioritaet oder klarere Empfehlung liefern.

Moegliche Logik:

- Komponenten mit `pe_in` erkennen.
- Wenn `line_in` oder `neutral_in` genutzt wird, muss `pe_in` ebenfalls passend verbunden sein, sofern vorhanden.
- Severity je nach Komponententyp: Netzteil/Metallgehaeuse eher `error`, einfache Steckerzeichnung eventuell `warning`.

#### `mainsWireConnectedToLowVoltageComponent`

Fehler, wenn ein L/N/PE-Netz direkt an eine Komponente geht, die keinen passenden Netzspannungsanschluss besitzt.

Das wird teilweise ueber Netzklassifikation erkannt, aber eine eigene Komponentensicht koennte klarer sagen: "Diese Komponente ist nicht fuer Netzspannung vorgesehen".

Diese Regel ist besonders wichtig, weil die bestehende Netzklassifikation stark quellenorientiert ist. Ein Netz mit `line_out` und einem reinen Kleinspannungs-Eingang wie `suppl_in` kann nur als `L_net_type` klassifiziert werden und dadurch nicht zwingend unter `mainsLowVoltageMixed` fallen.

Moegliche Logik:

- Netze mit `L_net_type`, `N_net_type` oder `PE_net_type` betrachten.
- Alle beteiligten Handles ohne passende `line_in`, `line_out`, `neutral_in`, `neutral_out`, `pe_in`, `pe_out` markieren.
- Prioritaet hoch, da sicherheitskritisch.

### Wire- und Diagrammqualitaetsregeln

#### `wireWithoutPhysicalParameters`

Info oder Warnung, wenn eine Wire in einem Power-Netz keine Laenge oder keinen Querschnitt hat.

Fuer reine logische Signalverbindungen ist das oft egal. Fuer Versorgung und spaetere Simulation ist es wichtig.

Moegliche Logik:

- Wires in Netzen mit `suppl_net_type`, `gnd_net_type` oder `usb_net_type` betrachten.
- Bei USB-Wires gelten Laenge und Querschnitt pro Leiter. Fuer neue USB-Wires sollen `AWG24`, `AWG26` und `AWG28` als Presets angeboten werden; `AWG26` ist der Default fuer neue bzw. bewusst migrierte USB-Wires.
- Edge-Daten auf physikalische Laenge und Querschnitt pruefen.
- Severity `warning`

#### `powerWireCrossSectionTooSmall` NICHT IMPLEMENTIEREN (später nahc simulation)

Warnung, wenn ein Power-Wire anhand bekannter Lastdaten wahrscheinlich zu duenn ist.

Diese Regel braucht zusaetzliche Strom-/Lastinformationen und ist daher eher ein spaeterer Ausbau oder eine Bruecke zur Simulation.

Moegliche Logik:

- Supply-Netz, Verbraucher und Sicherungswerte aggregieren.
- Drahtquerschnitt gegen geschaetzte Maximalstroeme pruefen.
- Als konservative Warnung formulieren, solange keine echte Simulation laeuft.

#### `duplicateParallelWire` 

Warnung, wenn zwei identische Handles durch mehrere Wires parallel verbunden sind.

Das kann absichtlich sein, ist in einem Diagramm aber oft ein versehentlich doppelt gezogener Draht.

Moegliche Logik:

- Edges nach normalisiertem Paar `(source, sourceHandle, target, targetHandle)` gruppieren.
- Gegenrichtung als gleiches Paar behandeln.
- Wenn mehr als eine Wire in derselben Gruppe liegt, Warnung erzeugen.

#### `wireConnectedToHiddenOrMissingHandle`

Fehler, wenn eine Wire auf einen Handle zeigt, der durch aktuelle Auswahl versteckt ist oder gar nicht mehr existiert.

Der Netzaufbau ignoriert solche Wires aktuell still, weil der Handle nicht im sichtbaren Handle-Set liegt. Fuer Nutzer waere eine explizite Meldung hilfreicher.

Moegliche Logik:

- Beim Aufbau des Check-Kontexts alle Edges erfassen, deren `sourceHandle` oder `targetHandle` nicht in `handleByKey` existiert.
- Unterscheiden zwischen "Handle existiert in Komponentendefinition, ist aber hidden" und "Handle-ID existiert gar nicht".
- Severity `error`, weil die Wire elektrisch wirkungslos ist.

#### `isolatedComponent`

Info, wenn eine technische Komponente keinerlei angeschlossene Wires hat.

Das ist fuer frisch platzierte Komponenten normal, kann nach einem Check aber als Hinweis helfen.

Moegliche Logik:

- Komponenten ohne angeschlossene Edges erkennen.
- Reine Zeichen-/Info-Komponenten wie `InfoNode`, `LineBoxNode`, `WireInfoNode` ausschliessen.
- Severity `info`.

### Metadaten- und Konsistenzregeln

#### `componentDefinitionIncompleteForChecks`

Info fuer Entwickler oder Debug-Modus, wenn eine Komponente fuer Checks zu wenig Metadaten hat.

Beispiele:

- Digitale LED-Streifen, die fuer Simulation umgestellt sind, benoetigen `ledSimulationOptions` und konkrete `ledSimulationOptionValues`. Die eigentliche harte Meldung fuer fehlende oder veraltete LED-Simulationsoptionen wird beim Simulationsmodellaufbau erzeugt, nicht als normale Diagramm-Check-Regel. Dadurch bleibt die Check-Engine auf Verdrahtung und Komponentenmetadaten fokussiert.

- elektrische Handles ohne `functions`
- Supply-Eingaenge ohne `tolVmin` / `tolVmax`
- Ausgaenge ohne `Vout` oder aufloesbare `VoutDependency`
- Pins mit unklarer oder unbekannter Funktion

Moegliche Logik:

- Nur in Debug-Modus oder optionaler Entwicklerregel anzeigen.
- Nicht als Nutzerfehler darstellen, sondern als Hinweis zur Komponentendefinition.

#### `ambiguousMultiFunctionHandle`

Warnung im Entwicklerkontext, wenn ein Handle mehrere Funktionen hat und dadurch Netzklassifikation unklar wird.

Da die Klassifikation fuer einige Signale nur exklusive Funktionen nutzt, koennen Multi-Function-Handles absichtlich weniger stark klassifiziert werden. Das sollte fuer Komponentenautoren sichtbar sein.

Moegliche Logik:

- Handles mit mehreren klassifikationsrelevanten Funktionen finden.
- Pruefen, ob diese Kombination in einer erlaubten Liste steht.
- Sonst Entwicklerhinweis ausgeben.

## Priorisierung der vorgeschlagenen Regeln

Die folgende Tabelle bewertet die vorgeschlagenen Regeln nach fachlicher Anzeigeprioritaet und nach Umsetzungsprioritaet.

- `Umsetzung`: empfohlene Reihenfolge fuer die Entwicklung. `1` bedeutet sehr frueh.
- `Severity`: erwartete Standardschwere.
- `Specificity`: wie stark die Regel allgemeinere Meldungen verdraengen sollte.
- `Sort-Prioritaet`: Anzeigeprioritaet im Nutzer-Modus. Niedrigere Zahl bedeutet weiter oben.

| Regel | Umsetzung | Severity | Specificity | Sort-Prioritaet | Scope | Priorisierung / Suppression |
| --- | ---: | --- | ---: | ---: | --- | --- |
| `wireConnectedToHiddenOrMissingHandle` | 1 | `error` | 90 | 10 | `edge`/`handle` | Sehr frueh umsetzen, weil der Netzaufbau solche Wires aktuell ignoriert. Sollte Folgefehler unterdruecken, die nur entstehen, weil das Wire elektrisch nicht beruecksichtigt wurde. |
| `mainsWireConnectedToLowVoltageComponent` | 2 | `error` | 95 | 4 | `component`/`handle` | Sicherheitskritisch und deckt Faelle ab, die quellenbasierte Netzklassifikation uebersehen kann. Sollte zusammen mit `mainsLowVoltageMixed` dedupliziert oder gruppiert werden; im Zweifel gewinnt die klarere Meldung mit betroffener Komponente. |
| `groundAndSupplyPolaritySwapped` | 3 | `error` | 95 | 8 | `net` | Kritischer Spezialfall. Muss `mixedClassifications` fuer dasselbe Netz unterdruecken und vor normalen Supply-/Ground-Folgefehlern stehen. |
| `mixedDigitalSignalTypes` | 4 | `error` | 85 | 44 | `net` | Sollte generische digitale `signalSinkWithoutSource`- oder `multipleSignalSources`-Meldungen fuer dasselbe digitale Netz unterdruecken, wenn die Ursache eine Data-/Clock-/Backup-Verwechslung ist. |
| `componentHasOnlyOneTerminalConnected` | 5 | `warning` | 65 | 110 | `component` | Guenstig umzusetzen und hilfreich. Wird durch `requiredPinUnconnected` fuer dasselbe Bauteil unterdrueckt, damit Zweipol-Komponenten nicht gleichzeitig Fehler und Warnung fuer dieselbe fehlende Seite zeigen. |
| `supplyVoltageUnknown` | 6 | `warning` | 55 | 95 | `net` | Sollte angezeigt werden, wenn Spannungschecks nicht aussagekraeftig sind. Wird von konkretem `supplyVoltageMismatch` unterdrueckt, sobald die Spannung bekannt ist. |
| `fuseBypassed` | 7 | `error` | 90 | 18 | `net`/`component` | Sicherheits-/Schutzfunktionsfehler. Sollte allgemeine Fuse- oder Mixed-Netz-Hinweise fuer dieselben Fuse-Paare unterdruecken. |
| `controlledOutputWithoutControlInput` | 8 | `error` | 85 | 52 | `component`/`handle` | Generische Regel fuer genutzte geschaltete Ausgaenge mit fehlendem digitalen Steuer-/Enable-Netz. Sollte allgemeinere Signal- oder Supply-Hinweise fuer denselben Ausgang nicht pauschal unterdruecken, aber als konkreter Komponentenfehler sichtbar sein. |
| `analogLedColorChannelUnconnected` | 9 | `warning` | 70 | 85 | `component`/`handle` | Spezifischer Funktionshinweis fuer analoge LED-Streifen. Soll nicht durch generische PWM-Signalregeln ersetzt werden; vollstaendig unverdrahtete Komponenten bleiben bei `isolatedComponent`. |
| `analogLedColorChannelMultiplePwmSignals` | 10 | `error` | 90 | 44 | `component`/`handle` | Spezifischer Schutzfehler fuer analoge LED-Streifen. Gewinnt als konkrete Komponentenmeldung gegen generische Mehrfach-PWM-Quellen auf demselben Farbkanal. |
| `wireWithoutPhysicalParameters` | 11 | `info` oder `warning` | 40 | 150 | `edge` | Vorbereitung fuer Simulation. Sollte von haerteren Wire-Fehlern wie fehlendem Handle unterdrueckt werden. |
| `clockedLedClockMissing` | 12 | `error` | 85 | 46 | `component`/`handle` | Sehr konkret fuer Clock-LEDs. Sollte generisches `signalSinkWithoutSource` fuer den Clock-Pin unterdruecken; bei LED-zu-LED-Weiterleitung muss Clock vom selben vorgelagerten Segment kommen wie Data. |
| `dataDirectionWrong` | 13 | `error` | 80 | 48 | `net`/`handle` | Konkreter als allgemeine Quellen-/Senkenfehler. Kann `signalSinkWithoutSource` oder `multipleSignalSources` fuer denselben digitalen Pfad unterdruecken. |
| `digitalBackupPairMismatch` | 14 | `warning` oder `error` | 75 | 70 | `component`/`handle` | `error` fuer fehlenden/falschen Backup-Pfad; `warning`, wenn erster Strip-Backup toleriert am Data-Netz statt empfohlen an GND liegt. Bei LED-zu-LED-Weiterleitung muss Backup vom selben vorgelagerten Segment kommen wie Data. |
| `signalOutputWithoutConsumer` | 15 | `warning` | 50 | 125 | `net` | Gegenstueck zu `signalSinkWithoutSource`, aber weniger kritisch. Von Richtung- und Subtype-Fehlern unterdruecken lassen. |
| `levelShifterSupplyMismatch` | 16 | `error` | 95 | 36 | `component` | Sehr spezifisch und wichtig. Sollte allgemeinere digitale Pegelfehler fuer Kanale desselben Level-Shifters teilweise erklaeren koennen, aber nicht komplett verstecken, wenn externe Eingangspegel weiterhin falsch sind. |
| `capacitorPolarityMismatch` | 17 | `error` | 90 | 34 | `component`/`handle` | Konkreter Bauteilfehler. Sollte generische Mixed-Netz-Meldungen nicht pauschal unterdruecken, aber fuer die Kondensatorpins als beste Meldung gelten. |
| `mainsConnectorIncomplete` | 18 | `error` | 75 | 14 | `component` | Spezifischere Zusammenfassung von mehreren `mainsInputMissing`-Pins. Kann einzelne fehlende L/N-Meldungen gruppieren, sollte PE-Sicherheitsmeldung separat lassen koennen. |
| `protectiveEarthMissingForMetalOrMainsDevice` | 19 | `warning` oder `error` | 80 | 16 | `component`/`handle` | Sollte `mainsInputMissing` fuer PE ergaenzen oder ersetzen, wenn der Komponententyp klar sicherheitsrelevant ist. |
| `supplyInputOnlyInternallyPowered` | 20 | `warning` | 60 | 90 | `component`/`net` | Deaktiviert. Der Spezialfall war bei LED-Streifen irrefuehrend; fehlende echte Quellen sollen ueber `supplyInputWithoutSource` oder `powerMissing` sichtbar werden. |
| `fuseCurrentMissingOrUnderspecified` | 21 | `info` oder `warning` | 45 | 160 | `component` | Eher Beratungsregel. Sollte erst relevant werden, wenn Sicherungsmetadaten konsistent gepflegt sind. |
| `unusedRequiredFunctionalGroup` | 22 | `warning` oder `error` | 80 | 75 | `component` | Kann mehrere einzelne Pflichtpin-Meldungen gruppieren. Sollte erst mit passenden Gruppen-Metadaten umgesetzt werden. |
| `powerWireCrossSectionTooSmall` | 23 | `warning` | 70 | 100 | `edge`/`net` | Wertvoll, aber erst mit Last-/Simulationsdaten belastbar. Sollte von `wireWithoutPhysicalParameters` abhaengen: ohne Parameter zuerst Parameterwarnung. |
| `duplicateParallelWire` | 24 | `info` oder `warning` | 35 | 170 | `edge` | Qualitaetshinweis. Sollte von echten elektrischen Fehlern unterdrueckt oder weit unten angezeigt werden. |
| `isolatedComponent` | 25 | `info` | 30 | 180 | `component` | Niedrige Prioritaet, da beim Entwurf haeufig normal. Sollte nicht fuer Zeichen-/Info-Komponenten erscheinen. |
| `componentDefinitionIncompleteForChecks` | 26 | `info` | 60 | 900 | `component`/`handle` | Nur Diagnose-/Entwicklermodus. Im Nutzer-Modus standardmaessig ausblenden. |
| `ambiguousMultiFunctionHandle` | 27 | `info` oder `warning` | 60 | 910 | `handle` | Nur Diagnose-/Entwicklermodus. Hilft Komponentenautoren, sollte Nutzer nicht stoeren. |
| `digitalLedSignalGroupGroundMissing` | 28 | `error` | 85 | 47 | `component`/`handle` | Spezifische LED-Gruppenregel fuer Data-/Clock-Eingaenge ohne GND in derselben `_start`, `_end` oder `_middle_N`-Gruppe. Sollte allgemeine Komponenten-GND-Meldungen nicht komplett ersetzen, aber fuer den betroffenen Signalanschluss die klarere Meldung sein. |
| `sn74Ahct125nDirectLedOutputMissingSeriesResistor` | 29 | `warning` | 80 | 72 | `handle` | Spezifischer Aufbauhinweis fuer direkte SN74AHCT125N-Ausgaenge auf LED-Data-/Clock-Eingaenge. Erscheint nur ohne Serienwiderstand im Elementary-Net-Pfad. |

## Empfohlene Umsetzungsreihenfolge

Als praktische Roadmap ist diese Liste historisch zu lesen: Alle nicht mit `NICHT IMPLEMENTIEREN` markierten Regeln aus dieser Tabelle sind inzwischen umgesetzt. Die drei bewusst ausgelassenen Regeln bleiben als spaetere bzw. explizit ausgeschlossene Kandidaten stehen.

1. `wireConnectedToHiddenOrMissingHandle`: schafft Vertrauen in den Netzaufbau und verhindert stille Fehler.
2. `mainsWireConnectedToLowVoltageComponent`: schliesst eine wichtige Sicherheitsluecke, weil L/N/PE auf reine Kleinspannungs-Eingaenge nicht immer ueber Netzklassifikation auffaellt.
3. `groundAndSupplyPolaritySwapped`: kritischer, haeufiger Spezialfall mit klarerer Meldung als `mixedClassifications`.
4. `mixedDigitalSignalTypes`: NICHT IMPLEMENTIEREN.
5. `componentHasOnlyOneTerminalConnected`: schnell implementierbar und erkennt viele unvollstaendige Bauteile.
6. `supplyVoltageUnknown`: erklaert, warum Spannungschecks nicht greifen.
7. `fuseBypassed`: wichtig fuer Schutzfunktionen, sobald Fuse-Boards genutzt werden.
8. `controlledOutputWithoutControlInput`: prueft genutzte geschaltete Ausgaenge ueber das Handle-Metadatum `controllableBy`.
9. `analogLedColorChannelUnconnected`: macht fehlende Farbkanaele bei verwendeten analogen LED-Streifen sichtbar.
10. `analogLedColorChannelMultiplePwmSignals`: verhindert mehrere unterschiedliche PWM-Treiber auf demselben analogen Farbkanal.
11. `wireWithoutPhysicalParameters`: Vorbereitung fuer Simulation und Strom-/Spannungsfall-Auswertung.

Weitere Mains-Regeln wie `mainsConnectorIncomplete` und `protectiveEarthMissingForMetalOrMainsDevice` sind umgesetzt. `levelShifterSupplyMismatch` und `powerWireCrossSectionTooSmall` bleiben wegen der `NICHT IMPLEMENTIEREN`-Markierung bewusst offen.
