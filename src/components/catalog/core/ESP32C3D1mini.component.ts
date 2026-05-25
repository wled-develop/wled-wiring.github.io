import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "ESP32C3D1mini",
    "version": 1,
    "display": {
      "name": "compData.ESP32C3D1mini.name",
      "descriptionShort": "compData.ESP32C3D1mini.descriptionShort",
      "description": "compData.ESP32C3D1mini.description",
      "group": "controller"
    },
    "geometry": {
      "image": {
        "url": "./ESP32C3D1mini.png",
        "width": 158,
        "height": 122
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
        "y": 58,
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
        "id": "3V3",
        "name": "3.3 V",
        "description": "3.3 V",
        "type": "source",
        "x": 40.9,
        "y": 5.2,
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
        "id": "GPIO5",
        "name": "GPIO 5",
        "description": "Digital In/Out, Analog In (ADC2)",
        "type": "source",
        "x": 53,
        "y": 5.2,
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
        "id": "GPIO4",
        "name": "GPIO 4",
        "description": "Digital In/Out, Analog In (ADC1)",
        "type": "source",
        "x": 64.6,
        "y": 5.2,
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
        "x": 76.4,
        "y": 5.2,
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
        "x": 88,
        "y": 5.2,
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
        "id": "GPIO2",
        "name": "GPIO 2",
        "description": "Digital In/Out, Analog In (ADC1); be careful: strapping pin, do not push LOW at boot",
        "type": "source",
        "x": 100,
        "y": 5.2,
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
        "x": 111.5,
        "y": 5.2,
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
        "id": "EN",
        "name": "Enable",
        "description": "Enable input: shutdown if LOW",
        "type": "source",
        "x": 123.4,
        "y": 5.2,
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
        "id": "5V",
        "name": "5V",
        "description": "5V",
        "type": "source",
        "x": 40.6,
        "y": 112,
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
        "x": 52.1,
        "y": 112,
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
        "id": "GPIO6",
        "name": "GPIO 6",
        "description": "Digital In/Out",
        "type": "source",
        "x": 64.3,
        "y": 112,
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
        "x": 76,
        "y": 112,
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
        "x": 87.6,
        "y": 112,
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
        "x": 99.6,
        "y": 112,
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
        "x": 111.2,
        "y": 112,
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
        "x": 123,
        "y": 112,
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
      "name": "compData.ESP32C3D1mini.name",
      "description": "compData.ESP32C3D1mini.descriptionShort",
      "popover": {
        "description": "compData.ESP32C3D1mini.description"
      },
      "technicalID": "ESP32C3D1mini",
      "technicalVersion": 1,
      "group": "controller",
      "image": {
        "url": "./ESP32C3D1mini.png",
        "width": 158,
        "height": 122
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
          "y": 58,
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
          "x": 40.9,
          "xalign": "start",
          "y": 5.2,
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
          "x": 53,
          "xalign": "start",
          "y": 5.2,
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
          "x": 64.6,
          "xalign": "start",
          "y": 5.2,
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
          "x": 76.4,
          "xalign": "start",
          "y": 5.2,
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
          "x": 88,
          "xalign": "start",
          "y": 5.2,
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
          "x": 100,
          "xalign": "start",
          "y": 5.2,
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
          "x": 111.5,
          "xalign": "start",
          "y": 5.2,
          "yalign": "start"
        },
        {
          "borderColor": "blue",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Enable input: shutdown if LOW",
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
          "x": 123.4,
          "xalign": "start",
          "y": 5.2,
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
          "x": 40.6,
          "xalign": "start",
          "y": 112,
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
          "x": 52.1,
          "xalign": "start",
          "y": 112,
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
          "x": 64.3,
          "xalign": "start",
          "y": 112,
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
          "x": 76,
          "xalign": "start",
          "y": 112,
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
          "x": 87.6,
          "xalign": "start",
          "y": 112,
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
          "x": 99.6,
          "xalign": "start",
          "y": 112,
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
          "x": 111.2,
          "xalign": "start",
          "y": 112,
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
          "x": 123,
          "xalign": "start",
          "y": 112,
          "yalign": "start"
        }
      ]
    }
  }
});
