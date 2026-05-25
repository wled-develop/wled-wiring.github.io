import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "SolderJoint",
    "version": 1,
    "display": {
      "name": "compData.SolderJoint.name",
      "descriptionShort": "compData.SolderJoint.descriptionShort",
      "description": "compData.SolderJoint.description",
      "group": "others"
    },
    "geometry": {
      "image": {
        "url": "./SolderJoint.jpg",
        "width": 16,
        "height": 16
      },
      "noBackgroundImage": true,
      "rotation": 0,
      "rotatable": false,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "hid1",
        "name": "Solder joint pin",
        "type": "source",
        "x": 8,
        "y": 8,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "solid",
          "color": "rgb(0,0,0)",
          "lineWidth": 2,
          "radius": "50%"
        },
        "voltage": {},
        "behavior": {
          "changeColorAutomatically": true
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "name": "compData.SolderJoint.name",
      "description": "compData.SolderJoint.descriptionShort",
      "popover": {
        "description": "compData.SolderJoint.description"
      },
      "technicalID": "SolderJoint",
      "technicalVersion": 1,
      "group": "others",
      "image": {
        "url": "./SolderJoint.jpg",
        "width": 16,
        "height": 16
      },
      "noBackgroundImage": true,
      "rotation": 0,
      "resizableX": false,
      "rotatable": false,
      "borderWidth": 2,
      "simdata": {},
      "handles": [
        {
          "hid": "hid1",
          "type": "source",
          "x": 8,
          "y": 8,
          "xalign": "start",
          "yalign": "start",
          "width": 8,
          "height": 8,
          "borderType": "solid",
          "borderColor": "rgb(0,0,0)",
          "borderLineWidth": 2,
          "borderRadius": "50%",
          "postype": "centered",
          "position": "left",
          "name": "Solder joint pin",
          "changeColorAutomatically": true
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
