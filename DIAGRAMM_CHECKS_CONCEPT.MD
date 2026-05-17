# Diagramm Checks Konzept und aktueller Implementierungsstand

Stand: 2026-05-17

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

Nur sichtbare Handles werden beruecksichtigt. Handles werden ausgefiltert, wenn ihre `hideConditions` anhand der aktuellen `selectFields` der Komponente greifen. Es werden sowohl `data.handles` als auch `data.repeatedHandleArray` einer Node einbezogen.

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

### Spannungsdaten

Ausgangsspannungen werden fuer Handles mit Ausgangsfunktion abgeleitet:

- Wenn `handle.Vout` eine Zahl groesser 0 ist, wird diese verwendet.
- Wenn `handle.VoutDependency` auf ein Input-Feld zeigt und dieses einen numerischen Wert hat, wird dieser Wert verwendet.
- Fuer `suppl_out` wird zusaetzlich das Input-Feld `source_voltage` als Fallback genutzt.
- `resolveVoltageOut()` kann bei abhaengigen Ausgaengen die Spannung rekursiv ueber versorgende, extern erreichbare Handles aufloesen.

Eingangstoleranzen werden fuer Eingangs-Handles aus `tolVmin` und `tolVmax` uebernommen. Ein Eingang ohne definierte Grenzen akzeptiert jede aufgeloeste Spannung.

## Netzaufbau

Die Netze werden in drei Schichten aufgebaut. Diese Schichtung ist wichtig, weil unterschiedliche Regeln unterschiedlich weit "durch" Komponenten schauen muessen.

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

- Beide Handles haben `gnd`.
- Ein `suppl_out` ist von einem `suppl_in` abhaengig: `suppl_out.VoutDependency === suppl_in.hid`.
- Zwei `suppl_out`-Handles haben feste Ausgangsspannungen, die sich um weniger als 0.5 V unterscheiden.
- Zwei `suppl_out`-Handles verwenden dieselbe `VoutDependency`, die als Input-Feld der Komponente existiert.
- Bei LED-Komponenten (`node.data.group === 'led'`) werden mehrere `suppl_in`-Handles derselben Komponente verbunden.
- Bei einem `Resistor` werden zwei Netze verbunden, wenn beide angrenzenden Fused Nets als digitale Netze klassifiziert sind.

Diese Layer-Logik erlaubt z.B.:

- gemeinsame GND-Bezuege innerhalb einer Komponente zu erkennen
- weitergereichte Versorgungsausgaenge von echten unabhaengigen Quellen zu unterscheiden
- LED-Streifen mit mehreren Einspeisepunkten als einen Verbraucherzusammenhang zu behandeln
- digitale Signale ueber einen Serienwiderstand hinweg als erreichbar zu betrachten

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
- internen Sicherungsverbindungen
- internen `suppl_in`-zu-`suppl_in`-Verbindungen derselben Komponente

### `externallyPowerReachableHandles(handle)`

Startet nur ueber externe Wires aus der Komponente heraus und bleibt danach ausserhalb der Ausgangskomponente. Diese Funktion wird fuer abhaengige Spannungsausgaenge genutzt, um die externe Quelle zu finden, ohne die eigene Komponente als Quelle zu zaehlen.

### `signalReachableHandles(handle)`

Startet bei einem Handle und folgt:

- Elementary-Net-Verbindungen
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

### `signalSinkWithoutSource`

Fehler, wenn ein Signal-Eingang verdrahtet ist, aber das Netz nicht als passendes Signalnetz klassifiziert ist.

Aktuelle Signaldefinitionen:

- Digital: Quellen `dig_out`, `dig_clock_out`, `dig_backup_out`; Senken `dig_in`, `dig_clock_in`, `dig_backup_in`
- PWM: Quelle `pwm_out`; Senken `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W`, `pwm_in_WW`
- Analog: Quelle `an_out`; Senke `an_in`
- Audio: Quelle `audio_out`; Senke `audio_in`
- USB: Quelle `usb_power_out`; Senke `usb_full`

Digitale Senken haben eine Sonderbehandlung: Sie gelten auch dann als aufgeloest, wenn ueber `signalReachableHandles()` eine digitale Quelle erreichbar ist oder eine gueltige Bias-Verbindung existiert.

Eine digitale Bias-Verbindung gilt als gueltig, wenn:

- erreichbare digitale Senken vorhanden sind,
- und entweder GND erreichbar ist und die Zielspannung 0 V erlaubt,
- oder ein `suppl_out` erreichbar ist, dessen aufgeloeste Spannung in den erlaubten Bereich der digitalen Senke passt.

Passive Signal-Komponenten `Kerko` und `Resistor` werden dabei nicht als digitale Bias-Ziele betrachtet.

### `digitalSignalVoltageMismatch`

Fehler, wenn ein digitaler Eingang mit einer digitalen Quelle verbunden ist, deren aufgeloeste Ausgangsspannung ausserhalb von `tolVmin` / `tolVmax` des Eingangs liegt.

Geprueft wird, wenn:

- das Netz als digitales Netz klassifiziert ist, oder
- das Netz keine Klassifikation hat, aber fuer den Eingang digitale Quellen ueber `signalReachableHandles()` gefunden wurden.

Quellen ohne aufloesbare Spannung erzeugen keinen Mismatch.

### `multipleSignalSources`

Fehler, wenn ein klassifiziertes Signalnetz mehr als eine passende Quelle enthaelt.

Geprueft wird fuer dieselben Signaldefinitionen wie bei `signalSinkWithoutSource`. Es werden nur `sourceHandles` des Netzes betrachtet.

### `supplyInputWithoutSource`

Fehler, wenn ein Netz `suppl_in`-Handles enthaelt, aber keine unabhaengige Supply-Quelle erkannt wird.

`usb_full` wird hier explizit aus den Supply-Inputs herausgefiltert, weil USB separat als USB-Netz behandelt wird.

### `supplySourceWithoutConsumer`

Warnung, wenn ein Supply-Netz eine Quelle enthaelt, aber keinen `suppl_in`-Verbraucher und keinen digitalen Bias-Consumer.

Diese Regel ist als Hinweis gedacht: Ein Versorgungsausgang ist verdrahtet, aber es haengt kein erkannter Verbraucher daran.

### `supplyVoltageMismatch`

Fehler, wenn ein Supply-Netz genau eine unabhaengige Quelle hat, deren Spannung ausserhalb der erlaubten Bereiche eines oder mehrerer `suppl_in`-Handles liegt.

Quellen ohne aufloesbare Spannung werden nicht geprueft.

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
- mindestens ein `usb_full` in einem USB-Netz liegt.

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

## Priorisierung und Targeting

Issues enthalten:

- `id`
- `ruleId`
- `severity`: `error`, `warning` oder `info`
- `priority` optional
- Titel, Kurzbeschreibung, Beschreibung, Empfehlung
- `targets`

Targets sind aktuell `node` oder `edge`. Ein Handle wird indirekt ueber seine Node und die angeschlossenen Edges abgebildet. Doppelte Targets werden ueber `type`, `id` und optional `handleId` dedupliziert.

Einige schwere Netzfehler setzen `priorityBlockedNetIds`. Dadurch werden nachgelagerte generische Checks fuer dasselbe Netz unterdrueckt. Ziel ist, dass der Nutzer zuerst die urspruenglichere Ursache sieht, z.B. "Netzspannung und Kleinspannung verbunden" statt zusaetzlich "unterschiedliche Ausgangstypen verbunden".

## UI-Stand

Die Sidebar `DiagramCheckPage` bietet aktuell:

- Beta-Hinweis
- Button zum manuellen Starten
- Regeluebersicht im Modal
- leeren Zustand vor dem ersten Check
- Erfolgsmeldung, wenn keine Issues gefunden wurden
- Collapse-Liste der Issues mit Severity-Tag
- Anzeige von Beschreibung, Empfehlung und betroffenen Elementen
- Highlighting der betroffenen Nodes und Edges beim Aufklappen eines Issues

Es gibt ausserdem einen deaktivierten Debug-Modus `SHOW_NET_DEBUG`. Wenn er lokal auf `true` gesetzt wird, zeigt die Sidebar alle Elementary, Fused und Component-Linked Nets inklusive Klassifikationen, Pins, Wires und Highlight-Button.

## Bekannte Grenzen des aktuellen Standes

- Die Check-Engine ist regelbasiert und keine vollstaendige elektrische Simulation.
- Netzklassifikation basiert vor allem auf Handle-Funktionen, nicht auf Bauteilphysik.
- Nur sichtbare Handles werden geprueft.
- Nicht verdrahtete Einzelhandles erzeugen keine eigenen Netze; komponentenbezogene Regeln decken solche Faelle separat ab.
- Viele interne Komponentenbeziehungen sind explizit codiert, z.B. LED-Mehrfacheinspeisungen, Fuse-Verbindungen und SN74AHCT125N-Kanaele.
- Targets zeigen aktuell Node und Wire, aber nicht separat einen konkreten Pin als eigenes UI-Ziel.
- Die Regeltexte sind i18n-basiert; die technische Regeldefinition und die sichtbaren Beschreibungen koennen auseinanderlaufen, wenn Uebersetzungen nicht mitgepflegt werden.
