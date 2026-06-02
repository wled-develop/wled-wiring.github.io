# Konzept: Nachschaerfung `clockedLedClockMissing`

## Ausgangslage

`clockedLedClockMissing` prueft aktuell korrekt den Fall, dass ein Clock-LED-Streifen hinter einem anderen Clock-LED-Streifen haengt: Wenn `dig_in` vom `dig_out` eines vorgelagerten LED-Streifens gespeist wird, muss `dig_clock_in` vom `dig_clock_out` desselben vorgelagerten LED-Streifens kommen.

Der Controller-Fall ist jedoch zu weich. Wenn ein Clock-LED-Streifen direkt oder ueber Verbindungselemente/Level-Shifter vom Controller gespeist wird, darf `dig_clock_in` nicht nur irgendein "aufgeloester digitaler Eingang" sein. Das Clock-Signal muss ein eigenes Signalnetz bzw. ein eigener Signalpfad sein und darf nicht mit Data, Backup, Supply oder GND vermischt werden.

Wichtig: Ein Clock-Signal muss nicht zwingend von einem `dig_clock_out` kommen. Controller-GPIOs und Level-Shifter-Ausgaenge sind im aktuellen Komponentenmodell normalerweise `dig_out`. Ein `dig_out` kann also entweder Data oder Clock treiben. Er darf aber nicht gleichzeitig ein LED-Data-/LED-Backup-Netz und ein Clock-Netz bedienen.

## Ziel

Ein Clock-LED-Streifen mit angeschlossenem `dig_in` soll nur dann als korrekt gelten, wenn sein `dig_clock_in` eine zur Data-Verbindung passende, getrennte digitale Clock-Verbindung besitzt.

Die Regel soll insbesondere folgende Fehler erkennen:

- `dig_clock_in` liegt im selben Netz bzw. Signalpfad wie `dig_in`.
- `dig_clock_in` liegt an einem Supply-Netz.
- `dig_clock_in` liegt an GND oder einem sonstigen Bias-Netz.
- `dig_clock_in` liegt in einem digitalen Netz, das gleichzeitig `dig_in` oder `dig_backup_in` eines LED-Streifens speist.
- `dig_in` wird von einem Controller gespeist, `dig_clock_in` jedoch von einem anderen Controller oder einer unpassenden digitalen Quelle.

## Bewertung der offenen Punkte

### 1. Clock darf von `dig_out` kommen

Das ist korrekt und sollte im Konzept beruecksichtigt werden.

Die bisherige Idee, fuer den Controller-Fall nur `dig_clock_out` als gueltige Clock-Quelle zu akzeptieren, waere zu streng. Im aktuellen Komponentenmodell haben Controller-GPIOs und SN74AHCT125N-Ausgaenge `dig_out`. Fuer APA102-artige Streifen kann ein normaler Controller-`dig_out` fachlich trotzdem Clock erzeugen.

Deshalb muss die Regel nicht fragen: "Ist die Quelle ein `dig_clock_out`?", sondern: "Wird dieser digitale Ausgang in diesem Pfad exklusiv als Clock-Quelle verwendet?"

Ein `dig_out` ist fuer `dig_clock_in` gueltig, wenn sein erreichbarer Signalpfad nicht gleichzeitig eine LED-Data- oder LED-Backup-Senke speist. Derselbe Ausgang bzw. dasselbe digitale Signalnetz darf also nicht zugleich LED-`dig_in`/LED-`dig_backup_in` und LED-`dig_clock_in` bedienen.

Andere digitale Eingangs-Handles im Clock-Netz sind nicht automatisch ein Fehler. Ein Controller-`dig_in` oder ein anderer nicht-LED-`dig_in` darf im Clock-Pfad liegen, wenn damit das Clock-Signal z.B. zusaetzlich zurueckgelesen oder ueberwacht werden soll. Die Vermischungspruefung richtet sich nur gegen LED-Data-/LED-Backup-Eingaenge, weil dann dasselbe Signal zugleich als LED-Data/Backup und als LED-Clock verwendet wuerde.

Ein Serienwiderstand zwischen digitaler Quelle und LED-Streifen ist dabei weiterhin gueltig. Das gilt sowohl fuer einen Controller-`dig_out` als auch fuer einen Level-Shifter-`dig_out`, der ueber einen Widerstand zum `dig_clock_in` oder `dig_in` des Streifens fuehrt. Der Widerstand darf den Signalpfad fuer diese Pruefung nicht unterbrechen, solange er im Check-Kontext als digitale Signal-Pass-Through-Komponente behandelt wird.

### 2. Data und Clock muessen im Controller-Fall vom selben Controller kommen

Das ist sinnvoll, aber nur mit einer klaren Definition von "vom selben Controller".

Fachlich soll ein Clock-LED-Streifen, dessen `dig_in` vom Controller A gespeist wird, auch sein `dig_clock_in` von Controller A bekommen. Dazwischen koennen passive Verbindungselemente, Serienwiderstaende, Steckverbinder oder Level-Shifter liegen. Besonders beim SN74AHCT125N soll nicht der Level-Shifter als eigentliche logische Quelle gelten, sondern der Controller, der den Level-Shifter-Eingang treibt.

Die Regel sollte daher zwischen zwei Ebenen unterscheiden:

- Naechste digitale Quelle: Der direkt erreichbare Ausgang am Ende des betrachteten Signalpfads, z.B. ein SN74-`Y`-Ausgang oder ein Controller-GPIO.
- Ursprungskomponente: Die vorgelagerte logische Quelle vor transparenten Signalstufen, z.B. der Controller-GPIO vor einem Level-Shifter-Kanal.

Fuer den Vergleich "gleicher Controller" sollte die Ursprungskomponente verwendet werden, soweit sie sicher bestimmbar ist.

## Begriffe

### Digitaler Signalpfad

Ein digitaler Signalpfad umfasst Handles, die ueber Draehte und bekannte signaltransparente Elemente erreichbar sind. Bereits vorhandene Mechanismen wie `signalReachableHandles()` sind dafuer die naheliegende Grundlage.

Signaltransparente Elemente koennen sein:

- passive Verbindungselemente wie WAGO, SolderJoint und Steck-/Klemmverbindungen, soweit sie im Check-Kontext als durchverbunden modelliert sind
- passive Serienkomponenten wie `Resistor`, soweit sie fuer digitale Signale als Signal-Pass-Through behandelt werden
- Level-Shifter-Kanaele, wenn die Richtung und Kanalzuordnung eindeutig modelliert ist

Die Level-Shifter-Aufloesung ist der schwierigste Teil. Fuer SN74AHCT125N ist ein Kanal logisch transparent von `A` nach `Y`, wenn der Kanal benutzt wird und Enable nicht entgegensteht. Die eigentliche Daten-/Clock-Quelle hinter `Y` ist dann die Quelle am passenden `A`-Eingang.

### Clock-kompatible Quelle

Eine Clock-kompatible Quelle fuer `dig_clock_in` ist:

- ein `dig_clock_out`, z.B. beim LED-zu-LED-Fall
- oder ein `dig_out`, z.B. ein Controller-GPIO oder Level-Shifter-Ausgang, wenn dieser Pfad exklusiv als Clock-Pfad verwendet wird

Nicht gueltig sind:

- Supply-Ausgaenge (`suppl_out`)
- GND
- Bias-Aufloesungen ueber Supply/GND
- digitale Pfade, die gleichzeitig LED-Data- oder LED-Backup-Senken speisen

### Data-kompatible Quelle

Eine Data-kompatible Quelle fuer `dig_in` ist:

- ein `dig_out`
- oder ein LED-`dig_out` beim LED-zu-LED-Fall

Fuer den Controller-Fall ist entscheidend, welcher Controller als Ursprungskomponente dieses Data-Signal erzeugt.

## Neue Regelstruktur

### Schritt 1: Betroffene LED-Streifen bestimmen

Pro LED-Komponente:

- `dig_in` bestimmen.
- `dig_clock_in` bestimmen.
- Nur pruefen, wenn `dig_in` existiert und angeschlossen ist.
- Wenn kein `dig_clock_in` existiert, ist die Regel nicht zustaendig.
- Wenn `dig_clock_in` unverbunden ist, `clockedLedClockMissing` melden.

### Schritt 2: LED-zu-LED-Fall wie bisher streng paarweise pruefen

Wenn `dig_in` von genau einem vorgelagerten LED-Streifen gespeist wird:

- Den vorgelagerten LED-`dig_out` als Data-Quelle bestimmen.
- Den korrespondierenden `dig_clock_out` desselben vorgelagerten LED-Streifens bestimmen.
- `dig_clock_in` muss diesen `dig_clock_out` im passenden Signalpfad enthalten.
- Ein Clock-Signal von einem anderen LED-Streifen oder aus einem beliebigen digitalen Netz reicht nicht.

Dieser Teil bleibt der spezielle, harte Kettenfall.

### Schritt 3: Controller-/externe-Quelle-Fall pruefen

Wenn `dig_in` nicht von einem vorgelagerten LED-Streifen kommt:

1. Data- und Clock-Netz bzw. Signalpfad bestimmen.
2. Fehler melden, wenn Data und Clock dasselbe Netz bzw. denselben elementaren Signalpfad verwenden.
3. Fehler melden, wenn der Clock-Pfad Supply oder GND enthaelt.
4. Fehler melden, wenn der Clock-Pfad keine digitale Ausgangsquelle enthaelt.
5. Fehler melden, wenn der Clock-Pfad eine LED-Data- oder LED-Backup-Senke enthaelt:
   - `dig_in` an einer LED-Komponente
   - `dig_backup_in` an einer LED-Komponente
   - optional auch LED-spezifische Data-/Backup-Handles, die durch alte oder importierte Komponentenfunktionen erkannt werden
   - nicht melden fuer `dig_in` an Controllern, Level-Shiftern oder anderen nicht-LED-Komponenten, weil ein Clock-Signal dort bewusst zurueckgelesen oder weiterverarbeitet werden kann
6. Fehler melden, wenn die digitale Clock-Quelle nicht exklusiv fuer Clock verwendet wird.

Damit werden die bekannten Fehlerfaelle abgedeckt:

- `clock_in` am selben Netz wie `dig_in`: Fehler durch Netz-/Pfadgleichheit.
- `clock_in` an Supply: Fehler durch Supply-Klassifikation.
- `clock_in` an digitalem Netz, das einen LED-`dig_in` speist: Fehler durch LED-Data-Senke im Clock-Pfad.

Wichtig: Die erzeugte Fehlermeldung muss die konkrete Verletzungsart benennen. Eine generische Meldung wie "Clock-Leitung fehlt oder passt nicht" reicht fuer die Detailansicht nicht aus, wenn der Check bereits weiss, ob z.B. Data und Clock dasselbe Netz verwenden, Clock an Supply/GND liegt, ein LED-Data-Netz als Clock verwendet wird oder Data und Clock von verschiedenen Controllern stammen.

### Schritt 4: Gleicher Controller als Ursprung

Wenn fuer `dig_in` eine Controller-Ursprungskomponente bestimmbar ist, muss fuer `dig_clock_in` ebenfalls eine Controller-Ursprungskomponente bestimmbar sein und dieselbe Komponenten-ID haben.

Gueltige Beispiele:

- Controller GPIO A -> LED `dig_in`; Controller GPIO B -> LED `dig_clock_in`.
- Controller GPIO A -> Resistor -> LED `dig_in`; Controller GPIO B -> Resistor -> LED `dig_clock_in`.
- Controller GPIO A -> SN74 Kanal 1 Eingang -> SN74 Kanal 1 Ausgang -> LED `dig_in`; Controller GPIO B -> SN74 Kanal 2 Eingang -> SN74 Kanal 2 Ausgang -> LED `dig_clock_in`.
- Controller GPIO A -> SN74 Kanal 1 Eingang -> SN74 Kanal 1 Ausgang -> Resistor -> LED `dig_in`; Controller GPIO B -> SN74 Kanal 2 Eingang -> SN74 Kanal 2 Ausgang -> Resistor -> LED `dig_clock_in`.
- Controller GPIO A -> Verbindungselemente -> LED `dig_in`; Controller GPIO B -> Verbindungselemente -> LED `dig_clock_in`.

Ungueltige Beispiele:

- Controller A speist `dig_in`, Controller B speist `dig_clock_in`.
- Controller speist `dig_in`, aber `dig_clock_in` kommt von einem anderen LED-Data-Netz.
- Controller speist `dig_in`, aber `dig_clock_in` kommt nur von Supply/GND/Bias.

Wenn der Ursprung wegen unvollstaendiger Modellierung nicht sicher bestimmbar ist, sollte die Regel konservativ bleiben:

- Harte Fehler weiterhin fuer klare elektrische/strukturelle Fehler erzeugen: gleiches Netz, Supply, GND, LED-Data-/LED-Backup-Senken im Clock-Pfad.
- Den "gleicher Controller"-Fehler nur erzeugen, wenn beide Urspruenge sicher und verschieden sind oder wenn Data einen sicheren Controller-Ursprung hat und Clock sicher keinen Controller-Ursprung hat.
- Keine heuristische Vermutung ueber Bauteilnamen oder Labels verwenden.

## Vorschlag fuer Hilfsfunktionen

### `digitalSourcesForSignalInput(context, input)`

Liefert digitale Ausgangs-Handles, die den Eingang ueber Signalpfade erreichen.

Erlaubte Quellen:

- `dig_out`
- `dig_clock_out`
- `dig_backup_out`, nur fuer Backup-spezifische Regeln, nicht fuer Clock/Data im Controller-Fall

Fuer `dig_clock_in` sollten `dig_out` und `dig_clock_out` akzeptiert werden.

### `pathHasLedDataOrBackupSink(context, input)`

Prueft, ob der Signalpfad des betrachteten `dig_clock_in` andere LED-Data-/LED-Backup-Senken enthaelt.

Dabei soll der betrachtete `dig_clock_in` selbst ignoriert werden. Zu melden ist insbesondere:

- `dig_in` an einer LED-Komponente
- `dig_backup_in` an einer LED-Komponente

Nicht zu melden sind nicht-LED-`dig_in`-Handles, z.B. ein Controller-Eingang, der das Clock-Signal zusaetzlich zurueckliest.

`dig_clock_in` eines weiteren Clock-Streifens im selben Clock-Pfad ist erlaubt. Ein einzelner Clock-Ausgang darf mehrere `dig_clock_in`-Eingaenge parallel speisen, solange der Pfad nicht mit LED-Data/Backup, Supply oder GND vermischt wird.

### `resolveLogicalDigitalOrigin(context, sourceHandle)`

Ermittelt die logische Ursprungskomponente einer digitalen Quelle.

Basisfall:

- Wenn `sourceHandle.node.data.group === 'controller'`, ist die Ursprungskomponente diese Controller-Komponente.

Level-Shifter-Fall:

- Wenn `sourceHandle` ein Ausgang eines eindeutig modellierten Level-Shifter-Kanals ist, wird der zugehoerige Eingang dieses Kanals gesucht.
- Von diesem Eingang aus wird dessen digitale Quelle ermittelt.
- Ist diese Quelle ein Controller, gilt dieser Controller als Ursprung.

Fuer SN74AHCT125N soll dieselbe Kanalinformation verwendet werden, die bereits in den komponentenspezifischen Regeln genutzt wird:

- Kanal 1: `1OE`, `1A`, `1Y`
- Kanal 2: `2OE`, `2A`, `2Y`
- Kanal 3: `3OE`, `3A`, `3Y`
- Kanal 4: `4OE`, `4A`, `4Y`

Damit kann ein SN74-`Y`-Ausgang fuer die Ursprungsermittlung auf den passenden `A`-Eingang zurueckgefuehrt werden. Die Logik soll nicht parallel mit abweichenden Annahmen neu erfunden werden, sondern dieselbe Information wie `sn74Ahct125nUsedChannelInputMissing` und verwandte SN74-Regeln verwenden.

Wichtig: Diese Funktion darf nicht raten. Sie soll nur fuer explizit modellierte, bekannte transparente Kanaele Ergebnisse liefern.

## Issue-Verhalten

Weiterhin Regel-ID:

- `clockedLedClockMissing`

Die bestehende kurze Uebersetzung "Clock-Leitung fehlt oder passt nicht" passt weiter als allgemeiner Titel. Die konkrete Beschreibung bzw. Detailmeldung muss aber genau und spezifisch zur erkannten Verletzungsart passen, damit der Nutzer versteht, was im Diagramm falsch ist und wo er ansetzen muss.

Beispiele fuer spezifische Meldungsinhalte:

- Clock-Eingang ist nicht verbunden.
- Clock und Data verwenden dasselbe Signalnetz.
- Clock ist mit Supply verbunden.
- Clock ist mit GND oder einem Bias-Netz verbunden.
- Clock verwendet ein digitales Netz, das zugleich LED-Data oder LED-Backup speist.
- Data und Clock stammen von unterschiedlichen Controllern.
- Bei LED-zu-LED kommt Clock nicht vom passenden Clock-Ausgang desselben vorgelagerten Streifens.

Die laengere Beschreibung koennte spaeter erweitert werden, damit sie auch die Controller-Faelle erklaert:

- Clock muss ein eigenes digitales Signal sein.
- Bei LED-zu-LED muss Clock vom selben vorgelagerten Segment kommen.
- Bei Controller-Ansteuerung muessen Data und Clock vom selben Controller kommen; Level-Shifter und Verbindungselemente duerfen dazwischen liegen.

Fingerprint/Suppression:

- Weiterhin auf dem betroffenen `dig_clock_in` basieren.
- Weiterhin `digital-sink-without-source` fuer denselben Clock-Pin unterdruecken, weil diese Regel konkreter ist.

## Implementierungsplan

### Phase 1: Bestand aufnehmen und vorhandene Bausteine wiederverwenden

1. [x] Bestehende Implementierung von `clockedLedClockMissing` lokalisieren.
2. [x] Vorhandene Hilfsfunktionen fuer Signalpfade, erreichbare Handles, Netzklassifikation, digitale Quellen und Suppression pruefen.
3. [x] Vorhandene SN74AHCT125N-Regeln analysieren und die bereits genutzte Kanalzuordnung fuer `A`/`Y`/`OE` wiederverwenden.
4. [x] Keine neue parallele Modelllogik einfuehren, wenn bestehende Check-Utilities dieselbe Information bereits liefern.

Ergebnis dieser Phase:

- Klar ist, welche vorhandenen Funktionen erweitert werden koennen.
- Klar ist, welche neuen Hilfsfunktionen wirklich notwendig sind.
- Klar ist, wo spezifische Issue-Details erzeugt und uebersetzt werden.

### Phase 2: Signalpfad-Hilfsfunktionen vorbereiten

1. [x] Eine Funktion fuer digitale Quellen eines Signal-Eingangs bereitstellen oder erweitern.
2. [x] Sicherstellen, dass fuer `dig_clock_in` sowohl `dig_out` als auch `dig_clock_out` als moegliche digitale Quellen akzeptiert werden.
3. [x] Signaltransparente Elemente im Check-Kontext korrekt behandeln:
   - Verbindungselemente
   - Serienwiderstaende
   - eindeutig modellierte Level-Shifter-Kanaele
4. [x] Eine Pruefung fuer verbotene Clock-Pfad-Inhalte bereitstellen:
   - Supply
   - GND/Bias
   - LED-`dig_in`
   - LED-`dig_backup_in`
5. [x] Nicht-LED-`dig_in` im Clock-Pfad bewusst erlauben.

Ergebnis dieser Phase:

- Der Check kann unterscheiden, ob Clock ein gueltiger digitaler Pfad ist oder mit Power/GND/LED-Data vermischt wurde.

### Phase 3: Logischen Ursprung ermitteln

1. [x] `resolveLogicalDigitalOrigin(context, sourceHandle)` implementieren oder als bestehende Funktion erweitern.
2. [x] Controller-`dig_out` direkt als Controller-Ursprung erkennen.
3. [x] SN74AHCT125N-`Y`-Ausgaenge auf den passenden `A`-Eingang zurueckfuehren.
4. [x] Vom `A`-Eingang aus die vorgelagerte digitale Quelle bestimmen.
5. [x] Nur sichere, explizit modellierte transparente Kanaele aufloesen.
6. [x] Keine Heuristiken ueber Labels, Namen, Positionen oder Bauteiltexte verwenden.

Ergebnis dieser Phase:

- Data- und Clock-Pfade koennen auf denselben oder unterschiedliche Controller-Urspruenge verglichen werden.

### Phase 4: Regel `clockedLedClockMissing` nachschaerfen

1. [x] Pro Clock-LED-Streifen `dig_in` und `dig_clock_in` bestimmen.
2. [x] Wenn `dig_in` nicht angeschlossen ist, Regel nicht ausloesen.
3. [x] Wenn `dig_clock_in` fehlt oder unverbunden ist, spezifischen Fehler fuer fehlende Clock melden.
4. [x] LED-zu-LED-Fall unveraendert streng behandeln:
   - Data muss vom vorgelagerten LED-`dig_out` kommen.
   - Clock muss vom korrespondierenden `dig_clock_out` derselben vorgelagerten LED-Komponente kommen.
5. [x] Controller-/externe-Quelle-Fall getrennt pruefen:
   - Data und Clock duerfen nicht dasselbe Signalnetz verwenden.
   - Clock darf nicht an Supply liegen.
   - Clock darf nicht an GND/Bias liegen.
   - Clock muss eine digitale Ausgangsquelle haben.
   - Clock-Pfad darf keine LED-Data-/LED-Backup-Senke enthalten.
   - Clock-Quelle darf nicht zugleich als LED-Data-/Backup-Netz verwendet werden.
6. [x] Wenn Data einen sicheren Controller-Ursprung hat, Clock-Ursprung pruefen:
   - gleicher Controller: gueltig
   - sicher anderer Controller: Fehler
   - sicher kein Controller-Ursprung: Fehler
   - unsicherer Ursprung ohne harte Verletzung: kein heuristischer Fehler

Ergebnis dieser Phase:

- Die Regel deckt LED-Ketten und Controller-Ansteuerung ab, ohne gueltige Clock-Quellen ueber `dig_out` faelschlich zu verbieten.

### Phase 5: Spezifische Issues und Uebersetzungen umsetzen

1. [x] Die Regel-ID `clockedLedClockMissing` beibehalten.
2. [x] Den bestehenden allgemeinen Titel weiterverwenden.
3. [x] Pro Verletzungsart eine spezifische Beschreibung bzw. Detailmeldung erzeugen.
4. [x] Uebersetzungen in `src/translations/` fuer alle neuen Detailtexte pflegen.
5. [x] Fingerprint weiterhin am betroffenen `dig_clock_in` ausrichten.
6. [x] Bestehende Suppression von `digital-sink-without-source` fuer denselben Clock-Pin erhalten.

Ergebnis dieser Phase:

- Nutzer sehen nicht nur, dass Clock "nicht passt", sondern warum genau.

### Phase 6: Tests ergaenzen

1. [x] Bestehende Tests fuer `clockedLedClockMissing` erweitern, nicht ersetzen.
2. [x] Gueltige Controller-Faelle testen:
   - getrennte Controller-GPIOs fuer Data und Clock
   - Data/Clock ueber Serienwiderstaende
   - Data/Clock ueber SN74-Kanaele mit gleichem Controller-Ursprung
   - Clock-Pfad mit zusaetzlichem nicht-LED-`dig_in`
3. [x] Ungueltige Controller-Faelle testen:
   - Clock unverbunden
   - Clock und Data im selben Netz
   - Clock an Supply
   - Clock an GND/Bias
   - Clock-Netz speist LED-Data oder LED-Backup
   - Data und Clock von unterschiedlichen Controllern
   - Data und Clock ueber SN74, aber mit unterschiedlichen Controller-Urspruengen
4. [x] LED-zu-LED-Regressionsfaelle testen:
   - korrekter `DATA_end`/`CLOCK_end`-Anschluss bleibt gueltig
   - Clock von falschem LED-Streifen bleibt ungueltig
5. [x] Fuer jeden ungueltigen Fall pruefen, dass die spezifische Meldung zur Verletzungsart passt.

Ergebnis dieser Phase:

- Die fachlichen Beispiele aus diesem Konzept sind als Regressionstests abgesichert.

### Phase 7: Manuelle Plausibilitaetspruefung

1. Diagramm-Checks in der UI mit typischen APA102/SK9822-Diagrammen pruefen.
2. Mindestens einen gueltigen Controller-Fall mit Level-Shifter und Widerstaenden pruefen.
3. Mindestens drei ungueltige Faelle in der UI pruefen:
   - Clock an Data
   - Clock an Supply/GND
   - Clock von anderem Controller
4. Pruefen, dass die Anzeige in `DiagramCheckPage` die spezifischen Detailmeldungen sichtbar und verstaendlich darstellt.

Ergebnis dieser Phase:

- Die Regel ist nicht nur technisch korrekt, sondern fuer Nutzer nachvollziehbar.

## Testfaelle fuer die spaetere Implementierung

Gueltig:

- APA102 `DATA_start` von Controller GPIO 1, `CLOCK_start` von Controller GPIO 2.
- APA102 `DATA_start` von Controller GPIO 1 ueber Resistor, `CLOCK_start` von Controller GPIO 2 ueber Resistor.
- APA102 `DATA_start` von Level-Shifter-`dig_out` ueber Resistor, `CLOCK_start` von Level-Shifter-`dig_out` ueber Resistor, beide Level-Shifter-Eingaenge vom selben Controller.
- APA102 `DATA_start` von Controller ueber SN74 Kanal 1, `CLOCK_start` von demselben Controller ueber SN74 Kanal 2.
- APA102 `CLOCK_start` von Controller- oder Level-Shifter-`dig_out`; im selben Clock-Pfad liegt zusaetzlich ein Controller-`dig_in` zum Zuruecklesen des Clock-Signals.
- Zweiter APA102-Streifen: Data vom ersten Streifen `DATA_end`, Clock vom ersten Streifen `CLOCK_end`.

Ungueltig:

- `CLOCK_start` unverbunden.
- `CLOCK_start` im selben Netz wie `DATA_start`.
- `CLOCK_start` an GND.
- `CLOCK_start` an Supply.
- `CLOCK_start` an einem digitalen Netz, das gleichzeitig `DATA_start` eines anderen LED-Streifens speist.
- `DATA_start` von Controller A, `CLOCK_start` von Controller B.
- `DATA_start` von Controller A, `CLOCK_start` von einem Level-Shifter-Ausgang, dessen Eingang von Controller B kommt.
- LED-zu-LED: Data vom ersten Streifen, Clock nicht vom `CLOCK_end` desselben ersten Streifens.

## Geklaerte Designentscheidungen

Parallele Clock-Verteilung:

Ein einzelner Clock-Ausgang darf mehrere `dig_clock_in`-Eingaenge parallel speisen. Die Nachschaerfung verbietet nicht parallele Clock-Senken, sondern die Vermischung von Clock mit LED-Data, LED-Backup, Supply oder GND.

Level-Shifter-Ursprung:

Fuer Level-Shifter sollen die bereits vorhandenen komponentenspezifischen Informationen verwendet werden. Beim SN74AHCT125N sind die Kanalgruppen bereits in den SN74-Regeln beschrieben; dieselbe Zuordnung soll auch fuer die Ursprungsermittlung von Data- und Clock-Pfaden verwendet werden.
