import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "ESP32C3_supermini",
    "version": 1,
    "display": {
      "name": "compData.ESP32C3_supermini.name",
      "descriptionShort": "compData.ESP32C3_supermini.descriptionShort",
      "description": "compData.ESP32C3_supermini.description",
      "group": "controller"
    },
    "geometry": {
      "image": {
        "url": "./ESP32C3_supermini.png",
        "width": 110,
        "height": 83
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "USB",
        "name": "USB",
        "description": "USB (power and data)",
        "type": "source",
        "x": 17,
        "y": 41,
        "xalign": "start",
        "yalign": "start",
        "width": 35,
        "height": 40,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "#8c8c8c",
          "lineWidth": 2,
          "radius": "5%"
        },
        "functions": [
          "usb_full"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5.5
        },
        "behavior": {}
      },
      {
        "id": "5V",
        "name": "5V",
        "description": "5V",
        "type": "source",
        "x": 14,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "suppl_in",
          "suppl_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5.5
        },
        "behavior": {}
      },
      {
        "id": "GND",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 26,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "black",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {}
      },
      {
        "id": "3V3",
        "name": "3.3 V",
        "description": "3.3 V",
        "type": "source",
        "x": 38,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "suppl_in",
          "suppl_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 3,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO4",
        "name": "GPIO 4",
        "description": "Digital In/Out, Analog In (ADC1)",
        "type": "source",
        "x": 50,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO3",
        "name": "GPIO 3",
        "description": "Digital In/Out, Analog In (ADC1)",
        "type": "source",
        "x": 62,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO2",
        "name": "GPIO 2",
        "description": "Digital In/Out, Analog In (ADC1); be careful: strapping pin, do not push LOW at boot",
        "type": "source",
        "x": 72,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO1",
        "name": "GPIO 1",
        "description": "Digital In/Out, Analog In (ADC1)",
        "type": "source",
        "x": 84,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO0",
        "name": "GPIO 0",
        "description": "Digital In/Out, Analog In (ADC1)",
        "type": "source",
        "x": 96,
        "y": 6,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO5",
        "name": "GPIO 5",
        "description": "Digital In/Out, Analog In (ADC2)",
        "type": "source",
        "x": 14,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out",
          "an_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO6",
        "name": "GPIO 6",
        "description": "Digital In/Out",
        "type": "source",
        "x": 26,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO7",
        "name": "GPIO 7",
        "description": "Digital In/Out; onboard RGB LED",
        "type": "source",
        "x": 38,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO8",
        "name": "GPIO 8",
        "description": "Digital In/Out; be careful: strapping pin, do not push LOW at boot",
        "type": "source",
        "x": 50,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO9",
        "name": "GPIO 9",
        "description": "Digital In/Out",
        "type": "source",
        "x": 62,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO10",
        "name": "GPIO 10",
        "description": "Digital In/Out",
        "type": "source",
        "x": 73,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO20",
        "name": "GPIO 20 (RX)",
        "description": "Digital In/Out; be careful: used for USB",
        "type": "source",
        "x": 85,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO21",
        "name": "GPIO 21 (TX)",
        "description": "Digital In/Out; be careful: used for USB",
        "type": "source",
        "x": 97,
        "y": 77,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      }
    ],
    "simulation": {
      "version": 1,
      "elements": [
        {
          "id": "idle-load-5V",
          "type": "constantPowerSink",
          "terminals": {
            "positive": "5V",
            "negative": "GND1"
          },
          "parameters": {
            "powerW": 0.3,
            "minVoltageV": 3
          }
        },
        {
          "id": "idle-load-3V3",
          "type": "constantPowerSink",
          "terminals": {
            "positive": "3V3",
            "negative": "GND1"
          },
          "parameters": {
            "powerW": 0.3,
            "minVoltageV": 3
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "name": "compData.ESP32C3_supermini.name",
      "description": "compData.ESP32C3_supermini.descriptionShort",
      "popover": {
        "description": "compData.ESP32C3_supermini.description"
      },
      "technicalID": "ESP32C3_supermini",
      "technicalVersion": 1,
      "group": "controller",
      "image": {
        "url": "./ESP32C3_supermini.png",
        "width": 110,
        "height": 83
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "idle-load-5V",
            "type": "constantPowerSink",
            "terminals": {
              "positive": "5V",
              "negative": "GND1"
            },
            "parameters": {
              "powerW": 0.3,
              "minVoltageV": 3
            }
          },
          {
            "id": "idle-load-3V3",
            "type": "constantPowerSink",
            "terminals": {
              "positive": "3V3",
              "negative": "GND1"
            },
            "parameters": {
              "powerW": 0.3,
              "minVoltageV": 3
            }
          }
        ]
      },
      "handles": [
        {
          "borderColor": "#8c8c8c",
          "borderLineWidth": 2,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "USB (power and data)",
          "functions": [
            "usb_full"
          ],
          "height": 40,
          "hid": "USB",
          "name": "USB",
          "position": "left",
          "postype": "left",
          "tolVmax": 5.5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 35,
          "x": 17,
          "xalign": "start",
          "y": 41,
          "yalign": "start"
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "5V",
          "functions": [
            "suppl_in",
            "suppl_out"
          ],
          "height": 8,
          "hid": "5V",
          "name": "5V",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5.5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 8,
          "x": 14,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 8,
          "hid": "GND",
          "name": "GND",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 26,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "3.3 V",
          "functions": [
            "suppl_in",
            "suppl_out"
          ],
          "height": 8,
          "hid": "3V3",
          "name": "3.3 V",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 3,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 38,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC1)",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO4",
          "name": "GPIO 4",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 50,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC1)",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO3",
          "name": "GPIO 3",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 62,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC1); be careful: strapping pin, do not push LOW at boot",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO2",
          "name": "GPIO 2",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 72,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC1)",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO1",
          "name": "GPIO 1",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 84,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC1)",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO0",
          "name": "GPIO 0",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 96,
          "xalign": "start",
          "y": 6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, Analog In (ADC2)",
          "functions": [
            "dig_in",
            "dig_out",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO5",
          "name": "GPIO 5",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 14,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO6",
          "name": "GPIO 6",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 26,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; onboard RGB LED",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO7",
          "name": "GPIO 7",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 38,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; be careful: strapping pin, do not push LOW at boot",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO8",
          "name": "GPIO 8",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 50,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO9",
          "name": "GPIO 9",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 62,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO10",
          "name": "GPIO 10",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 73,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; be careful: used for USB",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO20",
          "name": "GPIO 20 (RX)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 85,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; be careful: used for USB",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO21",
          "name": "GPIO 21 (TX)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 97,
          "xalign": "start",
          "y": 77,
          "yalign": "start"
        }
      ]
    }
  }
});
