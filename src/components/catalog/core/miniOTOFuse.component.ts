import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "miniOTOFuse",
    "version": 1,
    "display": {
      "name": "compData.miniOTOFuse.name",
      "descriptionShort": "compData.miniOTOFuse.descriptionShort",
      "description": "compData.miniOTOFuse.description",
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
        "url": "./miniOTO_5A.jpg",
        "width": 60,
        "height": 89
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "physical": {
      "lengthStep": 0.016667
    },
    "handles": [
      {
        "id": "1",
        "name": "1",
        "description": "1",
        "type": "source",
        "x": 6.8,
        "y": 79,
        "xalign": "start",
        "yalign": "start",
        "width": 15,
        "height": 20,
        "postype": "bottom",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 0.5,
          "radius": "10%"
        },
        "voltage": {},
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 4,
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "2",
        "name": "2",
        "description": "2",
        "type": "source",
        "x": 52.2,
        "y": 79,
        "xalign": "start",
        "yalign": "start",
        "width": 15,
        "height": 20,
        "postype": "bottom",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 0.5,
          "radius": "10%"
        },
        "voltage": {},
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 4,
          "preferredLineDirection": "right"
        }
      }
    ],
    "fields": [
      {
        "id": "NominalValue",
        "type": "select",
        "name": "I",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 15,
            "label": "15 A",
            "image": {
              "url": "./miniOTO_15A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 20,
            "label": "20 A",
            "image": {
              "url": "./miniOTO_20A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 30,
            "label": "30 A",
            "image": {
              "url": "./miniOTO_30A.jpg",
              "width": 60,
              "height": 89
            },
            "x": 0,
            "y": 0
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "white",
          "fieldWidth": 70,
          "hide": false,
          "showNameIfSelected": false
        }
      }
    ],
    "internalConnections": [
      {
        "kind": "fuse",
        "fromHandle": "1",
        "toHandle": "2",
        "fuseId": "NominalValue",
        "nominalCurrentField": "NominalValue"
      }
    ],
    "simulation": {
      "version": 1,
      "elements": [
        {
          "id": "fuse",
          "type": "fuse",
          "terminals": {
            "a": "1",
            "b": "2"
          },
          "parameters": {
            "resistanceOhm": {
              "table": {
                "2": 0.085,
                "3": 0.051,
                "4": 0.03,
                "5": 0.025,
                "10": 0.0108,
                "15": 0.0065,
                "20": 0.0048,
                "30": 0.0029,
                "7.5": 0.018
              },
              "by": {
                "select": "NominalValue"
              },
              "default": 0.01
            },
            "nominalCurrentA": {
              "select": "NominalValue"
            }
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./miniOTO_5A.jpg",
        "width": 60,
        "height": 89
      },
      "technicalID": "miniOTOFuse",
      "name": "compData.miniOTOFuse.name",
      "description": "compData.miniOTOFuse.descriptionShort",
      "popover": {
        "description": "compData.miniOTOFuse.description",
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
      "physLengthStep": 0.016667,
      "inputFieldsBox": {
        "x": 31,
        "y": 25.5,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "rotate180only": true
      },
      "selectFields": [
        {
          "technicalID": "NominalValue",
          "name": "I",
          "displayName": false,
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 70,
          "customImage": true,
          "color": "white",
          "hide": false,
          "showNameIfSelected": false,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 15,
              "label": "15 A",
              "img": {
                "url": "./miniOTO_15A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 20,
              "label": "20 A",
              "img": {
                "url": "./miniOTO_20A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            },
            {
              "value": 30,
              "label": "30 A",
              "img": {
                "url": "./miniOTO_30A.jpg",
                "width": 60,
                "height": 89
              },
              "x": 0,
              "y": 0
            }
          ]
        }
      ],
      "internalConnections": [
        {
          "kind": "fuse",
          "fromHandle": "1",
          "toHandle": "2",
          "fuseId": "NominalValue",
          "nominalCurrentField": "NominalValue"
        }
      ],
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "fuse",
            "type": "fuse",
            "terminals": {
              "a": "1",
              "b": "2"
            },
            "parameters": {
              "resistanceOhm": {
                "table": {
                  "2": 0.085,
                  "3": 0.051,
                  "4": 0.03,
                  "5": 0.025,
                  "10": 0.0108,
                  "15": 0.0065,
                  "20": 0.0048,
                  "30": 0.0029,
                  "7.5": 0.018
                },
                "by": {
                  "select": "NominalValue"
                },
                "default": 0.01
              },
              "nominalCurrentA": {
                "select": "NominalValue"
              }
            }
          }
        ]
      },
      "handles": [
        {
          "hid": "1",
          "type": "source",
          "x": 6.8,
          "y": 79,
          "xalign": "start",
          "yalign": "start",
          "width": 15,
          "height": 20,
          "borderType": "dashed",
          "borderColor": "red",
          "borderLineWidth": 0.5,
          "borderRadius": "10%",
          "postype": "bottom",
          "position": "left",
          "description": "1",
          "name": "1",
          "prefferedLineWidth": 4,
          "prefferedLineDirection": "left",
          "mustBeConnected": true
        },
        {
          "hid": "2",
          "type": "source",
          "x": 52.2,
          "y": 79,
          "xalign": "start",
          "yalign": "start",
          "width": 15,
          "height": 20,
          "borderType": "dashed",
          "borderColor": "red",
          "borderLineWidth": 0.5,
          "borderRadius": "10%",
          "postype": "bottom",
          "position": "left",
          "description": "2",
          "name": "2",
          "prefferedLineWidth": 4,
          "prefferedLineDirection": "right",
          "mustBeConnected": true
        }
      ]
    }
  }
});
