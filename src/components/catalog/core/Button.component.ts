import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "Button",
    "version": 1,
    "display": {
      "name": "compData.Button.name",
      "descriptionShort": "compData.Button.descriptionShort",
      "description": "compData.Button.description",
      "group": "electronics",
      "buyLinks": []
    },
    "geometry": {
      "image": {
        "url": "./Button.jpg",
        "width": 80,
        "height": 29
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "1",
        "name": "1",
        "description": "Terminal 1",
        "type": "source",
        "x": 5.5,
        "y": 27,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 4,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 250
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      },
      {
        "id": "2",
        "name": "2",
        "description": "Terminal 2",
        "type": "source",
        "x": 75,
        "y": 27,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 4,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 250
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 1
        }
      }
    ],
    "simulation": {
      "version": 1
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./Button.jpg",
        "width": 80,
        "height": 29
      },
      "technicalID": "Button",
      "name": "compData.Button.name",
      "description": "compData.Button.descriptionShort",
      "technicalVersion": 1,
      "group": "electronics",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "popover": {
        "description": "compData.Button.description",
        "buyLinks": []
      },
      "simdata": {
        "version": 1
      },
      "handles": [
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "borderType": "dotted",
          "description": "Terminal 1",
          "functions": [
            "dig_in"
          ],
          "height": 4,
          "hid": "1",
          "name": "1",
          "position": "left",
          "postype": "centered",
          "tolVmax": 250,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 10,
          "x": 5.5,
          "xalign": "start",
          "y": 27,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        },
        {
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "borderType": "dotted",
          "description": "Terminal 2",
          "functions": [
            "dig_in"
          ],
          "height": 4,
          "hid": "2",
          "name": "2",
          "position": "left",
          "postype": "centered",
          "tolVmax": 250,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 10,
          "x": 75,
          "xalign": "start",
          "y": 27,
          "yalign": "start",
          "prefferedLineWidth": 1,
          "mustBeConnected": true
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
