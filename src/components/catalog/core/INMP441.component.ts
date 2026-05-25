import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "INMP441",
    "version": 1,
    "display": {
      "name": "compData.INMP441.name",
      "descriptionShort": "compData.INMP441.descriptionShort",
      "description": "compData.INMP441.description",
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
        "url": "./INMP441.jpg",
        "width": 60,
        "height": 60
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "LR",
        "name": "L/R",
        "description": "L/R selection. For WLED must be tied to GND",
        "type": "source",
        "x": 13,
        "y": 19,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "50%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "WS",
        "name": "WS",
        "description": "WS",
        "type": "source",
        "x": 13,
        "y": 30,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "blue",
          "lineWidth": 0.8,
          "radius": "50%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "SCK",
        "name": "SCK",
        "description": "SCK",
        "type": "source",
        "x": 13,
        "y": 41,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "blue",
          "lineWidth": 0.8,
          "radius": "50%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
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
        "x": 46.5,
        "y": 19,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
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
          "preferredLineWidth": 1
        }
      },
      {
        "id": "3V3",
        "name": "3.3 V",
        "description": "3.3 V supply",
        "type": "source",
        "x": 46.5,
        "y": 30,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "50%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 1
        }
      },
      {
        "id": "SD",
        "name": "SD",
        "description": "Data output",
        "type": "source",
        "x": 46.5,
        "y": 41,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "blue",
          "lineWidth": 0.8,
          "radius": "50%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
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
        "url": "./INMP441.jpg",
        "width": 60,
        "height": 60
      },
      "technicalID": "INMP441",
      "name": "compData.INMP441.name",
      "description": "compData.INMP441.descriptionShort",
      "popover": {
        "description": "compData.INMP441.description",
        "buyLinks": [
          {
            "text": "MyHome-Control Shop (Germnany)",
            "url": "https://shop.myhome-control.de/"
          }
        ]
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
          "borderRadius": "50%",
          "borderType": "dotted",
          "description": "L/R selection. For WLED must be tied to GND",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "LR",
          "name": "L/R",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 13,
          "xalign": "start",
          "y": 19,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "blue",
          "borderLineWidth": 0.8,
          "borderRadius": "50%",
          "borderType": "dotted",
          "description": "WS",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "WS",
          "name": "WS",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 13,
          "xalign": "start",
          "y": 30,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "blue",
          "borderLineWidth": 0.8,
          "borderRadius": "50%",
          "borderType": "dotted",
          "description": "SCK",
          "functions": [
            "dig_in"
          ],
          "height": 8,
          "hid": "SCK",
          "name": "SCK",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 13,
          "xalign": "start",
          "y": 41,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "50%",
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
          "width": 8,
          "x": 46.5,
          "xalign": "start",
          "y": 19,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "50%",
          "borderType": "dotted",
          "description": "3.3 V supply",
          "functions": [
            "suppl_in"
          ],
          "height": 8,
          "hid": "3V3",
          "name": "3.3 V",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 3.3,
          "width": 8,
          "x": 46.5,
          "xalign": "start",
          "y": 30,
          "yalign": "start",
          "prefferedLineWidth": 1
        },
        {
          "borderColor": "blue",
          "borderLineWidth": 0.8,
          "borderRadius": "50%",
          "borderType": "dotted",
          "description": "Data output",
          "functions": [
            "dig_out"
          ],
          "height": 8,
          "hid": "SD",
          "name": "SD",
          "position": "left",
          "postype": "centered",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 8,
          "x": 46.5,
          "xalign": "start",
          "y": 41,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        }
      ]
    }
  }
});
