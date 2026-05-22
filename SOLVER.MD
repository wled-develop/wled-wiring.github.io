# Solver-Konzept fuer die DC-Simulation

## Ziel

Der Solver soll fuer WLED-Wiring-Diagramme robuste DC-Ergebnisse liefern: Stroeme und Spannungen an Pins, Wires und LED-Streifen-Zwischenpunkten. Die abgeleiteten Simulationsergebnisse muessen drei Nachkommastellen liefern; die UI rundet diese Werte fuer die Diagrammanzeige auf zwei Nachkommastellen. Interne Berechnungen laufen ohne Rundung auf Ergebnis- oder Anzeigeaufloesung.

Das Netz kann viele Knoten enthalten, weil digitale LED-Streifen als viele logische LED-Elemente in Reihe modelliert werden. Der Solver muss deshalb sparse Datenstrukturen verwenden und darf keine dichten `N x N`-Matrizen fuer grosse Streifen erzwingen.

## Grundansatz

Empfohlen wird Modified Nodal Analysis (MNA) mit iterativer Behandlung nichtlinearer Elemente.

Lineare Elemente werden direkt gestempelt:

- Wire-Widerstaende
- elementare Widerstaende
- Sicherungs-Ersatzwiderstaende
- Kurzschlussbruecken als Knotenzusammenfassung vor dem Stempeln

Spezialelemente werden iterativ aktualisiert:

- PSU mit Stromlimit und aus `voltageDropPctAt150Current` abgeleiteter Spannungsdegradation
- DCDC-Wandler mit dynamischem Ausgangsstromlimit
- digitale LED-Stromsenken, spannungsabhaengig
- PWM-DC-Lasten

## Knotenmodell

Der Modellaufbau erzeugt echte Circuit-Nodes, nicht nur Check-Netze.

- Ein Pin-Ende ist ein Circuit-Node.
- Ein Wire verbindet zwei Circuit-Nodes ueber einen Widerstand.
- Kurzschlussbruecken vereinigen Circuit-Nodes per Union-Find.
- Check-Netze bleiben als Validierungs- und Gruppierungsinformation erhalten.

Die Referenz `0 V` wird an die negative Seite der Spannungsquelle mit dem hoechsten Stromlimit gelegt. Wenn es keine eindeutige GND-Insel gibt, bricht die Simulation ab.

## Sparse Matrix

Die Matrix sollte als sparse Struktur aufgebaut werden:

```ts
type SparseRows = Map<number, Map<number, number>>;
```

Fuer die erste Version reicht ein eigener Sparse-Assembler plus ein einfacher Solver. Fuer bessere Stabilitaet kann spaeter eine kleine numerische Bibliothek ersetzt werden.

Da LED-Streifen fast kettenfoermig sind, ist die Matrix duenn besetzt. Das Stempeln vieler LED-Elemente bleibt dadurch gut handhabbar.

## Element-Stempel

### Widerstand

Ein Widerstand zwischen `a` und `b` mit `R` wird ueber Leitwert `G = 1 / R` gestempelt:

```text
Y[a,a] += G
Y[b,b] += G
Y[a,b] -= G
Y[b,a] -= G
```

Liegt ein Terminal auf Referenz, werden nur die verbleibenden Terme gestempelt.

### Stromquelle

Eine DC-Stromquelle von `positive` nach `negative` wird als Einspeisung in den RHS-Vektor gestempelt. Die Vorzeichenkonvention muss zentral dokumentiert und getestet werden.

### Ideale Spannungsquelle

Eine ideale Spannungsquelle wird per MNA mit zusaetzlicher Stromvariable gestempelt.

Fuer eine Quelle zwischen `positive` und `negative`:

- neue Variable `I_vsrc`
- KCL-Kopplung an beide Knoten
- Gleichung `V(positive) - V(negative) = U`

### PSU mit Stromlimit

Bis zum Limit wird die PSU als ideale Spannungsquelle mit `U_nominal` gestempelt.

Nach einer Loesung wird der Quellenstrom ausgewertet:

- `I <= Ilimit`: Quelle bleibt ideal.
- `I > Ilimit`: Zielspannung fuer naechste Iteration wird aus `voltageDropPctAt150Current` abgeleitet. Der Wert beschreibt, auf welchen Prozentanteil der Nominalspannung die Quelle bei `I = 1.5 * Ilimit` faellt; daraus kann intern eine lineare Degradationssteigung fuer den Bereich zwischen `Ilimit` und `1.5 * Ilimit` berechnet werden.

Der Solver iteriert, bis sich die Spannung und der Strom nur noch gering aendern oder eine maximale Iterationszahl erreicht ist. Bei jeder Ueberschreitung von `Ilimit` wird ein Simulations-Check-Fehler erzeugt, auch wenn die degradierte Spannung konvergiert.

Die Implementierung loest den degradierenden Quellen-Arbeitspunkt stabilisiert: Aus dem geloesten Quellenstrom und der aktuellen Quellenspannung wird fuer die lineare Degradationskennlinie eine aequivalente Lastleitfaehigkeit abgeleitet. Daraus wird die naechste Zielspannung direkt auf der Kennlinie berechnet. Nichtlineare Zustaende wie PSU-Zielspannung und LED-Stromsenken werden mit Relaxation aktualisiert; die Konvergenzpruefung vergleicht weiterhin gegen die ungeglaetteten Zielwerte, damit der Solver nicht nur wegen kleiner Relaxationsschritte vorzeitig abbricht.

### DCDC-Wandler

Der DCDC-Wandler wird als Ausgangsspannungsquelle plus Eingangsleistungsmodell behandelt.

Pro Iteration:

1. Ausgang mit aktuellem `UoutTarget` loesen.
2. Ausgangsstrom `Iout` berechnen.
3. Eingangsleistung abschaetzen:
   ```text
   PinRequired = Uout * Iout / efficiency
   Iin = PinRequired / Vin
   ```
4. Dynamisches Ausgangslimit berechnen:
   ```text
   IoutLimitDynamic = max(0, Vin * IinAvailable * efficiency / Uout)
   ```

Praktischer fuer die erste Version: `IinAvailable` wird durch vorgelagerte PSU-/Netzloesung iterativ begrenzt. Wenn der Wandler mehr Ausgangsstrom fordert als aus Eingangsleistung und Wirkungsgrad verfuegbar ist, wird `UoutTarget` wie bei einer PSU ueber die aus `voltageDropPctAt150Current` abgeleitete Degradationssteigung reduziert.

Dieser Ansatz ist nicht perfekt, aber ausreichend fuer drei Nachkommastellen im Ergebnis und liefert sinnvolle Ueberlastmeldungen.

Implementierungsstand: Der Ausgang wird als MNA-Spannungsquelle gestempelt. Nach jeder linearen Loesung wird der Ausgangsstrom der Quelle ausgewertet; mit Ausgangsspannung und Wirkungsgrad wird daraus die Eingangsleistung und der Eingangsstrom fuer die naechste Iteration berechnet. Dieser Eingangsstrom wird als Stromsenke zwischen `inPositive` und `inNegative` gestempelt. `outputCurrentLimitA` verwendet die gleiche iterative Spannungsdegradation wie PSU-Quellen. Das dynamische Ausgangslimit wird aus genau einer passiv erreichbaren Eingangsspannungsquelle mit Stromlimit, aktueller Eingangsspannung, Wirkungsgrad und nominaler Ausgangsspannung berechnet. Werden mehrere Eingangsspannungsquellen passiv erreicht, wird kein Quellenlimit aufsummiert; die Simulation meldet stattdessen ein `DCDC input power limit is ambiguous`-Issue, weil Stromteilung zwischen mehreren Quellen nicht modelliert wird. Mehrere DCDC-Wandler an derselben PSU bleiben erlaubt; sie belasten die PSU ueber ihre iterativen Eingangsstromsenken gemeinsam. Wird das eindeutige dynamische Limit ueberschritten, degradiert der Ausgang und es entsteht ein `DCDC input power limited`-Issue. Nicht-isolierte Wandler verbinden ihre Masseknoten nicht implizit; sie muessen dafuer eine explizite `shortBridge` in `simdata` haben.

### Digitale LED

Eine einzelne digitale LED im Solver entspricht einer logischen LED des Streifens, nicht zwingend einer physikalischen LED. Je nach Streifen werden mehrere physikalische LEDs zu einer logischen LED gruppiert; die Gruppengroesse kommt aus `physLedsPerLogicLed`.

Eine logische digitale LED besteht aus:

- Supply-Serienwiderstand
- GND-Serienwiderstand
- Stromsenke zwischen lokalem Supply- und lokalem GND-Knoten

Der Zielstrom kommt aus LED-Typ, Farbmodus, lokaler LED-Spannung und Helligkeit. Kennlinien-Strom, Supply-Serienwiderstand und GND-Serienwiderstand werden fuer digitale LED-Streifen aus den in der Komponenteninstanz gespeicherten `ledSimulationOptionValues` aufgeloest. Die Varianten selbst liegen in `src/simulation/ledStripSimulationOptions.ts`. Widerstandsvarianten werden pro Meter angegeben und fuer das logische LED-Netzelement mit `resistanceOhmPerMeter * physLedsPerLogicLed / ledsPerMeter` umgerechnet. Kennlinien-Stroeme bleiben pro physikalischer LED und werden fuer die logische LED mit `physLedsPerLogicLed` multipliziert. Die Anzahl der Solver-Elemente pro LED-Streifen-Abschnitt wird mit `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet; `ledsPerMeter` meint physikalische LEDs pro Meter.

Die Stromsenke wird iterativ als DC-Stromquelle gestempelt. Nach jeder linearen Loesung wird die lokale Spannung `V = V(supplyOut) - V(gndOut)` des jeweiligen LED-Netzelements ausgewertet. Der naechste LED-Strom pro physikalischer LED kommt aus der Kennlinie:

```text
I = I0 + Ilim / (1 + exp(-k * (V - V0))) + kUI * V
```

`I0`, `Ilim`, `k`, `V0` und optional `kUI` sind pro Current-Curve-Variante und Farbmodus definiert. Wenn `kUI` fehlt, gilt `0`. Der berechnete Strom wird mit der Helligkeit `0..1` skaliert und anschliessend mit `physLedsPerLogicLed` auf die logische LED hochskaliert. Das wird iterativ geloest, weil `I` von der lokalen Spannung abhaengt.

Wenn eine LED-Komponente noch alte direkte LED-Simulationsparameter verwendet oder keine gueltigen `ledSimulationOptionValues` besitzt, wird kein Ersatzwert geraten. Der Modellaufbau erzeugt ein Fehler-Issue, dass die Komponente aus der aktuellen Vorlage aktualisiert werden muss.

## Iterationsablauf

1. Kurzschlussbruecken zusammenfassen.
2. Circuit-Nodes nummerieren, Referenz entfernen.
3. Startwerte setzen:
   - PSU: `U_nominal`
   - DCDC: `outputVoltageV`
   - LED: Zielstrom aus Kennlinie bei Nominalspannung und Helligkeit
4. Sparse Matrix und RHS aus aktuellen Elementzustaenden stempeln.
5. Lineares Gleichungssystem loesen.
6. Elementstroeme und Knotenspannungen berechnen.
7. Nichtlineare Elemente aktualisieren:
   - PSU-Degradation
   - DCDC-Eingangsstrom und DCDC-Ausgangslimit
   - LED-Strom bei Unterspannung
8. Konvergenz pruefen:
   - maximale Spannungsdifferenz der nichtlinearen Zielgroessen < `0.00005 V`
   - maximale Stromdifferenz der LED-Zielstroeme < `0.000005 A`
   - maximale Stromdifferenz der DCDC-Eingangsstroeme < `0.000005 A`
   - oder alle Ergebniswerte wuerden sich nach Rundung auf drei Nachkommastellen nicht mehr aendern
9. Bei Nichtkonvergenz nach z.B. 50 Iterationen: Ergebnis als Fehler markieren.

## Performance fuer lange LED-Streifen

Digitale LED-Streifen koennen hunderte oder tausende Einzelelemente erzeugen. Deshalb:

- LED-Elemente als einfache Datenarrays speichern, nicht als schwere Klassen.
- Sparse Matrix verwenden.
- Handles und Anzeige-Punkte nur fuer Start, Ende und vorhandene `physLengths.startIndex`-Grenzen erzeugen.
- Fuer sehr lange Streifen spaeter optional Segment-Kompression anbieten, z.B. mehrere LEDs zu einem Solver-Block zusammenfassen. Fuer die erste Version bleibt die Modellierung pro LED korrekt und einfacher nachvollziehbar.

## Genauigkeit

Ausgabe:

- Spannung im Ergebnis: drei Nachkommastellen; Diagrammanzeige: zwei Nachkommastellen
- Strom im Ergebnis: drei Nachkommastellen; Diagrammanzeige: zwei Nachkommastellen

Interne Rechnung:

- `number` reicht.
- Widerstaende nie exakt `0` stempeln; Kurzschluesse vorher per Union-Find zusammenfassen.
- Sehr kleine reale Widerstaende nicht wegen ihres geringen Einzel-Spannungsabfalls wegoptimieren. Wenn mehrere kleine Widerstaende in Reihe liegen, muessen ihre Spannungsabfaelle intern einzeln berechnet und erst nach der Summierung auf Ergebnisgenauigkeit gerundet werden.
- Nur explizite Kurzschlussbruecken werden per Union-Find zusammengefasst. Numerische Mindestwerte duerfen hoechstens vor Division durch Null oder extrem schlecht konditionierten Matrizen schuetzen und muessen deutlich unterhalb praktisch relevanter Wire-/Serienwiderstaende liegen.

## Fehlerfaelle

Der Solver bricht ab, wenn:

- kein GND-Referenzknoten vorhanden ist
- mehrere getrennte GND-Inseln vorhanden sind
- Matrix singulaer ist
- ein Wire keine gueltige Laenge oder keinen gueltigen Querschnitt hat
- ein relevantes Element auf einen fehlenden Pin verweist
- ein nicht simulierbares Element in einem relevanten Strompfad liegt
- Iteration nicht konvergiert

Ueberlast ist kein sofortiger Solver-Abbruch:

- PSU-Stromlimit ueberschritten: weiter mit degradierter Spannung, aber Check-Fehler ausgeben.
- DCDC-Limit ueberschritten: weiter mit degradierter Ausgangsspannung, aber Check-Fehler ausgeben.
- Sicherung ueber Nennstrom: weiter rechnen, aber Check-Fehler ausgeben.

## Ergebnisableitung

Nach Konvergenz werden berechnet:

- Knotenspannungen gegen Referenz
- Pin-Spannungen
- Pin-Stroeme aus Summe der angeschlossenen Elementstroeme
- Wire-Stroeme und Spannungsabfaelle
- LED-Start-/End-/Middle-Differenzspannungen
- Simulations-Check-Ziele fuer Highlights

Fuer LED-Middle-Anzeigen gilt: Ein Wert wird nur erzeugt, wenn ein konkreter Abschnitt mit `physLengths.startIndex === N` existiert.

## Stand der aktuellen Implementierung

Der aktuelle Code enthaelt bereits eine erste lineare DC-Pipeline:

- Modellaufbau mit Circuit-Nodes, Wire-Widerstaenden, Kurzschlussbruecken und `simdata.elements`.
- Referenzknoten wird aus der Spannungsquelle mit dem hoechsten Stromlimit gewaehlt; bei Gleichstand deterministisch.
- Digitale LED-Streifen werden anhand von `physLengths`, `ledsPerMeter` und `physLedsPerLogicLed` in interne LED-Elemente expandiert.
- Start-/End-/Middle-Grenzen der LED-Streifen werden als `SimulationVirtualPin` ausgegeben.
- MNA-Stempeln fuer Wires, Widerstaende, Sicherungen, Spannungsquellen, einfache Stromquellen, konstante Power-Sinks und digitale LED-Stromsenken; digitale LED-Stromsenken werden iterativ spannungsabhaengig aktualisiert.
- PSU-Spannungsquellen werden bei Stromlimit-Ueberschreitung iterativ ueber `voltageDropPctAt150Current` degradert. Der Solver konvergiert erst, wenn LED-Stroeme und PSU-Zielspannungen stabil sind.
- DCDC-Wandler stempeln ihren Ausgang als geregelte Spannungsquelle und ihre Eingangsseite iterativ als Stromsenke aus Ausgangsleistung und Wirkungsgrad. Optionale Ausgangsstromlimits degradieren die Ausgangsspannung wie bei PSU-Quellen.
- Ergebnisableitung fuer Pin-Spannungen, Wire-Stroeme, Wire-Spannungsabfaelle, LED-Netzelement-Differenzspannungen und `ΔVmin`.
- Erste Simulation-Checks fuer fehlende Referenz, widerspruechliche parallele Spannungsquellen, Quellenstromlimit inklusive degradierter PSU-Ueberlast und Sicherungs-Nennstrom.

Die aktuelle Implementierung ist damit ein brauchbarer DC-Zwischenschritt mit iterativen digitalen LED-Stromsenken und PSU-Degradation, aber noch kein vollstaendiger robuster Solver fuer alle geplanten Faelle.

## Was noch fuer einen richtigen Solver fehlt

### Sparse Solver statt Dense Solver

Der aktuelle Solver verwendet noch eine dichte Matrix. Fuer lange LED-Streifen muss das auf einen Sparse-Assembler und einen Sparse-Solver umgestellt werden:

- Sparse Row-/Triplet-Struktur fuer das Stempeln beibehalten.
- Numerisch robuste Loesung mit Pivoting verwenden.
- Matrixgroesse und Konditionierung in Debug-Ausgaben erfassen.
- Tests mit langen LED-Streifen aufbauen, damit Performance-Regressionen sichtbar werden.

### Iterativer Nichtlinear-Solver

Der Solver besitzt inzwischen einen Iterationsrahmen fuer digitale LED-Stromsenken, PSU-Degradation und DCDC-Eingangsleistung. Offen bleibt vor allem, Nichtkonvergenzmeldungen fachlich feiner auf einzelne Quellen, Wandler oder LED-Streifen zu beziehen.

### PSU-Stromlimit und Spannungsdegradation

PSU-Spannungsquellen werten den Quellenstrom nach jeder Iteration aus. Bei `I > currentLimitA` wird die Zielspannung anhand `voltageDropPctAt150Current` reduziert und das lineare System mit dieser Spannung erneut geloest. Die Simulation meldet weiterhin einen Check-Fehler fuer die Quelle, auch wenn die degradierte Loesung konvergiert.

Der Abbruch bei extremer Ueberlast wird nach Konvergenz bewertet: liegt der finale Quellenstrom ueber `1.5 * currentLimitA`, wird kein Ergebnis ausgegeben. Kurzzeitige Ueberschreitungen waehrend der Iteration fuehren noch nicht zum Abbruch, damit der Solver von der nominalen Startspannung in einen degradierten stabilen Arbeitspunkt finden kann.

### DCDC-Wandler-Modell

Der DCDC-Wandler besitzt inzwischen ein iteratives Eingangsleistungsmodell, ein optionales festes Ausgangsstromlimit und ein dynamisches Ausgangsstromlimit aus begrenzter Eingangsleistung. Fachlich festgelegt ist: Das dynamische Eingangsleistungslimit wird nur aus genau einer passiv erreichbaren Eingangsspannungsquelle mit Stromlimit berechnet. Mehrere passiv erreichbare Eingangsspannungsquellen am selben DCDC-Eingang werden nicht aufsummiert; Stromteilung zwischen Quellen ist ohne explizites Sharing-/Innenwiderstandsmodell nicht simuliert und wird als `DCDC input power limit is ambiguous` gemeldet. Mehrere DCDC-Wandler an einer PSU sind zulaessig; ihre Eingangsstromsenken belasten die gemeinsame PSU im normalen Solver-Modell.

Der Grundfall PSU -> DCDC -> Widerstand ist mit `simulation_test/ltspice/dcdc_psu_resistor` abgedeckt; DCDC-Ueberlast durch festes Ausgangslimit ist mit `simulation_test/ltspice/dcdc_overload_resistor` abgedeckt; begrenzte DCDC-Eingangsleistung durch PSU-Stromlimit ist mit `simulation_test/ltspice/dcdc_input_limited_resistor` abgedeckt.

### Spannungsabhaengige LED-Stroeme

Digitale LED-Stroeme werden aktuell iterativ ueber die lokale Spannung `V(supplyOut) - V(gndOut)` und die Kennlinie `I = I0 + Ilim / (1 + exp(-k * (V - V0))) + kUI * V` aktualisiert. Offen bleibt:

- Konvergenzverhalten mit langen und stark unterversorgten LED-Streifen per Fixture absichern.
- Nichtkonvergenzmeldungen in der UI feiner auf einzelne LED-Streifen beziehen.
- `ΔVmin` und Detailwerte mit automatischen Unter-/Ueberspannungs-Checks kombinieren.

### Quellen- und Stromverteilung

Mehrere widerspruechliche ideale Spannungsquellen werden jetzt abgefangen. Fuer einen vollstaendigen Solver bleiben offen:

- Verhalten bei mehreren identischen parallelen Quellen fachlich definieren: keine Stromaufteilung anzeigen oder explizit als nicht simulierte Parallelspeisung melden.
- Stromlimitpruefung bei deduplizierten parallelen identischen Quellen fachlich klaeren.
- Falls echte Stromaufteilung gewuenscht ist, muessen Quellen einen Innenwiderstand oder ein explizites Sharing-Modell bekommen.

### Ergebnis- und Check-Abdeckung

Weitere Checks muessen noch ausgebaut werden:

- Unter-/Ueberspannung an angezeigten Supply/GND-Paaren.
- LED-Streifen unter Mindestspannung oder ueber Maximalspannung.
- Nicht versorgte Teilnetze erkennen, ignorieren und als Hinweis melden.
- Mehrere getrennte GND-Inseln robust erkennen.
- Nicht simulierbare Komponenten in relevanten Strompfaden erkennen.
- Wire-/Elementstroeme fuer alle relevanten Elementtypen als Pin-Stroeme konsistent aufsummieren.

### Tests und Fixtures

Fuer die naechste Stufe werden reproduzierbare Solver-Tests gebraucht:

- Kleine analytisch pruefbare Widerstandsnetzwerke.
- Mehrere PSU-/Fuse-Ueberlastfaelle.
- LED-Streifen mit Einspeisung an Start, Ende und Middle.
- Widerspruechliche Spannungsquellen.
- Sehr lange LED-Streifen als Performance-Test.
- Erwartete Werte mit Toleranzen fuer Spannung, Strom, `ΔV` und `ΔVmin`.

LTspice-Referenztests sind als automatischer Harness umgesetzt:

```text
npm run test:ltspice
```

Der Harness laedt alle Faelle unter `simulation_test/ltspice/*` mit `diagram.json` und `expected.json`, fuehrt `runSimulation()` aus und vergleicht Pin-, Wire-, LED-Streifen- und optional Simulation-Check-Ergebnisse gegen die im Fixture angegebenen Toleranzen. Aktuelle Fehlschlaege sind Solver-Abweichungen bzw. Nichtkonvergenz und sollen als Arbeitsliste fuer die naechsten Solver-Schritte dienen.

Der DCDC-Grundfall `dcdc_psu_resistor` enthaelt zusaetzlich eine LTspice-Netlist `dcdc_psu_resistor.cir`. Sie beschreibt eine 12-V-Eingangsquelle, einen ideal geregelten 5-V-DCDC-Ausgang mit 90 % Wirkungsgrad und eine 10-Ohm-Last. Der automatisierte Harness nutzt weiterhin `diagram.json` und `expected.json`; die `.cir`-Datei dient als reproduzierbare externe Referenz.

Der DCDC-Ueberlastfall `dcdc_overload_resistor` enthaelt zusaetzlich eine LTspice-Netlist `dcdc_overload_resistor.cir`. Sie beschreibt denselben Grundaufbau mit festem 0,4-A-Ausgangslimit. Das Fixture erwartet die degradierte Ausgangsspannung und genau ein Simulation-Check-Issue fuer das ueberschrittene DCDC-Stromlimit.

Der DCDC-Eingangsleistungsfall `dcdc_input_limited_resistor` enthaelt zusaetzlich eine LTspice-Netlist `dcdc_input_limited_resistor.cir`. Sie beschreibt eine 12-V-Eingangsquelle mit 0,1-A-Stromlimit, einen 5-V-DCDC-Ausgang mit 90 % Wirkungsgrad und eine 10-Ohm-Last. Das Fixture erwartet die degradierte Ausgangsspannung und genau ein `DCDC input power limited`-Issue; transiente PSU-Ueberlasten aus fruehen Iterationen werden nicht als finale Nutzer-Issues ausgegeben.

Der analytische DCDC-Mehrquellenfall `dcdc_input_multi_source_ambiguous` beschreibt zwei passiv erreichbare 12-V-PSUs am selben DCDC-Eingang. Das Fixture erwartet keine Aufsummierung der Quellenlimits, sondern genau ein `DCDC input power limit is ambiguous`-Issue.

Der analytische Mehr-DCDC-Fall `dcdc_two_converters_one_psu` beschreibt eine 12-V-PSU mit zwei nachgeschalteten 5-V-DCDC-Wandlern und je einer 10-Ohm-Last. Das Fixture erwartet zwei geregelte DCDC-Ausgaenge ohne Simulation-Issue; die gemeinsame PSU-Last entsteht aus der Summe der beiden DCDC-Eingangsstromsenken.
