import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "Router",
    "version": 1,
    "display": {
      "name": "compData.Router.name",
      "descriptionShort": "compData.Router.descriptionShort",
      "description": "compData.Router.description",
      "group": "others"
    },
    "geometry": {
      "image": {
        "url": "./Router.png",
        "width": 200,
        "height": 132
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "ETH",
        "name": "Ethernet",
        "description": "Ethernet (LAN)",
        "type": "source",
        "x": 192,
        "y": 100.5,
        "xalign": "start",
        "yalign": "start",
        "width": 16,
        "height": 30,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "#8c8c8c",
          "lineWidth": 2,
          "radius": "5%"
        },
        "functions": [
          "eth"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "preferredLineWidth": 5
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./Router.png",
        "width": 200,
        "height": 132
      },
      "technicalID": "Router",
      "name": "compData.Router.name",
      "description": "compData.Router.descriptionShort",
      "popover": {
        "description": "compData.Router.description"
      },
      "technicalVersion": 1,
      "group": "others",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "handles": [
        {
          "borderColor": "#8c8c8c",
          "borderLineWidth": 2,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Ethernet (LAN)",
          "functions": [
            "eth"
          ],
          "height": 30,
          "hid": "ETH",
          "name": "Ethernet",
          "position": "left",
          "postype": "right",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 16,
          "x": 192,
          "xalign": "start",
          "y": 100.5,
          "yalign": "start",
          "prefferedLineWidth": 5
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
