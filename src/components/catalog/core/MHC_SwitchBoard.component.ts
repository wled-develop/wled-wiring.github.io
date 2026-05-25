import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "MHC_SwitchBoard",
    "version": 1,
    "display": {
      "name": "compData.MHC_SwitchBoard.name",
      "descriptionShort": "compData.MHC_SwitchBoard.descriptionShort",
      "description": "compData.MHC_SwitchBoard.description",
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
        "url": "./MHC_SwitchBoard.png",
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
        "id": "VIN",
        "name": "Power supply input +",
        "description": "power supply in +",
        "type": "source",
        "x": 25,
        "y": 145,
        "xalign": "start",
        "yalign": "start",
        "width": 40,
        "height": 22,
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
          "toleranceMax": 24
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND",
        "name": "GND (input)",
        "description": "GND",
        "type": "source",
        "x": 25,
        "y": 116,
        "xalign": "start",
        "yalign": "start",
        "width": 40,
        "height": 22,
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
        "id": "EN1",
        "name": "Enable input",
        "description": "Enable input",
        "type": "source",
        "x": 21,
        "y": 75,
        "xalign": "start",
        "yalign": "start",
        "width": 22,
        "height": 14,
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
        "id": "EN2",
        "name": "Enable input",
        "description": "Enable input",
        "type": "source",
        "x": 21,
        "y": 91,
        "xalign": "start",
        "yalign": "start",
        "width": 22,
        "height": 14,
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
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {}
      },
      {
        "id": "VOUT1",
        "name": "Power output 1",
        "description": "Power output 1 (fused, switched)",
        "type": "source",
        "x": 314,
        "y": 151,
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
          "outDependency": "VIN",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "EN1",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND1",
        "name": "GND (output 1)",
        "description": "GND (output 1)",
        "type": "source",
        "x": 314,
        "y": 129,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
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
          "toleranceMax": 26
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT2",
        "name": "Power output 2",
        "description": "Power output 2 (fused, switched)",
        "type": "source",
        "x": 314,
        "y": 107,
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
          "outDependency": "VIN",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "EN1",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND2",
        "name": "GND (output 2)",
        "description": "GND (output 2)",
        "type": "source",
        "x": 314,
        "y": 85,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
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
          "toleranceMax": 26
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "VOUT3",
        "name": "Power output 3",
        "description": "Power output 3 (fused, switched)",
        "type": "source",
        "x": 314,
        "y": 63,
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
          "outDependency": "VIN",
          "toleranceMin": 0,
          "toleranceMax": 26
        },
        "behavior": {
          "controllableBy": "EN1",
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND3",
        "name": "GND (output 3)",
        "description": "GND (output 3)",
        "type": "source",
        "x": 314,
        "y": 41,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
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
          "toleranceMax": 26
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      }
    ],
    "fields": [
      {
        "id": "Fuse1",
        "type": "select",
        "name": "Fuse1: ",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 40
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 40
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 40
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 40
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
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
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 107
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse3",
        "type": "select",
        "name": "Fuse3: ",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 168
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 168
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 168
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 168
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      }
    ],
    "internalConnections": [
      {
        "kind": "fuse",
        "fromHandle": "VIN",
        "toHandle": "VOUT1",
        "fuseId": "Fuse1",
        "nominalCurrentField": "Fuse1"
      },
      {
        "kind": "fuse",
        "fromHandle": "VIN",
        "toHandle": "VOUT2",
        "fuseId": "Fuse2",
        "nominalCurrentField": "Fuse2"
      },
      {
        "kind": "fuse",
        "fromHandle": "VIN",
        "toHandle": "VOUT3",
        "fuseId": "Fuse3",
        "nominalCurrentField": "Fuse3"
      },
      {
        "kind": "short",
        "fromHandle": "EN1",
        "toHandle": "EN2"
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "name": "compData.MHC_SwitchBoard.name",
      "description": "compData.MHC_SwitchBoard.descriptionShort",
      "popover": {
        "description": "compData.MHC_SwitchBoard.description",
        "buyLinks": [
          {
            "text": "MyHome-Control Shop (Germnany)",
            "url": "https://shop.myhome-control.de/"
          }
        ]
      },
      "technicalID": "MHC_SwitchBoard",
      "technicalVersion": 1,
      "group": "electronics",
      "image": {
        "url": "./MHC_SwitchBoard.png",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "inputFieldsBox": {
        "x": 200,
        "y": 85,
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
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 40
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 40
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 40
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 40
            }
          ]
        },
        {
          "technicalID": "Fuse2",
          "name": "Fuse2: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 107
            }
          ]
        },
        {
          "technicalID": "Fuse3",
          "name": "Fuse3: ",
          "displayName": false,
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 168
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 168
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 168
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 168
            }
          ]
        }
      ],
      "internalConnections": [
        {
          "kind": "fuse",
          "fromHandle": "VIN",
          "toHandle": "VOUT1",
          "fuseId": "Fuse1",
          "nominalCurrentField": "Fuse1"
        },
        {
          "kind": "fuse",
          "fromHandle": "VIN",
          "toHandle": "VOUT2",
          "fuseId": "Fuse2",
          "nominalCurrentField": "Fuse2"
        },
        {
          "kind": "fuse",
          "fromHandle": "VIN",
          "toHandle": "VOUT3",
          "fuseId": "Fuse3",
          "nominalCurrentField": "Fuse3"
        },
        {
          "kind": "short",
          "fromHandle": "EN1",
          "toHandle": "EN2"
        }
      ],
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "power supply in +",
          "functions": [
            "suppl_in"
          ],
          "height": 22,
          "hid": "VIN",
          "name": "Power supply input +",
          "position": "left",
          "postype": "left",
          "tolVmax": 24,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 40,
          "x": 25,
          "xalign": "start",
          "y": 145,
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
          "height": 22,
          "hid": "GND",
          "name": "GND (input)",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 40,
          "x": 25,
          "xalign": "start",
          "y": 116,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Enable input",
          "functions": [
            "dig_in"
          ],
          "height": 14,
          "hid": "EN1",
          "name": "Enable input",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 22,
          "x": 21,
          "xalign": "start",
          "y": 75,
          "yalign": "start"
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Enable input",
          "functions": [
            "dig_in"
          ],
          "height": 14,
          "hid": "EN2",
          "name": "Enable input",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "width": 22,
          "x": 21,
          "xalign": "start",
          "y": 91,
          "yalign": "start"
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output 1 (fused, switched)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT1",
          "name": "Power output 1",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN",
          "controllableBy": "EN1",
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 151,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND (output 1)",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND1",
          "name": "GND (output 1)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 129,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output 2 (fused, switched)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT2",
          "name": "Power output 2",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN",
          "controllableBy": "EN1",
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 107,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND (output 2)",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND2",
          "name": "GND (output 2)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 85,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output 3 (fused, switched)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT3",
          "name": "Power output 3",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN",
          "controllableBy": "EN1",
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 63,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND (output 3)",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND3",
          "name": "GND (output 3)",
          "position": "left",
          "postype": "right",
          "tolVmax": 26,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 314,
          "xalign": "start",
          "y": 41,
          "yalign": "start",
          "prefferedLineWidth": 4
        }
      ]
    }
  }
});
