import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "LineBoxNode",
    "version": 1,
    "display": {
      "name": "compData.LineBoxNode.name",
      "descriptionShort": "compData.LineBoxNode.descriptionShort",
      "description": "compData.LineBoxNode.description",
      "group": "others"
    },
    "geometry": {
      "image": {
        "url": "./LineBox.jpg",
        "width": 100,
        "height": 10
      },
      "noBackgroundImage": true,
      "rotation": 0,
      "rotatable": false,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": []
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./LineBox.jpg",
        "width": 100,
        "height": 10
      },
      "technicalID": "LineBoxNode",
      "name": "compData.LineBoxNode.name",
      "description": "compData.LineBoxNode.descriptionShort",
      "popover": {
        "description": "compData.LineBoxNode.description"
      },
      "technicalVersion": 1,
      "group": "others",
      "rotation": 0,
      "rotatable": false,
      "borderWidth": 2,
      "resizableX": false,
      "noBackgroundImage": true,
      "applyNodeResizer": true,
      "putToBackground": true,
      "changableColor": true,
      "onlyBorder": false,
      "color": "#000000",
      "handles": []
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
