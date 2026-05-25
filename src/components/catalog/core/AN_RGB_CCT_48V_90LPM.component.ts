import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "AN_RGB_CCT_48V_90LPM",
    "version": 1,
    "display": {
      "name": "compData.AN_RGB_CCT_48V_90LPM.name",
      "descriptionShort": "compData.AN_RGB_CCT_48V_90LPM.descriptionShort",
      "description": "compData.AN_RGB_CCT_48V_90LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./AN_RGB_CCT_48V_90LPM.jpg",
        "width": 417,
        "height": 30
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
        "id": "48V_start",
        "name": "48V (+)",
        "description": "+48V supply",
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
          "toleranceMin": 40,
          "toleranceMax": 48
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
        "y": 8,
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
        "y": 13,
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
        "y": 17,
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
        "id": "WW_start",
        "name": "Warm White",
        "description": "Warm White (-)",
        "type": "source",
        "x": 2.5,
        "y": 22,
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
          "pwm_in_WW"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "W_start",
        "name": "White",
        "description": "White (-)",
        "type": "source",
        "x": 2.5,
        "y": 27,
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
          "pwm_in_W"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "48V_end",
        "name": "48V (+)",
        "description": "+48V supply",
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
          "toleranceMin": 40,
          "toleranceMax": 48
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
        "y": 8,
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
        "y": 13,
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
        "y": 17,
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
        "id": "WW_end",
        "name": "Warm White",
        "description": "Warm White (-)",
        "type": "source",
        "x": 2.5,
        "y": 22,
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
          "pwm_in_WW"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "W_end",
        "name": "White",
        "description": "White (-)",
        "type": "source",
        "x": 2.5,
        "y": 27,
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
          "pwm_in_W"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "48V_middle",
        "name": "48V (+)",
        "description": "+48V supply",
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
          "toleranceMin": 40,
          "toleranceMax": 48
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
        "y": 8,
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
        "y": 13,
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
        "y": 17,
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
      },
      {
        "id": "WW_middle",
        "name": "Warm White",
        "description": "Warm White (-)",
        "type": "source",
        "x": 0,
        "y": 22,
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
          "pwm_in_WW"
        ],
        "voltage": {},
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "W_middle",
        "name": "White",
        "description": "White (-)",
        "type": "source",
        "x": 0,
        "y": 27,
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
        "url": "./AN_RGB_CCT_48V_90LPM.jpg",
        "width": 417,
        "height": 30
      },
      "technicalID": "AN_RGB_CCT_48V_90LPM",
      "name": "compData.AN_RGB_CCT_48V_90LPM.name",
      "description": "compData.AN_RGB_CCT_48V_90LPM.descriptionShort",
      "popover": {
        "description": "compData.AN_RGB_CCT_48V_90LPM.description"
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
          "hid": "48V_start",
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
          "name": "48V (+)",
          "description": "+48V supply",
          "prefferedLineDirection": "left",
          "functions": [
            "suppl_in"
          ],
          "tolVmax": 48,
          "tolVmin": 40
        },
        {
          "hid": "R_start",
          "type": "source",
          "x": 2.5,
          "y": 8,
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
          "y": 13,
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
          "y": 17,
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
          "hid": "WW_start",
          "type": "source",
          "x": 2.5,
          "y": 22,
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
          "description": "Warm White (-)",
          "name": "Warm White",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_WW"
          ]
        },
        {
          "hid": "W_start",
          "type": "source",
          "x": 2.5,
          "y": 27,
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
          "description": "White (-)",
          "name": "White",
          "prefferedLineDirection": "left",
          "functions": [
            "pwm_in_W"
          ]
        },
        {
          "hid": "48V_end",
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
          "name": "48V (+)",
          "description": "+48V supply",
          "prefferedLineDirection": "right",
          "functions": [
            "suppl_in"
          ],
          "tolVmax": 48,
          "tolVmin": 40
        },
        {
          "hid": "R_end",
          "type": "source",
          "x": 2.5,
          "y": 8,
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
          "y": 13,
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
          "y": 17,
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
          "hid": "WW_end",
          "type": "source",
          "x": 2.5,
          "y": 22,
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
          "description": "Warm White (-)",
          "name": "Warm White",
          "prefferedLineDirection": "right",
          "functions": [
            "pwm_in_WW"
          ]
        },
        {
          "hid": "W_end",
          "type": "source",
          "x": 2.5,
          "y": 27,
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
          "description": "White (-)",
          "name": "White",
          "prefferedLineDirection": "right",
          "functions": [
            "pwm_in_W"
          ]
        },
        {
          "hid": "48V_middle",
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
          "name": "48V (+)",
          "description": "+48V supply",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "suppl_in"
          ],
          "tolVmax": 48,
          "tolVmin": 40
        },
        {
          "hid": "R_middle",
          "type": "source",
          "x": 0,
          "y": 8,
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
          "y": 13,
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
          "y": 17,
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
        },
        {
          "hid": "WW_middle",
          "type": "source",
          "x": 0,
          "y": 22,
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
          "description": "Warm White (-)",
          "name": "Warm White",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "pwm_in_WW"
          ]
        },
        {
          "hid": "W_middle",
          "type": "source",
          "x": 0,
          "y": 27,
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
          "description": "White (-)",
          "name": "White",
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
