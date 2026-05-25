import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "IR_KY022",
    "version": 1,
    "display": {
      "name": "compData.IR_KY022.name",
      "descriptionShort": "compData.IR_KY022.descriptionShort",
      "description": "compData.IR_KY022.description",
      "group": "electronics"
    },
    "geometry": {
      "image": {
        "url": "./IR_KY022.png",
        "width": 106,
        "height": 62
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
        "x": 5,
        "y": 28,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
        "postype": "left",
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
        "x": 5,
        "y": 38.4,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
        "postype": "left",
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
      },
      {
        "id": "OUT",
        "name": "OUT",
        "description": "Output",
        "type": "source",
        "x": 5,
        "y": 49.2,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
        "postype": "left",
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
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./IR_KY022.png",
        "width": 106,
        "height": 62
      },
      "technicalID": "IR_KY022",
      "name": "compData.IR_KY022.name",
      "description": "compData.IR_KY022.descriptionShort",
      "popover": {
        "description": "compData.IR_KY022.description"
      },
      "technicalVersion": 1,
      "group": "electronics",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
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
          "height": 6,
          "hid": "GND",
          "name": "GND",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 10,
          "x": 5,
          "xalign": "start",
          "y": 28,
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
          "height": 6,
          "hid": "3V3",
          "name": "+3.3 V",
          "position": "left",
          "postype": "left",
          "tolVmax": 3.6,
          "tolVmin": 3,
          "type": "source",
          "Vout": 0,
          "width": 10,
          "x": 5,
          "xalign": "start",
          "y": 38.4,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Output",
          "functions": [
            "dig_out"
          ],
          "height": 6,
          "hid": "OUT",
          "name": "OUT",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 10,
          "x": 5,
          "xalign": "start",
          "y": 49.2,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        }
      ]
    }
  }
});
