# Konzept: Leitungsquerschnitt gegen Quellen und Sicherungen pruefen

Stand: 2026-05-31

Dieses Dokument bewertet die vorgeschlagene Diagramm-Check-Erweiterung fuer Leitungsquerschnitte und beschreibt ein kompatibles Umsetzungskonzept. Die Aufgabe stammt aus `Docs/Aufgabe1.txt`.

## Kurzfazit

Das Konzept ist elektrotechnisch sinnvoll, wenn es als konservative Plausibilitaetspruefung formuliert wird und nicht als normativer Nachweis. Der Kern ist richtig: Eine Leitung muss gegen den maximal moeglichen Fehlerstrom abgesichert sein. Vor einer Sicherung begrenzt typischerweise die Quelle bzw. deren Stromlimit den Fehlerstrom. Hinter einer Sicherung begrenzt die Sicherung den zulaessigen Dauer-/Fehlerstrom. GND-/Rueckleiter sollten in der Regel denselben Strom wie die zugehoerigen Versorgungsleiter tragen koennen.

Die vorhandene Implementierung passt grundsaetzlich gut dazu:

- Wires besitzen bereits `physCrosssection` und `physCrosssectionUnit`.
- `normalizeWireCrosssectionToMm2()` existiert bereits in `src/simulation/wireResistance.ts`.
- Power-Netze werden bereits ueber `suppl_net_type`, `gnd_net_type` und `componentLinkedElementaryBasedNets` abgebildet.
- `componentLinkedElementaryBasedNets` behalten Sicherungen als Netzgrenze und erben inzwischen `suppl_net_type`, wenn sie Teil eines versorgten Component-Linked Nets sind.
- Sicherungen sind in `internalConnections.kind === "fuse"` modelliert; die separate `miniOTOFuse`-Komponente nutzt ebenfalls diese interne Fuse-Verbindung.
- Quellen haben das Feld `source_current` und Simulationselemente nutzen dieses Feld bereits als Stromlimit.

Wichtig: Die Pruefung darf keine Laststroeme schaetzen. Sie prueft ausschliesslich, ob eine Leitung durch Quelle oder Sicherung gegen Ueberstrom begrenzt ist. Das ist mit den Projektgrenzen kompatibel, weil keine heuristische Lastannahme eingefuehrt wird.

## Elektrotechnische Bewertung

### Sinnvolle Annahmen

1. `source_current` wird als maximaler dauerhafter bzw. abschaltrelevanter Quellenstrom verstanden.
2. Fuer Leitungen direkt an der Quelle wird mit `1.25 * source_current` gerechnet. Das ist konservativ, weil viele Netzteile kurzzeitig oder dauerhaft oberhalb des Nennwerts liefern koennen, bevor sie begrenzen oder abschalten.
3. Hinter einer Sicherung wird der Sicherungsnennwert als Schutzgrenze verwendet.
4. Bei mehreren Sicherungen in Reihe ist ein Pfad ausreichend geschuetzt, wenn mindestens eine Sicherung auf diesem Pfad einen Nennwert kleiner oder gleich der Leitungstragfaehigkeit hat.
5. Bei mehreren Einspeisepfaden ist eine Leitung unsicher, wenn mindestens ein moeglicher Pfad zur Quelle nicht ausreichend begrenzt ist. Ein einziger unsicherer Parallelpfad reicht fuer eine Meldung.
6. GND-/Rueckleiter werden gegen die zugehoerigen Supply-Leiter verglichen, weil sie im Normalbetrieb denselben Laststrom fuehren koennen.

### Grenzen der Aussage

Die Tabellenwerte sind eine technische Plausibilitaetsbasis, aber kein Ersatz fuer Normen, Verlegebedingungen, Buendelung, Kontaktqualitaet, Leitungsmaterial, Umgebung, Leitungstyp oder Herstellerdaten. Die UI- und Meldungstexte sollten deshalb klar sagen: "pruefen" bzw. "in der Regel", nicht "ist normgerecht".

Die vorgeschlagenen Werte enthalten nur Kupferleiter. Falls spaeter Aluminium, spezielle Litzen, Leiterplattenbahnen oder Kabelbaeume modelliert werden, braucht das eigene Daten.

## Datenbasis fuer Stromtragfaehigkeit

Neue Datei empfohlen:

- `src/wires/wireAmpacity.ts`

Inhalt:

- Tabellen fuer metrische Querschnitte und AWG.
- Temperaturfaktoren.
- Funktionen:
  - `normalizeWireCrosssectionToMm2()` weiter aus `src/simulation/wireResistance.ts` nutzen.
  - `wireAmpacityA(crosssection, unit, installation, ambientTempC): AmpacityResult`.
  - `requiredCrosssectionForCurrentA(currentA, installation, ambientTempC, unitPreference)` optional fuer Empfehlungen.

Installationsarten:

- `surface`: Auf Oberflaeche
- `conduit`: In Elektrorohr
- `insulatedWall`: In waermegedaemmter Wand

Default:

- `installation = "surface"`
- `ambientTempC = 25`

Temperatur:

- Exakte Tabellenwerte direkt verwenden.
- Zwischenwerte linear interpolieren, weil Temperatur ein kontinuierlicher Parameter ist.
- Werte ausserhalb 10..60 Grad Celsius auf den Tabellenbereich klemmen oder in der UI begrenzen. Empfehlung: UI begrenzt 10..60 Grad, damit die Check-Logik keine Extrapolation braucht.

AWG:

- Fuer Ampacity die vorgegebenen US-AWG-Tabellen direkt verwenden.
- Falls eine Wire eine AWG-Groesse hat, die weder in der US-AWG-Tabelle noch in den expliziten USB-Sonderwerten vorkommt, keine Interpolation ueber AWG raten. In diesem Fall keine Ampacity-Fehlmeldung erzeugen; die Wire gilt fuer diese Regel als nicht auswertbar und wird ueber die vorhandenen physikalischen Wire-Daten-Diagnosen sichtbar.
- AWG26 und AWG28 werden explizit unterstuetzt, weil diese Groessen als USB-Presets existieren:
  - AWG26: `1.3 A`
  - AWG28: `0.85 A`
- Diese beiden Werte gelten unabhaengig von Leitungsverlegung und Umgebungstemperatur, weil sie fuer USB-Kabelleiter als Sonderfall verstanden werden. Sie werden nicht aus den allgemeinen Einzelader-Tabellen interpoliert.

## Settings und UI

Die Check-Regel braucht globale Diagramm-Einstellungen:

```ts
export type WireAmpacitySettings = {
  installation: "surface" | "conduit" | "insulatedWall";
  ambientTempC: number;
};
```

Empfohlene Ablage:

- Die Einstellung wird diagrammspezifisch im Diagramm-Export gespeichert.
- Empfohlene Export-Struktur:

```ts
type DiagramExportModel = {
  nodes?: Node<ComponentDataType>[];
  edges?: Edge<EdgeDataType>[];
  application?: {
    version?: number;
    name?: string;
    url?: string;
  };
  checkSettings?: {
    wireAmpacity?: WireAmpacitySettings;
  };
};
```

- Wenn ein altes Diagramm keine `checkSettings.wireAmpacity` enthaelt, gelten die Defaults `surface` und `25`.
- Optional kann die UI den zuletzt verwendeten Wert waehrend der laufenden Sitzung halten; fachlich massgeblich ist aber der Export, nicht ein rein globaler `localStorage`-Wert.

Integration:

- `runDiagramCheck(jsonData, options?)` um optionale Check-Einstellungen erweitern.
- `DiagramCheckPage` liest `WireAmpacitySettings` und uebergibt sie an `runDiagramCheck`.
- `createDiagramCheckContext()` kann die Einstellungen entweder direkt bekommen oder die neue Regel bekommt sie separat. Empfehlung: Einstellungen nicht in jeden Net-Builder stecken, sondern nur in `runNetworkRules(context, settings)`.

Sidebar:

- In `src/sidebar/ToolsPage.tsx` einen Button mit Icon, z.B. `SettingOutlined`, und Text `sidebar.tools.wireInstallationButton`.
- Button oeffnet eine kleine Modal- oder Drawer-Ansicht.
- Controls:
  - Select fuer Leitungsverlegung.
  - InputNumber oder Slider fuer Umgebungstemperatur 10..60 Grad Celsius.
  - Default-Anzeige: Auf Oberflaeche, 25 Grad Celsius.
- Alle Texte in `src/translations/de.json`, `en.json`, `zh.json` ergaenzen.

## Neue Check-Regeln

Empfohlene Rule-IDs:

- `sourceWireCrossSectionTooSmall`
- `unfusedSupplyWireCrossSectionTooSmall`
- `fusedSupplyWireCrossSectionTooSmall`
- `ledSupplyInputNotAdequatelyProtected`
- `componentGroundWireCrossSectionSmallerThanSupply`
- `ledGroundWireCrossSectionSmallerThanSupply`
- `connectorGroundWireCrossSectionSmallerThanBranch`

Alle Regeln sollten von `wireWithoutPhysicalParameters` bzw. nicht auswertbaren Querschnitten unterdrueckt oder nicht erzeugt werden. Wenn Querschnitt fehlt, ist die korrekte Meldung zuerst: physikalische Wire-Daten fehlen.

Keine neue Diagnose fuer nicht auswertbare Sicherungsnennwerte einfuehren. Dafuer wird die vorhandene Komponentendiagnose `fuseCurrentMissingOrUnderspecified` verwendet.

Severity:

- Regeln 1 bis 4: `error`, weil Leitungen oder LED-Supply-Eingaenge nicht ausreichend gegen Ueberstrom begrenzt sind.
- Regeln 5 bis 7: `warning`, weil es eine fachlich wichtige Rueckleiter-Plausibilitaet ist, aber ohne reale Verlegung und Lastverteilung false positives moeglich sind.

Vergleichstoleranz:

- Alle Ampacity-Grenzvergleiche verwenden `0.01 A` Toleranz.
- Eine Wire ist zu klein, wenn `ampacityA + 0.01 < requiredA`.
- Eine Sicherung gilt fuer Regel 3 als passend klein, wenn `nominalCurrentA <= ampacityA + 0.01`.

## Gemeinsame Hilfsmodelle

Empfohlene interne Datentypen:

```ts
type AmpacityEvaluatedWire = {
  edge: Edge<EdgeDataType>;
  ampacityA: number;
  crosssectionMm2: number;
};

type SourceLimit = {
  nodeId: string;
  sourceCurrentA: number;
  requiredCurrentA: number; // 1.25 * sourceCurrentA
};

type FuseBoundary = {
  nodeId: string;
  fromHandleId: string;
  toHandleId: string;
  fromNetId: string;
  toNetId: string;
  nominalCurrentA?: number;
};
```

Hilfsfunktionen:

- `getNodeFieldNumber(node, "source_current")`
  - Runtime-Nodes nutzen `inputFields[].technicalID`.
  - Komponentenquellen verwenden in den Core-Dateien teils `id`; diese sind zur Laufzeit normalisiert.
- `resolveFuseNominalCurrentA(node, connection)`
  - Zuerst `connection.nominalCurrent`.
  - Danach `connection.nominalCurrentField`.
  - Feld in `inputFields` oder `selectFields` suchen.
  - Bei `selectFields` ist `selectedValue` bereits numerisch und kann direkt als Ampere-Wert verwendet werden, sofern das Komponentenmodell so gepflegt ist.
- `netForEdge(edge, nets)`
  - Fuer Supply-Sicherungslogik: `componentLinkedElementaryBasedNets`.
  - Fuer allgemeine vorhandene Network Rules bleibt `componentLinkedNets`.
- `isPureConnector(node)`
  - `SolderJoint`, `WAGO_2X`, `WAGO_3X`.
- `isDigitalLedStrip(node)`
  - `node.data.group === "led"` und mindestens ein sichtbarer Handle hat eine digitale LED-Signalfunktion wie `dig_in`, `dig_out`, `dig_clock_in`, `dig_clock_out`, `dig_backup_in` oder `dig_backup_out`.
  - Dadurch werden nur digitale LED-Strips fuer die LED-Supply-Eingangsregel betrachtet; analoge LED-Komponenten werden nicht ohne ausdrueckliche Entscheidung einbezogen.

## Regel 1: Leitung direkt an Energiequelle

Ziel:

Eine Wire in einem Supply- oder GND-Zusammenhang ist zu duenn, wenn sie direkt an eine Quelle mit `source_current` angeschlossen ist und ihre Stromtragfaehigkeit kleiner als `1.25 * source_current` ist.

Praezise Erkennung:

1. Sammle alle Komponenten mit numerischem `source_current > 0`.
2. Bestimme deren sichtbare Source-Handles:
   - Supply-Ausgaenge: Handles mit `suppl_out` oder `usb_power_out`.
   - GND-Handles: Handles mit `gnd`, wenn dieselbe Komponente eine Energiequelle ist.
3. Direkte Source-Wires:
   - Edge ist direkt an einem dieser Handles angeschlossen.
   - Supply- und USB-Edges liegen in einem `component-linked-elementary-based` Netz mit `suppl_net_type` bzw. `usb_net_type`.
   - GND-Edges liegen in einem `elementary` Netz mit `gnd_net_type`.
4. Erweiterung fuer Supply ueber reine Verbindungselemente:
   - Starte vom Supply-Source-Handle.
   - Folge nur Wires und pure Connector-Komponenten (`SolderJoint`, `WAGO_2X`, `WAGO_3X`) in Supply- bzw. USB-Power-Netzen.
   - Markiere alle Supply-Wires in diesem reinen Connector-Bereich als direkt quellenangebunden.
   - Stoppe an jeder Nicht-Connector-Komponente und an Sicherungsgrenzen.
5. Fuer jede markierte Wire:
   - `ampacityA + 0.01 < 1.25 * source_current` ergibt `sourceWireCrossSectionTooSmall`.

Wichtig:

- Fuer GND wird die direkt an der Quelle angeschlossene GND-Wire ueber die Elementary-Netzsicht geprueft.
- Die Connector-Erweiterung fuer direkte Quellenanbindung gilt nur fuer Supply bzw. USB-Power, nicht fuer GND. Das folgt der Aufgabenentscheidung und vermeidet zusaetzliche GND-Reachability-Annahmen.
- Bei USB-Wires ist in der Regel klar, dass Supply und GND gemeinsam im Kabel gefuehrt werden. Deshalb wird `usb_net_type` in die Ampacity-Pruefung einbezogen; AWG26/AWG28 werden ueber die festen USB-Sonderwerte bewertet.
- Bei DCDC-Komponenten gilt `source_current` fuer die energieliefernde Ausgangsseite. Eingangsleitungen des DCDC werden nicht ueber den DCDC-`source_current` als Quelle bewertet.

Deutscher Meldungsvorschlag:

"Die Leitung ist direkt an eine Energiequelle angeschlossen. Diese Quelle kann im Normal- oder Fehlerfall mehr Strom liefern, als die Leitung ohne Ueberhitzung sicher tragen kann. Waehlen Sie einen groesseren Querschnitt oder eine Energiequelle mit kleinerem Stromlimit."

## Regel 2: Ungesichertes Supply-Teilnetz mit direkter Quellenanbindung

Ziel:

Alle weiteren Wires in demselben `component-linked-elementary-based` Supply-Netz, das mindestens eine Regel-1-Wire enthaelt, muessen ebenfalls gegen `1.25 * source_current` bestehen. Ausgenommen sind die Regel-1-Wires selbst, damit keine doppelte Meldung entsteht.

Algorithmus:

1. Erzeuge aus Regel 1 eine Map `directSourceNetId -> strongestRequiredCurrentA`.
2. Betrachte alle `componentLinkedElementaryBasedNets` mit `suppl_net_type`.
3. Wenn ein solches Netz eine Regel-1-Wire enthaelt:
   - Alle anderen Wires des Netzes pruefen.
   - Bei mehreren Quellen im selben Netz den groessten `1.25 * source_current` verwenden.
4. `ampacityA + 0.01 < requiredCurrentA` ergibt `unfusedSupplyWireCrossSectionTooSmall`.

Deutscher Meldungsvorschlag:

"Die Leitung liegt in einem Netz, das direkt an eine Energiequelle angeschlossen ist. Diese Quelle kann im Normal- oder Fehlerfall mehr Strom liefern, als die Leitung ohne Ueberhitzung sicher tragen kann. Waehlen Sie einen groesseren Querschnitt, eine Energiequelle mit kleinerem Stromlimit oder setzen Sie eine passende Sicherung dazwischen."

## Regel 3: Supply-Teilnetz hinter Sicherung

Ziel:

Wires in einem `component-linked-elementary-based` Supply-Netz ohne direkte Quellenanbindung sind zu duenn, wenn alle moeglichen Pfade zu einer Quelle nur ueber Sicherungen fuehren, deren wirksame Nennwerte fuer die Leitung zu hoch sind.

Graphmodell:

1. Knoten: `componentLinkedElementaryBasedNets` mit `suppl_net_type`.
2. Kanten:
   - Fuse-Kanten aus allen `internalConnections.kind === "fuse"`, wenn die beiden Fuse-Handles in unterschiedlichen component-linked-elementary-based Nets liegen.
   - Jede Kante traegt `nominalCurrentA`.
3. Quellen:
   - Netze mit Regel-1-Quelle.

LED-Strip-`suppl_in`-Handles werden in dieser Netzsicht nicht untereinander verbunden. Die interne Versorgung eines LED-Streifens bildet damit fuer Regel 3 eine Schutzbereichsgrenze: Wires an unterschiedlichen Anschlussbereichen werden nicht allein durch den Strip in dasselbe abgesicherte Teilnetz gelegt.

Pfadbewertung:

- Fuer einen Pfad von einem Netz zur Quelle ist die Leitung geschuetzt, wenn mindestens eine Sicherung auf diesem Pfad `nominalCurrentA <= ampacityA + 0.01` hat.
- Der Pfad ist unsicher, wenn keine Sicherung auf dem Pfad passend klein ist, also alle bekannten Sicherungen `nominalCurrentA > ampacityA + 0.01` sind.
- Gibt es mehrere Pfade, reicht ein unsicherer Pfad fuer eine Fehlermeldung.
- Gibt es eine Fuse ohne auswertbaren Nennwert auf einem sonst relevanten Pfad, wird keine harte "zu klein"-Meldung geraten. Stattdessen greift die vorhandene Komponentendiagnose `fuseCurrentMissingOrUnderspecified`.

Effizienter Algorithmus:

Fuer jede zu pruefende Wire mit `ampacityA`:

1. Starte im Netzknoten der Wire.
2. Traversiere den Fuse-Graph Richtung Quellen.
3. Fuehre pro Traversal-State `hasProtectiveFuseOnPath`.
4. Beim Ueberqueren einer Fuse:
   - Wenn `nominalCurrentA <= ampacityA + 0.01`, setze `hasProtectiveFuseOnPath = true`.
   - Wenn `nominalCurrentA > ampacityA + 0.01`, bleibt der State unveraendert.
   - Wenn unbekannt, markiere Pfad als unentscheidbar.
5. Wird eine Quelle mit `hasProtectiveFuseOnPath === false` erreicht, ist die Wire unsicher.
6. Wird eine Quelle nur ueber unentscheidbare Pfade erreicht, keine harte Meldung erzeugen; Diagnose ausgeben.

Alternative Optimierung (nicht notwendig):

Fuer jede Ampacity-Klasse koennte man vorab berechnen, welche Netze durch mindestens eine passende Sicherung von Quellen getrennt sind. Da Diagramme vermutlich klein sind, ist die einfache per-Wire-Traversierung ausreichend und leichter testbar.

Deutscher Meldungsvorschlag:

"Die Leitung liegt in einem Netz, das ueber eine Sicherung mit der Energiequelle verbunden ist. Der Nennstrom der Sicherung passt jedoch nicht zum Querschnitt der Leitung. Erhoehen Sie den Querschnitt oder verringern Sie den Sicherungsnennwert, wenn der angeschlossene Verbraucher keinen so hohen Strom benoetigt."

## Regel 4: Supply-Eingang an digitalem LED-Strip

Ziel:

Digitale LED-Strips koennen Versorgung ueber mehrere Einspeisepunkte intern weiterleiten und verhalten sich damit teilweise wie eine Leitung. Jeder `suppl_in`-Handle eines digitalen LED-Strips besitzt ein `Imax`. Dieser Wert beschreibt den maximal zulaessigen Strom, der ueber diesen Supply-Eingang bzw. den angrenzenden internen Strip-Abschnitt fliessen darf.

Ein solcher Supply-Eingang ist unzureichend geschuetzt, wenn zwischen ihm und einer Energiequelle kein ausreichend kleiner Sicherungsnennwert liegt und die Quelle selbst mehr Strom liefern kann, als der Eingang vertragen darf.

Pruefumfang:

- Nur digitale LED-Strip-Komponenten werden betrachtet.
- Nur Handles mit Funktion `suppl_in` werden geprueft.
- GND-Handles werden hier nicht geprueft, weil sie durch Regel 6 abgedeckt werden.
- Der Handle muss ein numerisches `Imax > 0` besitzen. Fehlt `Imax`, sollte keine harte Schutzmeldung geraten werden; optional kann spaeter eine Entwicklerdiagnose fuer unvollstaendige Komponentenmetadaten greifen.

Schutzbedingung:

Ein LED-Supply-Eingang ist ausreichend geschuetzt, wenn fuer jeden moeglichen Pfad zu einer Energiequelle mindestens eine der folgenden Bedingungen gilt:

1. Auf dem Pfad liegt eine auswertbare Sicherung mit `nominalCurrentA <= handle.Imax + 0.01`.
2. Der Pfad erreicht die Quelle ohne passende Sicherung, aber `handle.Imax + 0.01 >= 1.25 * source_current` der Energiequelle.

Wenn es mehrere Quellen oder mehrere Parallelpfade gibt, reicht ein unsicherer Pfad fuer eine Fehlermeldung. Das entspricht Regel 3: Ein einziger moeglicher Fehlerstrompfad ohne passende Begrenzung kann den betroffenen Eingang ueberlasten.

Graphmodell:

- Wiederverwendung des Fuse-Graphs aus Regel 3.
- Start ist das `componentLinkedElementaryBasedNet` des jeweiligen LED-`suppl_in`-Handles.
- Quellen sind die Netze mit Regel-1-Quelle bzw. mit `source_current`-Quelle.
- Weil LED-`suppl_in`-zu-`suppl_in` in dieser Netzsicht getrennt bleibt, wird jeder Einspeisepunkt gegen seine eigenen sichtbaren Pfade zur Quelle bewertet.
- Eine Sicherung mit unbekanntem Nennwert macht den betroffenen Pfad unentscheidbar. In diesem Fall keine harte Regel-4-Meldung erzeugen; die vorhandene Diagnose `fuseCurrentMissingOrUnderspecified` beschreibt die fehlende Sicherungsinformation.

Algorithmus:

1. Sammle alle digitalen LED-Strip-Komponenten.
2. Sammle deren sichtbare `suppl_in`-Handles mit numerischem `Imax > 0`.
3. Ermittle fuer jeden solchen Handle das `componentLinkedElementaryBasedNet`.
4. Traversiere vom Netzknoten ueber den Fuse-Graph Richtung Quellen.
5. Fuehre pro Traversal-State `hasProtectiveLimitOnPath`:
   - Beim Ueberqueren einer Sicherung mit `nominalCurrentA <= handle.Imax + 0.01` wird `hasProtectiveLimitOnPath = true`.
   - Beim Ueberqueren einer groesseren Sicherung bleibt der State unveraendert.
   - Bei unbekanntem Sicherungsnennwert wird der Pfad als unentscheidbar markiert.
6. Wird eine Quelle erreicht:
   - Wenn `hasProtectiveLimitOnPath === true`, ist dieser Pfad geschuetzt.
   - Wenn keine passende Sicherung auf dem Pfad liegt, pruefe `handle.Imax + 0.01 >= 1.25 * source_current`.
   - Ist auch diese Bedingung nicht erfuellt, ist der LED-Supply-Eingang unsicher.
7. Wird mindestens ein unsicherer Pfad gefunden, erzeuge `ledSupplyInputNotAdequatelyProtected`.
8. Werden Quellen nur ueber unentscheidbare Pfade erreicht, keine harte Meldung erzeugen; die Fuse-Metadaten-Diagnose soll sichtbar bleiben.

Deutscher Meldungsvorschlag:

"Der Versorgungseingang dieses digitalen LED-Streifens kann weniger Strom tragen, als die vorgeschaltete Energiequelle im Normal- oder Fehlerfall liefern kann. Setzen Sie zwischen Quelle und LED-Eingang eine passende Sicherung mit hoechstens dem zulaessigen Eingangsstrom ein oder verwenden Sie eine Quelle mit kleinerem Stromlimit."

## Regel 5: GND-Leitung an normaler Komponente

Ziel:

GND-Wires an einer Komponente sollen mindestens den groessten Querschnitt der an diese Komponente angeschlossenen Supply-Wires haben.

Implementierungshinweis:

- Die Regel ist mit dem Code-Feature-Flag `ENABLE_COMPONENT_GROUND_CROSSSECTION_CHECK = true` kapselbar.

Ausnahmen:

- `SolderJoint`
- `WAGO_2X`
- `WAGO_3X`
- LED-Strips bzw. `node.data.group === "led"`; diese werden in Regel 6 behandelt.

Algorithmus:

1. Pro Nicht-Connector-/Nicht-LED-Komponente:
   - Sammle direkt angeschlossene Wires, deren `componentLinkedNet` `suppl_net_type` hat.
   - Ermittle den maximalen auswertbaren Querschnitt.
2. Wenn kein Supply-Querschnitt vorhanden ist, keine Pruefung.
3. Sammle direkt angeschlossene GND-Wires.
4. Jede GND-Wire mit kleinerem Querschnitt erzeugt `componentGroundWireCrossSectionSmallerThanSupply`.

Deutscher Meldungsvorschlag:

"Die Masseleitung an dieser Komponente ist kleiner als eine angeschlossene Versorgungsleitung. Masseleitungen sollten in der Regel mindestens den Querschnitt der zugehoerigen Versorgungsleitungen haben. Pruefen Sie den Aufbau genau."

## Regel 6: GND-Leitung an LED-Strip-Komponente

Ziel:

Bei LED-Streifen soll der lokale GND-Anschlussbereich gegen den lokalen bzw. naechstliegenden Supply-Anschlussbereich verglichen werden.

Anschlussbereiche:

- `_start`
- `_end`
- `_middle_N`

Erkennung:

- Suffix aus `handle.hid` ableiten.
- Beispiele:
  - `VCC_start`, `GND_start`, `DATA_start` -> Bereich `start`
  - `VCC_end`, `GND_end` -> Bereich `end`
  - `VCC_middle_4`, `GND_middle_4` -> Bereich `middle_4`

Algorithmus:

1. Pro LED-Komponente alle direkt angeschlossenen Supply-Wires nach Anschlussbereich gruppieren.
2. Pro GND-Wire:
   - Bestimme Anschlussbereich.
   - Nutze zuerst Supply-Wires im gleichen Bereich.
   - Falls dort keine Supply-Wire vorhanden ist, suche den naechstliegenden Bereich entlang des Streifens:
     - Reihenfolge: `start`, `middle_N` nach `N`, `end`.
     - Bei gleicher Entfernung in beide Richtungen den groesseren Supply-Querschnitt verwenden.
   - Wenn nirgends Supply-Wires vorhanden sind, keine Pruefung.
3. Wenn GND-Querschnitt kleiner ist als Referenz-Supply-Querschnitt, Warnung erzeugen.

Deutscher Meldungsvorschlag:

"Die Masseleitung an diesem LED-Anschlussbereich ist kleiner als die zugehoerige oder naechstliegende Versorgungsleitung. Masseleitungen sollten in der Regel mindestens den Querschnitt der Versorgungsleitungen haben. Pruefen Sie den Aufbau genau."

## Regel 7: GND-Leitungen zwischen reinen Verbindungselementen

Ziel:

GND-Verteilerleitungen zwischen SolderJoint/WAGO-Knoten sollen nicht kleiner sein als die GND-Abgaenge zu Komponenten, die sie offenbar versorgen.

Diese Regel ist fachlich sinnvoll, aber am empfindlichsten fuer false positives, weil das Diagramm keine reale Verlegung und keine eindeutige Paarung von Supply- und GND-Leitungen kennt. Sie sollte deshalb klar als Warnung formuliert und deterministisch begrenzt werden.

Deterministischer Algorithmus ohne Lastschaetzung:

1. Baue einen Graphen nur aus GND-Wires und reinen Verbindungselementen.
2. Startknoten sind Connector-Komponenten, die mindestens eine GND-Wire zu einer Nicht-Connector-Komponente besitzen.
3. Fuer jeden Startknoten:
   - Referenzquerschnitt ist der maximale Querschnitt der GND-Wires vom Connector zu Nicht-Connector-Komponenten.
   - Regel-1-Wires werden ausgenommen.
4. Traversiere von diesen Startknoten zu benachbarten Connector-Knoten.
5. Jede Connector-zu-Connector-GND-Wire muss mindestens den aktuell getragenen Referenzquerschnitt haben.
6. Wenn eine Connector-zu-Connector-Wire kleiner ist, Warnung erzeugen.
7. Beim Weiterlaufen wird der Referenzquerschnitt als Maximum der bereits bekannten Anforderungen fortgeschrieben.

Wichtig:

- Diese Regel darf nicht versuchen zu erraten, welche Supply-Leitung physisch parallel liegt.
- Sie darf nur aus sichtbarer Topologie und Querschnitten folgern.
- Bei Zyklen im Connector-Graph muss pro Knoten der bisher groesste bekannte Referenzquerschnitt gespeichert werden; erneute Traversierung nur, wenn ein groesserer Wert ankommt.
- Die Regel wird sofort umgesetzt, aber mit einem Code-Feature-Flag kapselbar gemacht, z.B. `ENABLE_CONNECTOR_GROUND_BACKBONE_CHECK = true`. Das Flag dient als schneller Schalter, falls reale Diagramme zu viele false positives zeigen.

Deutscher Meldungsvorschlag:

"Diese Masseleitung zwischen Verbindungselementen ist kleiner als ein nachgelagerter Masseabgang. Masseleitungen, die parallel zu Versorgungsleitungen und zu denselben Komponenten gefuehrt werden, sollten in der Regel mindestens denselben Querschnitt haben wie die Versorgungsleitung. Da im Diagramm keine reale Verlegung erfasst ist, kann diese Meldung falsch-positiv sein. Pruefen Sie die Stelle manuell."

## Kompatibilitaet mit bestehender Implementierung

### Check-Kontext

Die Regeln koennen im bestehenden `runNetworkRules()` laufen. Benoetigt werden:

- Zugriff auf `context.componentLinkedNets` fuer bestehende Power-/GND-Klassifikation.
- Zugriff auf `context.componentLinkedElementaryBasedNets` fuer abgesicherte Supply-Teilnetze.
- `context.getHandle()`, `context.getNetByHandle()` und `context.getComponentLinkedElementaryBasedNetByHandle()`.
- Eine zusaetzliche Edge-zu-Net-Lookup-Map fuer `componentLinkedElementaryBasedNets`, damit Regeln schnell von Wire zu Teilnetz kommen.

Empfehlung: Die Lookup-Map lokal in `rules.ts` erstellen, nicht in `CheckNet` persistieren.

### Simulation

Die neue Pruefung muss nicht in die Simulation eingreifen. Sie nutzt dieselben Wire- und Komponentenmetadaten, aber erzeugt Diagramm-Check-Issues. Simulationsergebnisse wie realer Strom werden bewusst nicht benoetigt.

### Translations

Neue Issue-Texte muessen in allen vorhandenen Sprachen gepflegt werden:

- `src/translations/de.json`
- `src/translations/en.json`
- `src/translations/zh.json`

Deutsch sollte fachlich klar sein. Englisch und Chinesisch koennen sinngemaess uebersetzt werden. Die Regeltexte sollten keine Normkonformitaet behaupten.

### Tests

Neue Regression-Cases in `simulation_test\diagram_checks` bzw. bestehendem Diagramm-Check-Regression-Setup:

1. Direct source, 10 A, 0.25 mm2 -> Fehler Regel 1.
2. Direct source, ausreichend grosser Querschnitt -> keine Meldung.
3. Source -> WAGO -> Wire im gleichen ungesicherten Supply-Teilnetz -> Regel 2.
4. Source -> Fuse 5 A -> duenne Wire mit Ampacity 4 A -> Regel 3.
5. Source -> Fuse 5 A -> Wire mit Ampacity 6 A -> keine Regel-3-Meldung.
6. Zwei Sicherungen in Reihe 10 A und 3 A -> Wire 4 A ist geschuetzt, keine Meldung.
7. Zwei Parallelpfade, einer mit 3 A und einer mit 10 A -> Wire 4 A erzeugt Fehler wegen unsicherem 10-A-Pfad.
8. Fuse ohne Nennwert -> keine harte Regel-3-Meldung, aber bestehende Fuse-Nennwert-Diagnose.
9. Digitaler LED-Strip `suppl_in` mit `Imax = 10 A`, direkte Quelle `source_current = 12 A`, keine Sicherung -> Fehler Regel 4, weil `1.25 * 12 A = 15 A`.
10. Digitaler LED-Strip `suppl_in` mit `Imax = 10 A`, direkte Quelle `source_current = 8 A`, keine Sicherung -> keine Regel-4-Meldung, weil `1.25 * 8 A = 10 A`.
11. Digitaler LED-Strip `suppl_in` mit `Imax = 10 A`, Quelle ueber Sicherung 10 A -> keine Regel-4-Meldung.
12. Digitaler LED-Strip `suppl_in` mit `Imax = 10 A`, Quelle ueber Sicherung 15 A -> Fehler Regel 4.
13. Digitaler LED-Strip `suppl_in` mit `Imax = 10 A`, zwei Parallelpfade mit 10-A- und 15-A-Sicherung -> Fehler Regel 4 wegen unsicherem 15-A-Pfad.
14. Normale Komponente mit Supply 1.5 mm2 und GND 0.75 mm2 -> Warnung Regel 5.
15. LED-Startbereich mit Supply 1.5 mm2 und GND 0.75 mm2 -> Warnung Regel 6.
16. LED-GND ohne lokalen Supply, aber naechstliegender Supply in Middle/End -> korrekte Referenz.
17. Connector-GND-Backbone kleiner als Abgang -> Warnung Regel 7.
18. Fehlender Wire-Querschnitt -> nur `wireWithoutPhysicalParameters`, keine Ampacity-Fehlmeldung.
19. AWG26 USB-Wire -> mit `1.3 A` auswertbar; Leitungsverlegung und Temperatur aendern diesen Sonderwert nicht.
20. AWG28 USB-Wire -> mit `0.85 A` auswertbar; Leitungsverlegung und Temperatur aendern diesen Sonderwert nicht.

## Umsetzungsschritte

- [x] 1. `WireAmpacitySettings` und `wireAmpacity.ts` anlegen.
- [x] 2. Diagramm-Export/-Import um `checkSettings.wireAmpacity` erweitern; fuer alte Diagramme Defaults verwenden.
- [x] 3. Tools-UI fuer Leitungsverlegung und Umgebungstemperatur ergaenzen.
- [x] 4. `runDiagramCheck` optional um Check-Settings erweitern und `DiagramCheckPage` anbinden.
- [x] 5. Hilfsfunktionen in `rules.ts` oder neuer Datei `src/check/wireProtection.ts` anlegen:
   - Wire-Ampacity aus Edge-Daten.
   - Source-Limits aus Nodes.
   - Fuse-Boundaries aus `internalConnections`.
   - Net-Lookups fuer component-linked-elementary-based Nets.
- [x] 6. Regel 1 und 2 implementieren.
- [x] 7. Fuse-Graph und Regel 3 implementieren.
- [x] 8. LED-Supply-Eingangsregel 4 implementieren.
- [x] 9. GND-Komponentenregeln 5 und 6 implementieren.
- [x] 10. Connector-GND-Regel 7 mit Code-Feature-Flag implementieren.
- [x] 11. Translation-Texte ergaenzen.
- [x] 12. Regression-Cases ergaenzen.
- [x] 13. `Docs/DIAGRAMM_CHECKS_CONCEPT.MD` mit finalem Implementierungsstand aktualisieren.

## Entschiedene Punkte

1. Leitungsverlegung und Umgebungstemperatur werden im Diagramm-Export gespeichert, nicht nur global in `localStorage`.
2. Die Connector-Erweiterung fuer direkte Quellenanbindung gilt nur fuer Supply bzw. USB-Power, nicht fuer GND.
3. AWG26 und AWG28 werden als USB-Sonderwerte unterstuetzt: AWG26 = `1.3 A`, AWG28 = `0.85 A`; beide unabhaengig von Verlegung und Temperatur.
4. Bei nicht auswertbarem Sicherungsnennwert wird keine neue Diagnose eingefuehrt; `fuseCurrentMissingOrUnderspecified` reicht.
5. `source_current` bei DCDC-Komponenten gilt fuer den energieliefernden Ausgangsstrom.
6. `usb_net_type` wird in die Ampacity-Pruefung einbezogen. USB-Supply und USB-GND werden als gemeinsam gefuehrte Kabeladern behandelt, soweit die sichtbare USB-Wire dies hergibt.
7. Regel 7 wird sofort implementiert, aber mit einem Code-Feature-Flag versehen.
8. Regel 5 ist ebenfalls mit `ENABLE_COMPONENT_GROUND_CROSSSECTION_CHECK` als Code-Feature-Flag versehen.
9. Ampacity-Vergleiche verwenden eine Toleranz von `0.01 A`: Fehler nur bei `ampacityA + 0.01 < requiredA`.
10. Digitale LED-Strip-`suppl_in`-Handles werden zusaetzlich gegen `handle.Imax` geprueft. Eine passende Sicherung darf hoechstens `Imax` haben; ohne passende Sicherung muss `Imax` mindestens `1.25 * source_current` der Quelle abdecken.

## Gesamtpruefung

Nach Einarbeitung der Entscheidungen ist das Konzept in sich konsistent und mit der vorhandenen Implementierung kompatibel:

- Die benoetigten Netzsichten existieren bereits, insbesondere `componentLinkedElementaryBasedNets` als Sicherungsgrenze.
- `source_current` ist in den relevanten Quellenkomponenten vorhanden und wird bereits in der Simulation als Stromlimit verwendet.
- `internalConnections.kind === "fuse"` und `nominalCurrentField` passen zur vorgeschlagenen Fuse-Graph-Auswertung.
- `HandleDataType.Imax` existiert bereits und ist bei digitalen LED-Strip-`suppl_in`-Handles gepflegt.
- AWG26/AWG28 sind in der vorhandenen AWG-Normalisierung bereits bekannt; fuer Ampacity brauchen sie nur die festgelegten Sonderstromwerte.
- Die Regeln verwenden keine Lastschaetzung. Sie pruefen Schutzgrenzen durch Quelle, Sicherung oder explizit sichtbare Topologie und bleiben damit innerhalb der Projektvorgabe, keine heuristischen Techniken ohne explizite Anforderung einzufuehren.
- Regel 7 bleibt fachlich die empfindlichste Regel. Durch Warn-Severity, klare Meldung und Feature-Flag ist sie kontrollierbar.

## Empfehlung

Die Regeln 1 bis 4 sind der fachlich wertvollste Kern und passen besonders gut zur vorhandenen Netzmodellierung. Sie sollten zuerst umgesetzt werden. Regeln 5 und 6 sind ebenfalls sinnvoll, aber als Warnungen. Regel 7 kann gemaess Entscheidung direkt mit umgesetzt werden, sollte aber technisch leicht deaktivierbar bleiben und in Tests besonders auf false-positive-arme Topologien begrenzt werden.
