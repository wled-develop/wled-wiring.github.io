import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "AN_WHITE_24V_240LPM",
    "version": 1,
    "display": {
      "name": "compData.AN_WHITE_24V_240LPM.name",
      "descriptionShort": "compData.AN_WHITE_24V_240LPM.descriptionShort",
      "description": "compData.AN_WHITE_24V_240LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./AN_WHITE_24V_240LPM.jpg",
        "width": 62,
        "height": 25
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": true,
      "borderWidth": 2
    },
    "physical": {
      "lengthStep": 0.016667
    },
    "handles": [
      {
        "id": "24V_start",
        "name": "24V pin",
        "description": "24V supply input",
        "type": "source",
        "x": 2.7,
        "y": 21.5,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 20,
          "toleranceMax": 24
        },
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "W_start",
        "name": "W pin",
        "description": "W",
        "type": "source",
        "x": 2.7,
        "y": 4,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_W"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "24V_end",
        "name": "24V pin",
        "description": "24V supply input",
        "type": "source",
        "x": 2.7,
        "y": 21.5,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 20,
          "toleranceMax": 24
        },
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "W_end",
        "name": "W pin",
        "description": "W",
        "type": "source",
        "x": 2.7,
        "y": 4,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_W"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "24V_middle",
        "name": "24V pin",
        "description": "24V supply input",
        "type": "source",
        "x": 0,
        "y": 21.5,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 20,
          "toleranceMax": 24
        },
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "W_middle",
        "name": "W pin",
        "description": "W",
        "type": "source",
        "x": 0,
        "y": 4,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_W"
        ],
        "voltage": {},
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./AN_WHITE_24V_240LPM.jpg",
        "width": 62,
        "height": 25
      },
      "technicalID": "AN_WHITE_24V_240LPM",
      "name": "compData.AN_WHITE_24V_240LPM.name",
      "description": "compData.AN_WHITE_24V_240LPM.descriptionShort",
      "popover": {
        "description": "compData.AN_WHITE_24V_240LPM.description"
      },
      "showName": true,
      "technicalVersion": 1,
      "group": "led",
      "rotation": 0,
      "rotatable": true,
      "borderWidth": 2,
      "resizableX": true,
      "physLengthStep": 0.016667,
      "handles": [
        {
          "hid": "24V_start",
          "type": "source",
          "x": 2.7,
          "y": 21.5,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "24V pin",
          "description": "24V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "prefferedLineDirection": "left"
        },
        {
          "hid": "W_start",
          "type": "source",
          "x": 2.7,
          "y": 4,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "W",
          "name": "W pin",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_W"
          ]
        },
        {
          "hid": "24V_end",
          "type": "source",
          "x": 2.7,
          "y": 21.5,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "24V pin",
          "description": "24V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "prefferedLineDirection": "right"
        },
        {
          "hid": "W_end",
          "type": "source",
          "x": 2.7,
          "y": 4,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "W",
          "name": "W pin",
          "functions": [
            "pwm_in_W"
          ],
          "prefferedLineDirection": "right"
        },
        {
          "hid": "24V_middle",
          "type": "source",
          "x": 0,
          "y": 21.5,
          "xalign": "start",
          "yalign": "start",
          "width": 12,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "24V pin",
          "description": "24V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "repeated": "yes",
          "repeatAtFirst": "no"
        },
        {
          "hid": "W_middle",
          "type": "source",
          "x": 0,
          "y": 4,
          "xalign": "start",
          "yalign": "start",
          "width": 12,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "W",
          "name": "W pin",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "pwm_in_W"
          ]
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
