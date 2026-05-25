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
    ],
    "runtime": {
      "inputFieldsBox": {
        "x": 110,
        "y": 83,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "rotate180only": true
      }
    }
  }
});
