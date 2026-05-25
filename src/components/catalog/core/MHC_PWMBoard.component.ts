import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "MHC_PWMBoard",
    "version": 1,
    "display": {
      "name": "compData.MHC_PWMBoard.name",
      "descriptionShort": "compData.MHC_PWMBoard.descriptionShort",
      "description": "compData.MHC_PWMBoard.description",
      "group": "electronics",
      "buyLinks": [
        {
          "text": "MyHome-Control Shop (Germnany)",
          "url": "https://shop.myhome-control.de/"
        }
      ]
    },
    "geometry": {
      "image": {
        "url": "./MHC_PWMBoard.jpg",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "rotatable": true,
      "resizableX": false,
      "borderWidth": 2
    },
    "handles": [
      {
        "id": "VIN",
        "name": "Power supply input +",
        "description": "power supply in +",
        "type": "source",
        "x": 20,
        "y": 43,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 12,
          "toleranceMax": 48
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND",
        "name": "GND (input)",
        "description": "GND",
        "type": "source",
        "x": 20,
        "y": 65,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "PWMIN1",
        "name": "PWM input 1",
        "description": "PWM input 1",
        "type": "source",
        "x": 20,
        "y": 87,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "PWMIN2",
        "name": "PWM input 2",
        "description": "PWM input 2",
        "type": "source",
        "x": 20,
        "y": 109,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "PWMIN3",
        "name": "PWM input 3",
        "description": "PWM input 3",
        "type": "source",
        "x": 20,
        "y": 131,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineWidth": 2
        }
      },
      {
        "id": "VOUT",
        "name": "Power output +",
        "description": "Power output + (fused)",
        "type": "source",
        "x": 312,
        "y": 48,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "red",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "outDependency": "VIN",
          "toleranceMin": 0,
          "toleranceMax": 48
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "PWMOUT1",
        "name": "PWM output 1",
        "description": "PWM Output 1",
        "type": "source",
        "x": 312,
        "y": 70,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "pwm_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 48
        },
        "behavior": {
          "controllableBy": "PWMIN1",
          "preferredLineWidth": 3
        }
      },
      {
        "id": "PWMOUT2",
        "name": "PWM output 2",
        "description": "PWM Output 2",
        "type": "source",
        "x": 312,
        "y": 91,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "pwm_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 48
        },
        "behavior": {
          "controllableBy": "PWMIN2",
          "preferredLineWidth": 3
        }
      },
      {
        "id": "PWMOUT3",
        "name": "PWM output 3",
        "description": "PWM Output 3",
        "type": "source",
        "x": 312,
        "y": 113,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "black",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "pwm_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 48
        },
        "behavior": {
          "controllableBy": "PWMIN3",
          "preferredLineWidth": 3
        }
      }
    ],
    "fields": [
      {
        "id": "Fuse",
        "type": "select",
        "name": "Fuse: ",
        "selectedValue": 15,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          },
          {
            "value": 15,
            "label": "15 A",
            "image": {
              "url": "./miniOTO_15A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 85,
            "y": 5
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse1",
        "type": "select",
        "name": "Fuse1: ",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 88,
            "y": 40
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 84
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 84
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 84
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse2",
        "type": "select",
        "name": "Fuse2: ",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 123
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 123
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 123
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 198,
            "y": 123
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "Fuse3",
        "type": "select",
        "name": "Fuse3: ",
        "selectedValue": 5,
        "unit": "A",
        "options": [
          {
            "value": 2,
            "label": "2 A",
            "image": {
              "url": "./miniOTO_2A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 222,
            "y": 166
          },
          {
            "value": 3,
            "label": "3 A",
            "image": {
              "url": "./miniOTO_3A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 222,
            "y": 166
          },
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 222,
            "y": 166
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 222,
            "y": 166
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 107,
          "hide": true,
          "showNameIfSelected": true
        }
      }
    ],
    "internalConnections": [
      {
        "kind": "fuse",
        "fromHandle": "VIN",
        "toHandle": "VOUT",
        "fuseId": "Fuse",
        "nominalCurrentField": "Fuse"
      }
    ]
  },
  "compatibility": {
    "templateData": {
      "name": "compData.MHC_PWMBoard.name",
      "description": "compData.MHC_PWMBoard.descriptionShort",
      "popover": {
        "description": "compData.MHC_PWMBoard.description",
        "buyLinks": [
          {
            "text": "MyHome-Control Shop (Germnany)",
            "url": "https://shop.myhome-control.de/"
          }
        ]
      },
      "technicalID": "MHC_PWMBoard",
      "technicalVersion": 1,
      "group": "electronics",
      "image": {
        "url": "./MHC_PWMBoard.jpg",
        "width": 332,
        "height": 198
      },
      "rotation": 0,
      "resizableX": false,
      "rotatable": true,
      "borderWidth": 2,
      "inputFieldsBox": {
        "x": 156,
        "y": 85,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "backgroundColorSelected": "white",
        "rotate180only": true
      },
      "selectFields": [
        {
          "technicalID": "Fuse",
          "name": "Fuse: ",
          "displayName": false,
          "selectedValue": 15,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 7.5,
              "label": "7.5 A",
              "img": {
                "url": "./miniOTO_7.5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 10,
              "label": "10 A",
              "img": {
                "url": "./miniOTO_10A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            },
            {
              "value": 15,
              "label": "15 A",
              "img": {
                "url": "./miniOTO_15A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 85,
              "y": 5
            }
          ]
        },
        {
          "technicalID": "Fuse1",
          "name": "Fuse1: ",
          "displayName": false,
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 88,
              "y": 40
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 84
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 84
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 84
            }
          ]
        },
        {
          "technicalID": "Fuse2",
          "name": "Fuse2: ",
          "displayName": false,
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 123
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 123
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 123
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 198,
              "y": 123
            }
          ]
        },
        {
          "technicalID": "Fuse3",
          "name": "Fuse3: ",
          "displayName": false,
          "selectedValue": 5,
          "unit": "A",
          "fieldWidth": 107,
          "customImage": true,
          "color": "black",
          "hide": true,
          "showNameIfSelected": true,
          "options": [
            {
              "value": 2,
              "label": "2 A",
              "img": {
                "url": "./miniOTO_2A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 222,
              "y": 166
            },
            {
              "value": 3,
              "label": "3 A",
              "img": {
                "url": "./miniOTO_3A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 222,
              "y": 166
            },
            {
              "value": 4,
              "label": "4 A",
              "img": {
                "url": "./miniOTO_4A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 222,
              "y": 166
            },
            {
              "value": 5,
              "label": "5 A",
              "img": {
                "url": "./miniOTO_5A_top.jpg",
                "width": 60,
                "height": 20
              },
              "x": 222,
              "y": 166
            }
          ]
        }
      ],
      "internalConnections": [
        {
          "kind": "fuse",
          "fromHandle": "VIN",
          "toHandle": "VOUT",
          "fuseId": "Fuse",
          "nominalCurrentField": "Fuse"
        }
      ],
      "handles": [
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "power supply in +",
          "functions": [
            "suppl_in"
          ],
          "height": 18,
          "hid": "VIN",
          "name": "Power supply input +",
          "position": "left",
          "postype": "left",
          "tolVmax": 48,
          "tolVmin": 12,
          "type": "source",
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 43,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "GND",
          "functions": [
            "gnd"
          ],
          "height": 18,
          "hid": "GND",
          "name": "GND (input)",
          "position": "left",
          "postype": "left",
          "tolVmax": 0,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 65,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM input 1",
          "functions": [
            "dig_in"
          ],
          "height": 18,
          "hid": "PWMIN1",
          "name": "PWM input 1",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 87,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM input 2",
          "functions": [
            "dig_in"
          ],
          "height": 18,
          "hid": "PWMIN2",
          "name": "PWM input 2",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 109,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "green",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM input 3",
          "functions": [
            "dig_in"
          ],
          "height": 18,
          "hid": "PWMIN3",
          "name": "PWM input 3",
          "position": "left",
          "postype": "left",
          "tolVmax": 5,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "width": 30,
          "x": 20,
          "xalign": "start",
          "y": 131,
          "yalign": "start",
          "prefferedLineWidth": 2
        },
        {
          "borderColor": "red",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "Power output + (fused)",
          "functions": [
            "suppl_out"
          ],
          "height": 18,
          "hid": "VOUT",
          "name": "Power output +",
          "position": "left",
          "postype": "right",
          "tolVmax": 48,
          "tolVmin": 0,
          "type": "source",
          "VoutDependency": "VIN",
          "width": 30,
          "x": 312,
          "xalign": "start",
          "y": 48,
          "yalign": "start",
          "prefferedLineWidth": 4
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM Output 1",
          "functions": [
            "pwm_out"
          ],
          "height": 18,
          "hid": "PWMOUT1",
          "name": "PWM output 1",
          "position": "left",
          "postype": "right",
          "tolVmax": 48,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "controllableBy": "PWMIN1",
          "width": 30,
          "x": 312,
          "xalign": "start",
          "y": 70,
          "yalign": "start",
          "prefferedLineWidth": 3
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM Output 2",
          "functions": [
            "pwm_out"
          ],
          "height": 18,
          "hid": "PWMOUT2",
          "name": "PWM output 2",
          "position": "left",
          "postype": "right",
          "tolVmax": 48,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "controllableBy": "PWMIN2",
          "width": 30,
          "x": 312,
          "xalign": "start",
          "y": 91,
          "yalign": "start",
          "prefferedLineWidth": 3
        },
        {
          "borderColor": "black",
          "borderLineWidth": 1,
          "borderRadius": "20%",
          "borderType": "dashed",
          "description": "PWM Output 3",
          "functions": [
            "pwm_out"
          ],
          "height": 18,
          "hid": "PWMOUT3",
          "name": "PWM output 3",
          "position": "left",
          "postype": "right",
          "tolVmax": 48,
          "tolVmin": 0,
          "type": "source",
          "Vout": 0,
          "controllableBy": "PWMIN3",
          "width": 30,
          "x": 312,
          "xalign": "start",
          "y": 113,
          "yalign": "start",
          "prefferedLineWidth": 3
        }
      ]
    }
  }
});
