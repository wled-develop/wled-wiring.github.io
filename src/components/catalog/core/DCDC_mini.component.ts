import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "DCDC_mini",
    "version": 1,
    "display": {
      "name": "compData.DCDC_mini.name",
      "descriptionShort": "compData.DCDC_mini.descriptionShort",
      "description": "compData.DCDC_mini.description",
      "group": "electronics",
      "buyLinks": []
    },
    "geometry": {
      "image": {
        "url": "./DCDC_mini.jpg",
        "width": 57,
        "height": 36
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "IN",
        "name": "Input +",
        "description": "Input positive (0-23 V)",
        "type": "source",
        "x": 3,
        "y": 3,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 6,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 0,
          "toleranceMax": 40
        },
        "behavior": {
          "preferredLineWidth": 3,
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "GND1",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 3,
        "y": 33,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 6,
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
        "behavior": {
          "preferredLineWidth": 3,
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "OUT",
        "name": "Output +",
        "description": "Adjustable output",
        "type": "source",
        "x": 53.5,
        "y": 3,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 6,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "50%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "source_voltage",
          "toleranceMin": 0,
          "toleranceMax": 40
        },
        "behavior": {
          "preferredLineWidth": 3,
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "GND2",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 53.5,
        "y": 33,
        "xalign": "start",
        "yalign": "start",
        "width": 3,
        "height": 3,
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
        "behavior": {
          "preferredLineWidth": 3,
          "preferredLineDirection": "right"
        }
      }
    ],
    "fields": [
      {
        "id": "source_voltage",
        "type": "number",
        "name": "Vout",
        "value": 5,
        "min": 1,
        "max": 17,
        "step": 0.1,
        "unit": "V",
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
          "id": "dcdc",
          "type": "dcdcConverter",
          "terminals": {
            "inPositive": "IN",
            "inNegative": "GND1",
            "outPositive": "OUT",
            "outNegative": "GND2"
          },
          "parameters": {
            "outputVoltageV": {
              "field": "source_voltage"
            },
            "efficiency": 0.9,
            "voltageDropPctAt150Current": 50
          }
        },
        {
          "id": "gnd-bridge",
          "type": "shortBridge",
          "terminals": {
            "a": "GND1",
            "b": "GND2"
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./DCDC_mini.jpg",
        "width": 57,
        "height": 36
      },
      "technicalID": "DCDC_mini",
      "name": "compData.DCDC_mini.name",
      "description": "compData.DCDC_mini.descriptionShort",
      "popover": {
        "description": "compData.DCDC_mini.description",
        "buyLinks": []
      },
      "technicalVersion": 1,
      "group": "electronics",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "inputFieldsBox": {
        "x": 28.5,
        "y": 44,
        "borderType": "solid",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "rotate180only": true
      },
      "inputFields": [
        {
          "technicalID": "source_voltage",
          "type": "number_input",
          "name": "Vout",
          "value": 5,
          "min": 1,
          "max": 17,
          "step": 0.1,
          "unit": "V",
          "fieldWidth": 70,
          "color": "black"
        }
      ],
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "dcdc",
            "type": "dcdcConverter",
            "terminals": {
              "inPositive": "IN",
              "inNegative": "GND1",
              "outPositive": "OUT",
              "outNegative": "GND2"
            },
            "parameters": {
              "outputVoltageV": {
                "field": "source_voltage"
              },
              "efficiency": 0.9,
              "voltageDropPctAt150Current": 50
            }
          },
          {
            "id": "gnd-bridge",
            "type": "shortBridge",
            "terminals": {
              "a": "GND1",
              "b": "GND2"
            }
          }
        ]
      },
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Input positive (0-23 V)",
          "functions": [
            "suppl_in"
          ],
          "height": 6,
          "hid": "IN",
          "name": "Input +",
          "position": "left",
          "postype": "centered",
          "tolVmax": 40,
          "tolVmin": 0,
          "type": "source",
          "width": 6,
          "x": 3,
          "xalign": "start",
          "y": 3,
          "yalign": "start",
          "prefferedLineWidth": 3,
          "prefferedLineDirection": "left"
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
          "height": 6,
          "hid": "GND1",
          "name": "GND",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 3,
          "xalign": "start",
          "y": 33,
          "yalign": "start",
          "prefferedLineWidth": 3,
          "prefferedLineDirection": "left"
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "50%",
          "borderType": "dashed",
          "description": "Adjustable output",
          "functions": [
            "suppl_out"
          ],
          "height": 6,
          "hid": "OUT",
          "name": "Output +",
          "position": "left",
          "postype": "centered",
          "tolVmax": 40,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "source_voltage",
          "width": 6,
          "x": 53.5,
          "xalign": "start",
          "y": 3,
          "yalign": "start",
          "prefferedLineWidth": 3,
          "prefferedLineDirection": "right"
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
          "height": 3,
          "hid": "GND2",
          "name": "GND",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 3,
          "x": 53.5,
          "xalign": "start",
          "y": 33,
          "yalign": "start",
          "prefferedLineWidth": 3,
          "prefferedLineDirection": "right"
        }
      ]
    }
  }
});
