import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "InfoNode",
    "version": 1,
    "display": {
      "name": "compData.InfoNode.name",
      "descriptionShort": "compData.InfoNode.descriptionShort",
      "description": "compData.InfoNode.description",
      "group": "others"
    },
    "geometry": {
      "image": {
        "url": "./Info.jpg",
        "width": 100,
        "height": 50
      },
      "noBackgroundImage": true,
      "rotation": 0,
      "rotatable": false,
      "resizableX": false,
      "borderWidth": 0
    },
    "handles": []
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./Info.jpg",
        "width": 100,
        "height": 50
      },
      "technicalID": "InfoNode",
      "name": "compData.InfoNode.name",
      "description": "compData.InfoNode.descriptionShort",
      "popover": {
        "description": "compData.InfoNode.description"
      },
      "technicalVersion": 1,
      "group": "others",
      "changableTextColor": true,
      "textColor": "#000000",
      "rotation": 0,
      "rotatable": false,
      "borderWidth": 0,
      "resizableX": false,
      "noBackgroundImage": true,
      "infoText": "",
      "infoTextSize": 12,
      "infoTextFontFamily": "Arial, sans-serif",
      "infoTextBold": false,
      "infoTextAlign": "left",
      "applyNodeResizer": true,
      "handles": []
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
