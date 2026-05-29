# Konzept: DC-Stromfluss-Simulation

## Zielbild

Die Simulation soll aus dem aktuellen Diagramm ein elektrisches Simulationsmodell erzeugen, eine reine DC-Simulation ausfuehren und die Ergebnisse im Diagramm sowie im Sidebar-Bereich `Simulate current flow` anzeigen.

Voraussetzung fuer jede normale Simulation ist ein aktueller, fehlerfreier Diagramm-Check. Das Check-Ergebnis wird zusammen mit einem Diagramm-Fingerprint gespeichert. Wenn beim Klick auf `Simulate` kein Check-Ergebnis vorliegt, der Fingerprint nicht mehr zum aktuellen Diagramm passt oder Check-Meldungen mit Severity `error` existieren, startet die Simulation nicht. Stattdessen wird eine Meldung angezeigt, dass zuerst die Diagramm-Check-Meldungen korrigiert bzw. die Pruefung erneut ausgefuehrt werden muessen. Warnungen blockieren die Simulation nicht.

Fuer Entwicklungs- und Regressionstestfaelle gibt es in `src/simulation/simulationFeatureFlags.ts` den Schalter `DEBUG_BYPASS_SIMULATION_DIAGRAM_CHECK`. Wenn dieser explizit auf `true` gesetzt wird, wird dieses Diagramm-Check-Gating uebersprungen, damit teilweise modellierte, aber fuer die Simulation ausreichende Testdiagramme simuliert werden koennen.

Der erste Simulationsumfang ist bewusst begrenzt:

- Es werden nur `gnd`, `supply` und `pwm` Netze betrachtet.
- Es werden nur Komponenten simuliert, deren `data` eine `simdata`-Struktur enthaelt.
- Die Simulation ist zunaechst eine DC-/Mittelwertsimulation, keine Zeitbereichs-, Signalform- oder Protokollsimulation.
- Das Solver-Konzept ist separat in `SOLVER.MD` beschrieben.

Die grobe Pipeline:

1. Vorhandenes Diagramm-Check-Ergebnis pruefen, solange dessen Diagramm-Fingerprint unveraendert ist; im Debug-Bypass wird dieser Schritt uebersprungen.
2. Bei fehlendem, veraltetem oder fehlerhaftem Check-Ergebnis abbrechen und Meldung anzeigen; Warnungen blockieren die Simulation erstmal nicht.
3. Aus dem Diagramm-JSON wird ein Simulationsmodell aufgebaut.
4. Das Modell wird simuliert.
5. Ergebnisse werden erzeugt: Pin-Stroeme, Pin-Spannungen und zusaetzliche LED-Streifen-Spannungen.
6. Simulations-Checks laufen automatisch auf diesen Ergebnissen.
7. Ergebnisse und Check-Hinweise werden angezeigt.
8. Jede relevante Diagrammaenderung verwirft die Simulationsergebnisse.

## Bestehende Architektur, die genutzt werden sollte

Das Diagramm existiert bereits als ReactFlow-JSON. `createDiagramExportJson()` erzeugt das Exportobjekt aus `reactFlow.toObject()`.

Die regelbasierte Diagrammpruefung hat bereits eine brauchbare Netzbildung in `src/check/checkContext.ts`:

- `CheckHandle`
- `CheckNet`
- `componentLinkedNets`
- Klassifikationen wie `gnd_net_type`, `suppl_net_type`, `pwm_net_type`
- Funktionen wie `getNetByHandle`, `resolveVoltageOut`, `powerReachableHandles`, `signalReachableHandles`

Fuer die Simulation sollte diese Netzlogik in einen gemeinsamen Netlist-/Context-Baustein extrahiert werden. Checks und Simulation sollen dieselbe Sicht auf verbundene Pins und logische Netze haben.

Wichtig: Ein elementares Netz aus dem Diagramm-Check ist nicht automatisch ein einzelner Simulationsknoten. Wires werden in der Simulation als Widerstaende modelliert. Deshalb liegen die beiden Enden eines Wires im Simulationsmodell auf unterschiedlichen Knoten, die durch ein Wire-Widerstandselement verbunden sind. Check-Netze dienen also als topologische Gruppierung und Validierungsgrundlage, nicht als direkte 1:1-Knotenliste fuer den Solver.

Der Sidebar-Bereich existiert bereits als Platzhalter:

- `src/sidebar/Sidebar.tsx`
- `sidebar.simulation.title`
- `sidebar.simulation.comingSoon`

Dieser Bereich sollte spaeter durch eine echte `SimulationPage` ersetzt werden.

Der Komponenten-Katalog in der Sidebar zeigt bei aktivem `ENABLE_SIMULATION_CONTROLS` ein kleines Simulationssymbol im Karten-Header fuer Komponenten, deren `data.simdata !== undefined` ist. Das Symbol ist nur eine Sichtbarkeitsmarkierung fuer vorhandene Simulationsdaten; es erzeugt keine eigene Modelllogik und verwendet dieselbe Freigabe wie der Modellaufbau.

## Datenmodell: Komponenten

Nur Komponenten mit `data.simdata` werden als aktive oder modellierte Bauteile in das Simulationsmodell aufgenommen. Passive Verbindungsknoten wie `SolderJoint`, `WAGO_2X` und `WAGO_3X` sind eine Ausnahme: Sie liefern keine Bauteilgleichungen, sondern werden als ideale elektrische Knoten behandelt und brauchen deshalb kein eigenes `simdata`.

Komponenten ohne `simdata` duerfen weiterhin im Diagramm existieren. Sie liefern aber keine elektrischen Bauteilgleichungen. Wenn sie zwischen simulierten Netzen liegen und dadurch ein relevanter Strompfad nicht modelliert werden kann, erzeugt der Modellaufbau einen Simulationsfehler und bricht ab. Dadurch werden unvollstaendige Ergebnisse nicht als vertrauenswuerdig angezeigt.

Wenn `data.simdata` definiert, aber leer ist, bedeutet das: Die Komponente ist fuer die Simulation bekannt, enthaelt aber keine elementaren elektrischen Elemente. Sie kann beim Erzeugen der Gleichungen ignoriert werden. Das ist nuetzlich fuer Komponenten, die nur mechanisch oder informativ im Diagramm vorkommen, ohne eigenes elektrisches Modell. Reine Verbindungsknoten sollen bevorzugt ueber die passive Join-Semantik modelliert werden, nicht ueber leere `simdata`.

Kondensatoren (`Kerko`, `Elko`) werden fuer die reine DC-Betrachtung als offene Bauteile ohne DC-Leitpfad behandelt. Sie bekommen deshalb eine leere `simdata`-Definition und erzeugen keine `missing-simdata`-Meldung. Alte gespeicherte Diagramme, deren Kondensator-Knoten diese leere Definition noch nicht enthalten, werden vom Modellaufbau gleichwertig behandelt.

Komponentenoptionen koennen sichtbare Pins beeinflussen. Pins, die durch `hideConditions` aktuell nicht sichtbar sind, werden im Simulationsmodell ignoriert. Wenn ein elementares `simdata`-Element auf mindestens einen solchen unsichtbaren Pin verweist, wird dieses gesamte Element fuer die aktuelle Komponentenkonfiguration ignoriert. Das ist kein Simulationsfehler, sondern bedeutet, dass die optionale Funktion gerade nicht aktiv ist. Verweist ein Element dagegen auf einen Handle, der in der Komponente gar nicht existiert, bleibt das ein Simulationsfehler.

Vorgeschlagene Erweiterung von `ComponentDataType`:

```ts
simdata?: ComponentSimulationDefinition;
```

Konzeptionelle Struktur:

```ts
type ComponentSimulationDefinition = {
  version: 1;
  ports?: UsbPowerPairSimulationPort[];
  elements?: ComponentSimulationElementUse[];
};
```

`simdata.elements` soll kompakt genug bleiben, damit Komponenten-Dateien nicht aufgeblasen werden. Die Elementdefinitionen sollen aber lesbare Feldnamen verwenden. Die Validierung darf intern streng typisieren, aber die Komponentendaten selbst sollen kurze, gut lesbare Elementdefinitionen enthalten.

Beispielhafte Struktur:

```ts
type ComponentSimulationElementUse = {
  id: string;
  type:
    | 'resistor'
    | 'shortBridge'
    | 'voltageSource'
    | 'currentSource'
    | 'constantPowerSink'
    | 'fuse'
    | 'digitalLed'
    | 'dcdcConverter'
    | 'diode';
  terminals: Record<string, string>;
  parameters?: Record<string, SimulationParameterRef>;
};
```

Dabei gilt:

- `type` ist der elementare Elementtyp.
- `terminals` mappt Elementterminals auf `hid`s der Komponente oder auf virtuelle Terminalnamen aus `simdata.ports`, z.B. `USB.VBUS`.
- `ports` beschreibt zusammengesetzte sichtbare Anschluesse, die im Simulationsmodell in mehrere elektrische Knoten expandiert werden. Die erste Port-Art ist `usbPowerPair`.
- `parameters` enthaelt Parameter, feste Werte, Field-Referenzen, Select-Referenzen oder lokale Tabellen.

Beispiele:

```ts
simdata: {
  version: 1,
  elements: [
    {
      id: "main-resistor",
      type: "resistor",
      terminals: {a: "A", b: "B"},
      parameters: {resistanceOhm: {field: "resistance"}},
    },
  ],
}
```

```ts
simdata: {
  version: 1,
  elements: [
    {
      id: "psu-output",
      type: "voltageSource",
      terminals: {positive: "Vout1", negative: "GND1"},
      parameters: {
        voltageV: {field: "source_voltage"},
        currentLimitA: {field: "source_current"},
        voltageDropPctAt150Current: 50,
      },
    },
    {id: "gnd-bridge-1", type: "shortBridge", terminals: {a: "GND1", b: "GND2"}},
  ],
}
```

```ts
simdata: {
  version: 1,
  elements: [
    {
      id: "controller-idle-load",
      type: "constantPowerSink",
      terminals: {positive: "VIN", negative: "GND1"},
      parameters: {powerW: 0.5},
    },
  ],
}
```

Vorgeschlagene kompakte Syntax fuer `SimulationParameterRef`:

```ts
type SimulationParameterRef =
  | number
  | string
  | {const: number | string | boolean}
  | {field: string; default?: number | string | boolean}
  | {select: string; default?: number | string | boolean}
  | {table: Record<string, number>; by: SimulationParameterRef; default?: number}
  | {ledCurve: string; colorMode: 'settings.ledColorMode'}
  | {ledSimulationOption: 'supplyResistance' | 'gndResistance' | 'currentCurve'};
```

Dabei gilt:

- `{field: "source_voltage"}` verweist auf die `technicalID`/HID eines Eingabefelds der Komponente und uebernimmt dessen aktuellen Wert.
- `{select: "Fuse"}` verweist auf die `technicalID`/HID eines Auswahlfelds der Komponente.
- `{table: {"5": 0.01, "10": 0.006}, by: {select: "Fuse"}, default: 0.01}` erlaubt kleine lokale Tabellen direkt im Element.
- `{ledCurve: "WS2814_24V", colorMode: "settings.ledColorMode"}` ist die alte direkte Kennlinienreferenz. Fuer neue digitale LED-Streifen soll stattdessen `{ledSimulationOption: "currentCurve"}` verwendet werden.
- `{ledSimulationOption: "supplyResistance" | "gndResistance" | "currentCurve"}` verweist auf die in der LED-Komponenteninstanz gespeicherte Auswahl aus `ledSimulationOptionValues`.
- `default` wird verwendet, wenn ein Feld fehlt oder eine lokale Tabelle keinen passenden Eintrag hat. Fehlt auch `default`, erzeugt der Modellaufbau einen Simulationsfehler.

Die Simulation sollte nicht aus `technicalID` allein raten muessen. `technicalID` darf zur Auswahl eines Modelladapters oder fuer Defaults dienen, aber die explizite `simdata`-Struktur ist die Freigabe, dass eine Komponente simuliert wird.

`internalConnections` werden nicht automatisch in Kurzschlussbruecken uebersetzt. Interne Bruecken, Sicherungen oder andere Simulationselemente muessen explizit in `simdata` beschrieben werden. `internalConnections` und `simdata` duerfen inhaltlich aehnlich sein, bleiben aber getrennte Konzepte.

## Elementare elektrische Elemente

Die Simulation wird aus elementaren elektrischen Elementen aufgebaut. Komponenten verwenden diese Elemente in ihrer `data.simdata`-Struktur. Dadurch koennen viele Komponenten ohne Spezialcode beschrieben werden.

### Diode

Eine Diode besteht aus zwei Terminals und leitet ideal nur von `anode` nach `cathode`, sobald die Vorwaertsspannung erreicht ist. In Sperrrichtung wird kein Strom modelliert.

Terminals:

- `anode`
- `cathode`

Parameter:

- `forwardVoltageV`

Der erste konkrete Einsatz ist der USB-Versorgungspfad von `USB.VBUS` nach lokalem `VIN` bzw. lokalem V+. Dort gilt `forwardVoltageV = 0.4`. Das Element bleibt bewusst allgemein, damit spaeter auch andere ideale Diodenpfade ohne Sondertyp modelliert werden koennen.

Solver-Verhalten:

- Im leitenden Zustand wird die Diode wie eine ideale Spannungsquelle mit festem Spannungsabfall zwischen Anode und Kathode behandelt.
- Im sperrenden Zustand wird sie offen geschaltet.
- Der aktive Zustand wird iterativ bestimmt. Wenn eine Diode im geloesten Arbeitspunkt rueckwaerts bestromt wuerde oder die Vorwaertsspannung nicht erreicht, wird sie in der naechsten Iteration gesperrt; wenn `V(anode) - V(cathode) >= forwardVoltageV` erreicht wird, wird sie leitend.
- Ein kleiner Leckstrom oder Diagnose-Sperrstrom wird nicht gestempelt.

### Elementarer Widerstand

Ein elementarer Widerstand besteht aus zwei Terminals und einem Widerstand dazwischen.

Terminals:

- `a`
- `b`

Parameter:

- `resistanceOhm`

Der Widerstandswert kann definiert werden als:

- fester Zahlenwert
- Verweis auf ein Eingabefeld der Komponente
- Verweis auf ein Auswahlfeld der Komponente
- lokale Tabelle in Abhaengigkeit von einem Eingabe- oder Auswahlfeld

Beispiele:

- `Resistor`: ein elementarer Widerstand zwischen den beiden Pins.
- `miniOTOFuse`: ein elementarer Widerstand, dessen Wert aus einer lokalen Tabelle anhand des Sicherungs-Nominalwerts bestimmt wird.
- `MHC_V43`: ein Widerstand zwischen `VIN` und `VOUT`, um die Sicherung zu modellieren.
- `MHC_SwitchBoard`: drei getrennte Sicherungspfade `VIN -> VOUT1`, `VIN -> VOUT2` und `VIN -> VOUT3`; Widerstandswert und Nennstrom kommen jeweils aus `Fuse1`..`Fuse3`. Die Widerstandstabellen verwenden die Werte des `MHC_V43` plus `0.01 Ohm` fuer die zusaetzlichen Schalter auf dem Board.
- `FUSE_Board`: vier getrennte Sicherungspfade `IN1 -> OUT1`, `IN1 -> OUT2`, `IN2 -> OUT3` und `IN2 -> OUT4`; Widerstandswert und Nennstrom kommen jeweils aus dem passenden `Fuse1`..`Fuse4`-Select.
- `MHC_Relay5V`, `MHC_Relay12V`, `MHC_Relay24V`: zwei reale Sicherungspfade werden als vier Fuse-Elemente modelliert, weil NC und NO eines Relais real nie gleichzeitig leiten. `VIN1 -> VOUT1` und `VIN1 -> VOUT2` verwenden `Fuse1`; `VIN2 -> VOUT3` und `VIN2 -> VOUT4` verwenden `Fuse2`. Zusaetzlich werden `VIN1`/`VIN2` und `GND1`/`GND2` per `shortBridge` verbunden.

Die Handle-Funktion `passive` ist ein Diagramm-Check- und Komponentenmetadatum. Sie fuehrt kein eigenes Simulationselement ein. Fuer den generischen `Resistor` bleiben die `simdata.elements` mit `type: "resistor"` zwischen Pin `1` und Pin `2` die elektrische Wahrheit; `passive` verhindert nur, dass die Anschluesse in Diagramm-Checks als digitale Eingange oder andere aktive Rollen bewertet werden.

### Konstante Spannungsquelle mit Stromlimit und Spannungsdegradation

Eine konstante Spannungsquelle besteht aus zwei Terminals und einer geregelten Spannung dazwischen.

Terminals:

- `positive`
- `negative`

Parameter:

- `voltageV`
- `currentLimitA`
- `voltageDropPctAt150Current`

Bis zum Stromlimit ist die Quelle ideal geregelt. Wenn der Strom das Limit ueberschreitet, wird die Ausgangsspannung reduziert. Statt direkt einen Widerstandswert zu pflegen, wird in `simdata` definiert, um wie viel Prozent die Spannung sinkt, wenn der Strom 150% des Limits erreicht.

```text
overload = max(0, I / currentLimitA - 1)
dropFactor = voltageDropPctAt150Current / 100 / 0.5
U = U_nominal * (1 - dropFactor * overload), wenn I > currentLimitA
```

Beispiel: `voltageDropPctAt150Current = 50` bedeutet, dass bei `I = 1.5 * currentLimitA` die Ausgangsspannung auf 50% der Nominalspannung faellt. Wenn der Parameter fehlt, gilt dieser Wert `50` als Default. Der Solver kann daraus intern eine Ersatz-Steigung ableiten, die einem dynamischen Degradationswiderstand entspricht.

Wenn der Strom ueber 150% des Stromlimits steigt, wird die Simulation abgebrochen und ein Fehler angezeigt. Das Modell soll also nur den Bereich zwischen Limit und 150% Limit degradieren, aber keine beliebig weit sinkende Ausgangsspannung fuer extreme Ueberlastfaelle berechnen.

Bei Ueberschreiten des Stromlimits erzeugt der Simulations-Check eine Fehlermeldung. Die Degradation ist trotzdem Teil des Modells, damit der Solver in Ueberlastfaellen ein plausibles Ergebnis liefern kann.

Die Solver-Implementierung berechnet fuer die degradierende Quelle einen stabilisierten Arbeitspunkt aus aktueller Quellenspannung, geloestem Quellenstrom und der dokumentierten linearen Degradationskennlinie. Dadurch konvergieren sowohl rein ohmsche Ueberlastfaelle als auch digitale LED-Streifen mit spannungsabhaengigem Strom gegen dieselbe Kennlinie, ohne zwischen Nominalspannung und reduzierter Spannung zu springen.

Beispiel:

- `PSU`: Spannungsquelle zwischen Supply-Ausgang und GND, Spannung aus `source_voltage`, Stromlimit aus `source_current`, `voltageDropPctAt150Current` aus `simdata` oder Default `50`.
- `DC_JACK_FEMALE`: PSU-aehnliche Spannungsquelle zwischen `VOUT` und `GND`, Spannung aus `source_voltage`, Stromlimit aus `source_current`, `voltageDropPctAt150Current` aus `simdata` oder Default `50`.
- `PSU_USB_WIRES`: Spannungsquelle zwischen `VOUT` und `GND`, feste Ausgangsspannung `5 V`, Stromlimit aus `source_current`, `voltageDropPctAt150Current` aus `simdata` oder Default `50`.

Die GND-Referenz des Simulationsmodells wird an die negative Seite der Spannungsquelle gesetzt, die das hoechste Stromlimit hat. Bei mehreren gleich grossen Limits wird deterministisch nach Quellen-ID sortiert. Gibt es keine Spannungsquelle mit Stromlimit, wird als Fallback ein GND-Pin verwendet; wenn auch dieser fehlt, bricht der Modellaufbau mit einem Simulationsfehler ab.

### DCDC-Wandler

Ein DCDC-Wandler wird als eigenes elementares Element modelliert. Er besitzt Eingangs- und Ausgangsterminals und erzeugt eine geregelte Ausgangsspannung.

Terminals:

- `inPositive`
- `inNegative`
- `outPositive`
- `outNegative`

Parameter:

- `outputVoltageV`
- `efficiency`
- optional `outputCurrentLimitA`
- optional `voltageDropPctAt150Current`

Der Ausgangsstrom ist begrenzt durch die Eingangsleistung:

```text
IoutLimitDynamic = max(0, Pin * efficiency / outputVoltageV)
IoutLimit = min(outputCurrentLimitA, IoutLimitDynamic), falls outputCurrentLimitA gesetzt ist
```

Wenn der Ausgangsstrom das dynamische Limit ueberschreitet, verhaelt sich der Ausgang aehnlich wie eine PSU im Ueberlastfall: Die Ausgangsspannung wird ueber `voltageDropPctAt150Current` reduziert und der Simulations-Check meldet einen Fehler. Fehlt der Parameter, gilt auch hier Default `50`. Fuer die erste Version reicht ein iteratives Modell, bei dem Eingangsstrom und Ausgangsstrom pro Solver-Iteration aus Leistung und Wirkungsgrad aktualisiert werden.

Wenn der Ausgangsstrom ueber 150% des dynamischen oder festen Ausgangslimits steigt, bricht die Simulation mit Fehler ab.

Implementierungsstand: Der DCDC-Ausgang wird als geregelte Ausgangsspannungsquelle gestempelt. Nach jeder Loesung wird der Ausgangsstrom gemessen und daraus mit `Pin = Uout * Iout / efficiency` der Eingangsstrom fuer die naechste Iteration berechnet. Dieser Eingangsstrom wird als Stromsenke zwischen `inPositive` und `inNegative` gestempelt und belastet dadurch vorgelagerte PSU- und Leitungsmodelle. Ein optionales `outputCurrentLimitA` nutzt dieselbe Spannungsdegradation wie eine PSU. Zusaetzlich wird ein dynamisches Ausgangsstromlimit aus genau einer erreichbaren Eingangsspannungsquelle mit Stromlimit, aktueller Eingangsspannung und Wirkungsgrad berechnet; wenn dieses Limit ueberschritten wird, reduziert der Solver die DCDC-Ausgangsspannung und erzeugt ein eigenes Simulation-Check-Issue fuer begrenzte DCDC-Eingangsleistung. Werden mehrere Eingangsspannungsquellen passiv erreicht, wird kein Quellenlimit aufsummiert und die Simulation meldet ein Ambiguitaets-Issue, weil Stromteilung zwischen mehreren Quellen nicht modelliert ist. Mehrere DCDC-Wandler an derselben PSU sind zulaessig; sie belasten die PSU gemeinsam ueber ihre iterativen Eingangsstromsenken. Nicht-isolierte Wandler muessen ihre gemeinsame Masse explizit per `shortBridge` in `simdata` beschreiben; `DCDC_mini` verwendet eine Bruecke zwischen `GND1` und `GND2`.

### Kurzschlussbruecke

Eine Kurzschlussbruecke besteht aus zwei Terminals und verbindet diese hart miteinander. Beide Terminals bilden elektrisch denselben Simulationsknoten.

Terminals:

- `a`
- `b`

Parameter:

- keine

Beispiele:

- Interne Verbindung zwischen mehreren Supply-Ausgaengen einer PSU.
- Interne Verbindung zwischen mehreren GND-Ausgaengen einer PSU.
- `WAGO_2x` und `WAGO_3x`: Kurzschlussbruecken zwischen den jeweiligen Klemmenpins.
- GND-Bruecken im `MHC_V43` Controller.
- GND-Bruecken vom Eingang zu den drei Ausgaengen des `MHC_SwitchBoard` sowie die Bruecke zwischen `EN1` und `EN2`.

### Konstantleistungssenke

Eine Konstantleistungssenke verbraucht eine feste elektrische Leistung zwischen zwei Terminals. Sie ist nuetzlich fuer kleine Nebenverbraeuche von Controllern oder Modulen, die im DC-Modell nicht detailliert abgebildet werden sollen.

Terminals:

- `positive`
- `negative`

Parameter:

- `powerW`
- optional `minVoltageV`

Elektrisches Verhalten:

```text
I = powerW / max(V(positive) - V(negative), minVoltageV)
```

Wenn `minVoltageV` nicht gesetzt ist, wird ein kleiner interner Mindestwert verwendet, damit bei sehr niedriger Spannung kein unendlicher Strom entsteht. Faellt die Spannung unter `minVoltageV`, begrenzt der Solver den Strom auf `powerW / minVoltageV` und erzeugt optional einen Simulationshinweis wegen Unterspannung.

Implementierungsstand: `constantPowerSink` wird im nichtlinearen Solver iterativ als Stromsenke gestempelt. Nach jeder linearen Loesung wird die aktuelle Klemmenspannung ausgewertet und der Strom fuer die naechste Iteration mit `powerW / max(V, minVoltageV)` aktualisiert. Dadurch wird die Last bei normaler Versorgung nicht auf den Worst-Case-Strom `powerW / minVoltageV` festgenagelt. Stromquellen und Konstantleistungssenken aktivieren keine ansonsten freien Knoten, weil sie keine Leitfaehigkeit definieren; sie werden nur gestempelt, wenn beide Terminals bereits Teil des aktiven Simulationsnetzes sind. Ein unbeschalteter Controller-Pin mit Nebenverbrauch, z. B. der `3V3`-Pin eines ESP32, macht das lineare System dadurch nicht singulaer.

Beispiel:

- `MHC_V43`: Konstantleistungssenke zwischen `VIN` und `GND1` mit `powerW = 0.5`, um einen kleinen Nebenverbrauch des Controllers zu simulieren.

### Digitales LED-Netzelement

Das digitale LED-Netzelement modelliert genau eine logische LED eines digitalen LED-Streifens. Eine logische LED kann je nach Streifen aus einem oder mehreren physikalischen RGB- bzw. RGBW-LED-Paketen bestehen. Diese Gruppierung wird ueber `physLedsPerLogicLed` beschrieben.

Terminals:

- `supplyIn`
- `supplyOut`
- `gndIn`
- `gndOut`

Interne Struktur:

- Serienwiderstand zwischen `supplyIn` und `supplyOut`
- Serienwiderstand zwischen `gndIn` und `gndOut`
- spannungsabhaengige Stromsenke zwischen `supplyOut` und `gndOut`

Parameter:

- `supplyResistanceOhm`
- `gndResistanceOhm`
- `ledType`
- `ledsPerMeter`
- `physLedsPerLogicLed`
- Stromkennlinienparameter fuer Farbe `R`: `I0`, `Ilim`, `k`, `V0`
- Stromkennlinienparameter fuer Farbe `G`: `I0`, `Ilim`, `k`, `V0`
- Stromkennlinienparameter fuer Farbe `B`: `I0`, `Ilim`, `k`, `V0`
- Stromkennlinienparameter fuer Farbe `RGB-White`: `I0`, `Ilim`, `k`, `V0`
- Stromkennlinienparameter fuer Farbe `Separate-White`: `I0`, `Ilim`, `k`, `V0`
- Stromkennlinienparameter fuer Kombination `Separate-White + RGB-White`: `I0`, `Ilim`, `k`, `V0`

`ledsPerMeter` beschreibt die Anzahl physikalischer RGB- bzw. RGBW-LED-Pakete pro Meter, nicht die Anzahl einzelner Farbchips innerhalb dieser Pakete. Ein RGBW-FCOB-Streifen mit 784 einzelnen Farbchips pro Meter hat daher `ledsPerMeter: 196`. `physLedsPerLogicLed` beschreibt, wie viele dieser physikalischen RGB/RGBW-LED-Pakete zu einer logischen LED zusammengefasst sind. `supplyResistanceOhm` und `gndResistanceOhm` werden als Widerstand pro Meter des Streifens angegeben. Fuer ein logisches LED-Netzelement wird daraus `resistanceOhmPerMeter * physLedsPerLogicLed / ledsPerMeter` berechnet. Nur der Strom aus der Kennlinie bleibt pro physikalischem RGB/RGBW-LED-Paket angegeben; er wird mit der Helligkeit skaliert und danach fuer die logische LED mit `physLedsPerLogicLed` hochskaliert.

`RGB-White` bedeutet elektrisch: Die RGB-Kanaele werden so angesteuert, dass Weiss entsteht. `Separate-White` bedeutet: Nur der W-/WW-Kanal ist aktiv, RGB ist aus. Zusaetzlich soll ein Modus fuer `Separate-White + RGB-White` vorgesehen werden.

Stromkennlinien fuer LED-Streifen werden pro LED-Typ in `src/simulation/ledCurrentLookups.ts` gepflegt. Fuer jeden Farbmodus werden die Parameter `I0`, `Ilim`, `k`, `V0` und optional `kUI` gesetzt. Wenn `kUI` fehlt, gilt `0`. Die lokale LED-Spannung ist `V = V(supplyOut) - V(gndOut)`, und der Strom pro physikalischem RGB/RGBW-LED-Paket wird berechnet als:

```text
I = I0 + Ilim / (1 + exp(-k * (V - V0))) + kUI * V
```

Die Auswertung skaliert danach mit der Helligkeit `0..1`. Fuer Sicherungen werden kleine lokale Tabellen direkt in den jeweiligen `simdata`-Elementparametern gepflegt; das betrifft anfangs `miniOTOFuse` und `MHC_V43`.

### Auswaehlbare LED-Streifen-Simulationsoptionen

Digitale LED-Streifen verwenden fuer `supplyResistanceOhm`, `gndResistanceOhm` und `currentCurve` keine freien Nutzereingaben. Die Komponentendefinition legt in `ledSimulationOptions` fest, welche Varianten fuer die jeweilige LED-Komponente erlaubt sind und welche Variante empfohlen ist. Die konkrete Node-Instanz speichert die Auswahl in `ledSimulationOptionValues`.

Die zentralen Varianten liegen in `src/simulation/ledStripSimulationOptions.ts`:

- Widerstandsvarianten beschreiben den positiven oder negativen Kupferpfad pro Meter, z.B. typischer, guter oder schlechter 5-mm-Streifen.
- Current-Curve-Varianten enthalten die vollstaendige `LedCurrentCurve` mit `LedCurrentCurveParameters` fuer alle Farbmodi.

Die Current-Curve-Varianten decken mehrere digitale LED-Streifenfamilien ab, z.B. WS2812B/WS2812B ECO 5 V, WS2811 24 V, WS2814 12 V/24 V sowie WS28xx/SK6812 FCOB-Varianten. Bei RGB-only-Kennlinien ohne eigene `Separate+RGB White`-Messwerte wird `SEPARATE_AND_RGB_WHITE` identisch zu `RGB_WHITE` gepflegt.

`simdata` verweist bei umgestellten digitalen LED-Komponenten ueber `{ledSimulationOption: "supplyResistance"}`, `{ledSimulationOption: "gndResistance"}` und `{ledSimulationOption: "currentCurve"}` auf diese Auswahl. Der Modellaufbau loest diese Referenzen in primitive Simulationsparameter auf. Der Solver erhaelt weiterhin numerische Widerstaende und eine Kennlinien-ID; die elektrische Modellierung aendert sich dadurch nicht.

Fuer alte gespeicherte LED-Komponenten gibt es keine stille Abwaertskompatibilitaet. Wenn eine digitale LED-Komponente noch direkte LED-Widerstandswerte oder alte `{ledCurve: ...}`-Parameter verwendet, erzeugt die Simulation ein Fehler-Issue mit dem Hinweis, dass die Komponentendaten aus der aktuellen Vorlage aktualisiert werden muessen. Erst ein explizites Komponentenupdate setzt fehlende oder nicht mehr erlaubte LED-Optionswerte auf die empfohlenen Defaults.

Beispiel fuer `digitalLed`-Parameter:

```ts
parameters: {
  supplyResistanceOhm: {ledSimulationOption: "supplyResistance"},
  gndResistanceOhm: {ledSimulationOption: "gndResistance"},
  ledType: "WS2814_24V",
  ledsPerMeter: 60,
  physLedsPerLogicLed: 6,
  currentCurve: {ledSimulationOption: "currentCurve"},
}
```

### PWM-DC-Netzelemente

PWM-Netze werden in der ersten Version als DC-Netze behandelt. Analoge LED-Streifen werden in der ersten Simulation noch nicht umgesetzt, sondern spaeter ergaenzt. Das Konzept bereitet sie aber vor: Analoge LED-Streifen haben pro Kanal einen eigenen PWM-Eingang, zum Beispiel `pwm_in_R`, `pwm_in_G`, `pwm_in_B` oder `pwm_in_W`. Diese Eingangsnetze duerfen Strom und Spannung haben und werden nicht nur als reine Steuersignale betrachtet.

Die konkrete Zuordnung eines PWM-Netzes zu einem LED-Streifen-Kanal kommt aus `simdata`.

## Komponentenbeispiele fuer die erste Version

`Resistor`:

- ein elementarer Widerstand
- Terminal `a` an Pin 1
- Terminal `b` an Pin 2
- Widerstand aus Eingabefeld oder festem Default

`miniOTOFuse`:

- ein elementarer Widerstand
- Widerstandswert per lokaler Tabelle aus Sicherungs-Nominalwert
- Tabelle direkt im `simdata`-Elementparameter
- Simulations-Check bei Strom ueber Nominalwert

`PSU`:

- eine konstante Spannungsquelle mit Stromlimit und `voltageDropPctAt150Current`
- negative Quelle an GND
- positive Quelle an Supply-Ausgang
- mehrere Kurzschlussbruecken, um mehrere Supply-Ausgaenge und mehrere GND-Ausgaenge intern zu verbinden
- Check-Fehler, wenn Stromlimit ueberschritten wird

Digitale LED-Streifen:

- Parameter `ledsPerMeter` erstmal als festes Feld im ComponentType; der Wert beschreibt physikalische RGB- bzw. RGBW-LED-Pakete pro Meter, nicht einzelne Farbchips
- Parameter `physLedsPerLogicLed` beschreibt die Gruppierung physikalischer RGB/RGBW-LED-Pakete zu einer logischen LED
- `physLengths[i].length` ist verbindlich in Metern
- pro Abschnitt wird aus `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet, wie viele logische LEDs der Abschnitt hat; `lengthM` ist dabei die Laenge dieses LED-Streifen-Abschnitts
- fuer jede logische LED wird ein digitales LED-Netzelement in Reihe erzeugt
- Serienwiderstaende werden pro Meter angegeben und fuer das logische LED-Netzelement mit `resistanceOhmPerMeter * physLedsPerLogicLed / ledsPerMeter` umgerechnet
- dadurch koennen Spannungen an einzelnen `_middle_N`-Pins berechnet werden

`WAGO_2x` und `WAGO_3x`:

- Kurzschlussbruecken zwischen den Klemmenpins

`MHC_V43` Controller:

- Widerstand zwischen `VIN` und `VOUT`, um die Sicherung zu modellieren
- Widerstandswert und Sicherungsgrenzwert per lokaler Tabelle direkt in `simdata`
- Kurzschlussbruecken zwischen den GND-Pins
- Konstantleistungssenke zwischen `VIN` und `GND1` mit `0.5 W` fuer kleinen Controller-Nebenverbrauch

`MHC_SwitchBoard`:

- je ein Fuse-Element zwischen `VIN` und `VOUT1`, `VOUT2`, `VOUT3`
- Widerstandswert und Sicherungsgrenzwert per lokaler Tabelle direkt in `simdata`; die Widerstaende entsprechen den `MHC_V43`-Sicherungswerten plus `0.01 Ohm`
- Kurzschlussbruecken zwischen `GND` und `GND1`, `GND2`, `GND3`
- Kurzschlussbruecke zwischen `EN1` und `EN2`

`FUSE_Board`:

- vier unabhaengige Sicherungselemente fuer `IN1 -> OUT1`, `IN1 -> OUT2`, `IN2 -> OUT3` und `IN2 -> OUT4`
- Widerstandswert und Sicherungsgrenzwert je Pfad aus `Fuse1`, `Fuse2`, `Fuse3` bzw. `Fuse4`
- die vorhandenen `internalConnections` bleiben Diagramm-/Check-Information; die elektrische Simulation nutzt die expliziten `fuse`-Elemente in `simdata`

`MHC_Relay5V`, `MHC_Relay12V`, `MHC_Relay24V`:

- die beiden realen abgesicherten Relaispfade werden je als NC- und NO-Fuse-Element modelliert: `VIN1 -> VOUT1`, `VIN1 -> VOUT2`, `VIN2 -> VOUT3`, `VIN2 -> VOUT4`
- `Fuse1` definiert Widerstandswert und Sicherungsgrenzwert fuer beide Ausgaenge von Relaispfad 1; `Fuse2` entsprechend fuer Relaispfad 2
- `VIN1` und `VIN2` sind intern gebrueckt; `GND1` und `GND2` sind intern gebrueckt
- das Modell bildet keinen dynamischen Relais-Schaltzustand ab; NC und NO werden als alternative, reale Pfade desselben abgesicherten Ausgangs beschrieben

`DCDC`:

- eigenes DCDC-Element
- Ausgangsspannung aus Eingabefeld
- Stromlimit dynamisch aus Eingangsleistung, Wirkungsgrad und Ausgangsspannung
- Ueberlastmodell analog PSU mit `voltageDropPctAt150Current`

## Datenmodell: Simulationsmodell

Das Simulationsmodell sollte unabhaengig vom ReactFlow-UI sein. Es wird aus Diagramm-JSON erzeugt und enthaelt nur fachliche Daten.

Vorgeschlagene Hauptstruktur:

```ts
type SimulationModel = {
  version: 1;
  settings: SimulationSettings;
  nodes: SimulationNode[];
  checkNets: SimulationCheckNetRef[];
  circuitNodes: SimulationCircuitNode[];
  wires: SimulationWireElement[];
  components: SimulationComponent[];
  elements: SimulationElement[];
  pins: SimulationPin[];
  virtualPins: SimulationVirtualPin[];
  referenceNodeId: string;
};
```

`SimulationCircuitNode` ist der echte Knoten fuer den Solver. Da Wires Widerstaende sind, hat ein Check-Netz im Normalfall mehrere Circuit-Nodes.

```ts
type SimulationCircuitNode = {
  id: string;
  sourceCheckNetId?: string;
  pinIds: string[];
};
```

`SimulationWireElement`:

```ts
type SimulationWireElement = {
  id: string;
  edgeId: string;
  sourceCircuitNodeId: string;
  targetCircuitNodeId: string;
  resistanceOhm: number;
  lengthM: number;
  crosssectionMm2: number;
  material: 'copper';
};
```

Wires im Diagramm werden in der Simulation als konstante Widerstaende modelliert. Fuer die erste Version wird Kupfer angenommen.

Formel:

```text
R = rho * lengthM / crosssectionMm2
rho = 0.0179 Ohm * mm2 / m
```

Dabei kommen `lengthM`, `crosssectionMm2` und Einheit aus den Wire-Daten:

- `edge.data.physLength`
- `edge.data.physCrosssection`
- `edge.data.physCrosssectionUnit`

Falls Laenge oder Querschnitt fehlen oder ungueltig sind, wird die Simulation abgebrochen und ein Check-Fehler erzeugt. Es gibt keinen stillen Default.

Unterstuetzte Querschnittseinheiten:

- `mm2`: Wert direkt verwenden
- `AWG`: per AWG-zu-mm2-Tabelle umrechnen

Die Wire-Toolbar verwendet aktuell ein Zahlenfeld/Select fuer den Querschnitt und daneben eine Einheitenauswahl mit `"mm2"` oder `"AWG"`. Bei `"AWG"` wird `physCrosssection` als AWG-Nummer gespeichert. Die aktuelle UI-Auswahl ist `24, 22, 20, 18, 16, 14, 12, 10, 8`. Engineering ToolBox dokumentiert eine AWG-Tabelle mit Durchmesser und Querschnittsflaeche in `mm2`, die als Quelle fuer die initiale Tabelle dienen kann: https://www.engineeringtoolbox.com/awg-wire-gauge-d_731.html

Beispielwerte fuer die lokale Tabelle:

```ts
const awgToMm2: Record<string, number> = {
  '8': 8.37,
  '10': 5.26,
  '12': 3.31,
  '14': 2.08,
  '16': 1.31,
  '18': 0.82,
  '20': 0.52,
  '22': 0.33,
  '24': 0.20,
  '26': 0.13,
};
```

`SimulationPin`:

```ts
type SimulationPin = {
  id: string;
  nodeId: string;
  handleId: string;
  circuitNodeId?: string;
  sourceCheckNetId?: string;
  connectedWireIds: string[];
  functions: string[];
  role: 'gnd' | 'supply' | 'pwm' | 'other';
  position: {x: number; y: number};
};
```

`SimulationVirtualPin` ist fuer LED-Streifen-Punkte, die nicht direkt an ein Netz angeschlossen sind, fuer die aber trotzdem eine Spannung angezeigt werden soll:

```ts
type SimulationVirtualPin = {
  id: string;
  nodeId: string;
  handleId: string;
  role: 'gnd' | 'supply';
  segmentBoundaryIndex: number;
  pairedHandleId?: string;
  circuitNodeId?: string;
  position: {x: number; y: number};
};
```

## Relevante Netze

Fuer den ersten Umfang werden nur Netze betrachtet, die mindestens eine dieser Klassifikationen haben:

- `gnd_net_type`
- `suppl_net_type`
- `pwm_net_type`

Mapping fuer die Simulation:

- `gnd_net_type` -> `gnd`
- `suppl_net_type` -> `supply`
- `pwm_net_type` -> `pwm`

Netze mit mehreren relevanten Klassifikationen sollten nicht stillschweigend simuliert werden. Sie sollten als Simulationsfehler abgebrochen werden. Der Simulations-Check zeigt dann eine klare Meldung.

Wenn es mehrere getrennte GND-Netze gibt, sollte das wegen der Diagramm-Check-Voraussetzung normalerweise nicht vorkommen. Zur Robustheit bricht die Simulation ab und zeigt einen Fehler. Wenn gar kein GND-Netz existiert, bricht die Simulation ebenfalls ab und zeigt einen Fehler.

Mehrere Spannungsquellen mit unterschiedlicher Spannung im selben Supply/GND-System sollen bereits durch den Diagramm-Check als Fehler erkannt werden. Falls dieser Zustand trotzdem bis zum Simulationsmodell gelangt, bricht die Simulation mit einem Simulationsfehler ab. Als gleiches Supply/GND-System gelten Spannungsquellen, deren positive und negative Terminals auf denselben Circuit-Nodes liegen. Fuer den Vergleich wird eine kleine Ergebnistoleranz von `0.0005 V` verwendet. Parallele Quellen mit Ausgleichsstrom werden nicht simuliert. Mehrere ideale Quellen mit identischer Spannung auf denselben Circuit-Nodes duerfen vorkommen; der lineare Solver stempelt sie nur einmal, damit keine redundante ideale Quellenbedingung eine singulaere Matrix erzeugt.

Nicht versorgte, aber ansonsten valide Teilnetze werden ignoriert. Ein Hinweis wird nur fuer aktive Simulationselemente erzeugt, also z.B. fuer Lasten, Stromquellen, LED-Elemente oder DCDC-Wandler, deren gesamte Anschlussknoten nicht von einer Spannungsquelle erreichbar sind. Rein passive Elemente wie Widerstaende, Sicherungen, Short-Bridges oder aktuell leitende Dioden duerfen auch in Signal- oder Hilfsnetzen ohne Versorgung liegen und erzeugen keine `unpoweredSubnet`-Info. Die Simulation des versorgten Hauptnetzes darf dadurch weiterlaufen.

## Simulationseinstellungen

Der Bereich `Simulate current flow` soll mindestens enthalten:

1. Button `Simulate`
2. Button `Delete simulation results`
3. Einstellungen:
   - LED-Farbwahl: `R`, `G`, `B`, `RGB-White`, `Separate-White`, `Separate-White + RGB-White`
   - Helligkeit in Prozent
4. Statusanzeige fuer den Simulationszustand
5. Ergebnisliste der Simulations-Checks, analog zur Liste in der Diagrammpruefung

Vorgeschlagene Struktur:

```ts
type SimulationSettings = {
  ledColorMode: 'R' | 'G' | 'B' | 'RGB_WHITE' | 'SEPARATE_WHITE' | 'SEPARATE_AND_RGB_WHITE';
  brightnessPercent: number;
};

type SimulationStatus = 'idle' | 'running' | 'success' | 'failed' | 'blocked';
```

Die UI sollte `brightnessPercent` zunaechst auf `0..100` begrenzen. Intern sollte die Simulation mit `0..1` arbeiten.

Simulationseinstellungen sind lokaler UI-State und nicht Undo-/Redo-faehig.

Da die Simulation bei groesseren Diagrammen oder langen LED-Streifen etwas dauern kann, muss die UI einen laufenden Zustand anzeigen. Beim Klick auf `Simulate` wird der Status sofort auf `running` gesetzt. Der Button `Simulate` wird waehrenddessen deaktiviert oder zeigt einen Busy-Zustand, z.B. `Simulating...`. Der Statusbereich zeigt eine kurze Meldung wie `Simulation wird ausgefuehrt...`. Nach Abschluss wechselt der Status auf `success` oder `failed`; bei Abbruch durch Diagramm-Check-Fehler bleibt der Status `failed` bzw. `blocked` mit passender Meldung.

## Simulationsergebnis

Das Ergebnis sollte von der UI getrennt sein und keine React-Komponenten enthalten.

Simulationsergebnisse werden nicht in das Diagramm-JSON exportiert. Sie bleiben reiner Laufzeit-/UI-State. Dadurch bleiben Modell-Exportdateien deterministisch und enthalten nur das bearbeitbare Schaltungsmodell, nicht die zuletzt berechnete Auswertung.

Bildexporte sind davon ausgenommen: Wenn Simulationsergebnisse im Diagramm sichtbar sind, sollen PNG-, JPG- und SVG-Export die sichtbaren Simulation-Overlay-Elemente mit ausgeben, also Spannungslabels, Stromlabels, Strom-/Spannungspfeile und Hinweislinien. Reine UI-Aktionen des Overlays, z.B. Plot-Buttons, werden nicht in den Bildexport aufgenommen.

```ts
type SimulationResult = {
  modelVersion: 1;
  settings: SimulationSettings;
  createdAt: string;
  diagramFingerprint: string;
  pinResults: SimulationPinResult[];
  virtualPinResults: SimulationVirtualPinResult[];
  wireResults: SimulationWireResult[];
  checkIssues: SimulationCheckIssue[];
  status: 'ok' | 'warning' | 'error';
};
```

Pin-Ergebnisse:

```ts
type SimulationPinResult = {
  pinId: string;
  nodeId: string;
  handleId: string;
  currentA?: number;
  voltageV?: number;
};
```

Wire-Ergebnisse:

```ts
type SimulationWireResult = {
  wireId: string;
  edgeId: string;
  currentA?: number;
  voltageDropV?: number;
  resistanceOhm?: number;
};
```

LED-Streifen-Ergebnisse:

```ts
type SimulationLedElementVoltageResult = {
  elementId: string;
  nodeId: string;
  sourceElementId?: string;
  distanceM?: number;
  sectionIndex?: number;
  logicLedIndex?: number;
  physicalLedCount?: number;
  deltaVoltageV?: number;
};

type SimulationLedStripVoltageSummaryResult = {
  nodeId: string;
  sourceElementId?: string;
  minDeltaVoltageV?: number;
  elementCount: number;
};
```

Fuer jedes intern erzeugte LED-Netzelement eines digitalen LED-Streifens wird nach erfolgreicher Simulation die lokale Differenzspannung berechnet:

- `deltaVoltageV = V(supplyOut) - V(gndOut)` des jeweiligen expandierten LED-Netzelements.
- `distanceM` beschreibt die Position dieses logischen LED-Netzelements entlang des physischen Streifens. Der Wert wird beim Modellaufbau aus `physLengths`, Abschnittslaenge und logischem LED-Index erzeugt und nicht spaeter aus Element-IDs geraten.
- `sectionIndex` und `logicLedIndex` sind optionale Diagnose-/UI-Metadaten fuer Tooltips und fuer die Zuordnung zu `physLengths`-Abschnitten. `sectionIndex` ist die fortlaufende Abschnittsnummer im sortierten `physLengths`-Array, nicht `physLengths.startIndex`.
- `physicalLedCount` beschreibt, wie viele physikalische RGB/RGBW-LED-Pakete durch dieses logische LED-Netzelement repraesentiert werden.
- Die Werte werden als Simulationsergebnis gespeichert, aber noch nicht dauerhaft einzeln im Diagramm angezeigt.
- Die spaetere Detailanzeige fuer einzelne LED-Netzelemente wird separat definiert.

Aus allen `deltaVoltageV`-Werten eines LED-Streifens wird zusaetzlich eine Zusammenfassung berechnet:

- `minDeltaVoltageV = Math.min(...deltaVoltageV)`
- Anzeigeformat im Diagramm: `V_LED,min=2.22 V`, wobei `LED,min` in der UI tiefgestellt ist.
- Diese Anzeige wird zusammen mit den anderen Simulationsergebnissen angezeigt.

### LED-Streifen-Spannungsplot

Nach einer erfolgreichen Simulation soll der Nutzer fuer digitale LED-Streifen anzeigen koennen, wie sich die lokale LED-Differenzspannung ueber die physische Streifenlaenge entwickelt. Der Plot verwendet dieselben berechneten `deltaVoltageV`-Werte, aus denen auch `V_LED,min` entsteht; es wird kein separates vereinfachtes oder interpoliertes elektrisches Modell verwendet.

UI-Einstieg:

- Neben der bestehenden `V_LED,min`-Anzeige im Simulation-Result-Overlay erscheint ein kleiner Icon-Button, wenn fuer diesen LED-Streifen mindestens zwei `SimulationLedElementVoltageResult`-Werte mit `distanceM` und `deltaVoltageV` vorliegen.
- Der Button gehoert visuell zum `V_LED,min`-Label, darf aber dessen Lesbarkeit und Platzierungslogik nicht verschlechtern. Fuer die Label-Groesse muss der Button mitgemessen werden.
- Der Button oeffnet ein Unterfenster ueber dem Diagramm. Bevorzugt wird ein AntD-Modal oder Drawer, weil der Plot groesser sein darf als ein Overlay-Tooltip und auf Touch-Geraeten bedienbar bleiben muss.
- Das Unterfenster zeigt den gewaehlten Streifen eindeutig, z.B. ueber Komponentenname oder Node-ID, und kann per Schliessen-Button verlassen werden. Es veraendert das Diagramm nicht und erzeugt keinen Undo-Snapshot.

Plot-Inhalt:

- X-Achse: physische Laenge des LED-Streifens in Metern, beginnend bei `0 m`.
- Y-Achse: lokale Differenzspannung `V_LED = V(supplyOut) - V(gndOut)` in Volt.
- Der Plot zeigt ein Grid mit vertikalen und horizontalen Hilfslinien.
- Die Kurve wird als Polyline durch die tatsaechlich berechneten logischen LED-Punkte gezeichnet. Zwischenwerte duerfen nur als visuelle Verbindung der Messpunkte erscheinen, nicht als zusaetzliche Simulationsdaten.
- Unter dem Plot werden die Anzahl der logischen LEDs und die daraus repraesentierte Anzahl physikalischer RGB/RGBW-LED-Pakete getrennt angezeigt.
- Der kleinste Punkt wird markiert und entspricht dem Wert aus `V_LED,min`.
- Abschnittsgrenzen aus `physLengths` werden als vertikale Markierungen angezeigt. Einspeisepunkte an Start, Ende oder Middle-Pins sollen nur markiert werden, wenn sie aus den vorhandenen Pin-/Abschnittsdaten eindeutig bestimmbar sind.
- Tooltips auf Punkten zeigen mindestens Laenge, `V_LED`, Abschnitt und logischen LED-Index.

Datenmodell-Anforderung:

- Der Modellaufbau muss fuer jedes expandierte `digitalLed`-Element die Reihenfolge und Position entlang des Streifens in das Simulationselement oder in begleitende Metadaten schreiben.
- `runSimulation()` uebernimmt diese Metadaten in `SimulationLedElementVoltageResult`.
- Die Plot-Daten werden aus `simulationResult.ledElementVoltageResults` nach `nodeId` und `sourceElementId` gruppiert und nach `distanceM` sortiert.
- Wenn ein Streifen keine vollstaendigen Laengeninformationen hat, entsteht wie bisher kein erfolgreiches LED-Modell; ein Plot-Button wird dann nicht angezeigt.
- Wenn nur ein einzelner Punkt existiert, wird kein Kurvenplot angeboten, weil keine Entwicklung ueber die Laenge sichtbar ist.

Implementierungsstand:

- Umgesetzt in `src/simulation/buildSimulationModel.ts`, `src/simulation/runSimulation.ts`, `src/simulation/SimulationOverlay.tsx` und `src/simulation/simulationTypes.ts`.
- `SimulationElement.ledStripPosition` speichert `distanceM`, fortlaufenden `sectionIndex`, `logicLedIndex` und `physicalLedCount` fuer expandierte `digitalLed`-Elemente.
- Das Overlay zeigt am `V_LED,min`-Label einen Plot-Button, wenn Plotdaten fuer den Streifen vorhanden sind.
- Das Unterfenster wird als AntD-Modal geoeffnet und zeichnet den Plot als SVG mit Grid, tiefgestelltem `LED` in der Y-Achse, Minimum-Markierung und vertikalen `physLengths`-Grenzlinien.
er
Nicht-Ziele fuer die erste Umsetzung:

- Kein Export des Plots in das Diagramm-JSON.
- Keine automatische Optimierung oder Empfehlung fuer Einspeisepunkte.
- Keine Glattung, Trendlinie oder heuristische Rekonstruktion fehlender Punkte.
- Keine dauerhafte Anzeige aller Einzelpunkte direkt im Diagramm.

Wire-Strom und Spannungsabfall werden nicht dauerhaft als Label auf jedem Wire angezeigt, um das Diagramm nicht zu ueberladen. Sie sollen aber per Hover oder Select am Wire verfuegbar sein.

Konvention fuer `currentA`:

- positiv: Strom fliesst aus dem Komponentenpin ins Netz
- negativ: Strom fliesst aus dem Netz in den Komponentenpin

Die Anzeige zeigt den Betrag immer positiv:

- `Math.abs(currentA).toFixed(2) + ' A'`
- Pfeilrichtung zeigt das Vorzeichen.

Spannung:

- Normale Pin-Spannung wird als absolute Knotenspannung gegen Simulationsreferenz/GND angezeigt.
- Anzeigeformat: positive oder negative Zahl mit zwei Nachkommastellen und Einheit `V`.

Simulationsergebnisse werden mit drei Nachkommastellen erzeugt. Die Diagrammanzeige rundet diese Werte auf zwei Nachkommastellen. Interne Berechnungen duerfen nicht auf diese Ergebnis- oder Anzeigeaufloesung gerundet werden: Auch sehr kleine einzelne Widerstaende mit kleinem Spannungsabfall muessen erhalten bleiben, weil sich viele solche Spannungsabfaelle in einer Reihenschaltung zu einem relevanten Gesamtwert aufsummieren koennen.

## LED-Streifen: zusaetzliche Spannungsanzeige

Bei LED-Komponenten sollen zusaetzlich Spannungsdifferenzen fuer bestimmte Supply-/GND-Pin-Paare angezeigt werden.

Betroffene Handles:

- Start/End:
  - `GND_start`, `GND_end`
  - `5V_start`, `5V_end`
  - `12V_start`, `12V_end`
  - `24V_start`, `24V_end`
  - `48V_start`, `48V_end`
- Mitte:
  - konkrete wiederholte Handles im aktuellen System mit Basis-HIDs mit `_middle`, z.B. `24V_middle_1`, `GND_middle_2`

Anzeige-Regel:

- LED-Supply-, LED-GND- und LED-PWM-Pins werden fuer normale Pin-Spannungslabels wie andere Pins behandelt.
- Zusaetzlich wird fuer Supply-/GND-Paare eine Differenzspannung angezeigt:
  - `V(supplyPin) - V(correspondingGndPin)`
  - Zuordnung ueber gleiche Endung:
    - `_start`: Supply-Start gegen `GND_start`
    - `_end`: Supply-Ende gegen `GND_end`
    - `_middle_N`: Supply-Mitte gegen `GND_middle_N`
- Fuer die Differenzanzeige wird ein leicht versetzter Spannungspfeil vom Supply-Pin zum GND-Pin gezeichnet. Am Anfang und Ende wird die Versatzseite so gewaehlt, dass der Pfeil auf dem Streifen liegt. Bei Middle-Punkten wird vorzugsweise die Seite ohne Wire-Ueberdeckung gewaehlt. Das Label wird als `V_LED=0.15 V` angezeigt, wobei `LED` in der UI tiefgestellt ist, und per Hinweispfeil mit dem Rand dieses Spannungspfeils verbunden; die Pfeilspitze soll den Spannungspfeil nicht durchkreuzen.
- Zusaetzlich wird fuer den gesamten LED-Streifen die minimale interne LED-Netzelement-Differenzspannung angezeigt. Das Label wird als `V_LED,min=2.22 V` formatiert, wobei `LED,min` in der UI tiefgestellt ist.
- Die `V_LED,min`-Anzeige wird erst nach allen Strom-, Spannungs- und Spannungsdifferenzanzeigen platziert, damit sie deren bereits belegte Bereiche beruecksichtigen kann.
- Fuer die Platzierung wird zuerst eine Position nahe der Mitte der LED-Komponente bewertet. Wenn dort bereits viele Anzeigen liegen oder Ueberdeckungen entstehen, werden weitere Kandidaten entlang des LED-Streifens bewertet und die Position mit mehr freiem Platz gewaehlt.
- Von der `V_LED,min`-Anzeige fuehrt ein Hinweispfeil auf kuerzestem Weg zum LED-Streifen. Der Hinweispfeil endet am Komponentenrand und nicht in der Mitte des Streifens.

Beispiele:

- `24V_start` zeigt `V(24V_start) - V(GND_start)`
- `12V_end` zeigt `V(12V_end) - V(GND_end)`
- `5V_middle_2` zeigt `V(5V_middle_2) - V(GND_middle_2)`

Ein `_middle_N`-Spannungswert wird nur angezeigt, wenn ein `physLengths`-Eintrag mit `startIndex === N` existiert. Falls der passende GND-Pin nicht existiert oder nicht berechnet werden kann, wird kein Spannungswert angezeigt und ein Simulations-Check kann einen Hinweis erzeugen.

## LED-Streifen und physLengths

`physLengths` beschreibt Teilabschnitte eines LED-Streifens:

```ts
type PhysLengthType = {
  startIndex: number;
  length: number | undefined;
};
```

Die vorhandene UI berechnet daraus Abschnitte:

- Abschnitt `i` beginnt bei `physLengths[i].startIndex`.
- Abschnitt `i` endet bei `physLengths[i + 1].startIndex`, oder beim `nodeLength`, wenn es der letzte Abschnitt ist.
- Abschnittsbreite im Bild: `(nextStartIndex - startIndex) * nodeBasicSizeX`.
- `physLengths[i].length` ist in Metern.

Die Beziehung zu `_middle_N`-Handles ist:

- Wiederholte Middle-Handles werden in `repeatedHandleArray` konkretisiert.
- Ein konkreter Middle-Handle hat eine ID wie `24V_middle_2` und `repeatIndex: 2`.
- Beim Verbinden eines Middle-Handles sorgt `stripCheckAndDivideIfMiddleConnection()` dafuer, dass ein `physLengths`-Eintrag mit `startIndex === repeatIndex` existiert.
- Falls dieser Eintrag noch nicht existiert, wird der vorherige Abschnitt geteilt. Ist dessen Laenge bekannt, wird sie proportional auf die beiden neuen Abschnitte verteilt.
- Beim Loeschen der letzten Verbindung an einer solchen Grenze kann der zugehoerige `physLengths`-Eintrag wieder entfernt und die Laenge mit dem vorherigen Abschnitt zusammengefuehrt werden.
- Der Modellaufbau prueft verbundene `_middle_N`-Handles trotzdem defensiv. Falls ein importiertes oder aelteres Diagramm eine Wire an `_middle_N` enthaelt, aber kein passender `physLengths.startIndex === N` existiert, wird `N` als notwendige Abschnittsgrenze behandelt. Fehlt dadurch eine Abschnittslaenge, bricht die Simulation mit einer klaren Meldung ab, statt die Wire an einen falschen oder losen Knoten zu haengen.

Fuer die Simulation:

- Ein LED-Streifen wird erst in `physLengths`-Abschnitte aufgeteilt.
- Je Abschnitt wird aus `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` die Anzahl logischer LEDs berechnet; `lengthM` ist die Laenge dieses LED-Streifen-Abschnitts, `ledsPerMeter` meint physikalische RGB/RGBW-LED-Pakete pro Meter und nicht einzelne Farbchips.
- Jede logische LED wird als ein digitales LED-Netzelement in Reihe modelliert.
- Zwischen zwei benachbarten Abschnitten entstehen interne Supply- und GND-Circuit-Nodes. An diesen Knoten endet die LED-Kette des vorherigen Abschnitts und beginnt die LED-Kette des naechsten Abschnitts.
- `_middle_N` liegt an der Abschnittsgrenze mit `startIndex === N` und muss elektrisch mit genau diesen internen Grenzknoten verbunden werden: `24V_middle_N`/`12V_middle_N`/`5V_middle_N` mit dem Supply-Grenzknoten, `GND_middle_N` mit dem GND-Grenzknoten.
- Eine externe Wire, die an einem `_middle_N`-Handle angeschlossen ist, wird dadurch nicht als separater loser Pin modelliert, sondern speist genau an der entsprechenden Stelle in die LED-Schiene ein.
- Spannungen an `_middle_N` werden nur fuer solche Abschnittsgrenzen angezeigt, die wirklich in `physLengths` existieren.

Beispiel aus `example3.json`:

- `nodeLength: 4`
- konkrete Middle-Handles bei `repeatIndex` 1, 2 und 3
- `physLengths: [{startIndex: 0, length: 13}, {startIndex: 2, length: 13}]`
- Die angeschlossenen Handles `24V_middle_2` und `GND_middle_2` gehoeren zur Abschnittsgrenze `startIndex: 2`.
- Fuer `_middle_1` und `_middle_3` wird keine Zusatzspannung angezeigt, solange kein passender `physLengths`-Eintrag existiert.

## Modellaufbau aus Diagramm-JSON

Der Modellaufbau sollte als pure Funktion implementiert werden:

```ts
createSimulationModel(diagramJson, settings): SimulationModel
```

Schritte:

1. Vorhandenes Diagramm-Check-Ergebnis pruefen; es darf verwendet werden, wenn dessen Diagramm-Fingerprint unveraendert ist. Nur Check-Fehler mit Severity `error` blockieren die Simulation, Warnungen erlauben sie erstmal.
2. Diagramm-JSON parsen.
3. Nodes und Edges typisieren.
4. Check-/Netzkontext aufbauen oder gemeinsame Netlist-Funktion nutzen.
5. Relevante Check-Netze filtern: GND, Supply, PWM.
6. Echte Circuit-Nodes erzeugen: Pin-Enden, interne Bruecken und Wire-Enden beruecksichtigen.
7. Wire-Widerstaende aus Laenge, Querschnitt und Kupfer-spezifischem Widerstand erzeugen.
8. Simulierbare Komponenten erkennen: `node.data.simdata !== undefined`.
9. Nicht simulierbare Komponenten pruefen: Wenn eine Komponente ohne `simdata` mindestens einen Pin an einem `gnd`-, `supply`- oder `pwm`-Netz hat, gilt sie als im relevanten Pfad und die Simulation bricht mit Fehler ab.
10. Wenn `node.data.simdata` leer ist: Komponente als bekannt, aber ohne Gleichungsbeitraege behandeln.
11. Fuer jede simulierbare Komponente:
     - relevante Pins sammeln
     - Pinpositionen fuer Anzeige bestimmen
     - lesbare kompakte Elementdefinitionen validieren
     - elementare Elemente mit aktuell unsichtbaren Terminals wegen `hideConditions` ueberspringen
     - elementare elektrische Elemente aus `simdata.elements` erzeugen
12. LED-VirtualPins und LED-Einzelelemente ermitteln.
13. GND-Referenz anhand der Spannungsquelle mit dem hoechsten Stromlimit setzen. Bei Gleichstand wird deterministisch nach Quellen-ID gewaehlt; wenn keine Quelle existiert, wird ein GND-Pin als Fallback verwendet.
14. Mehrere Spannungsquellen mit unterschiedlicher Spannung im selben Supply/GND-System als Simulationsfehler behandeln. Identische parallele ideale Quellen werden fuer den linearen Solver dedupliziert.
15. Nicht versorgte, aber ansonsten valide Teilnetze ignorieren und einen Hinweis erzeugen.
16. Validierungsfehler sammeln; bei Fehlern keine Simulation starten.

## Solver-Strategie

Das detaillierte Solver-Konzept ist in `SOLVER.MD` beschrieben. Dieser Abschnitt beschreibt nur die Einbindung in das Simulationskonzept und die Startstrategie fuer die erste Implementierung.

Fuer die erste Implementierung wird ein kleiner eigener Dense-Solver fuer fruehe Tests verwendet. Er soll eine MNA-Matrix loesen koennen und mindestens Gaussian Elimination mit Pivoting enthalten. Diese Loesung ist bewusst auf kleine bis mittlere Testmodelle begrenzt und dient dazu, Modellaufbau, Element-Stempel, Checks und Ergebnisableitung schnell und nachvollziehbar zu verifizieren.

Der Solver soll trotzdem von Anfang an ueber ein austauschbares Interface angebunden werden:

```ts
type LinearSystemSolver = {
  solve(system: LinearSystem): SolverResult;
};
```

Dadurch kann spaeter ein Sparse-Solver oder eine externe numerische Bibliothek ergaenzt werden, ohne Modellaufbau und Ergebnislogik neu zu schreiben. Ein eigener Sparse-Solver ist fuer den Start nicht vorgesehen.

## Anzeige im Diagramm

Die Ergebnisse sollen direkt am Diagramm angezeigt werden.

Wenn eine Simulation laeuft, soll der Nutzer auch im Diagramm erkennen, dass gerade gerechnet wird. Das Overlay kann dafuer einen dezenten globalen Busy-Indikator anzeigen, z.B. oben im Diagrammbereich oder nahe der Toolbar. Dieser Zustand darf nicht wie ein berechnetes Ergebnis wirken: Strom-/Spannungslabels werden erst nach erfolgreicher Simulation aktualisiert. Bestehende alte Ergebnislabels duerfen waehrend einer neuen Simulation entweder entfernt oder sichtbar als nicht aktuell markiert werden; bevorzugt werden sie beim Start der neuen Simulation entfernt, damit keine alten Werte mit laufenden Berechnungen verwechselt werden.

Stromanzeige:

- Pin-Stroeme werden nicht dauerhaft am Pin angezeigt. Am Pin steht nur Spannung.
- Wire-Stroeme werden pro Wire angezeigt.
- Normale Wire-Stromanzeige:
  - Die Position der Anzeige ist am laengsten Wire-Segment ungefaehr in dessen Mitte.
  - Die Wire-Stromanzeige zeigt den Stromwert immer als positiven Betrag mit zwei Nachkommastellen.
  - Neben der Wire-Stromanzeige wird ein Richtungspfeil gezeichnet. Der Pfeil liegt moeglichst nahe an der Wire und zeigt in Richtung des positiven Stromflusses. Positiver Wire-Strom ist dabei die Richtung `source -> target`, negativer Wire-Strom zeigt entsprechend `target -> source`.
  - Ist der gerundete Stromwert `0.00`, wird ein beidseitiger Pfeil angezeigt.
  - Der Pfeilkopf ist schmal. Die Pfeilkopflaenge soll zusammen mit der Pfeillaenge so wirken, dass ein Pfeilkopf ungefaehr ein Drittel der Pfeillaenge einnimmt.
  - Pfeillaenge und Pfeilkopf werden in Screen-Koordinaten stabil gehalten, damit der Pfeilkopf beim Herauszoomen nicht relativ zur Pfeillaenge waechst.
  - Der Abstand des Pfeils zur Wire wird aus der gezeichneten Wire-Dicke plus einem kleinen visuellen Abstand berechnet.
  - Wenn eine andere Wire den Bereich um die geplante Pfeilmitte kreuzt, darf der Pfeil entlang desselben Wire-Segments nach links oder rechts verschoben werden, sofern dort genug Platz ist.
  - Die Stromwertanzeige darf etwas Abstand zum Pfeil haben, bleibt aber so nah wie moeglich und wird so platziert, dass sie andere Wires, Komponenten oder Anzeigen moeglichst nicht ueberdeckt.
  - Von der Stromwertanzeige fuehrt eine duenne Hinweislinie mit Pfeil zur Mitte des Wire-Stromrichtungspfeils.
- Zusaetzliche Wire-Stromanzeige beim Hover:
  - Beim Hover ueber eine Wire wird eine zusaetzliche Stromanzeige nahe an der Hover-Position erzeugt.
  - Sie verwendet dasselbe Konzept wie die normale Wire-Stromanzeige: positiver Betrag, Richtungspfeil, beidseitiger Pfeil bei gerundet `0.00` und Hinweislinie vom Label zur Pfeilmitte.
  - Wenn der Hover im Bereich der normalen Anzeige liegt, wird keine zusaetzliche Hover-Anzeige erzeugt, damit sich beide Anzeigen nicht ueberlappen.
- Beim Select/Klick auf eine Wire wird das Simulation-Overlay ausgeblendet, damit Wire-Toolbar, Wire-Punkte und Editier-Controls nicht ueberdeckt werden.

Spannungsanzeige:

- Position neben dem betroffenen Pin.
- Wert mit Vorzeichen, zwei Nachkommastellen und Einheit `V`.
- Von jedem Spannungswert fuehrt immer ein Hinweispfeil zum betroffenen Pin.
- Normale Pin-Spannungen werden nur an Pins mit mindestens einer angeschlossenen Wire angezeigt. Unverbundene normale Pins bleiben ohne Spannungslabel, auch wenn intern ein Wert berechnet wurde.
- LED-Supply-Pins werden bei normalen Pin-Spannungslabels wie andere Pins behandelt.
- LED-Streifen-Spannungspunkte sind eine Ausnahme: vorgesehene Supply-Start-/End-/Middle-Punkte duerfen auch ohne direkt angeschlossene Wire angezeigt werden, wenn dafuer ein Simulationsergebnis existiert. Diese Ausnahme betrifft nur explizite LED-Spannungspunkte mit Simulationsergebnis; normale LED-Supply-Pins bleiben ansonsten wie andere Pins an die Wire-Verbindung gekoppelt.
- Zusaetzlich wird fuer ein LED-Supply/GND-Pin-Paar eine Spannungsdifferenz angezeigt: Ein Spannungspfeil wird leicht versetzt vom Supply-Pin zum zugeordneten GND-Pin gezeichnet. Am Anfang und Ende eines LED-Streifens wird die Versatzseite so gewaehlt, dass der Spannungspfeil auf dem Streifen liegt und nicht ausserhalb der Komponente. Bei Middle-Punkten werden beide moeglichen Seiten bewertet; wenn dort Wires verlaufen, wird vorzugsweise die Seite ohne Wire-Ueberdeckung gewaehlt. Ueber oder unter bzw. neben dem LED-Streifen wird eine LED-Spannungsanzeige platziert, z.B. `V_LED=0.15 V`, wobei `LED` in der UI tiefgestellt ist. Von dieser Anzeige fuehrt ein Hinweispfeil zum Spannungspfeil. Die Spitze des Hinweispfeils endet am Rand des Spannungspfeils auf der Seite, von der der Hinweispfeil kommt, und durchkreuzt den Spannungspfeil nicht.
- Fuer LED-Streifen wird zusaetzlich `V_LED,min=2.22 V` angezeigt, wobei `LED,min` in der UI tiefgestellt ist. Diese Anzeige fasst die kleinste lokale Differenzspannung aller intern erzeugten LED-Netzelemente des Streifens zusammen. Sie wird als letzte Simulationsergebnis-Anzeige platziert, bevorzugt nahe der Streifenmitte und bei Platzmangel entlang des Streifens verschoben. Der Hinweispfeil endet auf kuerzestem Weg am Komponentenrand.
- Simulationsmeldungen fuer zu niedrige LED-Spannung werden pro LED-Streifen zusammengefasst. Wenn `V_LED` an einem angeschlossenen Start-, End- oder Middle-Anschluss unter dem Minimum liegt, wird nur die Versorgungsspannungs-Meldung erzeugt. Wenn alle angeschlossenen Versorgungspunkte im Bereich liegen, aber `V_LED,min` zu niedrig ist, wird stattdessen nur die Meldung fuer zu hohen Spannungsabfall ueber die Streifenlaenge erzeugt.
- An `SolderJoint`-Komponenten werden Spannungen angezeigt, aber keine Stroeme.
- Spannungsanzeigen sollen so platziert werden, dass sie keine Pins bzw. Handle-Bereiche, Wires oder andere Spannungs- oder Stromanzeigen ueberdecken.

Wire-Anzeige:

- Im Overlay wird pro Wire dauerhaft der Wire-Strom mit Richtungspfeil angezeigt, solange keine Wire selektiert ist.
- Strompfeile werden in Screen-Koordinaten gegen andere Wires und bereits platzierte Strompfeile geprueft. Wenn eine Ueberlappung entsteht, wird der neue Pfeil entlang seines Wire-Segments auf die naechste freie Kandidatenposition verschoben; die elektrische Richtung und der angezeigte Wert bleiben unveraendert.
- Beim Hover ueber eine Wire wird nahe der Hover-Position eine zusaetzliche Wire-Stromanzeige mit Richtungspfeil und Hinweislinie angezeigt. Wenn der Hover nahe an der normalen Wire-Stromanzeige liegt, wird diese zusaetzliche Anzeige unterdrueckt.
- Beim Select/Klick auf eine Wire wird das Simulation-Overlay ausgeblendet.
- Spannungsabfall und berechneter Widerstand koennen spaeter in der Wire-Toolbar oder in einem kleinen Tooltip angezeigt werden, nicht als dauerhaftes Label auf jedem Wire.

Anzeige-Modi:

- `Default`: Permanente Wire-Stromanzeigen erscheinen nur fuer Stroeme kleiner als `-0.02 A` oder groesser als `0.02 A`; die Hover-Anzeige fuer eine Wire bleibt davon ausgenommen und wird immer angezeigt. Pin-Spannungen werden nur an `suppl_out`-Pins und USB-Versorgungsanzeigen dargestellt. `V_LED` und `V_LED,min` bleiben sichtbar.
- `Extended`: Alle aktuell verfuegbaren Simulationsergebnis-Labels werden angezeigt.
- Der Modus wird in der Simulation-Sidebar unterhalb des `Simulate`-Buttons umgeschaltet und wirkt auf bereits berechnete Ergebnisse ohne erneuten Simulationslauf.
- Beispiel: `I = 3.2 A`, `dU = 0.4 V`, `R = 0.12 Ohm`.

Darstellungskonzept:

- Eigene Overlay-Komponente, z.B. `SimulationOverlay`, die `SimulationResult` und Node-/Handle-Positionen liest.
- Overlay kann zusaetzlich `simulationStatus === 'running'` lesen und dann einen nicht-interaktiven Busy-Indikator anzeigen.
- Nicht in `ComponentDataType` speichern.
- Nicht in Export-JSON persistieren.
- Zoom- und pan-stabil: Overlay-Positionen werden aus ReactFlow-Viewport und Handle-Positionen abgeleitet und bei Pan/Zoom automatisch neu berechnet.
- Die Labelposition darf nicht aus `postype` abgeleitet werden. Fuer Spannungslabels wird nicht pauschal die entgegengesetzte Richtung der ausgehenden Wire verwendet. Stattdessen werden mehrere Kandidatenpositionen um den Pin bewertet und die Position mit moeglichst wenig Ueberdeckung mit Handle-Bereichen, Wires, Komponenten und anderen Anzeigen gewaehlt.
- Overlay-Labels haben eine begrenzte Zoom-Skalierung. Bei moderatem Herauszoomen skalieren sie kleiner mit. Bei starkem Herauszoomen wird die Skalierung gedeckelt, sodass Labels nicht groesser werden und weniger stark ueberlappen; volle Lesbarkeit bei maximalem Zoom-out ist nicht erforderlich.
- Stromrichtungspfeile werden an Wires angezeigt, deutlich sichtbar, z.B. blau/cyan fuer Strom.
- Spannungslabels in einer zweiten Ebene mit heller Flaeche, dunkler Schrift und farbigem Rand, z.B. amber/orange fuer Spannung.
- Nachdem alle Pin-Spannungslabels, Wire-Stromlabels und Hover-Labels platziert wurden, prueft das Overlay auf Ueberlappungen in Screen-Koordinaten. Ueberlappende Labels werden iterativ auseinander geschoben. Wird ein Label dabei so weit verschoben, dass die Zugehoerigkeit nicht mehr eindeutig ist, wird eine duenne Hinweislinie mit Pfeil vom Label zum Pin bzw. zum Wire-Stromrichtungspfeil gezeichnet.
- Labels sollen Pointer-Events deaktivieren, damit sie das Editieren des Diagramms nicht stoeren.

## Simulationsergebnisse verwerfen

Simulationsergebnisse duerfen nicht mehr angezeigt werden, sobald sich das Diagramm fachlich aendert.

Relevante Aenderungen:

- Komponente hinzugefuegt
- Komponente geloescht
- Komponente verschoben
- Komponente gedreht
- Komponenteneigenschaften geaendert
- Handles/repeated handles geaendert
- Wire hinzugefuegt
- Wire geloescht
- Wire verschoben
- Wire-Bend geaendert
- Wire-Eigenschaften geaendert

Ausnahme:

- Aenderungen, die nur die angezeigten Simulationsergebnisse selbst betreffen, duerfen die Ergebnisse nicht invalidieren.

Entscheidung:

- Eine Diagrammaenderung loescht Simulationsergebnisse sofort.
- Auf dem Diagramm werden alle Simulationsanzeigen sofort entfernt.
- Ergebnisse werden nicht nur als `outdated` markiert.
- Beim Start einer neuen Simulation entsteht kein Undo-Snapshot, weil Simulationsergebnisse transient sind.

`Delete simulation results`:

- setzt `simulationResult = null`
- entfernt Overlay
- entfernt Simulations-Highlights
- loescht auch Highlights aus Simulations-Checks

Empfehlung:

- Simulationsergebnis enthaelt `diagramFingerprint`.
- Der Fingerprint wird aus Nodes und Edges erzeugt, aber ohne transienten UI-Zustand:
  - `selected`
  - `dragging`
  - `checkHighlighted`
  - Simulation-Overlay-Daten
- Bei jeder Nodes-/Edges-Aenderung wird der aktuelle Fingerprint verglichen.
- Wenn er abweicht, wird `simulationResult` auf `null` gesetzt.

## Simulations-Checks

Nach jeder erfolgreichen Simulation laufen automatisch Simulations-Checks.

Die Ergebnisse werden im Bereich `Simulate current flow` angezeigt, aehnlich wie die Wiring-Diagramm-Checks.

Vorgeschlagene Struktur:

```ts
type SimulationCheckIssue = {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
  targets?: SimulationTarget[];
};
```

Erste Checks:

- Diagramm-Check hat Fehler: Simulation nicht starten.
- Kein eindeutiges GND-Referenznetz.
- Gar kein GND-Netz.
- Supply-Netz ohne Spannungsquelle.
- Stromlimit einer PSU oder eines DCDC-Wandlers ueberschritten.
- Sicherungsstrom ueber Grenzwert.
- Wire-Laenge oder Wire-Querschnitt fehlt oder ist ungueltig.
- Nicht simulierbare Komponente liegt in relevantem Strompfad.
- Simulation konnte fuer ein Netz keine Spannung bestimmen.
- Spannung am Wire bzw. zwischen Supply- und GND-Pin zu niedrig, fuer alle Pin-Paare, fuer die Spannung angezeigt werden soll.
- Spannung am angeschlossenen LED-Streifen-Versorgungspunkt unter Mindestspannung. Pro LED-Streifen wird dafuer nur eine zusammengefasste Meldung erzeugt. Sie weist darauf hin, dass Netzteilspannung bzw. bei Stromlimit/Degradation die verfuegbare Netzteilleistung erhoeht werden muss.
- Spannung ueber die Laenge des LED-Streifens unter Mindestspannung, obwohl die angeschlossenen Versorgungspunkte im erlaubten Bereich liegen. Pro LED-Streifen wird dafuer nur eine zusammengefasste Meldung erzeugt. Sie weist darauf hin, dass der Spannungsabfall ueber den Streifen zu hoch ist und weitere Einspeisungen noetig sind.
- Spannung am LED-Streifen ueber Maximalspannung.
- Mehrere Spannungsquellen mit unterschiedlicher Spannung im selben Supply/GND-System.
- Nicht versorgtes Teilnetz wurde ignoriert.
- Strom ueber 150% des PSU- oder DCDC-Limits: Simulation abbrechen.

Vorgeschlagene kurze UI-/Translation-Texte:

- Diagramm-Check blockiert Simulation: `Simulation nicht gestartet. Bitte korrigiere zuerst die Fehler im Diagramm-Check.`
- Veraltetes Check-Ergebnis: `Diagramm wurde geaendert. Bitte Diagramm-Check erneut ausfuehren.`
- Simulation fehlgeschlagen: `Simulation fehlgeschlagen. Bitte pruefe die angezeigten Simulationsmeldungen.`
- PSU-Ueberlast: `Stromlimit der Spannungsquelle ueberschritten. Die Ausgangsspannung wurde im Modell reduziert.`
- DCDC-Ueberlast: `Stromlimit des DCDC-Wandlers ueberschritten. Die Ausgangsspannung wurde im Modell reduziert.`
- Extreme Ueberlast: `Strom liegt ueber 150% des Limits. Simulation wurde abgebrochen.`
- Sicherung ueberlastet: `Strom durch Sicherung liegt ueber dem Nennwert.`
- Wire-Daten fehlen: `Wire-Laenge oder Wire-Querschnitt fehlt. Simulation kann nicht gestartet werden.`
- Nicht simulierbare Komponente im relevanten Netz: `Komponente ist an ein relevantes Netz angeschlossen, hat aber kein Simulationsmodell.`
- Nicht versorgtes Teilnetz: `Nicht versorgtes Teilnetz wurde ignoriert.`

Die Check-Liste sollte die gleiche UX verwenden wie `DiagramCheckPage`:

- Severity-Tag
- Titel
- Beschreibung
- Empfehlung
- Betroffene Elemente
- Klick/Expand hebt betroffene Pins/Komponenten/Wires hervor

Betroffene Elemente werden in der normalen UI nutzerverstaendlich angezeigt:

- Komponenten ueber den uebersetzten Komponentennamen.
- Pins als `Komponentenname - Pinname`.
- Wires als Verbindung zwischen den lesbaren Endpunkten.
- Interne Simulationselemente fallen auf die zugehoerige Komponente zurueck.

Technische IDs wie ReactFlow-Node-IDs, Handle-IDs oder expandierte Simulationselement-IDs sollen nur als Fallback sichtbar werden, wenn der Diagrammkontext kein lesbares Label mehr liefern kann.

## UI-Konzept: Simulate current flow

Sidebar-Panel ersetzt den aktuellen `comingSoon`-Text.

Elemente:

1. Einstellungen
   - LED-Farbmodus als Select/Segmented Control
   - Helligkeit als Slider + Prozentanzeige
2. Button `Simulate`
   - prueft vorhandenen Diagramm-Check-Status und Fingerprint
   - startet die Berechnung in einem Web Worker, damit die Sidebar den `running`-Zustand rendern kann und lange LED-Streifen die UI nicht blockieren
   - baut Modell im Worker
   - fuehrt Simulation im Worker aus
   - startet Checks
   - setzt `simulationResult`
   - setzt waehrenddessen `simulationStatus = 'running'`
   - verwirft Worker-Ergebnisse, wenn sich der Diagramm-Fingerprint waehrend der Berechnung geaendert hat
3. Button `Delete simulation results`
   - setzt `simulationResult = null`
   - setzt `simulationStatus = 'idle'`
   - entfernt Overlay
   - entfernt Simulations-Highlights
4. Statusbereich
   - `No simulation has been run yet`
   - `Simulation is running...` waehrend der Berechnung
   - `Simulation failed` bei Check-, Solver- oder Modellfehler
   - Bei Erfolg nur nutzerverstaendliche Zusammenfassung anzeigen, z.B. Anzahl simulierter Komponenten und Anzahl simulierter Wires.
   - Diese Zahlen zaehlen nur den wirklich simulierten Modellanteil: Komponenten nur, wenn fuer sie mindestens ein elementares Simulationselement erzeugt wurde; Wires nur, wenn beide Wire-Enden an Circuit-Nodes liegen, die von Simulationselement-Terminals benutzt werden. Ausgenommene Diagramm-Komponenten, optionale/unsichtbare Elemente, WireInfo-Nodes und rein informative bzw. nicht modellierte Wires werden nicht mitgezaehlt.
   - Technische Modellstatistiken wie Circuit-Nodes, Elementanzahl, Pin-Results und Wire-Results nicht in der normalen UI anzeigen.
5. Check-Ergebnisse
   - Liste analog Diagramm-Checks
   - Issue-Zeilen sind interaktiv: Hover zeigt die betroffenen Nodes/Wires temporaer im Diagramm, Klick haelt die Markierung bis zum naechsten Klick, zur naechsten Simulation oder zum Loeschen/Invalidieren der Ergebnisse.
   - Simulation-Issue-Highlights verwenden eigene `simulationHighlighted`-Flags auf Nodes/Edges und ueberschreiben nicht die Diagramm-Check-Highlights.

Debug-Modus:

- Der Simulationsbereich hat einen Code-Schalter `SIMULATION_DEBUG`, der standardmaessig `false` ist.
- Wenn `SIMULATION_DEBUG === true`, schreibt die Simulation technische Debug-Informationen in die Browser-Console.
- Sinnvolle Debug-Ausgaben sind: Diagramm-Fingerprint, Einstellungen, Status, Anzahl Diagramm-Komponenten, Anzahl simulierbarer Komponenten, Check-Netze, Circuit-Nodes, simulierte Wires, elementare Simulationselemente, Pins, virtuelle Pins, Pin-/Wire-Ergebnisse und Simulationsmeldungen.
- Diese Informationen sind nur fuer Entwicklung und Tests gedacht und duerfen normale Nutzer nicht in der UI verwirren.
- Zusaetzlich gibt es `DEBUG_BYPASS_SIMULATION_DIAGRAM_CHECK` in `simulationFeatureFlags.ts`. Dieser Schalter ist standardmaessig `false` und darf nur fuer Entwicklung/Regressionstests aktiviert werden. Bei `true` startet die Simulation auch ohne aktuelles fehlerfreies Diagramm-Check-Ergebnis; die UI zeigt dann einen Warnhinweis zum Debug-Bypass.

## USB-Power-Pair-Simulation

`PSU_USB` besitzt nur einen sichtbaren USB-Handle. Elektrisch besteht eine USB-Versorgung aber aus mindestens zwei Leitern: `VBUS` bzw. `V+` und `GND`. Fuer die Simulation darf dieser Handle deshalb nicht als einzelner Circuit-Node behandelt werden. Er muss im Modellaufbau explizit in zwei virtuelle elektrische Pins aufgespalten werden.

Ziel fuer `PSU_USB`:

- Die Komponente liefert dieselbe 5-V-Spannungsquelle wie `PSU_USB_WIRES`: `voltageV = 5`, `currentLimitA` aus `source_current`, `voltageDropPctAt150Current = 50`.
- Der sichtbare Handle `usb` mit Funktion `usb_power_out` erzeugt intern einen virtuellen `VBUS`-Pin und einen virtuellen `GND`-Pin.
- Ein angeschlossener `usb_full`-Handle erzeugt ebenfalls intern einen virtuellen `VBUS`-Pin und einen virtuellen `GND`-Pin.
- Eine USB-Wire zwischen `usb_power_out` und `usb_full` wird im Simulationsmodell als zwei parallele Leiter modelliert: ein VBUS-Leiter von Quelle zu Verbraucher und ein GND-Rueckleiter von Verbraucher zur Quelle.
- Die Wire-Laenge und der Wire-Querschnitt gelten jeweils fuer einen einzelnen Leiter. Deshalb erhalten VBUS- und GND-Leiter denselben berechneten Widerstand, nicht den halben oder doppelten Wert.

### Datenmodell

Das Konzept soll ohne Heuristik umgesetzt werden. Der Modellaufbau soll nicht aus Handle-Namen wie `usb` ableiten, dass zwei Leiter existieren, sondern eine explizite Simulation-Port-Definition verwenden.

Vorschlag:

```ts
type UsbPowerPairSimulationPort = {
  id: string;
  type: "usbPowerPair";
  handle: string;
  positiveTerminal: string;
  negativeTerminal: string;
};
```

Beispiel fuer `PSU_USB`:

```json
"simdata": {
  "version": 1,
  "ports": [
    {
      "id": "usb-power",
      "type": "usbPowerPair",
      "handle": "usb",
      "positiveTerminal": "usb.VBUS",
      "negativeTerminal": "usb.GND"
    }
  ],
  "elements": [
    {
      "id": "source",
      "type": "voltageSource",
      "terminals": {
        "positive": "usb.VBUS",
        "negative": "usb.GND"
      },
      "parameters": {
        "voltageV": 5,
        "currentLimitA": { "field": "source_current" },
        "voltageDropPctAt150Current": 50
      }
    }
  ]
}
```

Komponenten mit `usb_full` benoetigen ebenfalls einen `usbPowerPair`-Port. Alle Komponenten mit `usb_full` duerfen grundsaetzlich ueber USB versorgt werden; sie haben zugleich einen separaten V+-Eingang. Dafuer gilt:

- `USB.GND` wird ueber eine explizite `shortBridge` mit dem lokalen GND-Knoten der Komponente verbunden.
- `USB.VBUS` wird nicht direkt mit `VIN` oder `5V` kurzgeschlossen, sondern ueber ein allgemeines `diode`-Element auf den lokalen V+-Knoten gefuehrt.
- Diese Diode leitet ideal nur in Vorwaertsrichtung und erzeugt ca. `0.4 V` Spannungsabfall. Rueckspeisung von lokalem V+ nach `USB.VBUS` wird ideal gesperrt; ein Sperrstrom wird nicht modelliert.
- Wenn der separate V+-Eingang versorgt ist, speist sich die Komponente aus diesem Eingang; USB ist dann nicht die primaere Versorgung.
- Wenn der separate V+-Eingang nicht versorgt ist, aber `usb_full` mit einem erreichbaren `usb_power_out` verbunden ist, speist USB die Komponente ueber die Diode.

Damit werden per USB versorgte Controller auch an ihren internen 5-V- und 3.3-V-Pins als versorgt bzw. weiterleitend modelliert. USB ist also keine reine interne Controller-Last, sondern kann die bestehenden Versorgungs- und Reglerpfade der Komponente aktivieren.

Falls eine konkrete Komponente USB nur als Datenanschluss nutzen soll, darf sie keinen `usbPowerPair`-Port definieren. Ein `usb_full` ohne erreichbares `usb_power_out` ist kein Diagrammfehler und kein Simulationsfehler; der USB-Port wird dann fuer die Versorgung einfach nicht verwendet.

Beispiel fuer eine USB-versorgbare Verbraucherkomponente:

```json
"simdata": {
  "version": 1,
  "ports": [
    {
      "id": "usb-power",
      "type": "usbPowerPair",
      "handle": "USB",
      "positiveTerminal": "USB.VBUS",
      "negativeTerminal": "USB.GND"
    }
  ],
  "elements": [
    {"id": "usb-gnd-bridge", "type": "shortBridge", "terminals": {"a": "USB.GND", "b": "GND"}},
    {
      "id": "usb-vbus-diode",
      "type": "diode",
      "terminals": {"anode": "USB.VBUS", "cathode": "VIN"},
      "parameters": {"forwardVoltageV": 0.4}
    }
  ]
}
```

### Modellaufbau

Der Modellaufbau erweitert `buildSimulationModel()` um virtuelle Pins fuer zusammengesetzte Ports:

1. Sichtbare Handles bleiben fuer Diagramm-Checks, Targets und UI erhalten.
2. Fuer jeden `usbPowerPair`-Port werden zwei interne Pin-IDs erzeugt, z.B. `node::usb::VBUS` und `node::usb::GND`.
3. Element-Terminals duerfen diese virtuellen Terminal-IDs referenzieren.
4. USB-Wires werden nicht als ein normaler Wire-Widerstand erzeugt. Stattdessen entstehen zwei `SimulationWireElement`-Eintraege mit derselben Laenge und demselben Querschnitt:
   - `edge:<id>:usb-vbus`
   - `edge:<id>:usb-gnd`
5. Beide Wire-Elemente behalten eine Referenz auf dieselbe sichtbare Edge-ID, muessen aber fuer Ergebnisaggregation als USB-Paar markiert werden.
6. Bei USB-Verbraucherkomponenten werden die Port-Terminals mit den internen Versorgungsknoten verbunden: `USB.GND` per `shortBridge`, `USB.VBUS` ueber eine Diode mit ca. `0.4 V` Vorwaertsspannung zum lokalen V+-Knoten.

Wenn ein sichtbarer USB-Handle per Komponentenoption ausgeblendet ist, duerfen die zugehoerigen virtuellen Terminals ebenfalls nicht als fehlende Pins bewertet werden. Element-Terminals wie `USB.GND` oder `USB.VBUS` werden dann fuer diese Komponenteninstanz ignoriert, genauso wie Elemente, die auf andere versteckte Handles zeigen.

Der Solver sieht fuer die USB-Wire weiterhin normale Widerstands-Wires und fuer `PSU_USB` eine normale Spannungsquelle. Neu benoetigt wird aber ein gerichtetes Dioden-/Forward-Drop-Element fuer den Verbraucherpfad von `USB.VBUS` nach lokalem `VIN` bzw. `5V`.

### Ergebnisdarstellung fuer USB-Wires

Eine sichtbare USB-Wire hat zwei elektrische Strangstromwerte. Im Normalfall ist der Betrag des VBUS-Stroms gleich dem Betrag des GND-Rueckstroms, die Richtungen sind entgegengesetzt. Die UI soll deshalb:

- als Zahlenwert nur den Hinstrom anzeigen, also den Betrag des VBUS-Stroms von `usb_power_out` zu `usb_full`;
- den Strompfeil fuer USB-Wires bidirektional darstellen, auch wenn der Wert nicht 0 A ist;
- den Hover-/Detailwert als USB-Paar kennzeichnen, damit klar bleibt, dass Hin- und Rueckstrom in derselben sichtbaren Wire laufen;
- bei Abweichung zwischen VBUS- und GND-Strom ein Simulations-Issue (Info) erzeugen, weil dann ein zusaetzlicher Rueckstrompfad oder eine Modellierungsinkonsistenz vorliegt.

Technisch sollte `SimulationWireResult` dafuer nicht nur einen einzelnen `currentA`-Wert kennen, sondern optional Metadaten fuer aggregierte sichtbare Wires bekommen, z.B. `displayCurrentA`, `displayBidirectional` und `conductorResults`.

### Diagramm-Checks fuer USB-Versorgung

Die Check-Regeln behandeln USB als optionalen Power-Pair-Steckverbinder. Ein `usb_full` ist nur dann eine Versorgung, wenn im selben USB-Netz ein erreichbares `usb_power_out` liegt. Ohne erreichbares `usb_power_out` gilt der USB-Port als ungenutzt fuer die Versorgung, z.B. weil darueber nur Daten laufen.

- `wireWithoutPhysicalParameters` muss auch USB-Netze betrachten, weil eine USB-Wire fuer die Simulation Laenge und Querschnitt pro Leiter braucht.
- Ein `usb_full`-Eingang ohne erreichbares `usb_power_out` ist kein Fehler und darf `powerMissing` nicht verhindern oder ausloesen. Der Port wird fuer die Versorgung ignoriert.
- USB-Power-Verbindungen muessen Point-to-Point sein: genau ein `usb_power_out` darf genau einen `usb_full` versorgen. Verzweigungen, passive Verteiler, mehrere `usb_full`-Senken oder mehrere `usb_power_out`-Quellen in einem USB-Power-Netz sind Diagrammfehler.
- Spannungsvertraeglichkeit von `usb_full` soll gegen die aufgeloeste USB-Quellspannung geprueft werden, wenn tatsaechlich eine Point-to-Point-USB-Power-Verbindung vorhanden ist. Fuer `PSU_USB` ist das 5 V.
- Mischungen von USB-Power mit normalen `suppl_out`/`gnd`-Netzen sollen bewusst bewertet werden: Entweder als harte Mixed-Classification-Fehler oder als erlaubte interne Bruecke nur dann, wenn sie in der Komponente explizit als USB-Power-Pair-Port modelliert ist.

### Geklaerte Entscheidungen

1. Alle Komponenten mit `usb_full` koennen ueber USB versorgt werden.
2. Diese Komponenten besitzen zusaetzlich einen separaten V+-Eingang. Dieser Eingang hat fachlich hoehere Prioritaet als USB.
3. USB versorgt die Komponente ueber ein allgemeines `diode`-Element von `USB.VBUS` nach lokalem V+ mit ca. `0.4 V` Spannungsabfall. `USB.GND` wird mit lokalem GND gebrueckt.
4. Per USB versorgte Komponenten duerfen ihre internen 5-V-/3.3-V-Pfade als versorgt bzw. weiterleitend modellieren.
5. Die Stromgrenze fuer die USB-Versorgung kommt aus der Quelle, bei `PSU_USB` also aus `source_current`.
6. Die USB-Diode leitet ideal in Vorwaertsrichtung und sperrt ideal gegen Rueckspeisung. Es wird kein Sperrstrom modelliert.
7. USB-Wires bieten als erste Querschnitts-Presets `AWG24`, `AWG26` und `AWG28`; Default fuer neue und migrierte USB-Wires ist `AWG26`.
8. Bis diese Preset-UI umgesetzt ist, muss der Modellaufbau weiterhin explizite Wire-Parameter verlangen. Ein stiller Modellaufbau-Default ohne gespeicherte Wire-Daten ist nicht zulaessig, weil sonst alte Diagramme unbemerkt andere Simulationsergebnisse liefern.
9. Die Spannungsanzeige am `usb_full`-Handle zeigt nur `USB.VBUS` gegen `USB.GND`, nicht zusaetzlich interne 5-V/GND-Pins. Die Anzeige soll als `VUSB=5V` erscheinen, wobei `USB` als Index tiefgestellt wird.

### Konzeptpruefung

Das Konzept ist in sich stimmig, wenn drei Grenzen strikt eingehalten werden:

- USB-Power wird nur ueber explizite `simdata.ports` modelliert. Weder Handle-Name noch `usb_full` allein duerfen virtuelle VBUS/GND-Knoten erzeugen.
- Diagramm-Checks bleiben verantwortlich fuer Point-to-Point-Struktur und fehlende Wire-Parameter. Der Solver soll keine verzweigten USB-Power-Netze interpretieren muessen.
- Die interne Versorgung eines USB-Verbrauchers wird ausschliesslich ueber die explizite `shortBridge` fuer GND und das `diode`-Element fuer VBUS aktiviert. Dadurch bleibt klar, warum USB die Komponente versorgen kann, aber nicht rueckwaerts in das USB-Kabel einspeist.

Offene Implementierungsrisiken:

- Prioritaet zwischen separatem V+-Eingang und USB entsteht elektrisch ueber die Diode und die vorhandenen Spannungsquellen, nicht ueber eine Sonderregel. Tests muessen pruefen, dass ein versorgter `VIN` den USB-Pfad nicht rueckspeist.
- `powerMissing` darf ein bloss verbundenes, aber quellloses `usb_full` nicht als Versorgung zaehlen.
- Bestehende Diagramme mit USB-Wires ohne physikalische Daten brauchen eine klare Nutzer-Meldung; der Default `AWG26` soll erst greifen, wenn die Wire-Daten gespeichert oder bewusst migriert werden.

### Implementierungsplan fuer USB-Power-Pair

1. Typen und Metadaten erweitern:
   - [x] `ComponentSimulationDefinition` um `ports?: UsbPowerPairSimulationPort[]` erweitern.
   - [x] `ComponentSimulationElementType` und Element-Typen um `diode` mit Terminals `anode`/`cathode` und Parameter `forwardVoltageV` erweitern.
   - [x] `elementaryElements.ts` um Metadaten fuer `diode` ergaenzen.
2. Komponentenmodell vorbereiten:
   - [x] `PSU_USB` auf `simdata.ports` mit `usbPowerPair` umstellen und eine 5-V-`voltageSource` zwischen `USB.VBUS` und `USB.GND` definieren.
   - [x] Alle Komponenten mit `usb_full` identifizieren und je Komponente den lokalen V+- und GND-Knoten festlegen.
   - [x] Fuer diese Komponenten `usbPowerPair`, `shortBridge` von `USB.GND` nach lokalem GND und `diode` von `USB.VBUS` nach lokalem V+ ergaenzen.
3. Modellaufbau erweitern:
   - [x] Port-Validierung fuer sichtbare Handles und virtuelle Terminalnamen einbauen.
   - [x] Port-Validierung fuer doppelte Port-IDs einbauen.
   - [x] USB-Wires zwischen `usb_power_out` und `usb_full` in zwei Wire-Elemente expandieren: VBUS-Hinleiter und GND-Rueckleiter.
   - [x] Normale Wire-Erzeugung fuer diese sichtbare Edge unterdruecken und die beiden Leiter mit Aggregationsmetadaten auf die sichtbare Edge verweisen lassen.
4. Solver erweitern:
   - [x] Iteratives ideales Diodenmodell implementieren.
   - [x] Konvergenz-/Abbruchkriterien fuer Dioden-Zustandswechsel definieren.
   - [x] Debug-Ausgaben fuer Dioden-Zustandswechsel ergaenzen.
   - [x] Tests fuer leitende USB-Diode, gesperrte Rueckspeisung und gleichzeitige VIN-/USB-Versorgung ergaenzen.
5. Diagramm-Checks umsetzen:
   - [x] `signalSinkWithoutSource`: `usb_full` ohne erreichbares `usb_power_out` weiterhin ignorieren.
   - [x] Neue bzw. angepasste USB-Point-to-Point-Pruefung: genau ein `usb_power_out`, genau ein `usb_full`, keine passiven Verteiler oder Mehrfachsenken in einem aktiven USB-Power-Netz.
   - [x] `supplyInputWithoutSource`: `usb_full` weiter ausschliessen; separate `suppl_in`-Pins derselben Komponente bleiben normal pruefpflichtig.
   - [x] `powerMissing`: `usb_full` nur als Versorgung zaehlen, wenn ein erreichbares `usb_power_out` im passenden USB-Netz liegt.
   - [x] `wireWithoutPhysicalParameters`: `usb_net_type` einbeziehen.
   - [x] USB-Spannungsvertraeglichkeit gegen `tolVmin`/`tolVmax` der `usb_full`-Senke pruefen, sobald eine gueltige Point-to-Point-USB-Power-Verbindung existiert.
6. Wire-UI und Daten:
   - [x] Querschnitts-Presets `AWG24`, `AWG26` und `AWG28` fuer USB-Wires anbieten.
   - [x] `AWG26` als UI-Default fuer neue USB-Wires setzen, aber fehlende Daten in alten Diagrammen weiterhin melden, bis sie gespeichert oder migriert wurden.
7. Ergebnisdarstellung:
   - [x] `SimulationWireResult` um aggregierte USB-Anzeigeinformationen erweitern, z.B. `displayCurrentA`, `displayBidirectional` und `conductorResults`.
   - [x] Sichtbare USB-Wire mit bidirektionalem Pfeil und Hinstromwert anzeigen.
   - [x] `usb_full`-Spannungslabel als `VUSB` gegen `USB.GND` ausgeben.
   - [x] Info-Issue erzeugen, wenn VBUS- und GND-Leiterstroeme betragsmaessig relevant abweichen.
8. Regressionstests:
   - [x] Diagramm-Check-Fixtures fuer ungenutztes `usb_full`, gueltige Point-to-Point-USB-Versorgung, Verzweigung, mehrere Quellen, mehrere Senken, fehlende Wire-Daten und USB-Spannungsmismatch anlegen. Umgesetzt unter `simulation_test/diagram_checks/` mit `npm run test:diagram-check`.
   - [x] Simulation-Fixtures fuer `PSU_USB -> Controller`, USB mit zusaetzlichem `VIN`, Rueckspeisungsversuch in USB und fehlende USB-Wire-Parameter ergaenzen.
   - [x] Bestehende LTspice-/Analyse-Regressionen weiter laufen lassen, damit Dioden- und Portlogik keine bestehenden Supply/GND-Faelle veraendert. Verifiziert mit `npm run test:ltspice`.

## Empfohlene Modulstruktur

Vorschlag:

```text
src/simulation/
  simulationTypes.ts
  buildSimulationModel.ts
  runSimulation.ts
  simulationDebug.ts
  simulationChecks.ts
  simulationWorker.ts
  runSimulationInWorker.ts
  simulationFingerprint.ts
  denseLinearSystemSolver.ts
  wireResistance.ts
  awgToMm2.ts
  elementaryElements.ts
  ledCurrentLookups.ts
  ledStripSimulation.ts
  componentSimulationModels.ts
  SimulationPage.tsx
  SimulationOverlay.tsx
```

Beispiele fuer Simulation und Ueberpruefung liegen im Verzeichnis `simulation_test/`. Dort sollen Testdiagramme, erwartete Simulationsergebnisse und Sonderfaelle wie Ueberlast, fehlende Wire-Daten oder LED-Streifen-Spannungsabfaelle gesammelt werden.

### LTspice-Referenzbeispiele

Unter `simulation_test/ltspice/` liegen reproduzierbare Referenzfaelle, die gegen LTspice-Sollwerte verglichen werden sollen. Jeder Fall enthaelt mindestens:

- `diagram.json`: exportiertes WLED-Wiring-Diagramm fuer genau diesen Aufbau.
- `expected.json`: aus LTspice uebernommene Sollwerte inklusive Simulationseinstellungen und Toleranzen.

Die Datei `simulation_test/ltspice/HowToMakeReferences.md` beschreibt, wie neue Referenzen aufgebaut werden sollen und welche Messwerte besonders nuetzlich sind.

Aktuell vorhandene Referenzfaelle:

- `PSU_Resistor`: einfache PSU-Last mit Widerstand. Dieser Fall prueft Grundgleichungen fuer Spannungsquelle, Leitungswiderstaende, Strom und Spannungsabfall ohne LED-Nichtlinearitaet.
- `dcdc_psu_resistor`: 12-V-PSU, DCDC-Wandler auf 5 V und 10-Ohm-Last. Dieser Fall prueft geregelte DCDC-Ausgangsspannung, Ausgangslaststrom und den iterativen Eingangsstrom aus Ausgangsleistung und Wirkungsgrad. Die zugehoerige LTspice-Datei liegt als `dcdc_psu_resistor.cir` im Fixture-Verzeichnis.
- `dcdc_overload_resistor`: 12-V-PSU, DCDC-Wandler auf 5 V mit 0,4-A-Ausgangslimit und 10-Ohm-Last. Dieser Fall prueft DCDC-Ausgangsspannungsdegradation und den erwarteten Simulation-Check bei ueberschrittenem Ausgangsstromlimit. Die zugehoerige LTspice-Datei liegt als `dcdc_overload_resistor.cir` im Fixture-Verzeichnis.
- `dcdc_input_limited_resistor`: 12-V-PSU mit 0,1-A-Stromlimit, DCDC-Wandler auf 5 V und 10-Ohm-Last. Dieser Fall prueft das dynamische DCDC-Ausgangslimit aus begrenzter Eingangsleistung und den erwarteten Simulation-Check `DCDC input power limited`. Die zugehoerige LTspice-Datei liegt als `dcdc_input_limited_resistor.cir` im Fixture-Verzeichnis.
- `dcdc_input_multi_source_ambiguous`: zwei passiv erreichbare 12-V-PSUs am selben DCDC-Eingang. Dieser analytische Fall prueft, dass Eingangsquellenlimits nicht aufsummiert werden und stattdessen `DCDC input power limit is ambiguous` gemeldet wird.
- `dcdc_two_converters_one_psu`: eine 12-V-PSU versorgt zwei DCDC-Wandler mit je einer 10-Ohm-Last. Dieser analytische Fall prueft, dass mehrere DCDC-Wandler an einer PSU erlaubt sind und die PSU gemeinsam ueber ihre Eingangsstromsenken belasten.
- `ws2814_single_feed_1m`: 1 m WS2814-24-V-Streifen mit Einspeisung am Anfang. Dieser Fall ist klein und eignet sich als Kalibrierung fuer LED-Kennlinie, LED-Serienwiderstaende und Wire-Ergebnisableitung.
- `ws2814_single_feed_10m`: 10 m WS2814-24-V-Streifen mit Einspeisung am Anfang. Dieser Fall prueft sichtbaren Spannungsabfall ueber den Streifen und die iterative LED-Stromberechnung.
- `ws2814_double_feed_10m`: 10 m WS2814-24-V-Streifen mit Einspeisung an Anfang und Ende. Dieser Fall prueft Stromaufteilung ueber mehrere Einspeisepfade und Start-/End-Spannungen am LED-Streifen.
- `ws2814_double_feed_10m_PSU_3A_Limit`: 10 m WS2814-24-V-Streifen mit Doppeleinspeisung und 3-A-PSU-Limit. Dieser Fall ist die Referenz fuer PSU-Ueberlast und Spannungsdegradation bei ueberschrittenem Stromlimit.

Diese LTspice-Faelle sollen fuer jede fachliche Aenderung am Modellaufbau, Solver, LED-Strommodell, Wire-Widerstand oder PSU-/DCDC-Ueberlastmodell verwendet werden. Ziel ist ein automatisierter Regressionstest, der `diagram.json` laedt, die Simulation mit den in `expected.json` definierten Einstellungen ausfuehrt und Pin-, Wire-, LED-Streifen- und optional Simulation-Check-Sollwerte innerhalb der angegebenen Toleranzen vergleicht.

Wichtig fuer automatische Tests: `expected.json` muss gueltiges JSON bleiben, Dezimalwerte muessen also mit Punkt geschrieben werden. Wenn einzelne Referenzen voruebergehend fachlich erwartete Abweichungen enthalten, sollen diese nicht geloescht, sondern mit Kommentar in einer separaten `notes.md` oder im Test-Report erklaert werden.

Automatische Ausfuehrung:

```text
npm run test:ltspice
```

Der Test-Harness liegt in `scripts/ltspiceRegression.ts` und wird ueber `scripts/runLtspiceRegression.mjs` mit esbuild fuer Node gebuendelt. Er verwendet den echten `runSimulation()`-Pfad, keine nachgebauten Testmodelle. Pin-Sollwerte werden ueber `nodeTechnicalID` und `handleId` zugeordnet. Wire-Sollwerte koennen direkt ueber `edgeId` oder ein Edge-Testlabel zugeordnet werden; solange die bestehenden Fixtures nur freie `label`-Texte in `expected.json` enthalten, werden die erwarteten Wires in Reihenfolge gegen die simulierten DC-Wires verglichen. Fuer neue Fixtures ist `edgeId` oder ein explizites Testlabel vorzuziehen. Erwartete Simulation-Checks koennen unter `expected.checkIssues` per `id`, `severity`, `title` und `descriptionIncludes` angegeben werden; sobald dieses Feld gesetzt ist, muss die Anzahl der tatsaechlichen Checks exakt passen.

Der Test darf waehrend der Solver-Entwicklung fehlschlagen. Ein Fehlschlag bedeutet dann: Die Testinfrastruktur funktioniert und zeigt, welche LTspice-Sollwerte noch nicht erreicht werden. Vor Solver-Aenderungen sollte der aktuelle Stand notiert werden; nach der Aenderung duerfen nur fachlich erklaerte Differenzen bleiben.

Optional:

- Gemeinsame Netzlogik aus `check/checkContext.ts` spaeter nach `src/netlist/` extrahieren.
- Wiring-Checks und Simulation verwenden dann dieselbe Netlist.

## Reihenfolge der Umsetzung

1. [x] Typen fuer Simulation definieren. Umgesetzt in `src/simulation/simulationTypes.ts`.
2. [x] `ComponentDataType` um optionale `simdata`-Struktur erweitern. Umgesetzt in `src/types.ts`.
3. [x] Elementare elektrische Elemente typisieren. Umgesetzt in `src/simulation/simulationTypes.ts` und `src/simulation/elementaryElements.ts`.
4. [x] Wire-Widerstandsmodell fuer Kupferleitungen inklusive AWG-Umrechnung definieren. Umgesetzt in `src/simulation/wireResistance.ts` und `src/simulation/awgToMm2.ts`.
5. [x] Erste `simdata`-Daten fuer wenige Komponenten eintragen. Umgesetzt fuer:
   - `Resistor`
   - `miniOTOFuse`
   - PSU-Komponenten inklusive `PSU_USB_WIRES` mit fester `5 V`-Ausgangsspannung und `DC_JACK_FEMALE` mit waehlbarer Ausgangsspannung
   - ein digitaler LED-Streifen
   - `WAGO_2x`
   - `WAGO_3x`
   - `MHC_V43`
   - `MHC_SwitchBoard`
   - `DCDC`
6. [x] `buildSimulationModel()` implementieren, noch ohne echten Solver. Umgesetzt in `src/simulation/buildSimulationModel.ts`.
7. [x] `SimulationPage` mit Buttons/Einstellungen und leerer Ergebnisliste bauen. Umgesetzt in `src/simulation/SimulationPage.tsx`.
8. [x] Ergebnis-Invalidierung per Fingerprint einbauen. Umgesetzt in `src/simulation/simulationFingerprint.ts` und `src/simulation/SimulationPage.tsx`.
9. [x] Simple Mock-/Deterministic-Simulation fuer Testdiagramme einbauen. Umgesetzt in `src/simulation/runSimulation.ts`.
10. [x] Overlay fuer Pin-Strom/Spannung anzeigen. Umgesetzt in `src/simulation/SimulationOverlay.tsx` und `src/simulation/simulationResultStore.ts`.
11. [x] Kleinen eigenen Dense-Solver fuer fruehe Tests implementieren. Umgesetzt in `src/simulation/denseLinearSystemSolver.ts`.
12. [x] Erste echte DC-Modelle und Solver nach `SOLVER.MD` ergaenzen. Umgesetzt als DC-Pipeline in `src/simulation/runSimulation.ts`: Wires, Widerstaende, Sicherungen, Spannungsquellen, einfache Stromquellen, konstante Power-Sinks, digitale LED-Serienwiderstaende und LED-Stromsenken werden gestempelt und mit `sparseLinearSystemSolver` geloest. Spannungsabhaengige digitale LED-Stroeme werden iterativ ueber die LED-Kennlinie aktualisiert.
13. [x] Simulation-Checks ergaenzen. Umgesetzt fuer Modellfehler wie fehlende Referenz, mehrere GND-Inseln, nicht simulierbare Komponenten an relevanten Netzen und widerspruechliche Spannungsquellen sowie Ergebnis-Checks fuer Quellenstromlimits, Sicherungs-Nennstroeme, Supply/GND-Pin-Spannungen und LED-Streifen-Min-/Max-Spannungen.
14. [x] LED-PhysLengths und virtuelle LED-Pin-Spannungen finalisieren. Umgesetzt im Modellaufbau: digitale LED-Streifen werden ueber `physLengths` segmentiert, interne LED-Elemente erzeugt und Start-/End-/Middle-Grenzen als `SimulationVirtualPin` mit `virtualPinResults` ausgegeben.
15. [x] Erste Simulation-Fixtures und erwartete Ergebniswerte in `simulation_test/` bauen. Umgesetzt mit LTspice-Referenzen unter `simulation_test/ltspice/`.
16. [x] PSU-Degradation bei ueberschrittenem Stromlimit implementieren. Umgesetzt in `src/simulation/runSimulation.ts`: Quellenstrom wird iterativ ausgewertet, die Zielspannung wird ueber `voltageDropPctAt150Current` reduziert, und konvergierte Ueberlast erzeugt weiterhin ein Simulations-Issue.
17. [x] Automatische Regressionstests fuer die LTspice-Referenzfaelle ergaenzen. Umgesetzt mit `npm run test:ltspice`, `scripts/ltspiceRegression.ts` und `scripts/runLtspiceRegression.mjs`.
18. [x] DCDC-Ueberlastmodell mit Eingangsleistungsmodell und degradierter Ausgangsspannung ergaenzen. Umgesetzt in `src/simulation/dcdcSimulation.ts` und `src/simulation/runSimulation.ts`, inklusive LTspice-/Analyse-Fixtures fuer Grundfall, festes Ausgangslimit, begrenzte Eingangsleistung, mehrdeutige Mehrquellen-Eingangsleistung und zwei DCDC-Wandler an einer PSU.
19. [x] Sparse-Solver fuer groessere LED-Streifen ergaenzen. Umgesetzt in `src/simulation/sparseLinearSystemSolver.ts`; `runSimulation()` nutzt diesen Solver fuer die MNA-Systeme.
20. [x] USB-Power-Pair-Typen, `usbPowerPair`-Ports und das allgemeine `diode`-Element ergaenzen. Umgesetzt in `src/simulation/simulationTypes.ts`, `src/simulation/elementaryElements.ts`, `src/components/catalog/validateComponent.ts` und `src/simulation/runSimulation.ts`.
21. [x] `PSU_USB` und alle Komponenten mit `usb_full` um explizite USB-Port- und USB-Versorgungs-`simdata` erweitern. Umgesetzt fuer `PSU_USB`, ESP8266-/ESP32-Controller und MHC-V43/V57.
22. [x] USB-Wires im Modellaufbau in VBUS- und GND-Leiter expandieren und aggregierte Wire-Ergebnisse erzeugen. Umgesetzt in `src/simulation/buildSimulationModel.ts`, `src/simulation/runSimulation.ts` und `src/simulation/SimulationOverlay.tsx`.
23. [x] Ideales Diodenmodell im Solver implementieren und Regressionstests fuer USB-Versorgung, VIN-Prioritaet und Rueckspeisung ergaenzen. Umgesetzt in `src/simulation/runSimulation.ts` und mit analytischen Fixtures unter `simulation_test/ltspice/usb_power_pair_controller`, `simulation_test/ltspice/usb_backfeed_blocked` und `simulation_test/ltspice/usb_missing_wire_parameters` abgesichert.
24. [x] USB-Wire-Presets `AWG24`, `AWG26` und `AWG28` in der Wire-UI anbieten; `AWG26` als Default fuer neue USB-Wires verwenden. Umgesetzt in `src/wires/wireDefaults.ts`, `src/App.tsx`, `src/components/GeneralComponent.tsx`, `src/wires/EditableWire.tsx` und `src/simulation/awgToMm2.ts`.

## Geklaerte Entscheidungen

1. `simdata.elements` wird kompakt, aber mit lesbaren Feldnamen wie `type`, `terminals` und `parameters` gehalten.
2. Erste Komponenten: `Resistor`, `miniOTOFuse`, PSU, digitaler LED-Streifen, `WAGO_2x`, `WAGO_3x`, `MHC_V43`, `MHC_SwitchBoard`, `DCDC`.
3. Strombegrenzung wird ueber iteratives nichtlineares Verhalten mit Spannungsreduktion geloest. In `simdata` wird dafuer `voltageDropPctAt150Current` gepflegt, nicht direkt ein `rDegradeOhm`.
4. PSU ist bis zum Limit ideal geregelt, kein Innenwiderstand vor dem Limit.
5. Sicherungswerte werden zuerst ueber lokale Tabellen direkt in `simdata` gepflegt.
6. LED-Stromkennlinien und LED-Streifen-Widerstandsvarianten in `src/simulation/ledStripSimulationOptions.ts`; `src/simulation/ledCurrentLookups.ts` stellt daraus die Solver-Kennlinien bereit.
7. `physLengths[i].length` ist Meter.
8. `_middle_N` entspricht `repeatIndex === N`; `physLengths.startIndex === N` markiert eine Abschnittsgrenze.
9. `_middle_N`-Spannung nur anzeigen, wenn `physLengths.startIndex === N` existiert.
10. `RGB-White`: RGB-Kanaele werden fuer Weiss gemeinsam angesteuert.
11. `Separate-White`: nur W-/WW-Kanal aktiv; zusaetzlich Modus fuer Separate White plus RGB White.
12. Analoge LED-Streifen haben pro Kanal separate PWM-Eingaenge.
13. PWM-Netze werden erstmal als DC-Netze behandelt.
14. Mehrere getrennte GND-Netze: robust abbrechen und Fehler anzeigen.
15. Kein GND-Netz: abbrechen und Fehler anzeigen.
16. Nicht simulierbare Komponenten in relevanten Strompfaden: Simulation abbrechen und Fehler anzeigen.
17. Fehlende Wire-Laenge oder Querschnitt: Simulation abbrechen und Check-Fehler erzeugen.
18. Andere Querschnittseinheiten: AWG per lokaler Tabelle nach `mm2` umrechnen.
19. `internalConnections` werden nicht automatisch in `simdata`-Bruecken uebersetzt.
20. Erste Grenzwerte: zu niedrige Spannung fuer alle angezeigten Supply/GND-Pin-Paare, Stromlimits und Sicherungen.
21. Strompfeile und Spannungslabels: sichtbare Overlay-Ebene mit Slotting und Hinweislinien gegen Ueberlappung.
22. Simulationsergebnisse bleiben bei Pan/Zoom sichtbar und werden automatisch neu positioniert.
23. `Delete simulation results` loescht auch Simulations-Check-Highlights.
24. Neue Simulation erzeugt keinen Undo-Snapshot.
25. Simulationseinstellungen sind nicht Undo-/Redo-faehig.
26. Diagrammaenderung loescht Ergebnisse sofort.
27. `Simulate` verwendet ein vorhandenes Diagramm-Check-Ergebnis, wenn dessen Diagramm-Fingerprint unveraendert ist.
28. Diagramm-Check-Warnungen blockieren die Simulation erstmal nicht; nur `error` blockiert.
29. Waehrend einer laufenden Simulation wird `simulationStatus = 'running'` angezeigt; der Nutzer sieht den Zustand im Sidebar-Statusbereich und optional als dezenten Busy-Indikator im Diagramm.
30. `SimulationParameterRef` verwendet kompakte Referenzen auf konstante Werte, Eingabefelder, Auswahlfelder und lokale Tabellen.
31. Field-Referenzen verweisen auf die `technicalID`/HID des Eingabefelds und uebernehmen dessen aktuellen Wert.
32. PSU und DCDC verwenden optional `voltageDropPctAt150Current`; Default ist `50`.
33. `voltageDropPctAt150Current = 50` bedeutet: Bei 150% des Stromlimits faellt die Ausgangsspannung auf 50% der Nominalspannung.
34. Die Anzahl logischer LEDs pro LED-Streifen-Abschnitt wird mit `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet; `lengthM` ist die Laenge dieses Abschnitts.
35. `ledsPerMeter` wird erstmal als festes Feld im ComponentType gepflegt und beschreibt physikalische RGB- bzw. RGBW-LED-Pakete pro Meter, nicht einzelne Farbchips.
36. `physLedsPerLogicLed` beschreibt, wie viele physikalische RGB/RGBW-LED-Pakete zu einer logischen LED gruppiert sind; beim `WS2814_24V_60LPM` sind es `6`, beim `FCOB_24V_784LPM` sind es `14` bei `196` RGBW-LED-Paketen pro Meter, und bei `FCOB_12V_720LPM`/`FCOB_24V_720LPM` sind es `12` bei `240` RGB-LED-Paketen pro Meter.
37. Serienwiderstaende digitaler LED-Streifen werden pro Meter angegeben und fuer das logische LED-Netzelement mit `resistanceOhmPerMeter * physLedsPerLogicLed / ledsPerMeter` umgerechnet. LED-Kennlinien-Stroeme bleiben pro physikalischem RGB/RGBW-LED-Paket angegeben und werden fuer das logische LED-Netzelement mit `physLedsPerLogicLed` multipliziert.
38. LED-Stromkennlinien liefern pro LED-Typ und Farbmodus den Strom in Abhaengigkeit von der lokalen LED-Spannung. Sie werden als auswaehlbare Varianten in `src/simulation/ledStripSimulationOptions.ts` zentral gepflegt; `currentCurve` wird beim Modellaufbau aus `ledSimulationOptionValues.currentCurve` zu einer Kennlinien-ID aufgeloest.
39. Analoge LED-Streifen werden in der ersten Simulation noch nicht umgesetzt, sondern spaeter ergaenzt.
40. Eine Komponente ohne `simdata` gilt als im relevanten Pfad, sobald mindestens ein Pin an einem `gnd`-, `supply`- oder `pwm`-Netz angeschlossen ist.
41. Pins, die durch Komponentenoptionen aktuell unsichtbar sind, werden ignoriert; elementare `simdata`-Elemente mit mindestens einem unsichtbaren Terminal werden fuer diese Konfiguration uebersprungen.
42. Die Wire-Toolbar speichert AWG als Zahlenwert in `physCrosssection` und die Einheit als `"AWG"` in `physCrosssectionUnit`.
43. Die normale Simulation-UI zeigt nur nutzerverstaendliche Zusammenfassungen; technische Modellstatistiken werden nur bei `SIMULATION_DEBUG === true` in die Console geschrieben.
44. Wire-Strom, Spannungsabfall und Widerstand sollen per Hover oder Select am Wire angezeigt werden.
45. Als erste konkrete Solver-Implementierung wird ein kleiner eigener Dense-Solver fuer fruehe Tests verwendet.
46. Mehrere Spannungsquellen mit unterschiedlicher Spannung im selben Supply/GND-System sind Diagramm-Check-Fehler; falls sie trotzdem auftreten, sind sie Simulationsfehler.
47. Bei Strom ueber 150% des PSU- oder DCDC-Limits bricht die Simulation ab und zeigt einen Fehler.
48. Erste Simulation-Fixtures werden in `simulation_test/` gebaut, sobald die relevanten Komponenten um `simdata` ergaenzt sind.
49. Nicht versorgte, aber ansonsten valide Teilnetze werden ignoriert und als Hinweis gemeldet.
50. USB-Power wird nicht aus Handle-Namen abgeleitet. Ein sichtbarer USB-Handle kann nur dann als VBUS/GND-Paar simuliert werden, wenn die Komponente einen expliziten `usbPowerPair`-Simulationsport definiert.
51. USB-Verbraucher werden ueber ein allgemeines ideales `diode`-Element mit `forwardVoltageV = 0.4` von `USB.VBUS` nach lokalem V+ versorgt; Rueckspeisung wird ideal gesperrt.
52. USB-Wire-Presets sind `AWG24`, `AWG26` und `AWG28`; `AWG26` ist der Default fuer neue bzw. bewusst migrierte USB-Wires.
