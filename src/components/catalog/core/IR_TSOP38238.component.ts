import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "IR_TSOP38238",
    "version": 1,
    "display": {
      "name": "compData.IR_TSOP38238.name",
      "descriptionShort": "compData.IR_TSOP38238.descriptionShort",
      "description": "compData.IR_TSOP38238.description",
      "group": "electronics"
    },
    "geometry": {
      "image": {
        "url": "./IR_TSOP38238.jpg",
        "width": 25,
        "height": 81
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "OUT",
        "name": "OUT",
        "description": "Output",
        "type": "source",
        "x": 1.5,
        "y": 76,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 10,
        "postype": "bottom",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "GND",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 12.5,
        "y": 76,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 10,
        "postype": "bottom",
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
        "id": "3V3",
        "name": "+3.3 V",
        "description": "Supply voltage",
        "type": "source",
        "x": 23,
        "y": 76,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 10,
        "postype": "bottom",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 3,
          "toleranceMax": 3.6
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./IR_TSOP38238.jpg",
        "width": 25,
        "height": 81
      },
      "technicalID": "IR_TSOP38238",
      "name": "compData.IR_TSOP38238.name",
      "description": "compData.IR_TSOP38238.descriptionShort",
      "popover": {
        "description": "compData.IR_TSOP38238.description"
      },
      "technicalVersion": 1,
      "group": "electronics",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "handles": [
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Output",
          "functions": [
            "dig_out"
          ],
          "height": 10,
          "hid": "OUT",
          "name": "OUT",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 6,
          "x": 1.5,
          "xalign": "start",
          "y": 76,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
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
          "postype": "bottom",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 12.5,
          "xalign": "start",
          "y": 76,
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
            "suppl_in"
          ],
          "height": 10,
          "hid": "3V3",
          "name": "+3.3 V",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 3.6,
          "tolVmin": 3,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 23,
          "xalign": "start",
          "y": 76,
          "yalign": "start",
          "prefferedLineWidth": 1
        }
      ]
    }
  }
});
