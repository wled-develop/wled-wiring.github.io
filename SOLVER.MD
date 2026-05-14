# Solver-Konzept fuer die DC-Simulation

## Ziel

Der Solver soll fuer WLED-Wiring-Diagramme robuste DC-Ergebnisse liefern: Stroeme und Spannungen an Pins, Wires und LED-Streifen-Zwischenpunkten. Eine Nachkommastelle fuer Strom und Spannung reicht aus. Deshalb ist Stabilitaet und gute Fehlerdiagnose wichtiger als sehr hohe numerische Genauigkeit.

Das Netz kann viele Knoten enthalten, weil digitale LED-Streifen als viele einzelne LED-Elemente in Reihe modelliert werden. Der Solver muss deshalb sparse Datenstrukturen verwenden und darf keine dichten `N x N`-Matrizen fuer grosse Streifen erzwingen.

## Grundansatz

Empfohlen wird Modified Nodal Analysis (MNA) mit iterativer Behandlung nichtlinearer Elemente.

Lineare Elemente werden direkt gestempelt:

- Wire-Widerstaende
- elementare Widerstaende
- Sicherungs-Ersatzwiderstaende
- Kurzschlussbruecken als Knotenzusammenfassung vor dem Stempeln

Spezialelemente werden iterativ aktualisiert:

- PSU mit Stromlimit und `rDegradeOhm`
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
- `I > Ilimit`: Zielspannung fuer naechste Iteration wird `U = U_nominal - rDegradeOhm * I`.

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

Praktischer fuer die erste Version: `IinAvailable` wird durch vorgelagerte PSU-/Netzloesung iterativ begrenzt. Wenn der Wandler mehr Ausgangsstrom fordert als aus Eingangsleistung und Wirkungsgrad verfuegbar ist, wird `UoutTarget` wie bei einer PSU ueber `rDegradeOhm` reduziert.

Dieser Ansatz ist nicht perfekt, aber ausreichend fuer eine Nachkommastelle und liefert sinnvolle Ueberlastmeldungen.

### Digitale LED

Eine einzelne digitale LED besteht aus:

- Supply-Serienwiderstand
- GND-Serienwiderstand
- Stromsenke zwischen lokalem Supply- und lokalem GND-Knoten

Der Zielstrom kommt aus LED-Typ, Farbmodus und Helligkeit.

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
   - maximale Spannungsdifferenz < `0.02 V`
   - maximale Stromdifferenz < `0.02 A`
   - oder alle angezeigten Werte wuerden sich nach Rundung auf eine Nachkommastelle nicht mehr aendern
9. Bei Nichtkonvergenz nach z.B. 50 Iterationen: Ergebnis als Fehler markieren.

## Performance fuer lange LED-Streifen

Digitale LED-Streifen koennen hunderte oder tausende Einzelelemente erzeugen. Deshalb:

- LED-Elemente als einfache Datenarrays speichern, nicht als schwere Klassen.
- Sparse Matrix verwenden.
- Handles und Anzeige-Punkte nur fuer Start, Ende und vorhandene `physLengths.startIndex`-Grenzen erzeugen.
- Fuer sehr lange Streifen spaeter optional Segment-Kompression anbieten, z.B. mehrere LEDs zu einem Solver-Block zusammenfassen. Fuer die erste Version bleibt die Modellierung pro LED korrekt und einfacher nachvollziehbar.

## Genauigkeit

Ausgabe:

- Spannung: eine Nachkommastelle
- Strom: eine Nachkommastelle

Interne Rechnung:

- `number` reicht.
- Widerstaende nie exakt `0` stempeln; Kurzschluesse vorher per Union-Find zusammenfassen.
- Sehr kleine Widerstaende unterhalb eines Grenzwerts entweder als Kurzschluss behandeln oder auf einen Mindestwert clampen.

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
