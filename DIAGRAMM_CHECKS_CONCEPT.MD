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

### `signalSinkWithoutSource`

Fehler, wenn ein Signal-Eingang verdrahtet ist, aber das Netz nicht als passendes Signalnetz klassifiziert ist.

Aktuelle Signaldefinitionen:

- Digital: Quellen `dig_out`, `dig_clock_out`, `dig_backup_out`; Senken `dig_in`, `dig_clock_in`, `dig_backup_in`
- PWM: Quelle `pwm_out`; Senken `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W`, `pwm_in_WW`
- Analog: Quelle `an_out`; Senke `an_in`
- Audio: Quelle `audio_out`; Senke `audio_in`
- USB: Quelle `usb_power_out`; Senke `usb_full`

Hinweis zu analogen LED-Streifen: `pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W` und `pwm_in_WW` werden dort aktuell als negativ geschaltete Lastanschluesse verwendet, nicht als klassische Logiksignal-Eingaenge. Fuer diese Handles sollten Spannungs-/Signalchecks perspektivisch anders arbeiten als bei reinen PWM-Logikpins, z.B. ueber eine eigene Lastanschluss-Funktion oder ueber Komponentenmetadaten, die Common-Anode-LED-Lasten von Signalinputs unterscheiden. Bis dahin sollten fehlende `tolVmin`/`tolVmax` an diesen analogen Strip-Pins nicht automatisch als Definitionsfehler bewertet werden.

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
| `multipleSupplySources` | `error` | 70 | 35 | `net` | Konkreter Supply-Fehler. Sollte vor `supplyVoltageMismatch` stehen, weil bei mehreren Quellen die eindeutige Spannung nicht bestimmbar ist. |
| `signalSinkWithoutSource` | `error` | 60 | 50 | `net`/`handle` | Sollte pro betroffenem Signaltyp und Netz erscheinen. Kann durch spezifischere Signalfehler wie `mixedDigitalSignalTypes` oder `dataDirectionWrong` unterdrueckt werden. |
| `digitalSignalVoltageMismatch` | `error` | 75 | 45 | `handle` | Konkreter als allgemeine Signalquellen-Regeln. Sollte nicht durch `signalSinkWithoutSource` verdeckt werden. |
| `multipleSignalSources` | `error` | 65 | 55 | `net` | Wichtig, aber nach sicherheits- und versorgungsbezogenen Fehlern. Kann durch spezifischere Direction-/Subtype-Regeln unterdrueckt werden. |
| `supplyInputWithoutSource` | `error` | 60 | 40 | `net` | Grundlegender Versorgungsfehler. Sollte vor komponentenbezogenem `powerMissing` stehen, wenn beide dieselbe Ursache beschreiben. |
| `supplySourceWithoutConsumer` | `warning` | 45 | 120 | `net` | Hinweischarakter. Sollte von konkreten Fehlern im selben Netz unterdrueckt werden, z.B. Mischfehler oder mehrere Quellen. |
| `supplyVoltageMismatch` | `error` | 75 | 42 | `net`/`handle` | Konkreter Spannungsfehler. Sollte nur laufen/anzeigen, wenn genau eine Quelle bekannt ist und keine priorisierten Netzmischfehler existieren. |
| `requiredPinUnconnected` | `error` | 70 | 32 | `handle` | Sehr konkret. Sollte fuer Pflichtpins sichtbar bleiben, kann aber in spaeteren Gruppenregeln als Teilursache zusammengefasst werden. |
| `groundMissing` (Component) | `error` | 55 | 60 | `component` | Konkrete Komponentenperspektive. Kann zusammen mit Network-`groundMissing` auftreten; spaeter ggf. als Detail unter einer globalen Ground-Meldung gruppieren. |
| `powerMissing` | `error` | 55 | 58 | `component` | Kann dieselbe Ursache wie `supplyInputWithoutSource` haben. Bei Deduplizierung sollte die Netzmeldung gewinnen, wenn sie den ganzen betroffenen Versorgungspfad besser beschreibt; die Komponentenmeldung kann als Detail erhalten bleiben. |
| `mainsInputMissing` | `error` | 70 | 12 | `component`/`handle` | Sicherheitsrelevant und konkret. Sollte vor allgemeinen Komponentenfehlern stehen. |
| `sn74Ahct125nUsedChannelInputMissing` | `error` | 100 | 38 | `component`/`handle` | Sehr spezifisch. Sollte allgemeinere digitale Signalfehler fuer die betroffenen Pins/Kanaele unterdruecken, aber nicht Versorgung/GND-Fehler des Chips. |

## Priorisierung der bestehenden Regelgruppen

Empfohlene Reihenfolge im normalen Nutzer-Modus:

1. Diagrammweite Blocker, z.B. `diagram-empty`.
2. Sicherheitskritische Netzspannungsfehler: `mainsLowVoltageMixed`, `peActiveMixed`, `mainsInputMissing`.
3. Kritische Basisnetze: `groundMultiple`, `groundMissing`.
4. Versorgungsstruktur: `multipleSupplySources`, `supplyInputWithoutSource`, `supplyVoltageMismatch`.
5. Pflichtpins und komponentenspezifische harte Fehler: `requiredPinUnconnected`, `sn74Ahct125nUsedChannelInputMissing`, `powerMissing`.
6. Signalintegritaet: `digitalSignalVoltageMismatch`, `signalSinkWithoutSource`, `multipleSignalSources`, `rs485Mixed`.
7. Fallbacks und Warnungen: `mixedClassifications`, `supplySourceWithoutConsumer`.

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

## Konzept fuer eindeutige Fehlermeldungen

### Problem

Wenn eine spezifische Regel denselben technischen Fehler genauer beschreibt als eine allgemeine Regel, kann ohne Gegenmassnahme trotzdem mehr als eine Meldung entstehen.

Beispiel:

- Eine neue Spezialregel `groundAndSupplyPolaritySwapped` meldet: "Plus und GND sind verbunden".
- Die allgemeine Regel `mixedClassifications` koennte fuer dasselbe Netz zusaetzlich melden: "Unterschiedliche Ausgangstypen verbunden".

Fuer Nutzer ist die zweite Meldung in diesem Fall nicht hilfreich. Pro eigentlichem Fehler sollte nur die beste, konkreteste Meldung sichtbar sein.

Aktuell gibt es bereits einen einfachen Ansatz: `priorityBlockedNetIds`. Einige schwere Netzwerkregeln markieren ein Netz als blockiert, damit spaetere generische Netzwerkregeln fuer dieses Netz nicht mehr laufen. Das funktioniert fuer einfache Faelle innerhalb von `runNetworkRules`, ist aber noch kein allgemeines Konzept fuer alle Regeln und alle Target-Arten.

### Zielbild

Die Check-Engine sollte Issues nicht nur sammeln, sondern vor der Ausgabe normalisieren:

1. Spezifische Regeln duerfen allgemeine Regeln fuer denselben Fehlerbereich verdraengen.
2. Die UI bekommt moeglichst nur eine Meldung pro Ursache.
3. Bei mehreren passenden Meldungen gewinnt die Meldung mit hoeherer Spezifitaet.
4. Technisch unterschiedliche Fehler am selben Netz duerfen weiterhin mehrere Meldungen erzeugen, wenn sie wirklich unterschiedliche Ursachen beschreiben.

### Konzept: Issue-Fingerprint und Suppression

Jedes Issue sollte zusaetzlich zu `id`, `ruleId`, `severity` und `targets` eine maschinenlesbare Deduplizierungsinformation bekommen.

Vorschlag fuer neue optionale Felder:

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

Statt Regeln direkt ungefiltert an die UI zu geben, sollte `runDiagramCheck()` eine Nachverarbeitung ausfuehren:

1. Alle Regeln erzeugen zunaechst ihre Issues.
2. Issues ohne `fingerprint` bleiben sichtbar, ausser sie werden explizit ueber Targets dedupliziert.
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

- `priorityBlockedNetIds` zu einer allgemeinen Blockstruktur erweitern.
- Neue Spezialregeln sollen beim Melden explizit generische Problemtypen fuer denselben Scope blockieren.
- Besonders `mixedClassifications` sollte nur noch als Fallback laufen, wenn kein spezifischer Mischfehler fuer dieses Netz erzeugt wurde.

Langfristig:

- `DiagramCheckIssue` um `fingerprint`, `specificity`, `suppresses` und `suppressedBy` erweitern.
- Eine zentrale Funktion `normalizeDiagramCheckIssues()` zwischen Regelausfuehrung und UI einfuehren.
- Regelimplementierungen duerfen dann ruhig mehrere potenzielle Issues erzeugen; die Normalisierung entscheidet, welche Meldung fuer Nutzer am besten ist.

Damit bleibt die Regelbasis erweiterbar, ohne dass die UI bei jedem neuen Spezialcheck mehr doppelte oder widerspruechliche Meldungen zeigt.

### Schaltbarer Diagnosemodus fuer alle Issues

Zusaetzlich zum normalen Nutzer-Modus sollte es einen per Schalter aktivierbaren Diagnosemodus geben, in dem keine oder nur minimale Deduplizierung stattfindet. In diesem Modus sollen sowohl allgemeine als auch spezifischere Meldungen angezeigt werden.

Ziel:

- pruefen, ob neue Spezialregeln tatsaechlich ausloesen
- sehen, welche generischen Regeln denselben Fehler ebenfalls erkennen
- erkennen, ob eine allgemeine Regel zu breit oder zu eng greift
- Suppression-Beziehungen testen, ohne die Rohdaten zu verlieren
- Regelentwicklung und Regressionstests einfacher machen

Moegliche Namen:

- `SHOW_ALL_DIAGRAM_CHECK_ISSUES`
- `ENABLE_DIAGRAM_CHECK_DIAGNOSTICS`
- `DIAGRAM_CHECK_DEDUPLICATION_MODE`

Empfohlen waere kein reiner Boolean, sondern ein Modus:

```ts
type DiagramCheckDeduplicationMode =
  | 'user-friendly'
  | 'diagnostic';
```

Verhalten:

- `user-friendly`: Standardmodus. Issues werden normalisiert, generische Doppelmeldungen werden unterdrueckt.
- `diagnostic`: Alle erzeugten Issues bleiben sichtbar. Optional kann die UI anzeigen, welche Issues im Standardmodus unterdrueckt wuerden.

Noch hilfreicher waere ein dritter Modus:

```ts
type DiagramCheckDeduplicationMode =
  | 'user-friendly'
  | 'diagnostic'
  | 'diagnostic-with-suppression-markers';
```

In `diagnostic-with-suppression-markers` wuerden alle Issues angezeigt, aber unterdrueckte Issues werden markiert, z.B. mit einem Tag "wuerde im Nutzer-Modus unterdrueckt". Dadurch kann man pruefen, ob die Deduplizierung korrekt arbeitet, ohne die Rohmeldungen zu verstecken.

Moegliche Implementierung:

```ts
const DIAGRAM_CHECK_DEDUPLICATION_MODE: DiagramCheckDeduplicationMode = 'user-friendly';

export function runDiagramCheck(jsonData: string): DiagramCheckIssue[] {
  const rawIssues = runAllDiagramCheckRules(jsonData);

  if (DIAGRAM_CHECK_DEDUPLICATION_MODE === 'diagnostic') {
    return rawIssues;
  }

  return normalizeDiagramCheckIssues(rawIssues, {
    includeSuppressed: DIAGRAM_CHECK_DEDUPLICATION_MODE === 'diagnostic-with-suppression-markers',
  });
}
```

Dafuer muesste `normalizeDiagramCheckIssues()` optional nicht nur die sichtbaren Issues zurueckgeben, sondern auch Metadaten:

```ts
type NormalizedDiagramCheckIssue = DiagramCheckIssue & {
  suppressed?: boolean;
  suppressedByIssueIds?: string[];
};
```

Die UI koennte dann im Diagnosemodus zusaetzlich anzeigen:

- ob ein Issue im normalen Modus sichtbar waere
- durch welches spezifischere Issue es unterdrueckt wuerde
- welchen `fingerprint` und welche `specificity` es hat

Der Schalter sollte nicht prominent fuer normale Nutzer sichtbar sein. Geeignete Orte:

- Entwickler-Konstante neben `SHOW_NET_DEBUG`
- Feature-Flag-Datei fuer Diagramm-Checks
- spaeter optional ein Debug-Bereich in der Regeluebersicht

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

## Vorschlaege fuer weitere Regeln

Die folgenden Regeln sind noch nicht implementiert. Sie sind als fachliche und technische Kandidaten fuer naechste Ausbaustufen gedacht.

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

#### `mixedDigitalSignalTypes`

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

Moegliche Logik:

- Pro Komponente `supplyInputHasExternalSource()` erweitern oder eigene Reachability nutzen.
- Pruefen, ob die Quelle wirklich von einer anderen Komponente mit `suppl_out` kommt.
- Severity `warning`, um False Positives bei passiven Verteilern zu vermeiden.

#### `fuseBypassed`

Warnung oder Fehler, wenn ein abgesicherter Ausgang und ein ungesicherter Eingang derselben Fuse-Komponente extern wieder zusammengeschaltet werden.

Bei Fuse-Boards kann ein Nutzer versehentlich die Sicherung umgehen, indem Eingang und Ausgang ausserhalb der Komponente verbunden werden.

Moegliche Logik:

- `internalConnections.kind === 'fuse'` als bekannte Fuse-Paare nutzen.
- Wenn `fromHandle` und `toHandle` nicht nur ueber den Fuse-Layer, sondern bereits im selben Elementary Net liegen, wurde die Sicherung extern ueberbrueckt.
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

- Elektrolytkondensatoren ueber technische ID oder Metadaten erkennen.
- Plus-Handle darf nicht in `gnd_net_type` liegen.
- Minus-Handle sollte in `gnd_net_type` liegen oder zumindest nicht in einem Supply-Netz mit positiver Quelle.
- Fuer Keramikkondensatoren nicht anwenden.

#### `levelShifterSupplyMismatch`

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

- Wires in Netzen mit `suppl_net_type` oder `gnd_net_type` betrachten.
- Edge-Daten auf physikalische Laenge und Querschnitt pruefen.
- Severity `info` fuer kleine Projekte, `warning` wenn Simulation aktiviert wird.

#### `powerWireCrossSectionTooSmall`

Warnung, wenn ein Power-Wire anhand bekannter Lastdaten wahrscheinlich zu duenn ist.

Diese Regel braucht zusaetzliche Strom-/Lastinformationen und ist daher eher ein spaeterer Ausbau oder eine Bruecke zur Simulation.

Moegliche Logik:

- Supply-Netz, Verbraucher und Sicherungswerte aggregieren.
- Drahtquerschnitt gegen geschaetzte Maximalstroeme pruefen.
- Als konservative Warnung formulieren, solange keine echte Simulation laeuft.

#### `duplicateParallelWire`

Info oder Warnung, wenn zwei identische Handles durch mehrere Wires parallel verbunden sind.

Das kann absichtlich sein, ist in einem Diagramm aber oft ein versehentlich doppelt gezogener Draht.

Moegliche Logik:

- Edges nach normalisiertem Paar `(source, sourceHandle, target, targetHandle)` gruppieren.
- Gegenrichtung als gleiches Paar behandeln.
- Wenn mehr als eine Wire in derselben Gruppe liegt, Info oder Warnung erzeugen.

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
| `componentHasOnlyOneTerminalConnected` | 5 | `warning` | 65 | 110 | `component` | Guenstig umzusetzen und hilfreich. Sollte nicht haertere Pflichtpin-Fehler unterdruecken; eher als zusaetzlicher Hinweis oder durch `requiredPinUnconnected` unterdrueckbar. |
| `supplyVoltageUnknown` | 6 | `warning` | 55 | 95 | `net` | Sollte angezeigt werden, wenn Spannungschecks nicht aussagekraeftig sind. Wird von konkretem `supplyVoltageMismatch` unterdrueckt, sobald die Spannung bekannt ist. |
| `fuseBypassed` | 7 | `error` | 90 | 18 | `net`/`component` | Sicherheits-/Schutzfunktionsfehler. Sollte allgemeine Fuse- oder Mixed-Netz-Hinweise fuer dieselben Fuse-Paare unterdruecken. |
| `wireWithoutPhysicalParameters` | 8 | `info` oder `warning` | 40 | 150 | `edge` | Vorbereitung fuer Simulation. Sollte von haerteren Wire-Fehlern wie fehlendem Handle unterdrueckt werden. |
| `clockedLedClockMissing` | 9 | `error` | 85 | 46 | `component`/`handle` | Sehr konkret fuer Clock-LEDs. Sollte generisches `signalSinkWithoutSource` fuer den Clock-Pin unterdruecken; bei LED-zu-LED-Weiterleitung muss Clock vom selben vorgelagerten Segment kommen wie Data. |
| `dataDirectionWrong` | 10 | `error` | 80 | 48 | `net`/`handle` | Konkreter als allgemeine Quellen-/Senkenfehler. Kann `signalSinkWithoutSource` oder `multipleSignalSources` fuer denselben digitalen Pfad unterdruecken. |
| `digitalBackupPairMismatch` | 11 | `warning` oder `error` | 75 | 70 | `component`/`handle` | `error` fuer fehlenden/falschen Backup-Pfad; `warning`, wenn erster Strip-Backup toleriert am Data-Netz statt empfohlen an GND liegt. Bei LED-zu-LED-Weiterleitung muss Backup vom selben vorgelagerten Segment kommen wie Data. |
| `signalOutputWithoutConsumer` | 12 | `warning` | 50 | 125 | `net` | Gegenstueck zu `signalSinkWithoutSource`, aber weniger kritisch. Von Richtung- und Subtype-Fehlern unterdruecken lassen. |
| `levelShifterSupplyMismatch` | 13 | `error` | 95 | 36 | `component` | Sehr spezifisch und wichtig. Sollte allgemeinere digitale Pegelfehler fuer Kanale desselben Level-Shifters teilweise erklaeren koennen, aber nicht komplett verstecken, wenn externe Eingangspegel weiterhin falsch sind. |
| `capacitorPolarityMismatch` | 14 | `error` | 90 | 34 | `component`/`handle` | Konkreter Bauteilfehler. Sollte generische Mixed-Netz-Meldungen nicht pauschal unterdruecken, aber fuer die Kondensatorpins als beste Meldung gelten. |
| `mainsConnectorIncomplete` | 15 | `error` | 75 | 14 | `component` | Spezifischere Zusammenfassung von mehreren `mainsInputMissing`-Pins. Kann einzelne fehlende L/N-Meldungen gruppieren, sollte PE-Sicherheitsmeldung separat lassen koennen. |
| `protectiveEarthMissingForMetalOrMainsDevice` | 16 | `warning` oder `error` | 80 | 16 | `component`/`handle` | Sollte `mainsInputMissing` fuer PE ergaenzen oder ersetzen, wenn der Komponententyp klar sicherheitsrelevant ist. |
| `supplyInputOnlyInternallyPowered` | 17 | `warning` | 60 | 90 | `component`/`net` | Spezialfall fuer irrefuehrende interne Pass-Throughs. Sollte nach harten Supply-Fehlern kommen und von `supplyInputWithoutSource` unterdrueckt werden, wenn keine Quelle existiert. |
| `fuseCurrentMissingOrUnderspecified` | 18 | `info` oder `warning` | 45 | 160 | `component` | Eher Beratungsregel. Sollte erst relevant werden, wenn Sicherungsmetadaten konsistent gepflegt sind. |
| `unusedRequiredFunctionalGroup` | 19 | `warning` oder `error` | 80 | 75 | `component` | Kann mehrere einzelne Pflichtpin-Meldungen gruppieren. Sollte erst mit passenden Gruppen-Metadaten umgesetzt werden. |
| `powerWireCrossSectionTooSmall` | 20 | `warning` | 70 | 100 | `edge`/`net` | Wertvoll, aber erst mit Last-/Simulationsdaten belastbar. Sollte von `wireWithoutPhysicalParameters` abhaengen: ohne Parameter zuerst Parameterwarnung. |
| `duplicateParallelWire` | 21 | `info` oder `warning` | 35 | 170 | `edge` | Qualitaetshinweis. Sollte von echten elektrischen Fehlern unterdrueckt oder weit unten angezeigt werden. |
| `isolatedComponent` | 22 | `info` | 30 | 180 | `component` | Niedrige Prioritaet, da beim Entwurf haeufig normal. Sollte nicht fuer Zeichen-/Info-Komponenten erscheinen. |
| `componentDefinitionIncompleteForChecks` | 23 | `info` | 60 | 900 | `component`/`handle` | Nur Diagnose-/Entwicklermodus. Im Nutzer-Modus standardmaessig ausblenden. |
| `ambiguousMultiFunctionHandle` | 24 | `info` oder `warning` | 60 | 910 | `handle` | Nur Diagnose-/Entwicklermodus. Hilft Komponentenautoren, sollte Nutzer nicht stoeren. |

## Empfohlene Umsetzungsreihenfolge

Als praktische Roadmap:

1. `wireConnectedToHiddenOrMissingHandle`: schafft Vertrauen in den Netzaufbau und verhindert stille Fehler.
2. `mainsWireConnectedToLowVoltageComponent`: schliesst eine wichtige Sicherheitsluecke, weil L/N/PE auf reine Kleinspannungs-Eingaenge nicht immer ueber Netzklassifikation auffaellt.
3. `groundAndSupplyPolaritySwapped`: kritischer, haeufiger Spezialfall mit klarerer Meldung als `mixedClassifications`.
4. `mixedDigitalSignalTypes`: wichtig fuer LED-Projekte mit Data, Clock und Backup.
5. `componentHasOnlyOneTerminalConnected`: schnell implementierbar und erkennt viele unvollstaendige Bauteile.
6. `supplyVoltageUnknown`: erklaert, warum Spannungschecks nicht greifen.
7. `fuseBypassed`: wichtig fuer Schutzfunktionen, sobald Fuse-Boards genutzt werden.
8. `wireWithoutPhysicalParameters`: Vorbereitung fuer Simulation und Strom-/Spannungsfall-Auswertung.

Weitere Mains-Regeln wie `mainsConnectorIncomplete` und `protectiveEarthMissingForMetalOrMainsDevice` haben fachlich ebenfalls hohe Anzeigeprioritaet, sind aber teilweise schon durch `mainsInputMissing` abgedeckt und koennen deshalb nach der direkten Low-Voltage-Fehlanschlussregel folgen.
