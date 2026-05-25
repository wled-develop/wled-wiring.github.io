import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "ESP32_30P",
    "version": 1,
    "display": {
      "name": "compData.ESP32_30P.name",
      "descriptionShort": "compData.ESP32_30P.descriptionShort",
      "description": "compData.ESP32_30P.description",
      "group": "controller"
    },
    "geometry": {
      "image": {
        "url": "./ESP32_30P.jpg",
        "width": 119,
        "height": 225
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "usb",
        "name": "USB",
        "description": "USB (power and data)",
        "type": "source",
        "x": 58.5,
        "y": 210.5,
        "xalign": "start",
        "yalign": "start",
        "width": 35,
        "height": 30,
        "postype": "bottom",
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
          "toleranceMax": 5
        },
        "behavior": {}
      },
      {
        "id": "EN",
        "name": "Enable",
        "description": "Reset input",
        "type": "source",
        "x": 5.3,
        "y": 24.2,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "blue",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "rst"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {}
      },
      {
        "id": "GPIO36",
        "name": "GPIO 36",
        "description": "Digital In, Analog in",
        "type": "source",
        "x": 5.3,
        "y": 35.1,
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
        "id": "GPIO39",
        "name": "GPIO 39",
        "description": "Digital In, Analog in",
        "type": "source",
        "x": 5.3,
        "y": 46,
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
        "id": "GPIO34",
        "name": "GPIO 34",
        "description": "Digital In, Analog in",
        "type": "source",
        "x": 5.3,
        "y": 56.7,
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
        "id": "GPIO35",
        "name": "GPIO 35",
        "description": "Digital In, Analog in",
        "type": "source",
        "x": 5.3,
        "y": 67.4,
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
        "id": "GPIO32",
        "name": "GPIO 32",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 78.1,
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
        "id": "GPIO33",
        "name": "GPIO 33",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 88.8,
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
        "id": "GPIO25",
        "name": "GPIO 25",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 99.5,
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
        "id": "GPIO26",
        "name": "GPIO 26",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 111,
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
        "id": "GPIO27",
        "name": "GPIO 27",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 121.7,
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
        "id": "GPIO14",
        "name": "GPIO 14",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5.3,
        "y": 132.2,
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
        "id": "GPIO12",
        "name": "GPIO 12",
        "description": "Digital In/Out (be careful: boot fails if pulled high, strapping pin)",
        "type": "source",
        "x": 5.1,
        "y": 142.8,
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
        "id": "GPIO13",
        "name": "GPIO 13",
        "description": "Digital In/Out",
        "type": "source",
        "x": 5,
        "y": 154,
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
        "id": "GND1",
        "name": "GND (1)",
        "description": "Ground",
        "type": "source",
        "x": 5,
        "y": 164.6,
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
        "id": "5V",
        "name": "5V",
        "description": "5V",
        "type": "source",
        "x": 5,
        "y": 175.3,
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
        "id": "GPIO23",
        "name": "GPIO 23",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.7,
        "y": 24.2,
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
        "id": "GPIO22",
        "name": "GPIO 22",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.7,
        "y": 35.1,
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
        "id": "GPIO1",
        "name": "GPIO 1",
        "description": "Digital In/Out (be careful: used for USB!)",
        "type": "source",
        "x": 113.7,
        "y": 46,
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
        "id": "GPIO3",
        "name": "GPIO 3",
        "description": "Digital In/Out (be careful: used for USB!)",
        "type": "source",
        "x": 113.7,
        "y": 56.7,
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
        "name": "GPIO 21",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.5,
        "y": 67.4,
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
        "id": "GPIO19",
        "name": "GPIO 19",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.5,
        "y": 78,
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
        "id": "GPIO18",
        "name": "GPIO 18",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.5,
        "y": 88.6,
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
        "id": "GPIO5",
        "name": "GPIO 5",
        "description": "Digital In/Out (outputs PWM signal at boot; be careful: strapping pin)",
        "type": "source",
        "x": 113.5,
        "y": 99.2,
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
        "id": "GPIO17",
        "name": "GPIO 17",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.5,
        "y": 111,
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
        "id": "GPIO16",
        "name": "GPIO 16",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.4,
        "y": 121.6,
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
        "id": "GPIO4",
        "name": "GPIO 4",
        "description": "Digital In/Out",
        "type": "source",
        "x": 113.4,
        "y": 132.2,
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
        "id": "GPIO2",
        "name": "GPIO 2",
        "description": "Digital In/Out (connected to on-board LED)",
        "type": "source",
        "x": 113.4,
        "y": 142.8,
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
        "id": "GPIO15",
        "name": "GPIO 15",
        "description": "Digital In/Out (outputs PWM signal at boot; be careful: strapping pin;)",
        "type": "source",
        "x": 113.4,
        "y": 153.4,
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
        "id": "GND2",
        "name": "GND (2)",
        "description": "Ground",
        "type": "source",
        "x": 113.4,
        "y": 164.3,
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
        "x": 113.4,
        "y": 175.6,
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
            "powerW": 0.5,
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
            "powerW": 0.5,
            "minVoltageV": 3
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "name": "compData.ESP32_30P.name",
      "description": "compData.ESP32_30P.descriptionShort",
      "popover": {
        "description": "compData.ESP32_30P.description"
      },
      "technicalID": "ESP32_30P",
      "technicalVersion": 1,
      "group": "controller",
      "image": {
        "url": "./ESP32_30P.jpg",
        "width": 119,
        "height": 225
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
              "powerW": 0.5,
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
              "powerW": 0.5,
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
          "height": 30,
          "hid": "usb",
          "name": "USB",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 35,
          "x": 58.5,
          "xalign": "start",
          "y": 210.5,
          "yalign": "start"
        },
        {
          "borderColor": "blue",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Reset input",
          "functions": [
            "rst"
          ],
          "height": 8,
          "hid": "EN",
          "name": "Enable",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 24.2,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In, Analog in",
          "functions": [
            "dig_in",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO36",
          "name": "GPIO 36",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 35.1,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In, Analog in",
          "functions": [
            "dig_in",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO39",
          "name": "GPIO 39",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 46,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In, Analog in",
          "functions": [
            "dig_in",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO34",
          "name": "GPIO 34",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 56.7,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In, Analog in",
          "functions": [
            "dig_in",
            "an_in"
          ],
          "height": 8,
          "hid": "GPIO35",
          "name": "GPIO 35",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 67.4,
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
          "hid": "GPIO32",
          "name": "GPIO 32",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 78.1,
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
          "hid": "GPIO33",
          "name": "GPIO 33",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 88.8,
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
          "hid": "GPIO25",
          "name": "GPIO 25",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 99.5,
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
          "hid": "GPIO26",
          "name": "GPIO 26",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 111,
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
          "hid": "GPIO27",
          "name": "GPIO 27",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 121.7,
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
          "hid": "GPIO14",
          "name": "GPIO 14",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.3,
          "xalign": "start",
          "y": 132.2,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (be careful: boot fails if pulled high, strapping pin)",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO12",
          "name": "GPIO 12",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5.1,
          "xalign": "start",
          "y": 142.8,
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
          "hid": "GPIO13",
          "name": "GPIO 13",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 5,
          "xalign": "start",
          "y": 154,
          "yalign": "start"
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Ground",
          "functions": [
            "gnd"
          ],
          "height": 8,
          "hid": "GND1",
          "name": "GND (1)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 5,
          "xalign": "start",
          "y": 164.6,
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
          "x": 5,
          "xalign": "start",
          "y": 175.3,
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
          "hid": "GPIO23",
          "name": "GPIO 23",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.7,
          "xalign": "start",
          "y": 24.2,
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
          "hid": "GPIO22",
          "name": "GPIO 22",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.7,
          "xalign": "start",
          "y": 35.1,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (be careful: used for USB!)",
          "functions": [
            "dig_in",
            "dig_out"
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
          "x": 113.7,
          "xalign": "start",
          "y": 46,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (be careful: used for USB!)",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO3",
          "name": "GPIO 3",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.7,
          "xalign": "start",
          "y": 56.7,
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
          "hid": "GPIO21",
          "name": "GPIO 21",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.5,
          "xalign": "start",
          "y": 67.4,
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
          "hid": "GPIO19",
          "name": "GPIO 19",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.5,
          "xalign": "start",
          "y": 78,
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
          "hid": "GPIO18",
          "name": "GPIO 18",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.5,
          "xalign": "start",
          "y": 88.6,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (outputs PWM signal at boot; be careful: strapping pin)",
          "functions": [
            "dig_in",
            "dig_out"
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
          "x": 113.5,
          "xalign": "start",
          "y": 99.2,
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
          "hid": "GPIO17",
          "name": "GPIO 17",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.5,
          "xalign": "start",
          "y": 111,
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
          "hid": "GPIO16",
          "name": "GPIO 16",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.4,
          "xalign": "start",
          "y": 121.6,
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
          "hid": "GPIO4",
          "name": "GPIO 4",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.4,
          "xalign": "start",
          "y": 132.2,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (connected to on-board LED)",
          "functions": [
            "dig_in",
            "dig_out"
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
          "x": 113.4,
          "xalign": "start",
          "y": 142.8,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out (outputs PWM signal at boot; be careful: strapping pin;)",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO15",
          "name": "GPIO 15",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 113.4,
          "xalign": "start",
          "y": 153.4,
          "yalign": "start"
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Ground",
          "functions": [
            "gnd"
          ],
          "height": 8,
          "hid": "GND2",
          "name": "GND (2)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 113.4,
          "xalign": "start",
          "y": 164.3,
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
          "x": 113.4,
          "xalign": "start",
          "y": 175.6,
          "yalign": "start"
        }
      ]
    }
  }
});
