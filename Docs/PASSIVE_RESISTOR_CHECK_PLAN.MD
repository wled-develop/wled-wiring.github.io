# Passive Resistor Check Plan

Stand: 2026-05-29

## Ziel

Der generische `Resistor` soll in Diagramm-Checks als passives elektrisches Bauteil modelliert werden, nicht als digitaler Eingang. Dadurch darf derselbe Widerstand ohne False Positives als Last zwischen Supply und GND verwendet werden. Gleichzeitig muessen bestehende Signalpfad-Checks erhalten bleiben, besonders digitale Serienwiderstaende zwischen Controller-/Buffer-Ausgang und LED-Daten- oder Clock-Eingang.

Dieses Konzept verzichtet bewusst auf ein `Usage`-Feld. Die fachliche Bedeutung eines Widerstands entsteht aus seiner passiven Pin-Definition und aus dem umgebenden Netzkontext.

## Ausgangsproblem

Aktuell besitzt `Resistor` an beiden Pins `functions: ["dig_in"]`.

Folgen:

- Ein Widerstand als Last an Supply/GND erzeugt `digital input without source`, weil beide Widerstandspins als digitale Senken gelten.
- Digitale Signalpfade profitieren davon, weil der Resistor dadurch in Signalregeln auftaucht.
- Die Modellierung vermischt Bauteilart und Verwendungszweck: Ein Widerstand ist kein digitaler Eingang.

## Zielmodell

### Neue passive Pin-Funktion

Eine neue Handle-Funktion wird eingefuehrt:

```text
passive
```

Bedeutung:

- Der Pin ist elektrisch anschliessbar, aber weder Quelle noch Senke eines aktiven Funktionsnetzes.
- `passive` erzeugt keine eigene Netzklassifikation.
- `passive` darf nicht als `dig_in`, `suppl_in`, `gnd`, `pwm_in`, `an_in` usw. zaehlen.
- `passive` beschreibt einen Anschluss eines Bauteils, dessen Wirkung ueber Komponententyp und Simulationselemente entsteht.

Alternative Namen wie `resistive_terminal` oder `passive_electrical` wurden verworfen, solange kein zweiter passiver Zweipoltyp eine andere Semantik braucht. `passive` ist kurz und fuer Kerko/Elko/Resistor spaeter wiederverwendbar.

### Resistor-Komponente

`src/components/catalog/core/Resistor.component.ts`:

- Pin `1`: `functions: ["passive"]`
- Pin `2`: `functions: ["passive"]`
- Simulationsdaten bleiben unveraendert: elementarer `resistor` zwischen `1` und `2`.
- `mustBeConnected` bleibt erhalten, damit einseitig angeschlossene Widerstaende weiterhin auffallen koennen.

Bestehende gespeicherte Diagramme koennen alte `dig_in`-Pins enthalten. Die Check-Logik muss deshalb entweder alte Resistor-Instanzen normalisieren oder speziell anhand `technicalID === "Resistor"` behandeln, bis eine Template-Migration existiert.

## Nicht-Ziele

- Keine automatische Erkennung von "Widerstand ist Last" ueber Widerstandswert, Wire-Farbe oder Position.
- Keine neue UI-Auswahl `Usage`.
- Keine Aenderung des Simulations-Solvers fuer Widerstaende.
- Keine Aufweichung der digitalen LED-/SN74-/Signalchecks.
- Keine globale Behandlung aller passiven Komponenten als Signal-Pass-Through.

## Betroffene Dateien

Voraussichtlich:

- `src/types.ts`
- `src/components/catalog/core/Resistor.component.ts`
- `src/check/checkContext.ts`
- `src/check/rules.ts`
- `src/check/componentSpecificRules.ts`
- `src/components/catalog/validateComponent.ts`
- `src/components/catalog/componentSchema.ts`
- `src/translations/en.json`
- `src/translations/de.json`
- `src/translations/zh.json`
- `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`
- `Docs/SIMUL_CONCEPT.MD`
- Regressionstest-Fixtures unter `simulation_test/diagram_checks/`

Optional, falls es schon Template-Update-Mechanik fuer alte Nodes gibt:

- `src/utils/componentTemplateUpdates.ts`

## Umsetzungsschritte

### 1. Typen und Schema vorbereiten

- [x] Pruefen, wo erlaubte `functions` typisiert oder validiert werden.
- [x] `passive` als gueltige Handle-Funktion aufnehmen.
- [x] Komponentenvalidierung so erweitern, dass `passive` nicht als fehlende Check-Metadaten gewertet wird.
- [x] Sicherstellen, dass `ambiguousMultiFunctionHandle` `passive` korrekt behandelt:
  - [x] `["passive"]` ist nicht ambiguous.
  - [x] `["passive", "dig_in"]` sollte als Definitionsproblem gelten, weil passive und aktive Rollen vermischt sind.
  - [x] `["passive", "gnd"]` sollte ebenfalls als Definitionsproblem gelten, ausser es wird spaeter explizit erlaubt.

### 2. Resistor-Pins umstellen

- [x] `Resistor.component.ts` beide Pins von `dig_in` auf `passive` umstellen.
- [x] Pruefen, ob gespeicherte Beispiele oder Tests direkt alte Resistor-Handles enthalten.
- [x] Entscheiden, ob alte gespeicherte Resistor-Nodes beim Check normalisiert werden:
  - [x] bevorzugt: `inferFunctions()` behandelt `technicalID === "Resistor"` und zweipolige Resistor-Pins als `passive`, auch wenn gespeichertes JSON noch `dig_in` enthaelt.
  - [ ] alternativ: Template-Migration aktualisiert alte Diagramme beim Laden.
- [x] Keine Simulation-Aenderung: `simdata.elements[0].type === "resistor"` bleibt die elektrische Wahrheit.

### 3. Netzklassifikation anpassen

- [x] `passive` darf keine `digital_net_type`, `suppl_net_type`, `gnd_net_type` oder andere Klassifikation erzeugen.
- [x] `sourceHandles` darf passive Pins nicht als Quelle enthalten.
- [x] `sinkHandles` darf passive Pins nicht als Senke enthalten.
- [x] `classificationFunctions()` muss alte Resistor-`dig_in` nicht mehr als digitale Senke durchreichen, sobald Normalisierung aktiv ist.
- [x] Mixed-Net-Regeln duerfen passive Pins nicht als aktiven Typ anzeigen.

### 4. Signal-Reachability ueber passive Serienbauteile erhalten

Der Widerstand soll fuer Signalpfade weiterhin durchlaessig sein, aber nur als zweipoliges passives Serienbauteil.

- [x] `isSeriesSignalNode()` von `technicalID === "Resistor"` auf "zweipoliger passiver Serienkandidat" umstellen.
- [x] Kriterien:
  - [x] genau zwei sichtbare Handles
  - [x] beide Handles haben effektiv `passive`
  - [x] Komponente ist `Resistor`
  - [x] keine passive Verbindungsknoten wie `WAGO` oder `SolderJoint`
- [x] `signalReachableHandles()` darf ueber diesen Resistor laufen.
- [ ] Die Traversierung darf nicht ueber Supply/GND-Verbindungen hinweg beliebige passive Lasten als Signalpfad missbrauchen:
  - [x] digitale Quellen/Senken werden ueber Reachability gefunden, aber passive Pins selbst sind keine Senken.
  - [x] ein Resistor zwischen Supply und GND darf keine digitale Quelle erzeugen und keine digitale Senke melden.
- [x] Pruefen, ob Kerko aktuell als passive Signalkomponente behandelt wird und ob das so bleiben soll.

### 5. Component-Linked Nets und digitale Resistor-Pass-Throughs

Aktuell werden Component-Linked Nets ueber Resistor verbunden, wenn beide angrenzenden Fused Nets `digital_net_type` haben.

- [x] Diese Logik beibehalten, aber auf passive Resistor-Pins umstellen.
- [x] Pruefen, ob die angrenzenden Netze weiterhin als digital klassifiziert werden, wenn der Resistor selbst keine digitale Senke mehr ist.
- [x] Sicherstellen:
  - [x] Controller `dig_out` -> Resistor -> LED `dig_in` ergibt einen verbundenen digitalen Kontext.
  - [x] SN74 `dig_out` -> Resistor -> LED `dig_in` ergibt einen verbundenen digitalen Kontext.
  - [x] PSU `suppl_out` -> Resistor -> GND ergibt keinen digitalen Kontext.
- [x] Component-Linked-Elementary-based Nets muessen dieselbe pass-through-Logik konsistent verwenden.

### 6. Netzwerkregeln anpassen

#### `signalSinkWithoutSource`

- [x] Passive Pins duerfen nicht als digitale Senken zaehlen.
- [x] Alte gespeicherte Resistor-`dig_in`-Pins duerfen nach Normalisierung nicht mehr als `digital-sink-without-source` auftauchen.
- [x] LED-/Controller-/Buffer-`dig_in`-Pins muessen weiterhin gemeldet werden, wenn keine Quelle erreichbar ist.

#### `signalOutputWithoutConsumer`

- [x] Digitale Quellen duerfen einen Verbraucher ueber einen passiven Resistor erreichen.
- [x] Eine digitale Quelle, die nur an einem passiven Resistor endet und dahinter keine echte digitale Senke hat, soll weiterhin als "output without consumer" warnen.
- [x] Direkte und ueber Resistor gefuehrte LED-Datenpfade muessen weiterhin als Verbraucher gelten.

#### `digitalSignalVoltageMismatch`

- [x] Spannungspruefung darf passive Pins ignorieren.
- [x] Spannungspruefung muss echte digitale Senken hinter einem Serienwiderstand weiterhin erreichen.
- [x] Ein Resistor als Last zwischen 5 V und GND darf keine digitale Level-Mismatch-Meldung erzeugen.

#### `dataDirectionWrong`

- [x] Resistor-Pins duerfen nicht als digitale Inputs in "only inputs" Netzen auftauchen.
- [x] Zwei echte digitale Eingange ohne Ausgang bleiben Fehler.
- [x] Zwei echte digitale Ausgaenge ohne Eingang bleiben Fehler.

#### `controlledOutputWithoutControlInput`

- [x] Nicht direkt vom Resistor betroffen, aber Regression pruefen.
- [ ] GPIOs mit `dig_in` + `dig_out` sind ein separates Problem: Die Regel fragt aktuell nach `digital_net_type`, das nur bei exklusivem `dig_out` entsteht.
- [ ] Fuer SwitchBoard-Tests muss entschieden werden, ob diese Regel kuenftig `hasReachableDigitalSource()` statt nur Netzklassifikation verwenden soll. Das ist nicht Teil der passiven Resistor-Umstellung, aber als separates Follow-up notieren.

### 7. Komponentenregeln anpassen

#### `componentHasOnlyOneTerminalConnected`

- [x] Resistor bleibt passiver Zweipol und wird weiterhin geprueft.
- [x] Einseitig angeschlossener Resistor erzeugt weiterhin Warnung.
- [x] Vollstaendig angeschlossener Lastwiderstand erzeugt keine Warnung.

#### `sn74Ahct125nDirectLedOutputMissingSeriesResistor`

- [x] Direkte SN74-Ausgang-zu-LED-Eingang-Verbindung ohne Resistor muss weiterhin warnen.
- [x] SN74-Ausgang -> Resistor -> LED-Eingang darf nicht warnen.
- [x] Die Regel verwendet bewusst Elementary Nets; pruefen, dass der passive Resistor SN74 und LED nicht im selben Elementary Net zusammenfasst.
- [x] `signalReachableHandles()` darf trotzdem durch den Resistor laufen, damit andere Signalregeln den Pfad als verbunden erkennen.

#### SN74 used channel input checks

- [x] `sn74Ahct125nUsedChannelInputMissing` muss weiterhin digitale Quellen/Senken hinter Serienwiderstand erkennen.
- [x] Passive Resistor-Pins duerfen nicht als fehlende Channel-Inputs gelistet werden.

### 8. Simulation pruefen

- [x] `buildSimulationModel()` muss Resistor-Simulationsdaten weiterhin lesen.
- [x] `runSimulation()` muss das Element `resistor` unveraendert stempeln.
- [ ] Lastwiderstand an SwitchBoard-Ausgang muss im Simulationsmodell als Last zwischen Supply und GND erscheinen.
- [x] Kein neues Simulationselement fuer `passive` einfuehren.
- [x] `SIMUL_CONCEPT.MD` aktualisieren: `passive` ist Check-/Komponentenmetadatum, die elektrische Simulation nutzt weiter `simdata`.

### 9. Import/Export und alte Diagramme

- [x] Exportierte neue Resistor-Nodes enthalten `functions: ["passive"]`.
- [x] Import alter Diagramme mit `Resistor` und `dig_in` funktioniert ohne Nutzeraktion.
- [x] Alte Diagramme mit Serienwiderstand in LED-Datenleitung bleiben checkbar.
- [x] Alte Diagramme mit Lastwiderstand verlieren die False Positives.
- [ ] Falls Template-Update-Logik vorhanden ist, pruefen:
  - [ ] Resistor-Template-Version erhoehen?
  - [ ] Alte Node-Instanzen beim Laden aktualisieren?
  - [ ] Keine Nutzerauswahl oder Widerstandswert verlieren.

### 10. Uebersetzungen und UI

- [x] Falls `passive` in Debug-/Diagnoseanzeigen sichtbar wird, Uebersetzungen in `en`, `de`, `zh` ergaenzen. Keine neuen Nutzerlabels noetig; Diagnosemeldungen zeigen technische Funktionsnamen direkt.
- [x] Nutzerfreundliche Meldungen sollen nicht "passive" als unverstaendlichen technischen Begriff in normalen Issues anzeigen, sofern vermeidbar.
- [x] Diagnosemodus darf `passive` anzeigen.

## Regressionstest-Matrix

### Muss ohne Issues sein

- [ ] PSU -> SwitchBoard VIN/GND, SwitchBoard VOUT1/GND1 -> Resistor als Last, EN1/EN2 korrekt angesteuert.
- [x] PSU -> Resistor -> GND als einfache Last.
- [x] Controller `dig_out` -> Resistor -> LED `dig_in`.
- [x] SN74 `Y` -> Resistor -> LED `DATA_in`.
- [ ] Digitaler LED-Streifen mit Daten-Serienwiderstand und gemeinsamer GND-Verbindung.

### Muss weiterhin Issues erzeugen

- [x] Resistor nur einseitig angeschlossen: `componentHasOnlyOneTerminalConnected`.
- [x] Controller `dig_out` -> Resistor, aber dahinter keine digitale Senke: `signalOutputWithoutConsumer`.
- [x] LED `dig_in` ohne digitale Quelle: `signalSinkWithoutSource`.
- [x] Zwei digitale Eingange miteinander verbunden ohne Ausgang: `dataDirectionWrong` oder passende digitale Sink-Meldung.
- [x] Zwei digitale Ausgaenge miteinander verbunden ohne Eingang: `dataDirectionWrong` oder multiple source.
- [x] SN74 `Y` direkt auf LED `DATA_in` ohne Resistor: `sn74Ahct125nDirectLedOutputMissingSeriesResistor`.
- [x] Digitaler Eingang wird mit unpassendem digitalen Pegel getrieben: `digitalSignalVoltageMismatch`.

### Darf nicht neu kaputtgehen

- [x] Fuse-Bypass-Erkennung.
- [x] Supply/GND-Polarity-Check.
- [x] Mixed-Net-Erkennung.
- [x] USB-Power-Pair Point-to-Point-Checks.
- [x] Analog-LED-PWM-Checks.
- [x] Required-pin-Checks.
- [x] Hidden-/missing-handle wire checks.
- [x] DCDC-Input-Power-Ambiguity-Checks in Simulation.

## Empfohlene neue Fixtures

Unter `simulation_test/diagram_checks/`:

- [x] `resistor_load_supply_gnd_valid`
  - Diagramm: PSU, Resistor zwischen V+ und GND.
  - Erwartung: keine digitalen Sink/Source-Issues.
- [x] `resistor_signal_series_valid`
  - Diagramm: Controller `dig_out`, Resistor, LED `dig_in`, gemeinsame GND.
  - Erwartung: keine digitalen Source/Sink-Issues.
- [x] `resistor_signal_series_missing_consumer`
  - Diagramm: Controller `dig_out` an Resistor, zweiter Pin offen oder nur passiv.
  - Erwartung: Output-without-consumer bzw. einseitiger Resistor.
- [x] `sn74_direct_led_without_resistor_still_warns`
  - Erwartung: SN74-Serienwiderstand-Warnung.
- [x] `sn74_led_with_passive_resistor_valid`
  - Erwartung: keine SN74-Serienwiderstand-Warnung.
- [x] `legacy_resistor_dig_in_load_valid`
  - Diagramm enthaelt bewusst alte gespeicherte Resistor-Pins mit `dig_in`.
  - Erwartung: keine digitalen Sink/Source-Issues, wenn als Supply/GND-Last verwendet.
- [x] `legacy_resistor_dig_in_signal_valid`
  - Altes Diagramm mit Resistor als digitaler Serienwiderstand.
  - Erwartung: Signalpfad bleibt gueltig.

## Offene Designentscheidung

`GPIO16` im SwitchBoard-Test ist ein Multifunktionshandle `dig_in` + `dig_out`. Die aktuelle digitale Netzklassifikation verlangt exklusive Digitalausgaenge. Dadurch gilt `GPIO16 -> EN1` nicht als `digital_net_type`, obwohl ein digitaler Output erreichbar ist.

Diese Frage ist nicht Teil der passiven Resistor-Umstellung, muss aber fuer das komplette SwitchBoard-Testziel separat geloest werden:

- Option A: `controlledOutputWithoutControlInput` nutzt `hasReachableDigitalSource()` statt nur `handleNetHasClassification(..., 'digital_net_type')`.
- Option B: Netzklassifikation unterscheidet zwischen exklusiver Klassifikation und "enthaelt digitale Quelle".
- Option C: GPIO-Komponenten bekommen getrennte Mode-/Rollen-Metadaten.

Empfehlung fuer spaeter: Option A lokal fuer diese Regel pruefen, weil sie die globale Netzklassifikation weniger veraendert.

## Abnahmekriterien

- [x] Der `Resistor` ist in aktuellen Templates passiv modelliert.
- [x] Alte Diagramme mit Resistor-`dig_in` erzeugen keine neuen False Positives.
- [x] Lastwiderstaende zwischen Supply und GND erzeugen keine digitalen Signalfehler.
- [x] Digitale Serienwiderstaende funktionieren weiterhin fuer Reachability, Source/Sink-Checks und Spannungschecks.
- [x] SN74-direkt-ohne-Serienwiderstand-Warnung bleibt erhalten.
- [x] Simulationsergebnisse fuer Widerstands-Lastfaelle bleiben unveraendert.
- [x] `npm run test:diagram-check` ist gruen.
- [x] Relevante LTspice-/Simulationstests fuer Widerstands-Lasten bleiben gruen.
- [x] `Docs/DIAGRAMM_CHECKS_CONCEPT.MD` und `Docs/SIMUL_CONCEPT.MD` sind nach Implementierung aktualisiert.

## Reihenfolge fuer die spaetere Implementierung

1. [x] Tests/Fixtures fuer aktuelles Fehlverhalten anlegen, soweit sie heute rot sein duerfen.
2. [x] `passive` in Typen/Schema/Validierung aufnehmen.
3. [x] Effektive Funktionsnormalisierung fuer alte Resistor-Nodes implementieren.
4. [x] `Resistor`-Template auf `passive` umstellen.
5. [x] Reachability- und Component-Linked-Pass-Throughs auf passive Resistor-Pins umstellen.
6. [x] Netzwerk- und Komponentenregeln gegen die Testmatrix pruefen.
7. [x] Docs und Uebersetzungen aktualisieren.
8. [x] Regression komplett laufen lassen.
