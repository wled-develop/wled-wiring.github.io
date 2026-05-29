## USB-Power-Pair-Simulation

- `PSU_USB` und `usb_full`-Verbindungen sollen ueber einen expliziten `usbPowerPair`-Simulationsport modelliert werden, damit eine sichtbare USB-Wire intern als VBUS- und GND-Leiter simuliert werden kann.
- Die Detailkonzeption und der Implementierungsplan stehen in `Docs/SIMUL_CONCEPT.MD` unter "USB-Power-Pair-Simulation".
- Geklaerte Entscheidungen: allgemeines ideales `diode`-Element mit `forwardVoltageV = 0.4` fuer `USB.VBUS -> VIN`, ideale Sperrung gegen Rueckspeisung, USB-Wire-Presets `AWG24`, `AWG26` als Default und `AWG28`.

## Passive Resistor-Pins

- Der generische `Resistor` sollte langfristig nicht als `dig_in` modelliert werden, sondern passive Pins bekommen, damit er als Last und als Signal-Serienwiderstand ohne Usage-Feld funktionieren kann.
- Detailplan und Pruefmatrix stehen in `Docs/PASSIVE_RESISTOR_CHECK_PLAN.MD`.

## Digital Source Capable Checks

- Multifunktions-GPIOs mit `dig_in` + `dig_out` sollten fuer passende Regeln als digital ausgabefaehig erkannt werden, ohne `digital_net_type` global zu lockern.
- Detailplan und Pruefmatrix stehen in `Docs/DIGITAL_SOURCE_CAPABLE_CHECK_PLAN.MD`.
