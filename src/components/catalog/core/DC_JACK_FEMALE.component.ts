import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "DC_JACK_FEMALE",
    "version": 1,
    "display": {
      "name": "compData.DC_JACK_FEMALE.name",
      "descriptionShort": "compData.DC_JACK_FEMALE.descriptionShort",
      "description": "compData.DC_JACK_FEMALE.description",
      "group": "electronics",
      "buyLinks": []
    },
    "geometry": {
      "image": {
        "url": "./DC_Jack_Female.png",
        "width": 90,
        "height": 35
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "GND",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 84,
        "y": 12,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 10,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
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
          "preferredLineWidth": 1
        }
      },
      {
        "id": "VOUT",
        "name": "V out",
        "description": "Supply voltage",
        "type": "source",
        "x": 84,
        "y": 24.5,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 10,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "out": 0,
          "outDependency": "source_voltage"
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      }
    ],
    "fields": [
      {
        "id": "source_voltage",
        "type": "number",
        "name": "V",
        "value": 5,
        "min": 1,
        "max": 48,
        "step": 0.1,
        "unit": "V",
        "ui": {
          "color": "black",
          "fieldWidth": 70
        }
      },
      {
        "id": "source_current",
        "type": "number",
        "name": "I",
        "value": 3,
        "min": 0,
        "max": 100,
        "step": 0.1,
        "unit": "A",
        "ui": {
          "color": "black",
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
            "voltageV": {
              "field": "source_voltage"
            },
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
        "url": "./DC_Jack_Female.png",
        "width": 90,
        "height": 35
      },
      "technicalID": "DC_JACK_FEMALE",
      "name": "compData.DC_JACK_FEMALE.name",
      "description": "compData.DC_JACK_FEMALE.descriptionShort",
      "technicalVersion": 1,
      "group": "electronics",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "inputFieldsBox": {
        "x": 45,
        "y": 45,
        "borderType": "solid",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent"
      },
      "inputFields": [
        {
          "technicalID": "source_voltage",
          "type": "number_input",
          "name": "V",
          "value": 5,
          "min": 1,
          "max": 48,
          "step": 0.1,
          "unit": "V",
          "fieldWidth": 70,
          "color": "black"
        },
        {
          "technicalID": "source_current",
          "type": "number_input",
          "name": "I",
          "value": 3,
          "min": 0,
          "max": 100,
          "step": 0.1,
          "unit": "A",
          "fieldWidth": 70,
          "color": "black"
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
              "voltageV": {
                "field": "source_voltage"
              },
              "currentLimitA": {
                "field": "source_current"
              },
              "voltageDropPctAt150Current": 50
            }
          }
        ]
      },
      "popover": {
        "description": "compData.DC_JACK_FEMALE.description",
        "buyLinks": []
      },
      "handles": [
        {
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 10,
          "hid": "GND",
          "name": "GND",
          "position": "left",
          "postype": "right",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 12,
          "x": 84,
          "xalign": "start",
          "y": 12,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Supply voltage",
          "functions": [
            "suppl_out"
          ],
          "height": 10,
          "hid": "VOUT",
          "name": "V out",
          "position": "left",
          "postype": "right",
          "type": "source",
          "Vout": 0,
          "VoutDependency": "source_voltage",
          "width": 12,
          "x": 84,
          "xalign": "start",
          "y": 24.5,
          "yalign": "start",
          "prefferedLineWidth": 1
        }
      ]
    }
  }
});
