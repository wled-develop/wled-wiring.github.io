# Digital Source Capable Check Plan

Stand: 2026-05-29

## Ziel

Multifunktions-GPIOs wie `GPIO16` mit `functions: ["dig_in", "dig_out"]` sollen fuer passende Regeln als digitale Quelle erkennbar sein, ohne die strenge globale Netzklassifikation `digital_net_type` aufzuloesen.

Das Ziel ist eine zweite, bewusst weichere Semantik:

```text
digitalSourceCapable
```

Sie bedeutet: In diesem Netz ist mindestens ein Pin erreichbar, der digital ausgeben kann. Das ist nicht identisch mit: Dieses Netz ist eindeutig ein digitales Signalnetz.

## Ausgangsproblem

Die aktuelle Netzklassifikation setzt `digital_net_type` nur bei exklusiven digitalen Ausgaengen. Ein Pin mit `dig_in` + `dig_out` wird deshalb nicht als digitale Netzquelle klassifiziert.

Das ist defensiv sinnvoll, weil ein Multifunktions-GPIO je nach Nutzung Eingang oder Ausgang sein kann. Es verhindert, dass unkonfigurierte GPIOs automatisch als aktive digitale Quellen gelten.

Fuer Control-/Enable-Regeln ist diese Logik aber zu streng. Beispiel:

- `ESP32D1mini GPIO16` hat `dig_in` + `dig_out`
- `MHC_SwitchBoard EN1` hat `dig_in`
- `GPIO16 -> EN1` ist fachlich ein gueltiger digitaler Steuerpfad
- `controlledOutputWithoutControlInput` sieht aktuell trotzdem kein `digital_net_type`

## Zielmodell

### Harte Klassifikation bleibt

`digital_net_type` bleibt konservativ:

- nur eindeutige digitale Ausgaenge klassifizieren ein Netz hart als digital
- Multifunktionspins klassifizieren ein Netz nicht automatisch hart als digital
- bestehende Regeln, die bewusst nur eindeutige Digitalnetze wollen, bleiben stabil

### Weiche digitale Quellenfaehigkeit kommt hinzu

Neue Hilfssemantik:

```ts
netHasDigitalSourceCapable(context, netOrHandle)
```

oder als Kontext-Helfer:

```ts
context.hasDigitalSourceCapable(handle)
context.netHasDigitalSourceCapable(net)
```

Bedeutung:

- Ein Netz oder Reachability-Bereich enthaelt mindestens einen Pin mit `dig_out`, `dig_clock_out` oder `dig_backup_out`.
- Dabei darf der Pin zusaetzlich Eingangsfunktionen besitzen, z.B. `dig_in`.
- Passive Serienwiderstaende duerfen fuer Signal-Reachability beruecksichtigt werden.
- Passive Pins selbst sind keine digitale Quelle.

## Nicht-Ziele

- `digital_net_type` nicht global lockern.
- Keine GPIO-Konfigurations-UI einfuehren.
- Keine Heuristik ueber Wire-Farbe, Pin-Name oder Bauteilposition.
- Keine automatische Annahme, dass jeder Multifunktions-GPIO in jeder Regel als Ausgang gelten darf.
- Keine Aenderung der elektrischen Simulation.

## Betroffene Stellen

Voraussichtlich:

- `src/check/checkContext.ts`
- `src/check/rules.ts`
- `src/check/componentSpecificRules.ts`
- `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`
- `Docs/SUGGESTIONS.MD`
- Regressionstest-Fixtures unter `simulation_test/diagram_checks/`

Moeglich, je nach Implementierungsform:

- `src/check/diagramCheckTypes.ts`
- `src/sidebar/DiagramCheckPage.tsx`, falls Debug-Ausgaben neue Netzeigenschaften anzeigen sollen
- `src/translations/en.json`
- `src/translations/de.json`
- `src/translations/zh.json`

## Begriffe

### Exklusive digitale Quelle

Ein Handle hat genau eine klassifikationsrelevante Funktion, z.B. nur:

```json
["dig_out"]
```

Solche Handles duerfen weiterhin `digital_net_type` setzen.

### Digitale Quellenfaehigkeit

Ein Handle kann digital ausgeben, wenn seine Funktionen mindestens eine digitale Ausgangsfunktion enthalten:

```json
["dig_out"]
["dig_in", "dig_out"]
["dig_clock_out"]
["dig_clock_in", "dig_clock_out"]
```

Diese Eigenschaft setzt nicht automatisch `digital_net_type`.

### Digitale Sink-Faehigkeit

Ein Handle kann digital empfangen, wenn seine Funktionen mindestens eine digitale Eingangsfunktion enthalten:

```json
["dig_in"]
["dig_in", "dig_out"]
```

Diese Eigenschaft darf nicht automatisch bedeuten, dass eine Quelle vorhanden ist.

## Umsetzungsschritte

### 1. Bestehende Semantik sichern

- [ ] `classifyNet()` unveraendert konservativ lassen.
- [ ] `hasExclusiveFunction()` fuer `digital_net_type` nicht entfernen.
- [ ] Bestehende Checks identifizieren, die wirklich eine harte Netzklasse brauchen.
- [ ] Bestehende Checks identifizieren, die eher eine erreichbare digitale Quelle brauchen.

Wichtige Fundstellen:

- `classifyNet()` in `src/check/checkContext.ts`
- `digitalSignalSourcesForInput()` in `src/check/rules.ts`
- `hasResolvedDigitalSink()` in `src/check/rules.ts`
- `checkControlledOutputWithoutControlInput()` in `src/check/rules.ts`
- SN74-Regeln in `src/check/componentSpecificRules.ts`

### 2. Hilfsfunktionen fuer Source-Capability einfuehren

Neue interne Helper in `rules.ts` oder zentral in `checkContext.ts`:

- [ ] `isDigitalSourceCapable(handle)`
- [ ] `isDigitalSinkCapable(handle)`
- [ ] `digitalSourceCapableHandlesForInput(context, input)`
- [ ] `netHasDigitalSourceCapable(context, net)`
- [ ] `handleHasDigitalSourceCapableNet(context, handle)`

Empfohlene Definition:

```ts
const digitalSourceFunctions = ["dig_out", "dig_clock_out", "dig_backup_out"];

const isDigitalSourceCapable = (handle: CheckHandle) => (
  digitalSourceFunctions.some((fn) => hasFunction(handle, fn))
);
```

Die bestehende Funktion `isDigitalSource()` kann entweder so umgedeutet oder bewusst getrennt werden. Empfehlung: getrennte Namen verwenden, damit harte und weiche Semantik nicht vermischt werden.

### 3. Reachability beachten

Die neue Quellenfaehigkeit soll nicht nur im selben Elementary Net suchen, sondern dieselbe Signal-Reachability nutzen wie digitale Signalchecks:

- [ ] Wires im Elementary Net beruecksichtigen.
- [ ] interne `short`-Verbindungen beruecksichtigen.
- [ ] Serienwiderstand-Pass-Through beruecksichtigen.
- [ ] Nach der geplanten passiven Resistor-Umstellung auch passive Resistor-Pins beruecksichtigen.

Wichtig:

- [ ] Supply/GND-Verbindungen duerfen nicht als Signal-Reachability missbraucht werden.
- [ ] Passive Lastwiderstaende duerfen keine digitale Quelle erzeugen.
- [ ] Multifunktions-GPIOs duerfen nur dann als Quelle gelten, wenn wirklich `dig_out` in den Funktionen steht.

### 4. `controlledOutputWithoutControlInput` umstellen

Diese Regel ist der Hauptnutzer der neuen Semantik.

Aktuell:

```ts
handleNetHasClassification(context, control, "digital_net_type")
```

Ziel:

```ts
controlHandleHasDigitalSourceCapable(context, control)
```

Dabei gilt:

- [ ] `EN1` direkt an exklusivem `dig_out`: gueltig.
- [ ] `EN1` direkt an `dig_in` + `dig_out` GPIO: gueltig.
- [ ] `EN1` ueber intern gebruecktes `EN2`: gueltig, wenn eine der Short-Alternativen digital-source-capable ist.
- [ ] `EN1` nur an anderem `dig_in`: Fehler bleibt.
- [ ] `EN1` nur an GND/Supply ohne digitale Quelle: Fehler bleibt, solange keine explizite "tied high/low allowed"-Regel definiert ist.

### 5. Digitale Sink-Aufloesung pruefen

`hasResolvedDigitalSink()` prueft aktuell, ob eine digitale Quelle erreichbar ist, eine gueltige Bias-Verbindung existiert oder ein LED-Backup-Spezialfall greift.

Pruefen:

- [ ] Soll ein `dig_in` hinter einem Multifunktions-GPIO als aufgeloest gelten?
- [ ] Fuer LED-Data-In kann das sinnvoll sein, wenn ein Controller-GPIO `dig_in` + `dig_out` als Datenquelle dient.
- [ ] Risiko: Ein bidirektionaler GPIO, der eigentlich Eingang ist, wuerde als Quelle akzeptiert.

Empfehlung:

- [ ] Nicht pauschal alle digitalen Sink-Regeln umstellen.
- [ ] Zunaechst nur Control-/Enable-Regeln umstellen.
- [ ] Danach separate Entscheidung fuer LED-Datenpfade dokumentieren und testen.

### 6. Output-without-consumer pruefen

`signalOutputWithoutConsumer` sucht aktuell Quellen und passende Senken.

Pruefen:

- [ ] Soll ein Multifunktions-GPIO als "Output" fuer diese Warnung gelten?
- [ ] Wenn ja, koennten ungenutzte GPIOs mit Wire als Output ohne Consumer warnen.
- [ ] Wenn nein, bleibt das Verhalten konservativ.

Empfehlung:

- [ ] Fuer diese Regel harte/exklusive Quellen beibehalten.
- [ ] Multifunktions-GPIOs nicht automatisch als "genutzter Output" melden, solange kein Modus bekannt ist.

### 7. Multiple-Sources und Data-Direction pruefen

Diese Regeln koennen stark von einer Lockerung betroffen sein.

- [ ] `multipleSignalSources`: weiterhin nur harte Quellen nutzen.
- [ ] `dataDirectionWrong`: weiterhin auf harten Quellen/Senken oder bestehender Logik lassen.
- [ ] Multifunktions-GPIOs nicht global als Konfliktquelle zaehlen.

Begruendung:

- Mehrere bidirektionale GPIOs in einem Netz sind nicht automatisch mehrere aktive Treiber.
- Ohne Pin-Modus kann der Check sonst zu aggressiv werden.

### 8. Spannungschecks pruefen

`digitalSignalVoltageMismatch` koennte digitale Quellen hinter `dig_in` + `dig_out` erkennen.

Optionen:

- Option A: weiterhin nur harte Quellen verwenden.
- Option B: source-capable Quellen verwenden, aber nur fuer echte digitale Senken.

Empfehlung fuer ersten Schritt:

- [ ] Keine globale Umstellung.
- [ ] Bestehende Spannungschecks unveraendert lassen.
- [ ] Falls spaeter LED-Datenpfade mit Multifunktions-GPIOs besser geprueft werden sollen, eigene Tests anlegen.

### 9. Diagnose/Debug-Ausgabe

Optional:

- [ ] In Net-Debug anzeigen:
  - harte Klassifikationen
  - source-capable digitale Handles
  - sink-capable digitale Handles
- [ ] Normale Nutzer-Issues nicht mit technischem Begriff `digitalSourceCapable` belasten.

### 10. Dokumentation aktualisieren

- [ ] `Docs/DIAGRAMM_CHECKS_CONCEPT.MD` erweitern:
  - harte Netzklassifikation bleibt exklusiv
  - neue weiche Quellenfaehigkeit beschreiben
  - Regeln nennen, die sie verwenden
- [ ] `Docs/SUGGESTIONS.MD` verlinkt diesen Plan.
- [ ] Falls umgesetzt, dieses Dokument als Arbeitsplan mit erledigten Schritten aktualisieren.

## Regressionstest-Matrix

### Muss gueltig sein

- [ ] SwitchBoard: `ESP32 GPIO16 (dig_in + dig_out) -> EN1`, Last an verwendetem VOUT/GND.
  - Erwartung: kein `controlledOutputWithoutControlInput`.
- [ ] SwitchBoard: `EN2` statt `EN1` angeschlossen, `EN1`/`EN2` per interner Short-Verbindung.
  - Erwartung: kein `controlledOutputWithoutControlInput`.
- [ ] Relay/PWMBoard mit Control-Pin an Multifunktions-GPIO.
  - Erwartung: kein Control-Input-Fehler.
- [ ] Control-Pin an exklusivem `dig_out`.
  - Erwartung: weiterhin gueltig.

### Muss weiterhin Fehler erzeugen

- [ ] SwitchBoard-Ausgang verwendet, aber `EN1`/`EN2` unverdrahtet.
  - Erwartung: `controlledOutputWithoutControlInput`.
- [ ] SwitchBoard-Ausgang verwendet, `EN1` nur an passivem Resistor ohne digitale Quelle.
  - Erwartung: `controlledOutputWithoutControlInput`.
- [ ] SwitchBoard-Ausgang verwendet, `EN1` nur an anderem `dig_in` ohne `dig_out`.
  - Erwartung: `controlledOutputWithoutControlInput`.
- [ ] Zwei Multifunktions-GPIOs in einem Netz ohne echte Senke.
  - Erwartung: keine neue aggressive Multiple-Source-Fehlermeldung durch diese Implementierung.
- [ ] LED `dig_in` ohne Quelle.
  - Erwartung: bestehender digitaler Sink-Fehler bleibt.

### Darf nicht neu kaputtgehen

- [ ] `digitalSignalVoltageMismatch` fuer eindeutige digitale Quellen.
- [ ] `multipleSignalSources` fuer eindeutige parallele digitale Ausgaenge.
- [ ] `dataDirectionWrong`.
- [ ] `signalOutputWithoutConsumer` fuer eindeutige digitale Ausgaenge.
- [ ] SN74-Channel-Regeln.
- [ ] SN74-direkt-ohne-Serienwiderstand-Warnung.
- [ ] USB-Power-Pair-Checks.
- [ ] Supply/GND-Polarity-Checks.
- [ ] Fuse-Bypass-Checks.

## Empfohlene Fixtures

Unter `simulation_test/diagram_checks/`:

- [ ] `switchboard_gpio_multifunction_control_valid`
  - SwitchBoard-Ausgang verwendet, `EN1` an GPIO mit `dig_in` + `dig_out`.
  - Erwartung: kein `controlledOutputWithoutControlInput`.
- [ ] `switchboard_gpio_multifunction_control_via_en2_valid`
  - `EN2` an GPIO, VOUT nutzt `controllableBy: EN1`.
  - Erwartung: Short-Gruppe loest Control korrekt auf.
- [ ] `switchboard_control_input_only_still_error`
  - `EN1` an reinem `dig_in`.
  - Erwartung: Control-Input-Fehler.
- [ ] `relay_gpio_multifunction_control_valid`
  - Relais-Ausgang verwendet, Control an Multifunktions-GPIO.
  - Erwartung: kein Control-Input-Fehler.
- [ ] `multifunction_gpio_does_not_create_multiple_sources`
  - Zwei `dig_in` + `dig_out` GPIOs verbunden.
  - Erwartung: keine neue multiple-source-Meldung allein wegen Source-Capability.

## Abnahmekriterien

- [ ] `digital_net_type` bleibt unveraendert konservativ.
- [ ] Neue digitale Quellenfaehigkeit ist als separate Hilfssemantik implementiert.
- [ ] `controlledOutputWithoutControlInput` erkennt Multifunktions-GPIOs mit `dig_out`.
- [ ] Keine globale Lockerung erzeugt neue False Positives bei Multiple-Source-, Direction- oder Output-without-consumer-Regeln.
- [ ] SwitchBoard-Control-Fall mit `GPIO16 -> EN1` ist fehlerfrei, sofern der verwendete Ausgang korrekt verdrahtet ist.
- [ ] Neue Fixtures decken positive und negative Faelle ab.
- [ ] `npm run test:diagram-check` ist gruen.
- [ ] `Docs/DIAGRAMM_CHECKS_CONCEPT.MD` ist nach Implementierung aktualisiert.

## Reihenfolge fuer spaetere Implementierung

1. Fixture fuer `SwitchBoard GPIO16 -> EN1` anlegen, das aktuell rot ist.
2. Helper fuer `isDigitalSourceCapable` und reachability-basierte Abfrage einfuehren.
3. Nur `controlledOutputWithoutControlInput` auf die neue Semantik umstellen.
4. Negative Fixtures fuer reinem `dig_in`, unverdrahteten Control-Pin und passive-only Control-Netze ergaenzen.
5. Regression laufen lassen und neue Multiple-Source-/Direction-Auswirkungen pruefen.
6. Erst danach entscheiden, ob LED-Datenpfade und Spannungschecks ebenfalls source-capable verwenden sollen.
