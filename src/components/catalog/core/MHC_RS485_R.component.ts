import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "MHC_RS485_R",
    "version": 1,
    "display": {
      "name": "compData.MHC_RS485_R.name",
      "descriptionShort": "compData.MHC_RS485_R.descriptionShort",
      "description": "compData.MHC_RS485_R.description",
      "group": "electronics",
      "buyLinks": [
        {
          "text": "MyHome-Control Shop (Germnany)",
          "url": "https://shop.myhome-control.de/"
        }
      ]
    },
    "geometry": {
      "image": {
        "url": "./MHC_RS485_R.png",
        "width": 178,
        "height": 54
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "RS485A",
        "name": "RS-485 input A",
        "description": "RS-485 input A",
        "type": "source",
        "x": 16,
        "y": 10,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "rs485_A"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 24
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 2
        }
      },
      {
        "id": "RS485GND",
        "name": "GND (RS-485)",
        "description": "RS-485 GND",
        "type": "source",
        "x": 16,
        "y": 26,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
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
          "preferredLineWidth": 2
        }
      },
      {
        "id": "RS485B",
        "name": "RS-485 input B",
        "description": "RS-485 input B",
        "type": "source",
        "x": 16,
        "y": 41,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "rs485_B"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 24
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 2
        }
      },
      {
        "id": "VIN",
        "name": "Power input +",
        "description": "Power input (from LEDs)",
        "type": "source",
        "x": 161,
        "y": 42,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 24
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "GND1",
        "name": "GND (from LEDs)",
        "description": "GND",
        "type": "source",
        "x": 161,
        "y": 10,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "DAT",
        "name": "Data output",
        "description": "Data output",
        "type": "source",
        "x": 161,
        "y": 26,
        "xalign": "start",
        "yalign": "start",
        "width": 24,
        "height": 14,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
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
          "mustBeConnected": true,
          "preferredLineWidth": 2
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
            "positive": "VIN",
            "negative": "GND1"
          },
          "parameters": {
            "powerW": 0.5,
            "minVoltageV": 3
          }
        },
        {
          "id": "gnd-bridge-1-2",
          "type": "shortBridge",
          "terminals": {
            "a": "GND1",
            "b": "RS485GND"
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "name": "compData.MHC_RS485_R.name",
      "description": "compData.MHC_RS485_R.descriptionShort",
      "popover": {
        "description": "compData.MHC_RS485_R.description",
        "buyLinks": [
          {
            "text": "MyHome-Control Shop (Germnany)",
            "url": "https://shop.myhome-control.de/"
          }
        ]
      },
      "technicalID": "MHC_RS485_R",
      "technicalVersion": 1,
      "group": "electronics",
      "image": {
        "url": "./MHC_RS485_R.png",
        "width": 178,
        "height": 54
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "idle-load",
            "type": "constantPowerSink",
            "terminals": {
              "positive": "VIN",
              "negative": "GND1"
            },
            "parameters": {
              "powerW": 0.5,
              "minVoltageV": 3
            }
          },
          {
            "id": "gnd-bridge-1-2",
            "type": "shortBridge",
            "terminals": {
              "a": "GND1",
              "b": "RS485GND"
            }
          }
        ]
      },
      "handles": [
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "RS-485 input A",
          "functions": [
            "rs485_A"
          ],
          "height": 14,
          "hid": "RS485A",
          "name": "RS-485 input A",
          "position": "left",
          "postype": "left",
          "tolVmax": 24,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 24,
          "x": 16,
          "xalign": "start",
          "y": 10,
          "yalign": "start",
          "prefferedLineWidth": 2,
          "mustBeConnected": true
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "RS-485 GND",
          "functions": [
            "gnd"
          ],
          "height": 14,
          "hid": "RS485GND",
          "name": "GND (RS-485)",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 24,
          "x": 16,
          "xalign": "start",
          "y": 26,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "RS-485 input B",
          "functions": [
            "rs485_B"
          ],
          "height": 14,
          "hid": "RS485B",
          "name": "RS-485 input B",
          "position": "left",
          "postype": "left",
          "tolVmax": 24,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 24,
          "x": 16,
          "xalign": "start",
          "y": 41,
          "yalign": "start",
          "prefferedLineWidth": 2,
          "mustBeConnected": true
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Power input (from LEDs)",
          "functions": [
            "suppl_in"
          ],
          "height": 14,
          "hid": "VIN",
          "name": "Power input +",
          "position": "left",
          "postype": "right",
          "tolVmax": 24,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 24,
          "x": 161,
          "xalign": "start",
          "y": 42,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 14,
          "hid": "GND1",
          "name": "GND (from LEDs)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 24,
          "x": 161,
          "xalign": "start",
          "y": 10,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Data output",
          "functions": [
            "dig_out"
          ],
          "height": 14,
          "hid": "DAT",
          "name": "Data output",
          "position": "left",
          "postype": "right",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 24,
          "x": 161,
          "xalign": "start",
          "y": 26,
          "yalign": "start",
          "prefferedLineWidth": 2,
          "mustBeConnected": true
        }
      ]
    }
  }
});
