import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "PSU_USB",
    "version": 1,
    "display": {
      "name": "compData.PSU_USB.name",
      "descriptionShort": "compData.PSU_USB.descriptionShort",
      "description": "compData.PSU_USB.description",
      "group": "psu"
    },
    "geometry": {
      "image": {
        "url": "./PSU_USB.png",
        "width": 200,
        "height": 99
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "usb",
        "name": "USB",
        "description": "USB (GND, 5V)",
        "type": "source",
        "x": 197,
        "y": 49.5,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 32,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "#8c8c8c",
          "lineWidth": 2,
          "radius": "5%"
        },
        "functions": [
          "usb_power_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 5
        }
      }
    ],
    "fields": [
      {
        "id": "source_current",
        "type": "number",
        "name": "Iout",
        "value": 3,
        "min": 0,
        "max": 5,
        "step": 0.1,
        "unit": "A",
        "ui": {
          "color": "#757575",
          "fieldWidth": 70
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./PSU_USB.png",
        "width": 200,
        "height": 99
      },
      "technicalID": "PSU_USB",
      "name": "compData.PSU_USB.name",
      "description": "compData.PSU_USB.descriptionShort",
      "popover": {
        "description": "compData.PSU_USB.description"
      },
      "technicalVersion": 1,
      "group": "psu",
      "rotation": 0,
      "borderWidth": 2,
      "resizableX": false,
      "rotatable": true,
      "inputFieldsBox": {
        "x": 104,
        "y": 24,
        "borderType": "solid",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent"
      },
      "inputFields": [
        {
          "technicalID": "source_current",
          "type": "number_input",
          "name": "Iout",
          "value": 3,
          "min": 0,
          "max": 5,
          "step": 0.1,
          "unit": "A",
          "fieldWidth": 70,
          "color": "#757575"
        }
      ],
      "handles": [
        {
          "borderColor": "#8c8c8c",
          "borderLineWidth": 2,
          "borderRadius": "5%",
          "borderType": "dotted",
          "description": "USB (GND, 5V)",
          "functions": [
            "usb_power_out"
          ],
          "height": 32,
          "hid": "usb",
          "name": "USB",
          "position": "left",
          "postype": "right",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 5,
          "width": 8,
          "x": 197,
          "xalign": "start",
          "y": 49.5,
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
