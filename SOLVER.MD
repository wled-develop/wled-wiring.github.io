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
- digitale LED-Stromsenken, optional spannungsabhaengig
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

### Digitale LED

Eine einzelne digitale LED im Solver entspricht einer logischen LED des Streifens, nicht zwingend einer physikalischen LED. Je nach Streifen werden mehrere physikalische LEDs zu einer logischen LED gruppiert; die Gruppengroesse kommt aus `physLedsPerLogicLed`.

Eine logische digitale LED besteht aus:

- Supply-Serienwiderstand
- GND-Serienwiderstand
- Stromsenke zwischen lokalem Supply- und lokalem GND-Knoten

Der Zielstrom kommt aus LED-Typ, Farbmodus und Helligkeit. Lookup-Strom, Supply-Serienwiderstand und GND-Serienwiderstand sind in `simdata` pro physikalischer LED angegeben und werden fuer die logische LED mit `physLedsPerLogicLed` multipliziert. Die Anzahl der Solver-Elemente pro LED-Streifen-Abschnitt wird mit `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet; `ledsPerMeter` meint physikalische LEDs pro Meter.

Fuer die erste Version darf die Stromsenke als konstante DC-Stromsenke modelliert werden, solange `Vled` oberhalb einer Mindestspannung liegt. Optional wird bei niedriger Spannung der Strom reduziert, z.B. linear:

```text
I = Itarget * clamp((Vled - Vmin) / (Vnominal - Vmin), 0, 1)
```

Das wird iterativ geloest, weil `I` von der lokalen Spannung abhaengt.

## Iterationsablauf

1. Kurzschlussbruecken zusammenfassen.
2. Circuit-Nodes nummerieren, Referenz entfernen.
3. Startwerte setzen:
   - PSU: `U_nominal`
   - DCDC: `outputVoltageV`
   - LED: Zielstrom aus Lookup und Helligkeit
4. Sparse Matrix und RHS aus aktuellen Elementzustaenden stempeln.
5. Lineares Gleichungssystem loesen.
6. Elementstroeme und Knotenspannungen berechnen.
7. Nichtlineare Elemente aktualisieren:
   - PSU-Degradation
   - DCDC-Ausgangslimit
   - LED-Strom bei Unterspannung
8. Konvergenz pruefen:
   - maximale Spannungsdifferenz der Ergebnisgroessen < `0.0005 V`
   - maximale Stromdifferenz der Ergebnisgroessen < `0.0005 A`
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
- Lineares MNA-Stempeln fuer Wires, Widerstaende, Sicherungen, ideale Spannungsquellen, einfache Stromquellen, konstante Power-Sinks und digitale LED-Stromsenken.
- Ergebnisableitung fuer Pin-Spannungen, Wire-Stroeme, Wire-Spannungsabfaelle, LED-Netzelement-Differenzspannungen und `ΔVmin`.
- Erste Simulation-Checks fuer fehlende Referenz, widerspruechliche parallele Spannungsquellen, Quellenstromlimit und Sicherungs-Nennstrom.

Die aktuelle Implementierung ist damit ein brauchbarer linearer Zwischenschritt, aber noch kein vollstaendiger robuster Solver fuer alle geplanten Faelle.

## Was noch fuer einen richtigen Solver fehlt

### Sparse Solver statt Dense Solver

Der aktuelle Solver verwendet noch eine dichte Matrix. Fuer lange LED-Streifen muss das auf einen Sparse-Assembler und einen Sparse-Solver umgestellt werden:

- Sparse Row-/Triplet-Struktur fuer das Stempeln beibehalten.
- Numerisch robuste Loesung mit Pivoting verwenden.
- Matrixgroesse und Konditionierung in Debug-Ausgaben erfassen.
- Tests mit langen LED-Streifen aufbauen, damit Performance-Regressionen sichtbar werden.

### Iterativer Nichtlinear-Solver

Die geplanten nichtlinearen Elemente werden derzeit nur als lineare Naeherung behandelt. Es fehlt ein Iterationsrahmen:

1. Startzustand fuer alle nichtlinearen Elemente setzen.
2. Lineares System stempeln und loesen.
3. Elementstroeme und lokale Spannungen auswerten.
4. Zielwerte fuer nichtlineare Elemente aktualisieren.
5. Konvergenz ueber Spannungs- und Stromdifferenzen pruefen.
6. Bei Nichtkonvergenz mit klarer Fehlermeldung abbrechen.

### PSU-Stromlimit und Spannungsdegradation

Aktuell wird das Stromlimit nur nach der Loesung geprueft. Fuer das richtige Verhalten fehlt:

- Quellenstrom nach jeder Iteration auswerten.
- Bei `I > currentLimitA` die Zielspannung anhand `voltageDropPctAt150Current` reduzieren.
- Bei `I > 1.5 * currentLimitA` abbrechen.
- Ueberlast als Check-Fehler melden, auch wenn die degradierte Loesung konvergiert.

### DCDC-Wandler-Modell

Der DCDC-Wandler ist derzeit nur als ideale Ausgangsspannungsquelle modelliert. Es fehlt:

- Eingangsleistung aus Ausgangsleistung und Wirkungsgrad berechnen.
- Dynamisches Ausgangsstromlimit aus verfuegbarer Eingangsleistung ableiten.
- Ausgangsspannung bei Ueberlast analog zur PSU degradieren.
- Eingangsseite elektrisch korrekt belasten.

### Spannungsabhaengige LED-Stroeme

Digitale LED-Stroeme werden aktuell aus dem Lookup bei Nominalspannung bestimmt. Fuer realistischere Ergebnisse fehlt:

- Pro internem LED-Netzelement lokale Spannung `V(supplyOut) - V(gndOut)` verwenden.
- Lookup pro Iteration mit dieser lokalen Spannung auswerten.
- Strom bei Unterspannung reduzieren statt konstant zu halten.
- `ΔVmin` und Detailwerte erst nach Konvergenz ausgeben.

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
