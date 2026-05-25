import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "SN74AHCT125N",
    "version": 1,
    "display": {
      "name": "compData.SN74AHCT125N.name",
      "descriptionShort": "compData.SN74AHCT125N.descriptionShort",
      "description": "compData.SN74AHCT125N.description",
      "group": "levelshifter"
    },
    "geometry": {
      "image": {
        "url": "./SN74AHCT125N.jpg",
        "width": 40,
        "height": 97
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "1OE",
        "name": "/1OE",
        "description": "Output 1 enable (inverted)",
        "type": "source",
        "x": 2,
        "y": 10,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "1A",
        "name": "1A",
        "description": "Input 1",
        "type": "source",
        "x": 2,
        "y": 23,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "1Y",
        "name": "1Y",
        "description": "Output 1",
        "type": "source",
        "x": 2,
        "y": 35.6,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "2OE",
        "name": "/2OE",
        "description": "Output 2 enable (inverted)",
        "type": "source",
        "x": 2,
        "y": 48.5,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "2A",
        "name": "2A",
        "description": "Input 2",
        "type": "source",
        "x": 2,
        "y": 61,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "2Y",
        "name": "2Y",
        "description": "Output 2",
        "type": "source",
        "x": 2,
        "y": 74,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "GND",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 2,
        "y": 87,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "VCC",
        "name": "VCC",
        "description": "Voltage supply",
        "type": "source",
        "x": 38,
        "y": 10,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "4OE",
        "name": "/4OE",
        "description": "Output 4 enable (inverted)",
        "type": "source",
        "x": 38,
        "y": 23,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "4A",
        "name": "4A",
        "description": "Input 4",
        "type": "source",
        "x": 38,
        "y": 35.6,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "4Y",
        "name": "4Y",
        "description": "Output 4",
        "type": "source",
        "x": 38,
        "y": 48.5,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "3OE",
        "name": "/3OE",
        "description": "Output 3 enable (inverted)",
        "type": "source",
        "x": 38,
        "y": 61,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "3A",
        "name": "3A",
        "description": "Input 3",
        "type": "source",
        "x": 38,
        "y": 74,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "3Y",
        "name": "3Y",
        "description": "Output 3",
        "type": "source",
        "x": 38,
        "y": 87,
        "xalign": "start",
        "yalign": "start",
        "width": 4,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "5%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      }
    ],
    "simulation": {
      "version": 1,
      "elements": [
        {
          "id": "idle-load",
          "type": "constantPowerSink",
          "terminals": {
            "positive": "VCC",
            "negative": "GND"
          },
          "parameters": {
            "powerW": 0.05,
            "minVoltageV": 3
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./SN74AHCT125N.jpg",
        "width": 40,
        "height": 97
      },
      "technicalID": "SN74AHCT125N",
      "name": "compData.SN74AHCT125N.name",
      "description": "compData.SN74AHCT125N.descriptionShort",
      "popover": {
        "description": "compData.SN74AHCT125N.description"
      },
      "technicalVersion": 1,
      "group": "levelshifter",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "idle-load",
            "type": "constantPowerSink",
            "terminals": {
              "positive": "VCC",
              "negative": "GND"
            },
            "parameters": {
              "powerW": 0.05,
              "minVoltageV": 3
            }
          }
        ]
      },
      "handles": [
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 1 enable (inverted)",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "1OE",
          "name": "/1OE",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 10,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Input 1",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "1A",
          "name": "1A",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 23,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 1",
          "functions": [
            "dig_out"
          ],
          "height": 8,
          "hid": "1Y",
          "name": "1Y",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 35.6,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 2 enable (inverted)",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "2OE",
          "name": "/2OE",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 48.5,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Input 2",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "2A",
          "name": "2A",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 61,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 2",
          "functions": [
            "dig_out"
          ],
          "height": 8,
          "hid": "2Y",
          "name": "2Y",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 74,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
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
          "width": 4,
          "x": 2,
          "xalign": "start",
          "y": 87,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Voltage supply",
          "functions": [
            "suppl_in"
          ],
          "height": 8,
          "hid": "VCC",
          "name": "VCC",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 10,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 4 enable (inverted)",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "4OE",
          "name": "/4OE",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 23,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Input 4",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "4A",
          "name": "4A",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 35.6,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 4",
          "functions": [
            "dig_out"
          ],
          "height": 8,
          "hid": "4Y",
          "name": "4Y",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 48.5,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 3 enable (inverted)",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "3OE",
          "name": "/3OE",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 61,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Input 3",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "3A",
          "name": "3A",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 74,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Output 3",
          "functions": [
            "dig_out"
          ],
          "height": 8,
          "hid": "3Y",
          "name": "3Y",
          "position": "left",
          "postype": "centered",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 4,
          "x": 38,
          "xalign": "start",
          "y": 87,
          "yalign": "start",
          "prefferedLineWidth": 1
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
