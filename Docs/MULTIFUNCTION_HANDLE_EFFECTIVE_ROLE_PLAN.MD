# Multifunction Handle Effective Role Plan

Stand: 2026-05-30

## Ziel

Multifunktionspins sollen in Diagramm-Checks nicht mehr so behandelt werden, als waeren alle ihre `functions` gleichzeitig aktiv. `functions` beschreibt die Faehigkeiten eines Handles. Fuer Signalregeln braucht es zusaetzlich eine kontextbezogene, effektive Rolle pro Netz oder Signal-Reachability-Bereich.

Beispiele:

- Ein Pin mit `dig_in` + `dig_out` ist nicht automatisch gleichzeitig digitale Quelle und digitale Senke.
- Ein Pin mit `dig_in` + `dig_out` + `an_in` ist nicht automatisch gleichzeitig digitaler Ausgang, digitaler Eingang und analoger Eingang.
- Wenn ein Netz einen eindeutigen digitalen Ausgang und einen Multifunktionspin mit `dig_in` + `dig_out` enthaelt, darf der Multifunktionspin als digitaler Eingang verwendet werden. Er darf in diesem Netz dann nicht zusaetzlich als digitale Quelle fuer `multipleSignalSources` oder `signalOutputWithoutConsumer` zaehlen.
- Wenn ein Multifunktionspin in einem konkreten Netz digital als Ausgang verwendet wird, duerfen alternative Eingangsfunktionen desselben Pins, z.B. `an_in`, keine separaten "Eingang ohne Quelle"-Fehler erzeugen.

Das Ziel ist keine automatische GPIO-Konfiguration, sondern eine konservative Rollenaufloesung fuer Diagramm-Checks, die eindeutige Kontexte nutzt und unklare Kontexte nicht aggressiv als Fehler meldet.

## Ausgangsproblem

Die aktuelle Check-Logik arbeitet an vielen Stellen direkt mit `handle.functions`, `net.sourceHandles` und `net.sinkHandles`.

In `src/check/checkContext.ts` wird ein Handle als Quelle gezaehlt, sobald es irgendeine Ausgangsfunktion besitzt, und als Senke, sobald es irgendeine Eingangsfunktion besitzt. Dadurch kann dasselbe Handle in einem Netz gleichzeitig Quelle und Senke sein.

Das erzeugt False Positives:

1. Ein Netz verbindet zwei Pins:
   - Pin A: `dig_in` + `dig_out`
   - Pin B: `dig_out`

   Fachlich kann Pin A als digitaler Eingang und Pin B als digitaler Ausgang verwendet werden. Aktuell entstehen aber:

   - `multipleSignalSources`, weil beide Pins als digitale Quellen zaehlen.
   - `signalOutputWithoutConsumer`, weil Pin A zusaetzlich als unbenutzter Ausgang betrachtet wird.

2. Ein Netz verbindet:
   - Pin A: `dig_in` + `dig_out` + `an_in`
   - Pin B: `dig_in`

   Fachlich kann Pin A als digitaler Ausgang und Pin B als digitaler Eingang verwendet werden. Aktuell kann zusaetzlich `signalSinkWithoutSource` fuer Analog entstehen, weil `an_in` blind als verwendeter analoger Eingang gewertet wird.

## Kernprinzip

### Capabilities bleiben unveraendert

`CheckHandle.functions` bleibt die normalisierte Liste der moeglichen Funktionen eines Handles.

Diese Liste wird weiterhin gebraucht fuer:

- Komponentendefinition und Diagnose
- Netzklassifikation
- Anzeige und Beschreibung
- Regeln, die bewusst Capability pruefen, z.B. `controlledOutputWithoutControlInput`
- Kompatibilitaetslogik fuer alte Komponenten

### Effektive Rollen kommen hinzu

Signalregeln sollen nicht direkt fragen:

```ts
hasFunction(handle, 'dig_out')
```

wenn sie eigentlich wissen wollen:

```text
Wird dieses Handle in diesem Netz effektiv als digitaler Ausgang verwendet?
```

Dafuer wird eine neue interne Auswertung eingefuehrt, z.B.:

```ts
type EffectiveSignalKind = 'digital' | 'pwm' | 'analog' | 'audio' | 'usb';
type EffectiveSignalDirection = 'source' | 'sink';

type EffectiveSignalRole = {
  handle: CheckHandle;
  signalId: EffectiveSignalKind;
  direction: EffectiveSignalDirection;
  functions: string[];
  confidence: 'hard' | 'inferred';
  reason: string;
};
```

Der konkrete Typ kann anders aussehen. Wichtig ist die Trennung:

- Capability: Der Pin kann etwas.
- Effective Role: Der Pin wird in diesem Netz fuer einen konkreten Check als etwas verwendet.

## Zielmodell fuer digitale Signale

### Harte digitale Quellen

Ein Handle ist eine harte digitale Quelle, wenn es nur eine eindeutige digitale Ausgangsrolle hat oder durch die bestehende konservative Klassifikation bereits eindeutig als Quelle wirkt.

Beispiele:

```json
["dig_out"]
["dig_clock_out"]
["dig_backup_out"]
```

Diese Handles duerfen weiterhin:

- `digital_net_type` klassifizieren
- bei `multipleSignalSources` als Quelle zaehlen
- bei `signalOutputWithoutConsumer` als Ausgang geprueft werden
- fuer Spannungschecks als digitale Quelle dienen

### Multifunktions-Digitalpins

Ein Handle mit digitaler Eingangs- und Ausgangsfaehigkeit ist ambivalent:

```json
["dig_in", "dig_out"]
["dig_clock_in", "dig_clock_out"]
["dig_backup_in", "dig_backup_out"]
["dig_in", "dig_out", "an_in"]
```

Es darf nicht pauschal als aktive Quelle behandelt werden.

Rollenaufloesung:

- Wenn im selben Signalkontext mindestens eine harte passende Quelle und keine widersprechende eindeutige Rolle vorliegt, kann der Multifunktionspin als passende Senke interpretiert werden.
- Wenn im selben Signalkontext mindestens eine harte passende Senke und keine harte Quelle vorliegt, kann der Multifunktionspin als passende Quelle interpretiert werden.
- Wenn mehrere Multifunktionspins ohne harte Gegenrolle verbunden sind, bleibt die Rolle unklar. Daraus soll kein Nutzerfehler `multipleSignalSources` entstehen.
- Wenn eine effektive Rolle fuer einen Signaltyp gewaehlt wurde, werden alternative Funktionen desselben Handles fuer generische Quelle-/Senke-ohne-Gegenstueck-Regeln in diesem Kontext nicht zusaetzlich ausgewertet.

### Keine globale Umdeutung

Die Netzklassifikation `digital_net_type` soll nicht einfach auf alle `dig_out`-faehigen Pins erweitert werden. Sie bleibt konservativ, damit bestehende Sicherheits- und Mischklassifikationsregeln nicht aggressiver werden.

Die effektive Rolle ist eine Auswertung fuer konkrete Signalregeln, nicht die neue Wahrheit des Netzes.

## Zielmodell fuer analoge und andere Signale

Das gleiche Prinzip gilt fuer andere Signalarten:

- `an_in` ist nur dann ein effektiv verwendeter analoger Eingang, wenn der Kontext analog ist oder keine andere passende effektive Rolle fuer dasselbe Handle gefunden wurde.
- `an_out` bleibt eine harte analoge Quelle, wenn sie exklusiv oder eindeutig ist.
- PWM, Audio und USB sollten langfristig dieselbe Infrastruktur nutzen, auch wenn die ersten Bugfixes digitale und analoge Kombinationen betreffen.

Wichtig: Analoge LED-PWM-Lastanschluesse (`pwm_in_R`, `pwm_in_G`, `pwm_in_B`, `pwm_in_W`, `pwm_in_WW`) haben bereits Sondersemantik. Die neue Rollenaufloesung darf diese Regeln nicht versehentlich als normale Logiksignal-Eingaenge verschaerfen.

## Nicht-Ziele

- Keine Heuristik ueber Pin-Namen, Wire-Farben, Bauteilpositionen oder Zeichenrichtung.
- Keine GPIO-Modus-UI in diesem Schritt.
- Keine Annahme, dass ein Multifunktionspin immer Ausgang ist, nur weil `dig_out` enthalten ist.
- Keine globale Lockerung von `digital_net_type`, `analog_net_type` oder anderen Netzklassifikationen.
- Keine Aenderung der elektrischen Simulation.
- Keine Unterdrueckung echter Fehler durch breite Ausnahmebedingungen.
- Keine neue Sonderfallliste nur fuer einzelne Komponenten wie ESP32 oder MHC-Boards.

## Betroffene Dateien

Voraussichtlich:

- `src/check/checkContext.ts`
- `src/check/rules.ts`
- `src/check/componentSpecificRules.ts`
- `src/check/diagramCheckTypes.ts` nur falls Debug-/Diagnosedaten typisiert werden sollen
- `src/sidebar/DiagramCheckPage.tsx` nur falls effektive Rollen im Net-Debug angezeigt werden sollen
- `src/translations/en.json`
- `src/translations/de.json`
- `src/translations/zh.json`
- `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`
- `Docs/SUGGESTIONS.MD`

Falls Regressionstest-Infrastruktur ergaenzt wird:

- `simulation_test/diagram_checks/` oder ein neuer lokaler Diagramm-Check-Testbereich
- `package.json`, falls ein eigener Testbefehl fehlt

## Betroffene Regeln

### Direkt betroffen

- `multipleSignalSources`
- `signalOutputWithoutConsumer`
- `signalSinkWithoutSource`
- `digitalSignalVoltageMismatch`
- `dataDirectionWrong`

### Zu pruefen

- `clockedLedClockMissing`
- `digitalBackupPairMismatch`
- `controlledOutputWithoutControlInput`
- SN74AHCT125N-spezifische Regeln
- `analogLedColorChannelMultiplePwmSignals`
- `ambiguousMultiFunctionHandle`

### Nicht als erste Umstellung geeignet

Folgende Bereiche sollen nicht als Nebenwirkung veraendert werden:

- Supply/GND-Regeln
- Mains/PE-Regeln
- USB-Power-Pair-Strukturregeln
- Fuse-Bypass-Regeln
- passive Resistor-Pass-Through-Logik

## Implementierungsstrategie

### 1. Bestehendes Verhalten absichern

- [x] Aktuelle Fundstellen dokumentieren, die direkt mit `sourceHandles`, `sinkHandles` oder `handlesWithAnyFunction()` arbeiten.
- [x] Bestehende Signaldefinitionen in `signalRuleDefinitions` als Grundlage weiterverwenden.
- [x] Festhalten, welche Regeln harte Netzklassifikation brauchen und welche effektive Rollen brauchen.
- [x] Sicherstellen, dass `classifyNet()` unveraendert konservativ bleibt.

### 2. Zentrale Signal-Capability-Helfer einziehen

Empfohlen ist eine kleine interne Schicht in `rules.ts` oder ein neues Modul, z.B. `src/check/effectiveSignalRoles.ts`.

Moegliche Helper:

```ts
const signalDefinitions = [
  {
    id: 'digital',
    classification: 'digital_net_type',
    sourceFunctions: ['dig_out', 'dig_clock_out', 'dig_backup_out'],
    sinkFunctions: ['dig_in', 'dig_clock_in', 'dig_backup_in'],
  },
  ...
];
```

Helper:

- [ ] `signalCapabilities(handle, definition)`
- [x] `hasSignalSourceCapability(handle, definition)`
- [x] `hasSignalSinkCapability(handle, definition)`
- [x] `isHardSignalSource(handle, definition)`
- [x] `isHardSignalSink(handle, definition)`
- [x] `signalReachableContext(context, handleOrNet)` als `signalContextHandles(context, net, definition)`

Definition von "hart":

- Fuer den ersten Schritt: exklusiver Output oder bereits als Quelle in einem klassifizierten Netz.
- Nicht hart: gemischte Input/Output-Handles wie `dig_in` + `dig_out`.

### 3. Effektive Rollen pro Signalkontext berechnen

Neue Funktion, z.B.:

```ts
effectiveSignalRolesForNet(context, net, definition)
```

Sie betrachtet:

- alle Handles im Component-Linked Net
- fuer digitale Signale zusaetzlich `signalReachableHandles()` fuer Serienwiderstaende und interne Shorts
- die harte Netzklassifikation
- harte Quellen
- harte Senken
- ambivalente Multifunktionshandles

Vorgeschlagene Prioritaet:

1. Harte Quellen bleiben Quellen.
2. Harte Senken bleiben Senken.
3. Ambivalente Handles werden nur dann inferiert, wenn dadurch ein eindeutiger Quellen-Senken-Kontext entsteht.
4. Ein Handle bekommt pro Signalkontext nur eine effektive Richtung.
5. Wenn ein Handle bereits fuer einen Signaltyp effektiv verwendet wird, werden seine alternativen Signaltypen fuer generische "ohne Quelle/Verbraucher"-Regeln nicht mehr blind ausgewertet.

### 4. Konflikt- und Unklarheitsfaelle definieren

Klare Faelle:

- Ein harter `dig_out` + ein `dig_in`/`dig_out`-Pin:
  - harter Pin = digitale Quelle
  - Multifunktionspin = digitale Senke
  - kein `multipleSignalSources`
  - kein `signalOutputWithoutConsumer`

- Ein `dig_in`/`dig_out`/`an_in`-Pin + ein harter `dig_in`:
  - Multifunktionspin = digitale Quelle
  - harter `dig_in` = digitale Senke
  - kein analoger `signalSinkWithoutSource` fuer `an_in`

- Zwei harte `dig_out`-Pins:
  - beide = digitale Quellen
  - `multipleSignalSources` bleibt Fehler

- Harter `dig_out` + harter `dig_out` + Multifunktionspin:
  - harte Quellen bleiben Konflikt
  - Multifunktionspin kann zusaetzlich Senke sein, aber der Mehrquellenfehler bleibt

Unklare Faelle:

- Zwei `dig_in` + `dig_out`-Pins ohne harte Senke oder harte Quelle:
  - keine sichere effektive Richtung
  - kein `multipleSignalSources`
  - optional Diagnosehinweis, aber kein Nutzerfehler

- Ein einzelner verdrahteter `dig_in` + `dig_out`-Pin ohne Gegenrolle:
  - kein `signalOutputWithoutConsumer`, weil nicht bekannt ist, ob er Ausgang sein soll
  - ggf. bestehende andere Regeln fuer einseitige Bauteilnutzung bleiben massgeblich

- Ein Pin mit `dig_in` + `dig_out` + `an_in` an einem unbekannten oder rein passiven Netz:
  - keine automatische analoge Fehlermeldung, solange kein analoger Kontext vorhanden ist
  - kein digitaler Quellenfehler, solange keine digitale Gegenrolle vorhanden ist

### 5. `multipleSignalSources` umstellen

Aktuell:

- nutzt klassifizierte Netze
- nimmt `net.sourceHandles`
- filtert nach passenden Source-Funktionen

Ziel:

- nutzt effektive Rollen fuer die jeweilige Signaldefinition
- zaehlt nur effektive Quellen
- ambivalente Pins zaehlen nur dann als Quelle, wenn sie im Kontext eindeutig als Quelle inferiert wurden
- harte Mehrfachquellen bleiben Fehler

Akzeptanz:

- [x] Reine `dig_out` + reine `dig_out` verbunden: Fehler bleibt.
- [x] Reine `dig_out` + `dig_in`/`dig_out`: kein Fehler.
- [x] Reine `dig_out` + reine `dig_out` + `dig_in`/`dig_out`: Fehler bleibt.
- [x] Zwei `dig_in`/`dig_out`: kein Nutzerfehler.

### 6. `signalOutputWithoutConsumer` umstellen

Aktuell:

- betrachtet alle Source-Handles in klassifizierten Netzen
- dadurch wird ein Multifunktionspin als unbenutzter Ausgang gemeldet, obwohl er als Eingang dienen kann

Ziel:

- nur effektive Quellen pruefen
- harte Quellen ohne effektive Senke bleiben Warnung
- ambivalente Pins werden nur dann als Output ohne Verbraucher gemeldet, wenn ihre effektive Rolle eindeutig Output ist

Akzeptanz:

- [x] Reiner `dig_out` ohne digitale Senke: Warnung bleibt.
- [x] Reiner `dig_out` an `dig_in`/`dig_out`: keine Warnung.
- [x] Zwei reine `dig_out` ohne Senke: Richtung-/Mehrquellenfehler bleibt, Output-Warnung kann wie bisher unterdrueckt werden.
- [x] Zwei `dig_in`/`dig_out` ohne eindeutige Senke: keine neue Warnung.

### 7. `signalSinkWithoutSource` umstellen

Aktuell:

- betrachtet alle Handles mit Sink-Funktionen
- erzeugt fuer alternative Funktionen wie `an_in` eigene Fehler, auch wenn derselbe Pin in diesem Netz digital verwendet wird

Ziel:

- nur effektive Senken pruefen
- wenn ein Handle im Kontext effektiv digital verwendet wird, werden seine alternativen analogen Sink-Funktionen fuer denselben Netzkontext nicht als unversorgt gemeldet
- echte analoge Eingange ohne analoge Quelle bleiben Fehler

Akzeptanz:

- [x] Reines `an_in` ohne `an_out`: Fehler bleibt.
- [x] `dig_in` + `dig_out` + `an_in` an reinem `dig_in`: kein analoger Fehler, digitale Rolle ist Quelle.
- [x] `dig_in` + `an_in` an `an_out`: analog darf als effektive Senke gelten.
- [x] `dig_in` + `an_in` an `dig_out`: digital darf als effektive Senke gelten.
- [x] `dig_in` + `an_in` ohne Quelle: unklar; keine aggressive Doppelmeldung. Falls eine Meldung entsteht, muss sie die tatsaechlich relevante angeschlossene Rolle beschreiben.

### 8. `digitalSignalVoltageMismatch` pruefen

Diese Regel nutzt digitale Quellen ueber `signalReachableHandles()`. Aktuell kann ein Multifunktionspin mit `dig_out` als Quelle erscheinen.

Ziel:

- Spannungschecks sollen nur effektive digitale Quellen gegen effektive digitale Senken pruefen.
- Ein Multifunktionspin, der im Kontext als digitale Senke inferiert wurde, darf nicht gleichzeitig als Quelle fuer einen Spannungsmismatch dienen.
- Harte Quellen bleiben voll geprueft.

Akzeptanz:

- [x] Reiner 5-V-`dig_out` an 3.3-V-`dig_in`: Fehler bleibt.
- [x] Reiner 5-V-`dig_out` an 3.3-V-`dig_in`/`dig_out`: Fehler bleibt, weil der Multifunktionspin effektiv Senke ist.
- [x] 3.3-V-`dig_in`/`dig_out` an reines 5-V-`dig_in`: Mismatch nur dann, wenn der Multifunktionspin effektiv Quelle ist und seine Spannung aufloesbar ist.
- [x] Zwei ambivalente GPIOs ohne klare Richtung erzeugen keinen Mismatch.

### 9. `dataDirectionWrong` pruefen

Diese Regel erkennt aktuell Output-only- und Input-only-Netze.

Ziel:

- harte Output-only-Netze bleiben Fehler.
- harte Input-only-Netze bleiben Fehler.
- Multifunktionspins duerfen nicht automatisch ein Output-only-Netz erzeugen.
- Wenn eine effektive Rollenaufloesung bereits eine gueltige Quelle-Senke-Beziehung ergibt, darf `dataDirectionWrong` nicht zusaetzlich ausloesen.

Akzeptanz:

- [x] Zwei reine `dig_out`: Richtung/Mehrquellenfehler bleibt.
- [x] Zwei reine `dig_in`: Eingang-ohne-Quelle/Richtung bleibt.
- [x] Reiner `dig_out` an `dig_in`/`dig_out`: kein Richtungfehler.
- [x] `dig_in`/`dig_out` an reinem `dig_in`: kein Richtungfehler.

### 10. Diagnose fuer unklare Multifunktionsrollen

Normale Nutzer sollen nicht mit unklaren technischen Rollenhinweisen gestoert werden.

Optional fuer Diagnosemodus:

- [x] Anzeige, welche effektive Rolle je Handle/Netz gewaehlt wurde.
- [x] Anzeige, warum eine Rolle nicht eindeutig war.
- [x] `ambiguousMultiFunctionHandle` um erlaubte Kombinationen erweitern:
  - `dig_in|dig_out|an_in`
  - `dig_clock_in|dig_clock_out`
  - `dig_backup_in|dig_backup_out`

Dabei soll `ambiguousMultiFunctionHandle` weiterhin Entwickler-/Diagnosehinweis bleiben.

### 11. Dokumentation aktualisieren

Nach Implementierung:

- [x] `Docs/DIAGRAMM_CHECKS_CONCEPT.MD` um Capabilities vs. Effective Roles erweitern.
- [x] Beschreibung von `multipleSignalSources`, `signalOutputWithoutConsumer`, `signalSinkWithoutSource`, `digitalSignalVoltageMismatch` aktualisieren.
- [x] `Docs/DIGITAL_SOURCE_CAPABLE_CHECK_PLAN.MD` ergaenzen oder als Teilaspekt dieses Plans referenzieren.
- [ ] `Docs/SUGGESTIONS.MD` aktualisieren, falls offene Folgeideen bleiben.
- [x] `Docs/TODO.MD` nur dann erweitern, wenn waehrend der Umsetzung konkrete Bugs oder dringende Folgearbeiten gefunden werden.

## Regressionstest-Matrix

### Muss gueltig sein

- [x] `dig_out` verbunden mit `dig_in` + `dig_out`.
  - Erwartung: kein `multipleSignalSources`, kein `signalOutputWithoutConsumer`.

- [x] `dig_in` + `dig_out` verbunden mit reinem `dig_in`.
  - Erwartung: digitale Verbindung gueltig, wenn Spannung passt.

- [x] `dig_in` + `dig_out` + `an_in` verbunden mit reinem `dig_in`.
  - Erwartung: kein analoger `signalSinkWithoutSource`.

- [x] `dig_in` + `an_in` verbunden mit reinem `dig_out`.
  - Erwartung: digitaler Eingang gueltig, kein analoger Fehler.

- [x] `dig_in` + `an_in` verbunden mit reinem `an_out`.
  - Erwartung: analoger Eingang gueltig, kein digitaler Fehler.

- [x] Reiner `dig_out` ueber passiven Serienwiderstand an `dig_in` + `dig_out`.
  - Erwartung: Serienwiderstand-Reachability bleibt gueltig.

### Muss weiterhin Fehler erzeugen

- [x] Zwei reine `dig_out` verbunden.
  - Erwartung: `multipleSignalSources` oder spezifischer Richtungfehler bleibt.

- [x] Zwei reine `dig_out` plus ein `dig_in` + `dig_out` verbunden.
  - Erwartung: harte Mehrquellen bleiben Fehler.

- [x] Reiner `dig_out` ohne erreichbare digitale Senke.
  - Erwartung: `signalOutputWithoutConsumer` bleibt Warnung.

- [x] Reiner `dig_in` ohne erreichbare digitale Quelle oder Bias.
  - Erwartung: `signalSinkWithoutSource` bleibt Fehler.

- [x] Reiner `an_in` ohne `an_out`.
  - Erwartung: analoger `signalSinkWithoutSource` bleibt Fehler.

- [x] 5-V-`dig_out` an 3.3-V-`dig_in`.
  - Erwartung: `digitalSignalVoltageMismatch` bleibt Fehler.

### Darf nicht neu kaputtgehen

- [x] `controlledOutputWithoutControlInput` mit Multifunktions-GPIO als Control-Quelle.
- [x] LED-Backup-Pair-Regeln.
- [x] Clocked-LED-Clock-Regeln.
- [x] SN74AHCT125N-Kanalregeln.
- [x] SN74AHCT125N-direkt-an-LED-ohne-Serienwiderstand-Warnung.
- [x] Analoge LED-Farbkanalregeln.
- [x] USB-Power-Pair-Regeln.
- [x] Supply-/GND-/Mains-/PE-Regeln.
- [x] Fuse-Bypass-Regeln.
- [x] Passive Resistor-Signal-Pass-Through-Regeln.

## Empfohlene Implementierungsreihenfolge

1. Bestehende False-Positive-Faelle als Regressionstests oder reproduzierbare Fixtures erfassen.
2. Neues Modul oder Helper-Gruppe fuer Signal-Capabilities und effektive Rollen einfuehren.
3. `multipleSignalSources` auf effektive Quellen umstellen.
4. `signalOutputWithoutConsumer` auf effektive Quellen/Senken umstellen.
5. `signalSinkWithoutSource` auf effektive Senken umstellen und alternative Funktionen desselben effektiv verwendeten Handles ignorieren.
6. `digitalSignalVoltageMismatch` auf effektive digitale Quellen/Senken pruefen.
7. `dataDirectionWrong` gegen die neue Rollenauflosung testen und bei Bedarf anpassen.
8. Diagnoseausgabe optional erweitern.
9. Dokumentation und Uebersetzungen aktualisieren.
10. Regressionstest-Matrix komplett ausfuehren.

## Offene Entscheidungen

- Soll ein ambivalenter Pin mit `dig_in` + `dig_out` an einem reinen `dig_in` immer als Quelle inferiert werden, oder nur fuer bekannte Controller-Komponenten?
  - Empfehlung: nicht komponentenspezifisch, sondern rollenbasiert. Ein reiner digitaler Eingang als Gegenrolle ist ein ausreichend starker Kontext.

- Soll ein ambivalenter Pin mit `dig_in` + `dig_out` an einem reinen passiven Netz eine Warnung erzeugen?
  - Empfehlung: nein. Ohne Gegenrolle ist die Nutzung unklar, aber nicht sicher falsch.

- Soll es spaeter eine explizite Pin-Modus-Konfiguration geben?
  - Empfehlung: spaeter separat betrachten. Diese Implementierung soll ohne neue UI auskommen.

- Sollen effektive Rollen in `CheckNet` gespeichert werden oder nur regelintern berechnet werden?
  - Empfehlung: zunaechst regelintern oder in einem kleinen Helper mit Cache. Erst in `CheckNet` aufnehmen, wenn mehrere UI-/Debug-/Regelbereiche denselben Zustand brauchen.

- Wie sollen mehrere Signaltypen auf demselben Multifunktionspin priorisiert werden?
  - Empfehlung: Der vorhandene Netzkontext entscheidet. Harte Gegenrollen gewinnen. Ohne Kontext keine automatische Priorisierung.

## Abnahmekriterien

- [x] `functions` bleibt Capability-Metadatum.
- [x] Signalregeln verwenden fuer Multifunktionshandles eine effektive Rollenaufloesung.
- [x] `digital_net_type` und andere Netzklassifikationen bleiben konservativ.
- [x] Die beiden gemeldeten False Positives sind beseitigt.
- [x] Harte Mehrquellenfehler fuer mehrere eindeutige Outputs bleiben erhalten.
- [x] Reine Eingang-ohne-Quelle-Fehler bleiben erhalten.
- [x] Alternative Funktionen eines effektiv verwendeten Multifunktionspins erzeugen keine separaten False Positives.
- [x] Keine neuen Heuristiken ueber Namen, Farben oder Positionen.
- [x] Konzeptdokumentation ist nach Implementierung aktualisiert.
