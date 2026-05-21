
**Gute Testfälle**
Lege pro Fall idealerweise drei Dateien an, z.B. unter `simulation_test/ltspice/`:

```text
simulation_test/ltspice/
  ws2814_single_feed_1m/
    diagram.json
    expected.json
    notes.md
```

`diagram.json`: Export aus WLED-Wiring für genau diesen Aufbau.

`expected.json`: Die gemessenen/aus LTSpice exportierten Sollwerte.

`notes.md`: Kurzbeschreibung, Annahmen und LTSpice-Schaltung.

**Expected-Format**
So wäre es für mich am besten nutzbar:

```json
{
  "source": "LTSpice",
  "case": "ws2814_single_feed_1m",
  "settings": {
    "brightnessPercent": 100,
    "ledColorMode": "RGB_WHITE"
  },
  "tolerance": {
    "voltageV": 0.05,
    "currentA": 0.02,
    "voltageDropV": 0.05
  },
  "expected": {
    "pins": [
      {
        "nodeTechnicalID": "PSU_HP",
        "handleId": "Vout1",
        "voltageV": 24.0
      }
    ],
    "wires": [
      {
        "label": "psu_to_led_vplus",
        "currentA": 1.2,
        "voltageDropV": 0.15
      }
    ],
    "ledStrips": [
      {
        "nodeTechnicalID": "WS2814_24V_60LPM",
        "minDeltaVoltageV": 22.8,
        "startVoltageV": 23.85,
        "endVoltageV": 22.8,
        "totalCurrentA": 1.2
      }
    ]
  }
}
```

Muss nicht exakt dieses Schema sein, aber wichtig sind: Einheiten, Toleranzen, Simulationseinstellungen und eindeutige Zuordnung der Messpunkte.

**Welche Werte Besonders Nützlich Sind**
Für LED-Streifen bitte möglichst:

- Versorgungsspannung am PSU-Ausgang
- Spannung am LED-Start: `V+`, `GND`, Differenzspannung
- Spannung am LED-Ende: `V+`, `GND`, Differenzspannung
- bei Middle-Einspeisungen auch die Middle-Punkte
- Gesamtstrom aus dem Netzteil
- Strom je Einspeisung, falls mehrere Einspeisungen
- Widerstände der V+ und GND-Pfade pro Meter
- LED-Strommodell/Parameter, die in LTSpice verwendet wurden

**Empfohlene Erste Beispiele**
1. 1 m WS2814, Einspeisung nur am Anfang, kurze dicke Zuleitung.
2. 5 m WS2814, Einspeisung nur am Anfang, sichtbarer Spannungsabfall.
3. 5 m WS2814, Einspeisung Anfang und Ende.
4. Gleicher Fall mit niedriger Helligkeit, z.B. 25%.
5. Ein Fall mit bewusst dünner/langer Zuleitung.

Wenn du mit einem Fall startest, nimm am besten Fall 1. Klein, übersichtlich, und perfekt zum Kalibrieren der Grundlogik.