import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "AUDIO_SOURCE",
    "version": 1,
    "display": {
      "name": "compData.AUDIO_SOURCE.name",
      "descriptionShort": "compData.AUDIO_SOURCE.descriptionShort",
      "description": "compData.AUDIO_SOURCE.description",
      "group": "others",
      "buyLinks": []
    },
    "geometry": {
      "image": {
        "url": "./Audio_source.png",
        "width": 200,
        "height": 111
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "AUDIO",
        "name": "Line-Out",
        "description": "Audio output",
        "type": "source",
        "x": 193.5,
        "y": 78,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 16,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "blue",
          "lineWidth": 2,
          "radius": "5%"
        },
        "functions": [
          "audio_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineWidth": 3
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./Audio_source.png",
        "width": 200,
        "height": 111
      },
      "technicalID": "AUDIO_SOURCE",
      "name": "compData.AUDIO_SOURCE.name",
      "description": "compData.AUDIO_SOURCE.descriptionShort",
      "popover": {
        "description": "compData.AUDIO_SOURCE.description",
        "buyLinks": []
      },
      "technicalVersion": 1,
      "group": "others",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "handles": [
        {
          "borderColor": "blue",
          "borderLineWidth": 2,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "Audio output",
          "functions": [
            "audio_out"
          ],
          "height": 16,
          "hid": "AUDIO",
          "name": "Line-Out",
          "position": "left",
          "postype": "right",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 12,
          "x": 193.5,
          "xalign": "start",
          "y": 78,
          "yalign": "start",
          "prefferedLineWidth": 3,
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
