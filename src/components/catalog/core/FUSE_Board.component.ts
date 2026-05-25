import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "FUSE_Board",
    "version": 1,
    "display": {
      "name": "compData.FUSE_Board.name",
      "descriptionShort": "compData.FUSE_Board.descriptionShort",
      "description": "compData.FUSE_Board.description",
      "group": "electronics"
    },
    "geometry": {
      "image": {
        "url": "./FUSE_Board.jpg",
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
        "id": "IN1",
        "name": "Input 1",
        "description": "Input 1 (Fuses 1 & 2)",
        "type": "source",
        "x": 15,
        "y": 90,
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
          "toleranceMin": 0,
          "toleranceMax": 32
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "IN2",
        "name": "Input 2",
        "description": "Input 2 (Fuses 3 & 4)",
        "type": "source",
        "x": 15,
        "y": 113,
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
          "toleranceMin": 0,
          "toleranceMax": 32
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "OUT1",
        "name": "Output 1",
        "description": "Output 1 (Fuse 1)",
        "type": "source",
        "x": 315,
        "y": 51,
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
          "outDependency": "IN1",
          "toleranceMin": 0,
          "toleranceMax": 32
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "OUT2",
        "name": "Output 2",
        "description": "Output 2 (Fuse 2)",
        "type": "source",
        "x": 315,
        "y": 74,
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
          "outDependency": "IN1",
          "toleranceMin": 0,
          "toleranceMax": 32
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "OUT3",
        "name": "Output 3",
        "description": "Output 3 (Fuse 3)",
        "type": "source",
        "x": 315,
        "y": 122,
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
          "outDependency": "IN2",
          "toleranceMin": 0,
          "toleranceMax": 32
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "OUT4",
        "name": "Output 4",
        "description": "Output 4 (Fuse 4)",
        "type": "source",
        "x": 315,
        "y": 145,
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
          "outDependency": "IN2",
          "toleranceMin": 0,
          "toleranceMax": 32
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
            "x": 78,
            "y": 23
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 23
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 23
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 23
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "white",
          "fieldWidth": 70,
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
            "x": 186,
            "y": 68
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 68
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 68
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 68
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "white",
          "fieldWidth": 70,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse3",
        "type": "select",
        "name": "Fuse3: ",
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
            "x": 78,
            "y": 122
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 122
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 122
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 78,
            "y": 122
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "white",
          "fieldWidth": 70,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse4",
        "type": "select",
        "name": "Fuse4: ",
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
            "x": 186,
            "y": 158
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 158
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 158
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 186,
            "y": 158
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "white",
          "fieldWidth": 70,
          "hide": true,
          "showNameIfSelected": true
        }
      }
    ],
    "internalConnections": [
      {
        "kind": "fuse",
        "fromHandle": "IN1",
        "toHandle": "OUT1",
        "fuseId": "Fuse1",
        "nominalCurrentField": "Fuse1"
      },
      {
        "kind": "fuse",
        "fromHandle": "IN1",
        "toHandle": "OUT2",
        "fuseId": "Fuse2",
        "nominalCurrentField": "Fuse2"
      },
      {
        "kind": "fuse",
        "fromHandle": "IN2",
        "toHandle": "OUT3",
        "fuseId": "Fuse3",
        "nominalCurrentField": "Fuse3"
      },
      {
        "kind": "fuse",
        "fromHandle": "IN2",
        "toHandle": "OUT4",
        "fuseId": "Fuse4",
        "nominalCurrentField": "Fuse4"
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "name": "compData.FUSE_Board.name",
      "description": "compData.FUSE_Board.descriptionShort",
      "popover": {
        "description": "compData.FUSE_Board.description"
      },
      "technicalID": "FUSE_Board",
      "technicalVersion": 1,
      "group": "electronics",
      "image": {
        "url": "./FUSE_Board.jpg",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "inputFieldsBox": {
        "x": 110,
        "y": 83,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "rotate180only": true
      },
      "selectFields": [
        {
          "technicalID": "Fuse1",
          "name": "Fuse1: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 70,
          "customImage": true,
          "color": "white",
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
              "x": 78,
              "y": 23
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 23
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 23
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 23
            }
          ]
        },
        {
          "technicalID": "Fuse2",
          "name": "Fuse2: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 70,
          "customImage": true,
          "color": "white",
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
              "x": 186,
              "y": 68
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 68
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 68
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 68
            }
          ]
        },
        {
          "technicalID": "Fuse3",
          "name": "Fuse3: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 70,
          "customImage": true,
          "color": "white",
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
              "x": 78,
              "y": 122
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 122
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 122
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 78,
              "y": 122
            }
          ]
        },
        {
          "technicalID": "Fuse4",
          "name": "Fuse4: ",
          "displayName": false,
          "selectedValue": 10,
          "unit": "A",
          "fieldWidth": 70,
          "customImage": true,
          "color": "white",
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
              "x": 186,
              "y": 158
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 158
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 158
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 186,
              "y": 158
            }
          ]
        }
      ],
      "internalConnections": [
        {
          "kind": "fuse",
          "fromHandle": "IN1",
          "toHandle": "OUT1",
          "fuseId": "Fuse1",
          "nominalCurrentField": "Fuse1"
        },
        {
          "kind": "fuse",
          "fromHandle": "IN1",
          "toHandle": "OUT2",
          "fuseId": "Fuse2",
          "nominalCurrentField": "Fuse2"
        },
        {
          "kind": "fuse",
          "fromHandle": "IN2",
          "toHandle": "OUT3",
          "fuseId": "Fuse3",
          "nominalCurrentField": "Fuse3"
        },
        {
          "kind": "fuse",
          "fromHandle": "IN2",
          "toHandle": "OUT4",
          "fuseId": "Fuse4",
          "nominalCurrentField": "Fuse4"
        }
      ],
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Input 1 (Fuses 1 & 2)",
          "functions": [
            "suppl_in"
          ],
          "height": 18,
          "hid": "IN1",
          "name": "Input 1",
          "position": "left",
          "postype": "left",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "width": 30,
          "x": 15,
          "xalign": "start",
          "y": 90,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Input 2 (Fuses 3 & 4)",
          "functions": [
            "suppl_in"
          ],
          "height": 18,
          "hid": "IN2",
          "name": "Input 2",
          "position": "left",
          "postype": "left",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "width": 30,
          "x": 15,
          "xalign": "start",
          "y": 113,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Output 1 (Fuse 1)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "OUT1",
          "name": "Output 1",
          "position": "left",
          "postype": "right",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "IN1",
          "width": 30,
          "x": 315,
          "xalign": "start",
          "y": 51,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Output 2 (Fuse 2)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "OUT2",
          "name": "Output 2",
          "position": "left",
          "postype": "right",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "IN1",
          "width": 30,
          "x": 315,
          "xalign": "start",
          "y": 74,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Output 3 (Fuse 3)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "OUT3",
          "name": "Output 3",
          "position": "left",
          "postype": "right",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "IN2",
          "width": 30,
          "x": 315,
          "xalign": "start",
          "y": 122,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Output 4 (Fuse 4)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "OUT4",
          "name": "Output 4",
          "position": "left",
          "postype": "right",
          "tolVmax": 32,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "IN2",
          "width": 30,
          "x": 315,
          "xalign": "start",
          "y": 145,
          "yalign": "start",
          "prefferedLineWidth": 4
        }
      ]
    }
  }
});
