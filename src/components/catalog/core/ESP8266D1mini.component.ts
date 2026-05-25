import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "ESP8266D1mini",
    "version": 1,
    "display": {
      "name": "compData.ESP8266D1mini.name",
      "descriptionShort": "compData.ESP8266D1mini.descriptionShort",
      "description": "compData.ESP8266D1mini.description",
      "group": "controller",
      "buyLinks": []
    },
    "geometry": {
      "image": {
        "url": "./ESP8266D1mini.jpg",
        "width": 162,
        "height": 118
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
        "x": 3,
        "y": 56,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
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
        "x": 45.5,
        "y": 5,
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
        "id": "GPIO15",
        "name": "GPIO 15 (D8)",
        "description": "Digital In/Out; SPI CS",
        "type": "source",
        "x": 57,
        "y": 5,
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
        "name": "GPIO 13 (D7)",
        "description": "Digital In/Out, SPI MOSI",
        "type": "source",
        "x": 69,
        "y": 5,
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
        "name": "GPIO 12 (D6)",
        "description": "Digital In/Out, SPI MISO",
        "type": "source",
        "x": 81,
        "y": 5,
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
        "name": "GPIO 14 (D5)",
        "description": "Digital In/Out, SPI SCLK",
        "type": "source",
        "x": 92.5,
        "y": 5,
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
        "name": "GPIO 16 (D0)",
        "description": "Digital In/Out, wake up pin",
        "type": "source",
        "x": 104.2,
        "y": 5,
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
        "id": "ADC0",
        "name": "ADC0 (A0)",
        "description": "Analog In",
        "type": "source",
        "x": 116,
        "y": 5,
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
        "id": "RST",
        "name": "Reset",
        "description": "Reset input",
        "type": "source",
        "x": 127.5,
        "y": 5,
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
        "x": 45.3,
        "y": 113,
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
        "x": 56.8,
        "y": 113,
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
        "id": "GPIO2",
        "name": "GPIO 2 (D4)",
        "description": "Digital In/Out",
        "type": "source",
        "x": 68.9,
        "y": 113,
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
        "id": "GPIO0",
        "name": "GPIO 0 (D3)",
        "description": "Digital In/Out; be careful: if LOW during boot, then enters flash mode",
        "type": "source",
        "x": 81,
        "y": 113,
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
        "name": "GPIO 4 (D2)",
        "description": "Digital In/Out, I2C SDA",
        "type": "source",
        "x": 92.5,
        "y": 113,
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
        "name": "GPIO 5 (D1)",
        "description": "Digital In/Out, I2C SCL",
        "type": "source",
        "x": 104.2,
        "y": 113,
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
        "name": "GPIO 3 (RX)",
        "description": "Digital In/Out; be careful: used for USB",
        "type": "source",
        "x": 116,
        "y": 113,
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
        "name": "GPIO 1 (TX)",
        "description": "Digital In/Out; be careful: used for USB",
        "type": "source",
        "x": 127.5,
        "y": 113,
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
      "name": "compData.ESP8266D1mini.name",
      "description": "compData.ESP8266D1mini.descriptionShort",
      "technicalID": "ESP8266D1mini",
      "technicalVersion": 1,
      "group": "controller",
      "image": {
        "url": "./ESP8266D1mini.jpg",
        "width": 162,
        "height": 118
      },
      "noBackgroundImageURL": false,
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "popover": {
        "description": "compData.ESP8266D1mini.description",
        "buyLinks": []
      },
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
          "height": 40,
          "hid": "USB",
          "name": "USB",
          "position": "left",
          "postype": "left",
          "tolVmax": 5.5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 3,
          "xalign": "start",
          "y": 56,
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
          "x": 45.5,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; SPI CS",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO15",
          "name": "GPIO 15 (D8)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 57,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, SPI MOSI",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO13",
          "name": "GPIO 13 (D7)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 69,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, SPI MISO",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO12",
          "name": "GPIO 12 (D6)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 81,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, SPI SCLK",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO14",
          "name": "GPIO 14 (D5)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 92.5,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, wake up pin",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO16",
          "name": "GPIO 16 (D0)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 104.2,
          "xalign": "start",
          "y": 5,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Analog In",
          "functions": [
            "an_in"
          ],
          "height": 8,
          "hid": "ADC0",
          "name": "ADC0 (A0)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 116,
          "xalign": "start",
          "y": 5,
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
          "hid": "RST",
          "name": "Reset",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 127.5,
          "xalign": "start",
          "y": 5,
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
          "x": 45.3,
          "xalign": "start",
          "y": 113,
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
          "x": 56.8,
          "xalign": "start",
          "y": 113,
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
          "hid": "GPIO2",
          "name": "GPIO 2 (D4)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 68.9,
          "xalign": "start",
          "y": 113,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out; be careful: if LOW during boot, then enters flash mode",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO0",
          "name": "GPIO 0 (D3)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 81,
          "xalign": "start",
          "y": 113,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, I2C SDA",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO4",
          "name": "GPIO 4 (D2)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 92.5,
          "xalign": "start",
          "y": 113,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Digital In/Out, I2C SCL",
          "functions": [
            "dig_in",
            "dig_out"
          ],
          "height": 8,
          "hid": "GPIO5",
          "name": "GPIO 5 (D1)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 104.2,
          "xalign": "start",
          "y": 113,
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
          "hid": "GPIO3",
          "name": "GPIO 3 (RX)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 116,
          "xalign": "start",
          "y": 113,
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
          "hid": "GPIO1",
          "name": "GPIO 1 (TX)",
          "position": "left",
          "postype": "centered",
          "tolVmax": 3.6,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 127.5,
          "xalign": "start",
          "y": 113,
          "yalign": "start"
        }
      ]
    }
  }
});
