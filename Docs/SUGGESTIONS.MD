## USB-Power-Pair-Simulation

- `PSU_USB` und `usb_full`-Verbindungen sollen ueber einen expliziten `usbPowerPair`-Simulationsport modelliert werden, damit eine sichtbare USB-Wire intern als VBUS- und GND-Leiter simuliert werden kann.
- Die Detailkonzeption und der Implementierungsplan stehen in `Docs/SIMUL_CONCEPT.MD` unter "USB-Power-Pair-Simulation".
- Geklaerte Entscheidungen: allgemeines ideales `diode`-Element mit `forwardVoltageV = 0.4` fuer `USB.VBUS -> VIN`, ideale Sperrung gegen Rueckspeisung, USB-Wire-Presets `AWG24`, `AWG26` als Default und `AWG28`.
