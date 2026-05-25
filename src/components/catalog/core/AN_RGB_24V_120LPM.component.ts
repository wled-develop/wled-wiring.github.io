import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "AN_RGB_24V_120LPM",
    "version": 1,
    "display": {
      "name": "compData.AN_RGB_24V_120LPM.name",
      "descriptionShort": "compData.AN_RGB_24V_120LPM.descriptionShort",
      "description": "compData.AN_RGB_24V_120LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./AN_RGB_24V_120LPM.jpg",
        "width": 125,
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
        "name": "24V (+)",
        "description": "+24V supply",
        "type": "source",
        "x": 2.5,
        "y": 3,
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
        "id": "R_start",
        "name": "RED",
        "description": "RED (-)",
        "type": "source",
        "x": 2.5,
        "y": 9,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_R"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "G_start",
        "name": "GREEN",
        "description": "GREEN (-)",
        "type": "source",
        "x": 2.5,
        "y": 15,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_G"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "B_start",
        "name": "BLUE",
        "description": "BLUE (-)",
        "type": "source",
        "x": 2.5,
        "y": 21,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_B"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "24V_end",
        "name": "24V (+)",
        "description": "+24V supply",
        "type": "source",
        "x": 2.5,
        "y": 3,
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
        "id": "R_end",
        "name": "RED",
        "description": "RED (-)",
        "type": "source",
        "x": 2.5,
        "y": 9,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_R"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "G_end",
        "name": "GREEN",
        "description": "GREEN (-)",
        "type": "source",
        "x": 2.5,
        "y": 15,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_G"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "B_end",
        "name": "BLUE",
        "description": "BLUE (-)",
        "type": "source",
        "x": 2.5,
        "y": 21,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_B"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "24V_middle",
        "name": "24V (+)",
        "description": "+24V supply",
        "type": "source",
        "x": 0,
        "y": 3,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
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
        "id": "R_middle",
        "name": "RED",
        "description": "RED (-)",
        "type": "source",
        "x": 0,
        "y": 9,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_R"
        ],
        "voltage": {},
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "G_middle",
        "name": "GREEN",
        "description": "GREEN (-)",
        "type": "source",
        "x": 0,
        "y": 15,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_G"
        ],
        "voltage": {},
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "B_middle",
        "name": "BLUE",
        "description": "BLUE (-)",
        "type": "source",
        "x": 0,
        "y": 21,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 5,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "pwm_in_B"
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
        "url": "./AN_RGB_24V_120LPM.jpg",
        "width": 125,
        "height": 25
      },
      "technicalID": "AN_RGB_24V_120LPM",
      "name": "compData.AN_RGB_24V_120LPM.name",
      "description": "compData.AN_RGB_24V_120LPM.descriptionShort",
      "popover": {
        "description": "compData.AN_RGB_24V_120LPM.description"
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
          "x": 2.5,
          "y": 3,
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
          "name": "24V (+)",
          "description": "+24V supply",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "prefferedLineDirection": "left"
        },
        {
          "hid": "R_start",
          "type": "source",
          "x": 2.5,
          "y": 9,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "RED (-)",
          "name": "RED",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_R"
          ]
        },
        {
          "hid": "G_start",
          "type": "source",
          "x": 2.5,
          "y": 15,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "GREEN (-)",
          "name": "GREEN",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_G"
          ]
        },
        {
          "hid": "B_start",
          "type": "source",
          "x": 2.5,
          "y": 21,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "BLUE (-)",
          "name": "BLUE",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_B"
          ]
        },
        {
          "hid": "24V_end",
          "type": "source",
          "x": 2.5,
          "y": 3,
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
          "name": "24V (+)",
          "description": "+24V supply",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "prefferedLineDirection": "right"
        },
        {
          "hid": "R_end",
          "type": "source",
          "x": 2.5,
          "y": 9,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "RED (-)",
          "name": "RED",
          "prefferedLineDirection": "right",
          "functions": [
            "pwm_in_R"
          ]
        },
        {
          "hid": "G_end",
          "type": "source",
          "x": 2.5,
          "y": 15,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "GREEN (-)",
          "name": "GREEN",
          "prefferedLineDirection": "right",
          "functions": [
            "pwm_in_G"
          ]
        },
        {
          "hid": "B_end",
          "type": "source",
          "x": 2.5,
          "y": 21,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "BLUE (-)",
          "name": "BLUE",
          "prefferedLineDirection": "right",
          "functions": [
            "pwm_in_B"
          ]
        },
        {
          "hid": "24V_middle",
          "type": "source",
          "x": 0,
          "y": 3,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "24V (+)",
          "description": "+24V supply",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 20,
          "tolVmax": 24,
          "repeated": "yes",
          "repeatAtFirst": "no"
        },
        {
          "hid": "R_middle",
          "type": "source",
          "x": 0,
          "y": 9,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "RED (-)",
          "name": "RED",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "pwm_in_R"
          ]
        },
        {
          "hid": "G_middle",
          "type": "source",
          "x": 0,
          "y": 15,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "GREEN (-)",
          "name": "GREEN",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "pwm_in_G"
          ]
        },
        {
          "hid": "B_middle",
          "type": "source",
          "x": 0,
          "y": 21,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "BLUE (-)",
          "name": "BLUE",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "pwm_in_B"
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
