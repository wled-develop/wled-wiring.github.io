# Plausibilitaetsbericht ComponentTypes vs. Diagramm-Checks

Stand: 2026-05-18

Geprueft wurden die Handle-Definitionen in `src/components/ComponentTypes` gegen das Check-Konzept in `DIAGRAMM_CHECKS_CONCEPT.MD` und die aktuelle Implementierung in `src/check`.

Die Check-Engine wertet fuer ComponentTypes vor allem diese Daten aus:

- `handle.functions`
- `tolVmin` / `tolVmax`
- `Vout` / `VoutDependency`
- `mustBeConnected`
- `hideConditions`
- `internalConnections`

## Kurzfazit

Es gibt mehrere Definitionen, die fuer die Checks wahrscheinlich falsch oder unvollstaendig sind. Besonders relevant sind fehlende `functions` bei einigen LED-Streifen, der unbekannte Funktionswert `usb_in`, digitale Ausgaenge ohne aufloesbare Ausgangsspannung und mehrere Funktionswerte, die zwar in ComponentTypes existieren, aber von den Checks aktuell kaum oder gar nicht semantisch ausgewertet werden.

## Kritisch

### 1. `usb_in` ist im Check-Konzept nicht bekannt

Betroffene Handles:

- `src/components/ComponentTypes/ESP32C3D1mini.ts:23` USB
- `src/components/ComponentTypes/ESP32C3_supermini.ts:23` USB
- `src/components/ComponentTypes/ESP32S3D1mini.ts:23` USB
- `src/components/ComponentTypes/ESP8266D1mini.ts:25` USB

Problem:

- `DIAGRAMM_CHECKS_CONCEPT.MD` nennt fuer USB nur `usb_power_out` und `usb_full`.
- `src/types.ts` enthaelt `usb_in` ebenfalls nicht im `HandleDataType['functions']` Union-Type.
- `src/check/checkContext.ts` und `src/check/rules.ts` klassifizieren USB-Netze nur ueber exklusives `usb_power_out` und behandeln USB-Senken nur als `usb_full`.

Auswirkung:

- Diese USB-Handles werden durch die Check-Engine nicht als USB-Senke erkannt.
- `component-rules.powerMissing` kann fuer diese Controller trotz USB-Versorgung falsch anschlagen, weil dort nur `suppl_in` und `usb_full` als Versorgungsbedarf geprueft werden.
- USB-Verbindungen zu `PSU_USB` koennen als `signalSinkWithoutSource`/`powerMissing` oder gar nicht sinnvoll erscheinen.

Verdacht / Empfehlung:

KORRIGIERT: `usb_in` wurde in den betroffenen Controller-USB-Handles durch `usb_full` ersetzt.
- Falls wirklich nur USB-Power-Input gemeint ist: Konzept, Typen und Regeln um einen klaren `usb_power_in`/`usb_in`-Fall erweitern.


### 2. LED-Streifen mit fehlenden `functions` an Daten- und GND-Pins

Betroffene Komponenten/Handles:

- `src/components/ComponentTypes/WS2812B_5V_30LPM.ts:48` `DATA_start`
- `src/components/ComponentTypes/WS2812B_5V_30LPM.ts:70` `GND_start`
- `src/components/ComponentTypes/WS2812B_5V_30LPM.ts:110` `DATA_end`
- `src/components/ComponentTypes/WS2812B_5V_30LPM.ts:130` `GND_end`
- `src/components/ComponentTypes/WS2812B_5V_30LPM.ts:193` `GND_middle`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:48` `BACKUP_start`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:70` `DATA_start`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:92` `GND_start`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:133` `BACKUP_end`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:152` `DATA_end`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:172` `GND_end`
- `src/components/ComponentTypes/WS2813_5V_60LPM.ts:256` `GND_middle`
- `src/components/ComponentTypes/WS2814_12V_30LPM.ts:48` `DATA_start`
- `src/components/ComponentTypes/WS2814_12V_30LPM.ts:70` `GND_start`
- `src/components/ComponentTypes/WS2814_12V_30LPM.ts:110` `DATA_end`
- `src/components/ComponentTypes/WS2814_12V_30LPM.ts:130` `GND_end`
- `src/components/ComponentTypes/WS2814_12V_30LPM.ts:193` `GND_middle`

Problem:

- Die Check-Engine erzeugt `rawFunctions` direkt aus `handle.functions`.
- Ohne `functions` werden die Handles weder als `gnd`, `dig_in`, `dig_out`, `dig_backup_in` noch `dig_backup_out` erkannt.
- `mustBeConnected` auf einem Datenpin prueft nur, ob irgendeine Wire angeschlossen ist, nicht ob die Verbindung fachlich richtig ist.

Auswirkung:

- GND-Checks (`groundMissing`, `groundMultiple`, `mixedClassifications`) bleiben fuer diese GND-Pins blind.
- Signalchecks (`signalSinkWithoutSource`, `multipleSignalSources`, `digitalSignalVoltageMismatch`) bleiben fuer diese Datenpins blind.
- Bei `DATA_end` steht teilweise `Vout: 5`, aber ohne Ausgangsfunktion wird diese Spannung von `inferVoltageOut()` ignoriert.

Verdacht / Empfehlung:

KORRIGIERT: `DATA_start` hat jetzt `functions: ["dig_in"]`.
KORRIGIERT: `DATA_end` hat jetzt `functions: ["dig_out"]`; vorhandene 5-V-Ausgaenge behalten `Vout: 5`.
KORRIGIERT: `BACKUP_start` hat jetzt `functions: ["dig_backup_in"]`.
KORRIGIERT: `BACKUP_end` hat jetzt `functions: ["dig_backup_out"]`.
KORRIGIERT: `GND_*` hat jetzt `functions: ["gnd"]`.

### 3. `SolderJoint` hat keine `functions`

Betroffen:

- `src/components/ComponentTypes/SolderJoint.ts:25` `hid1`

Problem:

- `SolderJoint` ist zwar in `isPassiveJoinNode()` explizit als passiver Verbindungsknoten hinterlegt und verbindet seine Handles intern.
- Bei nur einem Handle gibt es aber keine semantische Funktion, die Netzklassifikation unterstuetzt.
- `changeColorAutomatically` deutet auf einen generischen elektrischen Verbindungspunkt hin.

Auswirkung:

- Der Knoten kann Netze geometrisch verbinden, traegt aber selbst keine erkennbare Funktion.
- Fuer geplante Diagnosechecks wie `componentDefinitionIncompleteForChecks` waere das ein Treffer.

Verdacht / Empfehlung:

NICHTS TUN: - Entweder bewusst als funktionsloser passiver Join dokumentieren, oder mit einer generischen Funktion wie `general_conn` versehen und die Check-Engine entscheiden lassen, wie generische Verbindungspunkte behandelt werden.

## Hoch

### 4. Digitale Weiterleitungs-Ausgaenge ohne `Vout`

Betroffene Handles:

- `src/components/ComponentTypes/APA102_5V_30LPM.ts:136` `Clock_end` mit `dig_clock_out`
- `src/components/ComponentTypes/WS2805_12V_60LPM.ts:136` `BACKUP_end` mit `dig_backup_out`
- `src/components/ComponentTypes/WS2805_24V_60LPM.ts:136` `BACKUP_end` mit `dig_backup_out`
- `src/components/ComponentTypes/WS2815_12V_30LPM.ts:136` `BACKUP_end` mit `dig_backup_out`
- `src/components/ComponentTypes/WS2818_12V_30LPM.ts:136` `BACKUP_end` mit `dig_backup_out`

Problem:

- Laut Konzept werden Ausgangsspannungen fuer Handles mit Ausgangsfunktion aus `Vout` oder `VoutDependency` abgeleitet.
- `digitalSignalVoltageMismatch` kann nur arbeiten, wenn `resolveVoltageOut()` eine Zahl liefern kann.
- Vergleichbare `DATA_end`-Handles der LED-Streifen haben meist `Vout: 5`.

Auswirkung:

- Pegelfehler auf Clock-/Backup-Ausgaengen koennen unentdeckt bleiben.
- Eine spaetere Regel `supplyVoltageUnknown`/`digitalSignalVoltageMismatch` haette hier keine belastbare Spannung.

Verdacht / Empfehlung:

KORRIGIERT: `Clock_end` und `BACKUP_end` der betroffenen LED-Weiterleitungen haben jetzt `Vout: 5`; `DATA_end` war bereits als 5-V-Ausgang gepflegt bzw. wurde mit `dig_out` aktivierbar gemacht.
- Alternativ `VoutDependency` auf den lokalen Versorgungseingang setzen, falls der Ausgangspegel von der Strip-Versorgung abhaengt.

### 5. PWM-Eingaenge analoger LED-Streifen haben keine Toleranzen

Betroffene Komponenten:

- `src/components/ComponentTypes/AN_RGB_24V_120LPM.ts`
- `src/components/ComponentTypes/AN_RGB_CCT_48V_90LPM.ts`
- `src/components/ComponentTypes/AN_WHITE_24V_240LPM.ts`

Beispiele:

- `AN_RGB_24V_120LPM.ts:66` `pwm_in_R`
- `AN_RGB_CCT_48V_90LPM.ts:126` `pwm_in_WW`
- `AN_WHITE_24V_240LPM.ts:66` `pwm_in_W`

Problem:

- `pwm_in_*` wird in `hasVoltageInputFunction()` als spannungsrelevanter Eingang behandelt.
- Die betroffenen PWM-Senken haben keine `tolVmin`/`tolVmax`.
- Laut Konzept akzeptiert ein Eingang ohne definierte Grenzen jede aufgeloeste Spannung.

Auswirkung:

- PWM-Spannungs- oder Pegelfehler koennen nicht erkannt werden.
- Bei analogem LED-Common-Anode-Aufbau ist unklar, ob `pwm_in_*` hier als Logiksignal, MOSFET-Ausgang oder negativer Lastanschluss gemeint ist.

Verdacht / Empfehlung:

DOKUMENTIERT: In `DIAGRAMM_CHECKS_CONCEPT.MD` wurde ergaenzt, dass `pwm_in_*` bei analogen LED-Streifen aktuell negativ geschaltete Lastanschluesse sind und perspektivisch anders als klassische PWM-Logikinputs behandelt werden sollten.
- Wenn es bewusst ein PWM-Signalinput ist, Toleranzen pflegen.

## Mittel

### 6. `suppl_conn`, `general_conn`, `rst`, `not_connected`, `an_common` werden in den Checks kaum genutzt

Beobachtung:

- `suppl_conn` und `general_conn` kommen z.B. in `WAGO_2X` und `WAGO_3X` vor.
- `rst` kommt bei Controller-Resetpins vor.
- `not_connected` kommt bei mittleren LED-Strip-Pads vor.
- `an_common` ist im Typmodell vorhanden, wurde in den ComponentTypes bei der Auswertung aber nicht als aktive Funktion gefunden.

Problem:

- `src/check/checkContext.ts` klassifiziert Netze nicht anhand dieser Funktionen.
- `WAGO_2X`, `WAGO_3X` und `SolderJoint` werden stattdessen hart ueber `technicalID` als passive Join-Nodes erkannt.

Auswirkung:

- Die Funktionswerte sind fuer aktuelle Checks teilweise dokumentativ, nicht wirksam.
- Neue Verbindungskomponenten mit `general_conn`/`suppl_conn` wuerden ohne zusaetzliche `technicalID`-Sonderbehandlung nicht automatisch als passive Join-Nodes funktionieren.

Verdacht / Empfehlung:

DOKUMENTIERT: Diese Funktionen bleiben vorerst bewusst nicht-checkrelevant. Das sollte spaeter neu bewertet werden, wenn generische Verbindungspunkt- oder Reset-Regeln konkret umgesetzt werden.
- Oder Konzept/Engine so erweitern, dass generische Verbindungspunkt-Funktionen nicht nur Dekoration sind.

### 7. Multi-Function-Handles koennen absichtlich, aber auch irrefuehrend sein

Beispiele:

- Controller-GPIOs: `["dig_in", "dig_out"]`
- ADC-faehige GPIOs: `["dig_in", "dig_out", "an_in"]`
- Controller-Power-Pins: `["suppl_in", "suppl_out"]`
- WAGO-Klemmen: `["suppl_conn", "general_conn"]`

Problem:

- Das Konzept weist bereits darauf hin: Einige Klassifikationen verwenden exklusive Funktionen.
- Ein Handle mit `dig_in` + `dig_out` klassifiziert ein Netz deshalb nicht als `digital_net_type`, obwohl es als Quelle und Senke in `sourceHandles`/`sinkHandles` auftaucht.
- Bei Power-Pins mit `suppl_in` + `suppl_out` koennen Quellen- und Verbraucherrolle vermischt werden. `independentSupplySources()` versucht das teilweise zu entschaerfen.

Auswirkung:

- Bei bidirektionalen GPIOs ist das vermutlich gewollt, bei konkreten Input-only-Pins aber nicht.
- Beispiel: In `ESP32D1mini.ts` ist `GPIO34` als "Digital In (input only)" beschrieben, hat aber `["dig_in", "dig_out"]`.

Verdacht / Empfehlung:

- Multi-Function-Handles komponentenweise pruefen.
KORRIGIERT: Handles mit Beschreibung `input only` und irrtuemlichem `dig_out` wurden auf reine `dig_in`-Funktion reduziert.
- Den im Konzept vorgeschlagenen Diagnosecheck `ambiguousMultiFunctionHandle` umsetzen oder zumindest als Entwicklercheck fuehren.

## Bereits plausibel

- `VoutDependency`-Referenzen zeigen in der maschinellen Pruefung auf vorhandene Input-Felder oder vorhandene Handles.
- `internalConnections` vom Typ `fuse` zeigen auf vorhandene Handles.
- `nominalCurrentField` verweist bei den geprueften Sicherungen auf vorhandene Select-/Input-Felder.
- Es wurden keine doppelten `hid` innerhalb einer Komponentendefinition gefunden.

## Empfohlene naechste Schritte

1. KORRIGIERT: `usb_in` bereinigen oder offiziell ins Check-Konzept aufnehmen.
2. KORRIGIERT: Fehlende LED-Strip-`functions` in `WS2812B_5V_30LPM`, `WS2813_5V_60LPM` und `WS2814_12V_30LPM` nachpflegen.
3. KORRIGIERT: Ausgangsspannungen fuer `dig_clock_out`/`dig_backup_out`-Weiterleitungen ergaenzen.
4. DOKUMENTIERT: Semantik der analogen LED-`pwm_in_*`-Handles klaeren.
5. Einen Entwicklercheck fuer unvollstaendige Komponentendefinitionen einfuehren, wie im Konzept unter `componentDefinitionIncompleteForChecks` beschrieben.

## Weitere ComponentTypes-Pruefung: Geometrie und Struktur

Stand: 2026-05-18

Zusaetzlich wurden alle 57 ComponentTypes mit 563 Handle-Definitionen statisch auf weitere Plausibilitaetsprobleme geprueft:

- sichtbare Handle-Ueberlagerungen im Default-Zustand
- `_middle`-/Repeated-Handle-Konsistenz
- unbekannte `functions`
- doppelte `hid`
- fehlende Pflichtfelder
- ungueltige `hideConditions`
- ungueltige `VoutDependency`
- ungueltige `internalConnections`
- ungueltige `simdata.terminals`
- Select-/InputField-Dubletten und ungueltige Defaultwerte

### Deutliche Fehler

#### 8. `WS2815_12V_30LPM.BACKUP_middle` ist nicht als Repeated-Middle-Handle markiert

Betroffen:

- `src/components/ComponentTypes/WS2815_12V_30LPM.ts:221` `BACKUP_middle`

Problem:

- Das Handle heisst `_middle`, hat aber weder `repeated: "yes"` noch `repeatAtFirst: "no"`.
- Dadurch ist es bereits im Default-Zustand sichtbar.
- Es ueberlagert `BACKUP_start` im Default-Zustand vollstaendig bzw. stark.

Auswirkung:

- Nutzer sehen am linken Strip-Anfang zwei uebereinanderliegende Backup-Handles.
- Verbindungsauswahl und Hit-Testing koennen dadurch uneindeutig werden.
- Im Vergleich zu `DATA_middle` und `GND_middle` derselben Datei wirkt die Definition unvollstaendig.

Verdacht / Empfehlung:

KORRIGIERT: - `BACKUP_middle` analog zu den anderen Middle-Handles mit `repeated: "yes"` und `repeatAtFirst: "no"` markieren.

#### 9. `ESP32C3_supermini` USB-Handle ueberlappt GPIO-Handles

Betroffen:

- `src/components/ComponentTypes/ESP32C3_supermini.ts:23` `USB`
- `src/components/ComponentTypes/ESP32C3_supermini.ts:278` `GPIO6`
- `src/components/ComponentTypes/ESP32C3_supermini.ts:303` `GPIO7`

Problem:

- Das sichtbare USB-Handle ist mit `x: 17`, `y: 41`, `width: 35`, `height: 40` sehr gross.
- Es ueberlappt die unteren GPIO-Handles `GPIO6` und `GPIO7` jeweils etwa zur Haelfte.

Auswirkung:

- Klick-/Hover-Flaechen koennen sich gegenseitig stoeren.
- Verbindungen koennen versehentlich am USB-Handle statt an GPIO6/GPIO7 oder umgekehrt starten.

Verdacht / Empfehlung:

SO LASSEN, ICH SEHE KEIN PROBLEM - USB-Handle-Flaeche verkleinern oder so verschieben, dass sie nicht in die untere GPIO-Reihe hineinragt.
- Falls die grosse Flaeche bewusst den physischen USB-Port treffen soll, sollte geprueft werden, ob ein kleineres elektrisches Handle plus separate Optik sinnvoller ist.



#### 10. `SolderJoint.hid1` hat kein `description`-Feld

Betroffen:

- `src/components/ComponentTypes/SolderJoint.ts:25` `hid1`

Problem:

- `HandleDataType` verlangt `description`.
- Das Objekt wird ueber `as ComponentDataType` gecastet, daher faellt der fehlende Wert beim Build nicht auf.

Auswirkung:

- Tooltips, Popover-Listen oder Diagnoseausgaben koennen leere/undefinierte Beschreibung erhalten.
- Es ist ein struktureller Unterschied zu fast allen anderen Handles.

Verdacht / Empfehlung:

SO LASSEN: - `description: "Solder joint pin"` oder eine bewusst leere Beschreibung `description: ""` setzen.

### Weichere Verdachtsfaelle

#### 11. `AN_RGB_CCT_48V_90LPM` Kanal-Handles liegen sehr dicht

Betroffen:

- `src/components/ComponentTypes/AN_RGB_CCT_48V_90LPM.ts:69` `G_start`
- `src/components/ComponentTypes/AN_RGB_CCT_48V_90LPM.ts:89` `B_start`
- `src/components/ComponentTypes/AN_RGB_CCT_48V_90LPM.ts:192` `G_end`
- `src/components/ComponentTypes/AN_RGB_CCT_48V_90LPM.ts:212` `B_end`

Problem:

- `G_*` liegt bei `y: 13`, `B_*` bei `y: 17`, beide mit `height: 5`.
- Dadurch entsteht rechnerisch etwa 1 px vertikale Ueberlappung, also ca. 20 Prozent der kleineren Handle-Flaeche.

Auswirkung:

- In der Praxis kann das noch okay sein, wirkt aber sehr eng.
- Bei Zoom, Borderbreite oder Hit-Testing koennen die Pins schwer sauber anklickbar sein.

Verdacht / Empfehlung:

SO LASSEN: - Visuell pruefen, ob die Kanalpins im Editor sauber getrennt nutzbar sind.
- Falls nicht, y-Abstand leicht vergroessern oder Handle-Hoehe minimal reduzieren.

#### 12. `ESP32C3_supermini.GPIO5` liegt ebenfalls im USB-Randbereich

Betroffen:

- `src/components/ComponentTypes/ESP32C3_supermini.ts:23` `USB`
- `src/components/ComponentTypes/ESP32C3_supermini.ts:251` `GPIO5`

Problem:

- `GPIO5` ueberlappt das grosse USB-Handle rechnerisch zu etwa 31 Prozent.
- Das ist weniger stark als bei `GPIO6`/`GPIO7`, aber noch auffaellig.

Auswirkung:

- Je nach Z-Order und Zoom kann auch GPIO5 vom USB-Handle mit beeinflusst werden.

Verdacht / Empfehlung:

SO LASSEN: - Zusammen mit Issue 9 pruefen und ggf. durch dieselbe USB-Handle-Geometrie-Korrektur erledigen.

### Keine Auffaelligkeiten in diesen Checks

- Keine unbekannten `functions` in ComponentTypes gefunden.
- Keine doppelten `hid` innerhalb einer ComponentType-Definition gefunden.
- Keine kaputten `VoutDependency`-Referenzen gefunden.
- Keine kaputten `internalConnections`-Handle-Referenzen gefunden.
- Keine kaputten `simdata.terminals`-Handle-Referenzen gefunden.
- Keine ungueltigen `hideConditions` gegen vorhandene SelectFields gefunden.
- Keine SelectField-Defaultwerte ausserhalb der Options gefunden.
