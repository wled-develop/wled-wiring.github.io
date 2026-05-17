# Konzept: DC-Stromfluss-Simulation

## Zielbild

Die Simulation soll aus dem aktuellen Diagramm ein elektrisches Simulationsmodell erzeugen, eine reine DC-Simulation ausfuehren und die Ergebnisse im Diagramm sowie im Sidebar-Bereich `Simulate current flow` anzeigen.

Voraussetzung fuer jede Simulation ist ein fehlerfreier Diagramm-Check. Wenn beim Klick auf `Simulate` noch Diagramm-Check-Meldungen mit Severity `error` existieren, startet die Simulation nicht. Stattdessen wird eine Meldung angezeigt, dass zuerst die Diagramm-Check-Meldungen korrigiert werden muessen.

Der erste Simulationsumfang ist bewusst begrenzt:

- Es werden nur `gnd`, `supply` und `pwm` Netze betrachtet.
- Es werden nur Komponenten simuliert, deren `data` eine `simdata`-Struktur enthaelt.
- Die Simulation ist zunaechst eine DC-/Mittelwertsimulation, keine Zeitbereichs-, Signalform- oder Protokollsimulation.
- Das Solver-Konzept ist separat in `SOLVER.MD` beschrieben.

Die grobe Pipeline:

1. Vorhandenes Diagramm-Check-Ergebnis pruefen, solange dessen Diagramm-Fingerprint unveraendert ist.
2. Bei Check-Fehlern mit Severity `error` abbrechen und Meldung anzeigen; Warnungen blockieren die Simulation erstmal nicht.
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

## Datenmodell: Komponenten

Nur Komponenten mit `data.simdata` werden in das Simulationsmodell aufgenommen.

Komponenten ohne `simdata` duerfen weiterhin im Diagramm existieren. Sie liefern aber keine elektrischen Bauteilgleichungen. Wenn sie zwischen simulierten Netzen liegen und dadurch ein relevanter Strompfad nicht modelliert werden kann, erzeugt der Modellaufbau einen Simulationsfehler und bricht ab. Dadurch werden unvollstaendige Ergebnisse nicht als vertrauenswuerdig angezeigt.

Wenn `data.simdata` definiert, aber leer ist, bedeutet das: Die Komponente ist fuer die Simulation bekannt, enthaelt aber keine elementaren elektrischen Elemente. Sie kann beim Erzeugen der Gleichungen ignoriert werden. Das ist nuetzlich fuer Komponenten, die nur mechanisch, informativ oder rein verbindend im Diagramm vorkommen, ohne eigenes elektrisches Modell.

Komponentenoptionen koennen sichtbare Pins beeinflussen. Pins, die durch `hideConditions` aktuell nicht sichtbar sind, werden im Simulationsmodell ignoriert. Wenn ein elementares `simdata`-Element auf mindestens einen solchen unsichtbaren Pin verweist, wird dieses gesamte Element fuer die aktuelle Komponentenkonfiguration ignoriert. Das ist kein Simulationsfehler, sondern bedeutet, dass die optionale Funktion gerade nicht aktiv ist. Verweist ein Element dagegen auf einen Handle, der in der Komponente gar nicht existiert, bleibt das ein Simulationsfehler.

Vorgeschlagene Erweiterung von `ComponentDataType`:

```ts
simdata?: ComponentSimulationDefinition;
```

Konzeptionelle Struktur:

```ts
type ComponentSimulationDefinition = {
  version: 1;
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
    | 'dcdcConverter';
  terminals: Record<string, string>;
  parameters?: Record<string, SimulationParameterRef>;
};
```

Dabei gilt:

- `type` ist der elementare Elementtyp.
- `terminals` mappt Elementterminals auf `hid`s der Komponente.
- `parameters` enthaelt Parameter, feste Werte, Field-Referenzen oder Lookup-Definitionen.

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
  | {lookup: string; by: SimulationParameterRef; default?: number}
  | {table: Record<string, number>; by: SimulationParameterRef; default?: number}
  | {ledLookup: string; colorMode: 'settings.ledColorMode'};
```

Dabei gilt:

- `{field: "source_voltage"}` verweist auf die `technicalID`/HID eines Eingabefelds der Komponente und uebernimmt dessen aktuellen Wert.
- `{select: "Fuse"}` verweist auf die `technicalID`/HID eines Auswahlfelds der Komponente.
- `{lookup: "miniOtoResistanceByCurrent", by: {select: "Fuse"}}` verweist auf eine in `simdata` definierte Lookup-Tabelle.
- `{table: {"5": 0.01, "10": 0.006}, by: {select: "Fuse"}, default: 0.01}` erlaubt kleine lokale Tabellen direkt im Element.
- `{ledLookup: "WS2814_24V", colorMode: "settings.ledColorMode"}` verweist auf eine LED-Stromtabelle in `src/simulation/ledCurrentLookups.ts`. Der LED-Typ wird separat ueber den Parameter `ledType` des `digitalLed`-Elements angegeben und wird nicht im `currentLookup` gedoppelt.
- `default` wird verwendet, wenn ein Feld fehlt oder eine Lookup-Tabelle keinen passenden Eintrag hat. Fehlt auch `default`, erzeugt der Modellaufbau einen Simulationsfehler.

Die Simulation sollte nicht aus `technicalID` allein raten muessen. `technicalID` darf zur Auswahl eines Modelladapters oder fuer Defaults dienen, aber die explizite `simdata`-Struktur ist die Freigabe, dass eine Komponente simuliert wird.

`internalConnections` werden nicht automatisch in Kurzschlussbruecken uebersetzt. Interne Bruecken, Sicherungen oder andere Simulationselemente muessen explizit in `simdata` beschrieben werden. `internalConnections` und `simdata` duerfen inhaltlich aehnlich sein, bleiben aber getrennte Konzepte.

## Elementare elektrische Elemente

Die Simulation wird aus elementaren elektrischen Elementen aufgebaut. Komponenten verwenden diese Elemente in ihrer `data.simdata`-Struktur. Dadurch koennen viele Komponenten ohne Spezialcode beschrieben werden.

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
- Lookup-Funktion in Abhaengigkeit von einem Eingabe- oder Auswahlfeld

Beispiele:

- `Resistor`: ein elementarer Widerstand zwischen den beiden Pins.
- `miniOTOFuse`: ein elementarer Widerstand, dessen Wert aus einer Lookup-Tabelle anhand des Sicherungs-Nominalwerts bestimmt wird.
- `MHC_V43`: ein Widerstand zwischen `VIN` und `VOUT`, um die Sicherung zu modellieren.

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

Beispiel:

- `PSU`: Spannungsquelle zwischen Supply-Ausgang und GND, Spannung aus `source_voltage`, Stromlimit aus `source_current`, `voltageDropPctAt150Current` aus `simdata` oder Default `50`.
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

Beispiel:

- `MHC_V43`: Konstantleistungssenke zwischen `VIN` und `GND1` mit `powerW = 0.5`, um einen kleinen Nebenverbrauch des Controllers zu simulieren.

### Digitales LED-Netzelement

Das digitale LED-Netzelement modelliert genau eine logische LED eines digitalen LED-Streifens. Eine logische LED kann je nach Streifen aus einer oder mehreren physikalischen LEDs bestehen. Diese Gruppierung wird ueber `physLedsPerLogicLed` beschrieben.

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
- Lookup-Tabelle fuer Strom bei Farbe `R` in Abhaengigkeit der lokalen LED-Spannung
- Lookup-Tabelle fuer Strom bei Farbe `G` in Abhaengigkeit der lokalen LED-Spannung
- Lookup-Tabelle fuer Strom bei Farbe `B` in Abhaengigkeit der lokalen LED-Spannung
- Lookup-Tabelle fuer Strom bei Farbe `RGB-White` in Abhaengigkeit der lokalen LED-Spannung
- Lookup-Tabelle fuer Strom bei Farbe `Separate-White` in Abhaengigkeit der lokalen LED-Spannung
- Lookup-Tabelle fuer Strom bei Kombination `Separate-White + RGB-White` in Abhaengigkeit der lokalen LED-Spannung

`ledsPerMeter` beschreibt die Anzahl physikalischer LEDs pro Meter. `physLedsPerLogicLed` beschreibt, wie viele physikalische LEDs zu einer logischen LED zusammengefasst sind. Die Werte in `simdata` bleiben pro physikalischer LED angegeben: `supplyResistanceOhm`, `gndResistanceOhm` und der Strom aus der Lookup-Tabelle werden fuer das digitale LED-Netzelement mit `physLedsPerLogicLed` multipliziert. Der Stromwert der LED-Stromsenke wird also aus der passenden Lookup-Tabelle bestimmt, mit der Helligkeit skaliert und danach fuer die logische LED entsprechend der Gruppierung hochskaliert.

`RGB-White` bedeutet elektrisch: Die RGB-Kanaele werden so angesteuert, dass Weiss entsteht. `Separate-White` bedeutet: Nur der W-/WW-Kanal ist aktiv, RGB ist aus. Zusaetzlich soll ein Modus fuer `Separate-White + RGB-White` vorgesehen werden.

Lookup-Tabellen fuer LED-Streifen werden pro LED-Typ in `src/simulation/ledCurrentLookups.ts` gepflegt. Fuer jeden Farbmodus liefern sie den Strom in Abhaengigkeit von der lokalen LED-Spannung. Die Auswertung interpoliert linear zwischen Tabellenpunkten und skaliert danach mit der Helligkeit `0..1`. Fuer Sicherungen werden Lookup-Tabellen vorerst direkt in `simdata` gepflegt; das betrifft anfangs `miniOTOFuse` und `MHC_V43`.

Beispiel fuer `digitalLed`-Parameter:

```ts
parameters: {
  supplyResistanceOhm: 0.002,
  gndResistanceOhm: 0.002,
  ledType: "WS2814_24V",
  ledsPerMeter: 60,
  physLedsPerLogicLed: 6,
  currentLookup: {
    ledLookup: "WS2814_24V",
    colorMode: "settings.ledColorMode",
  },
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
- Widerstandswert per Lookup aus Sicherungs-Nominalwert
- Lookup direkt in `simdata`
- Simulations-Check bei Strom ueber Nominalwert

`PSU`:

- eine konstante Spannungsquelle mit Stromlimit und `voltageDropPctAt150Current`
- negative Quelle an GND
- positive Quelle an Supply-Ausgang
- mehrere Kurzschlussbruecken, um mehrere Supply-Ausgaenge und mehrere GND-Ausgaenge intern zu verbinden
- Check-Fehler, wenn Stromlimit ueberschritten wird

Digitale LED-Streifen:

- Parameter `ledsPerMeter` erstmal als festes Feld im ComponentType; der Wert beschreibt physikalische LEDs pro Meter
- Parameter `physLedsPerLogicLed` beschreibt die Gruppierung physikalischer LEDs zu einer logischen LED
- `physLengths[i].length` ist verbindlich in Metern
- pro Abschnitt wird aus `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet, wie viele logische LEDs der Abschnitt hat; `lengthM` ist dabei die Laenge dieses LED-Streifen-Abschnitts
- fuer jede logische LED wird ein digitales LED-Netzelement in Reihe erzeugt
- Serienwiderstaende werden pro physikalischer LED angegeben und fuer das logische LED-Netzelement mit `physLedsPerLogicLed` multipliziert
- dadurch koennen Spannungen an einzelnen `_middle_N`-Pins berechnet werden

`WAGO_2x` und `WAGO_3x`:

- Kurzschlussbruecken zwischen den Klemmenpins

`MHC_V43` Controller:

- Widerstand zwischen `VIN` und `VOUT`, um die Sicherung zu modellieren
- Widerstandswert und Sicherungsgrenzwert per Lookup direkt in `simdata`
- Kurzschlussbruecken zwischen den GND-Pins
- Konstantleistungssenke zwischen `VIN` und `GND1` mit `0.5 W` fuer kleinen Controller-Nebenverbrauch

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

Nicht versorgte, aber ansonsten valide Teilnetze werden ignoriert und als Hinweis gemeldet. Das betrifft z.B. lose passive Teilnetze oder nicht angeschlossene Teilbereiche ohne Quelle. Die Simulation des versorgten Hauptnetzes darf dadurch weiterlaufen.

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

Simulationsergebnisse werden nicht exportiert. Sie bleiben reiner Laufzeit-/UI-State und werden nicht in das Diagramm-JSON geschrieben. Dadurch bleiben Exportdateien deterministisch und enthalten nur das bearbeitbare Schaltungsmodell, nicht die zuletzt berechnete Auswertung.

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
- Die Werte werden als Simulationsergebnis gespeichert, aber noch nicht dauerhaft einzeln im Diagramm angezeigt.
- Die spaetere Detailanzeige fuer einzelne LED-Netzelemente wird separat definiert.

Aus allen `deltaVoltageV`-Werten eines LED-Streifens wird zusaetzlich eine Zusammenfassung berechnet:

- `minDeltaVoltageV = Math.min(...deltaVoltageV)`
- Anzeigeformat im Diagramm: `ΔVmin=2.22V`
- Diese Anzeige wird zusammen mit den anderen Simulationsergebnissen angezeigt.

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
- Fuer die Differenzanzeige wird ein leicht versetzter Spannungspfeil vom Supply-Pin zum GND-Pin gezeichnet. Das Label wird als `ΔV=0.15V` angezeigt und per Hinweispfeil mit der Mitte dieses Spannungspfeils verbunden.
- Zusaetzlich wird fuer den gesamten LED-Streifen die minimale interne LED-Netzelement-Differenzspannung angezeigt. Das Label wird als `ΔVmin=2.22V` formatiert.
- Die `ΔVmin`-Anzeige wird erst nach allen Strom-, Spannungs- und Spannungsdifferenzanzeigen platziert, damit sie deren bereits belegte Bereiche beruecksichtigen kann.
- Fuer die Platzierung wird zuerst eine Position nahe der Mitte der LED-Komponente bewertet. Wenn dort bereits viele Anzeigen liegen oder Ueberdeckungen entstehen, werden weitere Kandidaten entlang des LED-Streifens bewertet und die Position mit mehr freiem Platz gewaehlt.
- Von der `ΔVmin`-Anzeige fuehrt ein Hinweispfeil auf kuerzestem Weg zum LED-Streifen. Der Hinweispfeil endet am Komponentenrand und nicht in der Mitte des Streifens.

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
- Je Abschnitt wird aus `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` die Anzahl logischer LEDs berechnet; `lengthM` ist die Laenge dieses LED-Streifen-Abschnitts, `ledsPerMeter` meint physikalische LEDs pro Meter.
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
- Zusaetzlich wird fuer ein LED-Supply/GND-Pin-Paar eine Spannungsdifferenz angezeigt: Ein Spannungspfeil wird leicht versetzt vom Supply-Pin zum zugeordneten GND-Pin gezeichnet. Ueber oder unter dem LED-Streifen wird eine Delta-Anzeige platziert, z.B. `ΔV=0.15V`. Von dieser Anzeige fuehrt ein Hinweispfeil zur Mitte des Spannungspfeils.
- Fuer LED-Streifen wird zusaetzlich `ΔVmin=2.22V` angezeigt. Diese Anzeige fasst die kleinste lokale Differenzspannung aller intern erzeugten LED-Netzelemente des Streifens zusammen. Sie wird als letzte Simulationsergebnis-Anzeige platziert, bevorzugt nahe der Streifenmitte und bei Platzmangel entlang des Streifens verschoben. Der Hinweispfeil endet auf kuerzestem Weg am Komponentenrand.
- An `SolderJoint`-Komponenten werden Spannungen angezeigt, aber keine Stroeme.
- Spannungsanzeigen sollen so platziert werden, dass sie keine Pins bzw. Handle-Bereiche, Wires oder andere Spannungs- oder Stromanzeigen ueberdecken.

Wire-Anzeige:

- Im Overlay wird pro Wire dauerhaft der Wire-Strom mit Richtungspfeil angezeigt, solange keine Wire selektiert ist.
- Beim Hover ueber eine Wire wird nahe der Hover-Position eine zusaetzliche Wire-Stromanzeige mit Richtungspfeil und Hinweislinie angezeigt. Wenn der Hover nahe an der normalen Wire-Stromanzeige liegt, wird diese zusaetzliche Anzeige unterdrueckt.
- Beim Select/Klick auf eine Wire wird das Simulation-Overlay ausgeblendet.
- Spannungsabfall und berechneter Widerstand koennen spaeter in der Wire-Toolbar oder in einem kleinen Tooltip angezeigt werden, nicht als dauerhaftes Label auf jedem Wire.
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
- Spannung am LED-Streifen unter Mindestspannung.
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

## UI-Konzept: Simulate current flow

Sidebar-Panel ersetzt den aktuellen `comingSoon`-Text.

Elemente:

1. Einstellungen
   - LED-Farbmodus als Select/Segmented Control
   - Helligkeit als Slider + Prozentanzeige
2. Button `Simulate`
   - prueft vorhandenen Diagramm-Check-Status und Fingerprint
   - baut Modell
   - fuehrt Simulation aus
   - startet Checks
   - setzt `simulationResult`
   - setzt waehrenddessen `simulationStatus = 'running'`
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

Debug-Modus:

- Der Simulationsbereich hat einen Code-Schalter `SIMULATION_DEBUG`, der standardmaessig `false` ist.
- Wenn `SIMULATION_DEBUG === true`, schreibt die Simulation technische Debug-Informationen in die Browser-Console.
- Sinnvolle Debug-Ausgaben sind: Diagramm-Fingerprint, Einstellungen, Status, Anzahl Diagramm-Komponenten, Anzahl simulierbarer Komponenten, Check-Netze, Circuit-Nodes, simulierte Wires, elementare Simulationselemente, Pins, virtuelle Pins, Pin-/Wire-Ergebnisse und Simulationsmeldungen.
- Diese Informationen sind nur fuer Entwicklung und Tests gedacht und duerfen normale Nutzer nicht in der UI verwirren.

## Empfohlene Modulstruktur

Vorschlag:

```text
src/simulation/
  simulationTypes.ts
  buildSimulationModel.ts
  runSimulation.ts
  simulationDebug.ts
  simulationChecks.ts
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
   - PSU-Komponenten inklusive `PSU_USB_WIRES` mit fester `5 V`-Ausgangsspannung
   - ein digitaler LED-Streifen
   - `WAGO_2x`
   - `WAGO_3x`
   - `MHC_V43`
   - `DCDC`
6. [x] `buildSimulationModel()` implementieren, noch ohne echten Solver. Umgesetzt in `src/simulation/buildSimulationModel.ts`.
7. [x] `SimulationPage` mit Buttons/Einstellungen und leerer Ergebnisliste bauen. Umgesetzt in `src/simulation/SimulationPage.tsx`.
8. [x] Ergebnis-Invalidierung per Fingerprint einbauen. Umgesetzt in `src/simulation/simulationFingerprint.ts` und `src/simulation/SimulationPage.tsx`.
9. [x] Simple Mock-/Deterministic-Simulation fuer Testdiagramme einbauen. Umgesetzt in `src/simulation/runSimulation.ts`.
10. [x] Overlay fuer Pin-Strom/Spannung anzeigen. Umgesetzt in `src/simulation/SimulationOverlay.tsx` und `src/simulation/simulationResultStore.ts`.
11. [x] Kleinen eigenen Dense-Solver fuer fruehe Tests implementieren. Umgesetzt in `src/simulation/denseLinearSystemSolver.ts`.
12. [x] Erste echte DC-Modelle und Solver nach `SOLVER.MD` ergaenzen. Umgesetzt als erste lineare DC-Pipeline in `src/simulation/runSimulation.ts`: Wires, Widerstaende, Sicherungen, Spannungsquellen, einfache Stromquellen, konstante Power-Sinks, digitale LED-Serienwiderstaende und LED-Stromsenken werden gestempelt und mit `denseLinearSystemSolver` geloest. Nichtlineare Iterationen fuer PSU-/DCDC-Degradation und spannungsabhaengige LED-Stroeme bleiben Folgearbeit.
13. [x] Simulation-Checks ergaenzen. Umgesetzt fuer Modellfehler wie fehlende Referenz und widerspruechliche Spannungsquellen sowie Ergebnis-Checks fuer Quellenstromlimits und Sicherungs-Nennstroeme.
14. [x] LED-PhysLengths und virtuelle LED-Pin-Spannungen finalisieren. Umgesetzt im Modellaufbau: digitale LED-Streifen werden ueber `physLengths` segmentiert, interne LED-Elemente erzeugt und Start-/End-/Middle-Grenzen als `SimulationVirtualPin` mit `virtualPinResults` ausgegeben.
15. Erste Simulation-Fixtures und erwartete Ergebniswerte in `simulation_test/` bauen, sobald die relevanten Komponenten um `simdata` ergaenzt sind.

## Geklaerte Entscheidungen

1. `simdata.elements` wird kompakt, aber mit lesbaren Feldnamen wie `type`, `terminals` und `parameters` gehalten.
2. Erste Komponenten: `Resistor`, `miniOTOFuse`, PSU, digitaler LED-Streifen, `WAGO_2x`, `WAGO_3x`, `MHC_V43`, `DCDC`.
3. Strombegrenzung wird ueber iteratives nichtlineares Verhalten mit Spannungsreduktion geloest. In `simdata` wird dafuer `voltageDropPctAt150Current` gepflegt, nicht direkt ein `rDegradeOhm`.
4. PSU ist bis zum Limit ideal geregelt, kein Innenwiderstand vor dem Limit.
5. Sicherungs-Lookups zuerst direkt in `simdata`.
6. LED-Lookups pro LED-Typ in `src/simulation/ledCurrentLookups.ts`.
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
30. `SimulationParameterRef` verwendet kompakte Referenzen auf konstante Werte, Eingabefelder, Auswahlfelder und Lookup-Tabellen.
31. Field-Referenzen verweisen auf die `technicalID`/HID des Eingabefelds und uebernehmen dessen aktuellen Wert.
32. PSU und DCDC verwenden optional `voltageDropPctAt150Current`; Default ist `50`.
33. `voltageDropPctAt150Current = 50` bedeutet: Bei 150% des Stromlimits faellt die Ausgangsspannung auf 50% der Nominalspannung.
34. Die Anzahl logischer LEDs pro LED-Streifen-Abschnitt wird mit `round(lengthM * ledsPerMeter / physLedsPerLogicLed)` berechnet; `lengthM` ist die Laenge dieses Abschnitts.
35. `ledsPerMeter` wird erstmal als festes Feld im ComponentType gepflegt und beschreibt physikalische LEDs pro Meter.
36. `physLedsPerLogicLed` beschreibt, wie viele physikalische LEDs zu einer logischen LED gruppiert sind; beim `WS2814_24V_60LPM` sind es `6`.
37. Serienwiderstaende digitaler LED-Streifen und LED-Lookup-Stroeme werden pro physikalischer LED angegeben und fuer das logische LED-Netzelement mit `physLedsPerLogicLed` multipliziert.
38. LED-Lookup-Tabellen liefern pro LED-Typ und Farbmodus den Strom in Abhaengigkeit von der lokalen LED-Spannung. Sie werden in `src/simulation/ledCurrentLookups.ts` zentral gepflegt; `currentLookup` enthaelt nur Lookup-ID und Farbmodus-Referenz, nicht nochmal den LED-Typ.
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
