# Implementierungsplan: Simulierter Leitungsstrom gegen Stromtragfaehigkeit

Stand: 2026-06-01

## Ziel

Nach einer erfolgreichen Simulation soll jede auswertbare Leitung gegen ihre Stromtragfaehigkeit geprueft werden. Grundlage ist der simulierte absolute Stromwert der Leitung und der Grenzwert aus `wireAmpacityA` in `src/wires/wireAmpacity.ts`.

Wenn `abs(simulierter Strom) > wireAmpacityA(...) + Toleranz`, wird ein Fehler erzeugt: Der Querschnitt ist fuer handelsuebliche Leitungstypen zu gering; Nutzer sollen entweder besonders temperaturstabile Leitungen verwenden oder den Querschnitt vergroessern.

Die Regel darf nur als belastbare Bewertung laufen, wenn die Simulation bei voller LED-Last ausgefuehrt wurde:

- Nur RGB-Streifen im Diagramm: `brightnessPercent === 100` und `ledColorMode === "RGB_WHITE"`.
- RGBW-Streifen vorhanden, egal ob nur RGBW oder gemischt RGB + RGBW: `brightnessPercent === 100` und `ledColorMode === "SEPARATE_AND_RGB_WHITE"`.

Wenn eine andere Simulationseinstellung verwendet wird, soll statt der Fehlerbewertung ein Info-Issue erscheinen: Fuer die Bewertung der Strombelastbarkeit muss bei voller Helligkeit und RGB-Weiss bzw. Separate + RGB-Weiss simuliert werden.

## Architekturentscheidung

Die Regel wird als Simulations-Check umgesetzt, nicht als klassischer Diagramm-Check.

Begruendung:

- Die benoetigten Leitungsstroeme liegen erst in `SimulationResult.wireResults` vor.
- `runDiagramCheck()` arbeitet nur mit Diagrammstruktur und Check-Einstellungen, nicht mit Simulationsergebnissen.
- Bestehende Simulation-Checks werden bereits in `src/simulation/runSimulation.ts` erzeugt und in `SimulationPage.tsx` als Issues angezeigt.

Die bestehende Diagramm-Check-Regelgruppe `src/check/wireProtection.ts` bleibt fuer Quellen-/Sicherungs-/GND-Plausibilitaetschecks zustaendig. Die neue Regel nutzt aber dieselbe Ampacity-Quelle `wireAmpacityA`, damit die Stromtragfaehigkeit konsistent bleibt.

## Offene fachliche Details

- USB-Power-Pair-Wires haben aggregierte `SimulationWireResult.conductorResults`. Fuer die Ampacity-Bewertung soll jeder reale Leiter separat bewertet werden; die UI kann das Issue trotzdem am sichtbaren USB-Wire targeten.
- Wires ohne gueltigen Querschnitt werden von dieser Regel nicht geraten. Der bestehende `wireWithoutPhysicalParameters`- bzw. Simulationsmodellfehler deckt fehlende physikalische Daten ab.
- Fuer die LED-Typ-Erkennung soll nicht anhand von Namen geraten werden. Wenn moeglich, wird `digitalLed`-`SimulationElement.parameters.ledType` oder die zugehoerige `currentCurve`/Komponentenmetadaten genutzt. RGBW wird daran erkannt, dass bei `SEPARATE_WHITE` bzw. `SEPARATE_AND_RGB_WHITE` ein separater Weissstrom modellierbar ist; RGB-Streifen haben fuer Separate-White effektiv 0 A. Falls die vorhandenen Metadaten nicht eindeutig genug sind, wird ein kleines explizites Klassifikations-Hilfsmodul eingefuehrt statt heuristischer String-Raterei.

## Umsetzungsschritte

1. [x] Bestehenden Kontext sichten
   - `src/check/wireProtection.ts` nutzt bereits `wireAmpacityA`.
   - `src/simulation/simulationTypes.ts` enthaelt `SimulationSettings`, `SimulationWireResult` und `SimulationCheckIssue`.
   - `src/simulation/runSimulation.ts` erzeugt Simulation-Issues und Wire-Ergebnisse.
   - `src/simulation/SimulationPage.tsx` stellt `RGB_WHITE`, `SEPARATE_WHITE`, `SEPARATE_AND_RGB_WHITE` und Helligkeit bereit.

2. [x] LED-Lastmodus-Eignung bestimmen
   - Hilfsfunktion anlegen, z.B. `simulationAmpacityChecks.ts`.
   - Ermitteln, ob das Modell keine digitalen LED-Streifen, nur RGB-LED-Streifen oder mindestens einen RGBW-LED-Streifen enthaelt.
   - Zulaessige Bewertungsmodi:
     - keine LED-Streifen: volle Lastanforderung gilt als erfuellt, wenn keine LED-spezifische Last reduziert werden kann; alternativ kein Info-Issue noetig.
     - nur RGB: `brightnessPercent === 100` und `ledColorMode === "RGB_WHITE"`.
     - RGBW vorhanden: `brightnessPercent === 100` und `ledColorMode === "SEPARATE_AND_RGB_WHITE"`.
   - Keine heuristischen Namensregeln verwenden.

3. [x] Simulations-Ampacity-Check implementieren
   - Alle `model.wires` mit zugehoerigem `SimulationWireResult` auswerten.
   - Fuer normale Wires `abs(wireResult.currentA)` verwenden.
   - Fuer USB-Aggregate `conductorResults[]` getrennt bewerten, damit VBUS/GND-Leiter nicht durch Aggregation verdeckt werden.
   - Grenzwert mit `wireAmpacityA(edge.data?.physCrosssection, edge.data?.physCrosssectionUnit, settings.installation, settings.ambientTempC)` ermitteln.
   - Diagramm-Check-Ampacity-Einstellungen weiterverwenden oder in die Simulationseinstellungen ueberfuehren. Bis dahin ist als Bruecke eine explizite Uebergabe der aktuellen `checkSettings.wireAmpacity` an die Simulation zu planen.
   - Toleranz `0.01 A` analog zu `src/check/wireProtection.ts`.

4. [x] Issue-Verhalten umsetzen
   - Bei falschem Lastmodus genau ein Info-Issue erzeugen, mit Hinweis auf den benoetigten Simulationsmodus.
   - Bei richtigem Lastmodus pro ueberlasteter Leitung ein Error-Issue erzeugen.
   - Targets: sichtbare Wire (`{ type: "wire", edgeId }`).
   - Issue-ID stabil halten, z.B. `simulation-wire-ampacity:${edgeId}` und fuer USB-Leiter `simulation-wire-ampacity:${edgeId}:vbus`.
   - Beschreibung mit simuliertem Strom, Grenzwert und Querschnitt/Einheit formatieren.

5. [x] UI-/Datenfluss fuer Ampacity-Einstellungen klaeren
   - Pruefen, wo `checkSettings.wireAmpacity` aktuell gespeichert und exportiert wird.
   - Simulation muss dieselben Verlegeart-/Temperaturwerte verwenden wie Diagramm-Checks.
   - Wenn die Simulation im Worker laeuft, Worker-Request-Typ erweitern.

6. [x] Uebersetzungen ergaenzen
   - `src/translations/en.json`
   - `src/translations/de.json`
   - `src/translations/zh.json`
   - Texte fuer:
     - Leitung ueber Stromtragfaehigkeit.
     - Simulation nicht im erforderlichen Volllastmodus.

7. [ ] Tests ergaenzen
   - Simulation-Fixture mit ueberlasteter Leitung bei korrektem Volllastmodus.
   - Fixture mit gleicher Schaltung bei reduzierter Helligkeit oder falschem Farbmodus: nur Info-Issue, kein Ampacity-Error.
   - RGB-only-Fall: `RGB_WHITE` bei 100% erlaubt.
   - RGBW- oder gemischter Fall: nur `SEPARATE_AND_RGB_WHITE` bei 100% erlaubt.
   - USB-Power-Pair-Fall mit Leiterbewertung, falls vorhandene Testinfrastruktur das sinnvoll abbildet.
   - Bestehende Regressionen weiter ausfuehren: `npm run test:ltspice` und relevante Diagramm-/Simulationstestskripte.

8. [x] Dokumentation aktualisieren
   - `Docs/SIMUL_CONCEPT.MD`: neue Simulation-Check-Regel dokumentieren.
   - `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`: klarstellen, dass die alte `powerWireCrossSectionTooSmall`-Idee durch einen Simulation-Check ersetzt wird, sobald umgesetzt.
   - Bei Solver-Aenderungen waere `Docs/SOLVER.MD` zu aktualisieren; fuer diese Regel ist voraussichtlich keine Solver-Aenderung noetig.

## Voraussichtliche Dateien

- `src/simulation/runSimulation.ts`
- `src/simulation/simulationTypes.ts`
- `src/simulation/simulationWorker.ts`
- `src/simulation/runSimulationInWorker.ts`
- optional neu: `src/simulation/simulationAmpacityChecks.ts`
- optional: `src/check/checkSettingsStore.ts` bzw. Datenfluss der Check-Einstellungen
- `src/translations/en.json`
- `src/translations/de.json`
- `src/translations/zh.json`
- `Docs/SIMUL_CONCEPT.MD`
- `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`
