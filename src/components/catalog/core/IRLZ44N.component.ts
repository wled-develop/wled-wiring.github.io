import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "IRLZ44N",
    "version": 1,
    "display": {
      "name": "compData.IRLZ44N.name",
      "descriptionShort": "compData.IRLZ44N.descriptionShort",
      "description": "compData.IRLZ44N.description",
      "group": "electronics"
    },
    "geometry": {
      "image": {
        "url": "./IRLZ44N.jpg",
        "width": 40,
        "height": 115
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "G",
        "name": "Gate",
        "description": "Gate",
        "type": "source",
        "x": 9,
        "y": 110,
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
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 16
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "D",
        "name": "Drain",
        "description": "Drain",
        "type": "source",
        "x": 20,
        "y": 110,
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
          "pwm_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 55
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "S",
        "name": "Source",
        "description": "Source",
        "type": "source",
        "x": 31,
        "y": 110,
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
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./IRLZ44N.jpg",
        "width": 40,
        "height": 115
      },
      "technicalID": "IRLZ44N",
      "name": "compData.IRLZ44N.name",
      "description": "compData.IRLZ44N.descriptionShort",
      "popover": {
        "description": "compData.IRLZ44N.description"
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
          "description": "Gate",
          "functions": [
            "dig_in"
          ],
          "height": 10,
          "hid": "G",
          "name": "Gate",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 16,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 9,
          "xalign": "start",
          "y": 110,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Drain",
          "functions": [
            "pwm_out"
          ],
          "height": 10,
          "hid": "D",
          "name": "Drain",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 55,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 20,
          "xalign": "start",
          "y": 110,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "20%",
          "borderType": "dotted",
          "description": "Source",
          "functions": [
            "gnd"
          ],
          "height": 10,
          "hid": "S",
          "name": "Source",
          "position": "left",
          "postype": "bottom",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 6,
          "x": 31,
          "xalign": "start",
          "y": 110,
          "yalign": "start",
          "prefferedLineWidth": 1
        }
      ]
    }
  }
});
