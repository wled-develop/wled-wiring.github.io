import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "PSU_USB_WIRES",
    "version": 1,
    "display": {
      "name": "compData.PSU_USB_WIRES.name",
      "descriptionShort": "compData.PSU_USB_WIRES.descriptionShort",
      "description": "compData.PSU_USB_WIRES.description",
      "group": "psu"
    },
    "geometry": {
      "image": {
        "url": "./PSU_USB_WIRES.png",
        "width": 237,
        "height": 99
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "VOUT",
        "name": "5V out",
        "description": "+5V supply output",
        "type": "source",
        "x": 232,
        "y": 46,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 8,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 1,
          "radius": "5%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "GND",
        "name": "GND",
        "description": "GND (output)",
        "type": "source",
        "x": 232,
        "y": 54,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 8,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 1,
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
          "preferredLineWidth": 2
        }
      }
    ],
    "fields": [
      {
        "id": "source_current",
        "type": "number",
        "name": "Iout",
        "value": 3,
        "min": 0,
        "max": 5,
        "step": 0.1,
        "unit": "A",
        "ui": {
          "color": "#757575",
          "fieldWidth": 70
        }
      }
    ],
    "simulation": {
      "version": 1,
      "elements": [
        {
          "id": "source",
          "type": "voltageSource",
          "terminals": {
            "positive": "VOUT",
            "negative": "GND"
          },
          "parameters": {
            "voltageV": 5,
            "currentLimitA": {
              "field": "source_current"
            },
            "voltageDropPctAt150Current": 50
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./PSU_USB_WIRES.png",
        "width": 237,
        "height": 99
      },
      "technicalID": "PSU_USB_WIRES",
      "name": "compData.PSU_USB_WIRES.name",
      "description": "compData.PSU_USB_WIRES.descriptionShort",
      "popover": {
        "description": "compData.PSU_USB_WIRES.description"
      },
      "technicalVersion": 1,
      "group": "psu",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "inputFieldsBox": {
        "x": 104,
        "y": 24,
        "borderType": "solid",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent"
      },
      "inputFields": [
        {
          "technicalID": "source_current",
          "type": "number_input",
          "name": "Iout",
          "value": 3,
          "min": 0,
          "max": 5,
          "step": 0.1,
          "unit": "A",
          "fieldWidth": 70,
          "color": "#757575"
        }
      ],
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "source",
            "type": "voltageSource",
            "terminals": {
              "positive": "VOUT",
              "negative": "GND"
            },
            "parameters": {
              "voltageV": 5,
              "currentLimitA": {
                "field": "source_current"
              },
              "voltageDropPctAt150Current": 50
            }
          }
        ]
      },
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "+5V supply output",
          "functions": [
            "suppl_out"
          ],
          "height": 8,
          "hid": "VOUT",
          "name": "5V out",
          "position": "left",
          "postype": "right",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 12,
          "x": 232,
          "xalign": "start",
          "y": 46,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "GND (output)",
          "functions": [
            "gnd"
          ],
          "height": 8,
          "hid": "GND",
          "name": "GND",
          "position": "left",
          "postype": "right",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 12,
          "x": 232,
          "xalign": "start",
          "y": 54,
          "yalign": "start",
          "prefferedLineWidth": 2
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
