import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "MHC_Relay5V",
    "version": 1,
    "display": {
      "name": "compData.MHC_Relay5V.name",
      "descriptionShort": "compData.MHC_Relay5V.descriptionShort",
      "description": "compData.MHC_Relay5V.description",
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
        "url": "./MHC_Relay5V.png",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "VIN1",
        "name": "Power supply input",
        "description": "5 V DC power supply",
        "type": "source",
        "x": 20,
        "y": 40.5,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
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
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VIN2",
        "name": "Power supply input",
        "description": "5 V DC power supply",
        "type": "source",
        "x": 20,
        "y": 62,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
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
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "CTRL1",
        "name": "Control input 1",
        "description": "Control input for relay 1",
        "type": "source",
        "x": 20,
        "y": 88,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {}
      },
      {
        "id": "CTRL2",
        "name": "Control input 2",
        "description": "Control input for relay 2",
        "type": "source",
        "x": 20,
        "y": 109,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {}
      },
      {
        "id": "GND1",
        "name": "GND (input)",
        "description": "GND",
        "type": "source",
        "x": 20,
        "y": 135,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
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
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND2",
        "name": "GND (input)",
        "description": "GND",
        "type": "source",
        "x": 20,
        "y": 156,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
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
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT1",
        "name": "Power output 1 (NC)",
        "description": "Power output (fused, enabled when no control signal)",
        "type": "source",
        "x": 311,
        "y": 48,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "VIN1",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "CTRL1",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT2",
        "name": "Power output 1 (NO)",
        "description": "Power output (fused, enabled when control signal applied)",
        "type": "source",
        "x": 311,
        "y": 69,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "VIN1",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "CTRL1",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT3",
        "name": "Power output 2 (NC)",
        "description": "Power output (fused, enabled when no control signal)",
        "type": "source",
        "x": 311,
        "y": 95,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "VIN2",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "CTRL2",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT4",
        "name": "Power output 2 (NO)",
        "description": "Power output (fused, enabled when control signal applied)",
        "type": "source",
        "x": 311,
        "y": 116,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "VIN2",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "CTRL2",
          "preferredLineWidth": 4
        }
      }
    ],
    "fields": [
      {
        "id": "Fuse1",
        "type": "select",
        "name": "Fuse1: ",
        "selectedValue": 10,
        "unit": "A",
        "options": [
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 43
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 43
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 43
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 43
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 100,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse2",
        "type": "select",
        "name": "Fuse2: ",
        "selectedValue": 10,
        "unit": "A",
        "options": [
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 136
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 136
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 83,
            "y": 136
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 100,
          "hide": true,
          "showNameIfSelected": true
        }
      }
    ],
    "internalConnections": [
      {
        "kind": "fuse",
        "fromHandle": "VIN1",
        "toHandle": "VOUT1",
        "fuseId": "Fuse1",
        "nominalCurrentField": "Fuse1"
      },
      {
        "kind": "fuse",
        "fromHandle": "VIN1",
        "toHandle": "VOUT2",
        "fuseId": "Fuse1",
        "nominalCurrentField": "Fuse1"
      },
      {
        "kind": "fuse",
        "fromHandle": "VIN2",
        "toHandle": "VOUT3",
        "fuseId": "Fuse2",
        "nominalCurrentField": "Fuse2"
      },
      {
        "kind": "fuse",
        "fromHandle": "VIN2",
        "toHandle": "VOUT4",
        "fuseId": "Fuse2",
        "nominalCurrentField": "Fuse2"
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "name": "compData.MHC_Relay5V.name",
      "description": "compData.MHC_Relay5V.descriptionShort",
      "popover": {
        "description": "compData.MHC_Relay5V.description",
        "buyLinks": [
          {
            "text": "MyHome-Control Shop (Germnany)",
            "url": "https://shop.myhome-control.de/"
          }
        ]
      },
      "technicalID": "MHC_Relay5V",
      "technicalVersion": 1,
      "group": "electronics",
      "image": {
        "url": "./MHC_Relay5V.png",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "inputFieldsBox": {
        "x": 120,
        "y": 83,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "backgroundColorSelected": "white",
        "rotate180only": true
      },
      "selectFields": [
        {
          "technicalID": "Fuse1",
          "name": "Fuse1: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 100,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 43
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 43
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 43
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 43
            }
          ]
        },
        {
          "technicalID": "Fuse2",
          "name": "Fuse2: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 100,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 133,
              "y": 9
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 136
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 136
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 83,
              "y": 136
            }
          ]
        }
      ],
      "internalConnections": [
        {
          "kind": "fuse",
          "fromHandle": "VIN1",
          "toHandle": "VOUT1",
          "fuseId": "Fuse1",
          "nominalCurrentField": "Fuse1"
        },
        {
          "kind": "fuse",
          "fromHandle": "VIN1",
          "toHandle": "VOUT2",
          "fuseId": "Fuse1",
          "nominalCurrentField": "Fuse1"
        },
        {
          "kind": "fuse",
          "fromHandle": "VIN2",
          "toHandle": "VOUT3",
          "fuseId": "Fuse2",
          "nominalCurrentField": "Fuse2"
        },
        {
          "kind": "fuse",
          "fromHandle": "VIN2",
          "toHandle": "VOUT4",
          "fuseId": "Fuse2",
          "nominalCurrentField": "Fuse2"
        }
      ],
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "5 V DC power supply",
          "functions": [
            "suppl_in"
          ],
          "height": 18,
          "hid": "VIN1",
          "name": "Power supply input",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 40.5,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "5 V DC power supply",
          "functions": [
            "suppl_in"
          ],
          "height": 18,
          "hid": "VIN2",
          "name": "Power supply input",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 62,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Control input for relay 1",
          "functions": [
            "dig_in"
          ],
          "height": 18,
          "hid": "CTRL1",
          "name": "Control input 1",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 88,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Control input for relay 2",
          "functions": [
            "dig_in"
          ],
          "height": 18,
          "hid": "CTRL2",
          "name": "Control input 2",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 109,
          "yalign": "start"
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND1",
          "name": "GND (input)",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 135,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND2",
          "name": "GND (input)",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 156,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output (fused, enabled when no control signal)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT1",
          "name": "Power output 1 (NC)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN1",
          "controllableBy": "CTRL1",
          "width": 30,
          "x": 311,
          "xalign": "start",
          "y": 48,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output (fused, enabled when control signal applied)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT2",
          "name": "Power output 1 (NO)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN1",
          "controllableBy": "CTRL1",
          "width": 30,
          "x": 311,
          "xalign": "start",
          "y": 69,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output (fused, enabled when no control signal)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT3",
          "name": "Power output 2 (NC)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN2",
          "controllableBy": "CTRL2",
          "width": 30,
          "x": 311,
          "xalign": "start",
          "y": 95,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output (fused, enabled when control signal applied)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT4",
          "name": "Power output 2 (NO)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN2",
          "controllableBy": "CTRL2",
          "width": 30,
          "x": 311,
          "xalign": "start",
          "y": 116,
          "yalign": "start",
          "prefferedLineWidth": 4
        }
      ]
    }
  }
});
