import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "MHC_V63",
    "version": 1,
    "display": {
      "name": "compData.MHC_V63.name",
      "descriptionShort": "compData.MHC_V63.descriptionShort",
      "description": "compData.MHC_V63.description",
      "group": "controller",
      "buyLinks": [
        {
          "text": "MyHome-Control Shop (Germnany)",
          "url": "https://shop.myhome-control.de/"
        },
        {
          "text": "WLED Shop (worldwide)",
          "url": "https://wled.shop"
        }
      ]
    },
    "geometry": {
      "image": {
        "url": "./MHC_V63.png",
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
        "name": "Power supply input",
        "description": "5-12 V DC power supply",
        "type": "source",
        "x": 18,
        "y": 47.5,
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
          "toleranceMin": 4,
          "toleranceMax": 14
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND1",
        "name": "GND (input)",
        "description": "GND",
        "type": "source",
        "x": 18,
        "y": 68.5,
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
        "id": "DAT2",
        "name": "Data 2 out",
        "description": "LED data out (ESP8266: GPIO 14, ESP32: GPIO 18, ESP32-C3: GPIO 2, ESP32-S3: GPIO 12)",
        "type": "source",
        "x": 18,
        "y": 136,
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
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {}
      },
      {
        "id": "CLK2",
        "name": "Clock 2 out",
        "description": "LED data or clock out (ESP8266: GPIO 12, ESP32: GPIO 19, ESP32-C3: GPIO 3, ESP32-S3: GPIO 13)",
        "type": "source",
        "x": 18,
        "y": 157,
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
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {}
      },
      {
        "id": "VOUT",
        "name": "Power output",
        "description": "Power output (fused)",
        "type": "source",
        "x": 311,
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
          "outDependency": "VIN"
        },
        "behavior": {
          "preferredLineWidth": 4
        }
      },
      {
        "id": "GND2",
        "name": "GND (output)",
        "description": "GND",
        "type": "source",
        "x": 311,
        "y": 69.5,
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
        "id": "DAT",
        "name": "Data out",
        "description": "LED data out (ESP8266: GPIO 2, ESP32: GPIO 16, ESP32-C3: GPIO 6, ESP32-S3: GPIO 16)",
        "type": "source",
        "x": 311,
        "y": 91.3,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {}
      },
      {
        "id": "CLK",
        "name": "Clock out",
        "description": "LED data or clock out (ESP8266: GPIO 0, ESP32: GPIO 17, ESP32-C3: GPIO 7, ESP32-S3: GPIO 18)",
        "type": "source",
        "x": 311,
        "y": 113.6,
        "xalign": "start",
        "yalign": "start",
        "width": 30,
        "height": 18,
        "postype": "right",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "green",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {}
      },
      {
        "id": "GND3",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 4,
        "y": 92,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
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
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "WS",
        "name": "WS",
        "description": "Digital In/Out, ESP32: GPIO 5",
        "type": "source",
        "x": 4,
        "y": 102,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "SCK",
        "name": "SCK",
        "description": "Digital In/Out, ESP32: GPIO 21",
        "type": "source",
        "x": 4,
        "y": 113,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "3V3_1",
        "name": "3.3V output",
        "description": "3.3 V output from internal voltage regulator",
        "type": "source",
        "x": 22,
        "y": 92,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "GND4",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 22,
        "y": 102,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
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
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "ANIN",
        "name": "Analog input",
        "description": "Digital or analog input an ESP32 (GPIO 36), analog on ESP8266 (A0)",
        "type": "source",
        "x": 22,
        "y": 113,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "an_in"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "GND5",
        "name": "GND",
        "description": "GND",
        "type": "source",
        "x": 37,
        "y": 92,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
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
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "3V3_2",
        "name": "3.3V output",
        "description": "3.3 V output from internal voltage regulator",
        "type": "source",
        "x": 37,
        "y": 102,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "red",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "suppl_out"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 0
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "SD",
        "name": "SD",
        "description": "Digital In/Out, GPIO26 on ESP32",
        "type": "source",
        "x": 37,
        "y": 113,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "TX",
        "name": "TX",
        "description": "Digital In/Out. Normally used for serial communication",
        "type": "source",
        "x": 48,
        "y": 92,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "RX",
        "name": "RX",
        "description": "Digital In/Out. Normally used for serial communication",
        "type": "source",
        "x": 48,
        "y": 102,
        "xalign": "start",
        "yalign": "start",
        "width": 8,
        "height": 8,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "green",
          "lineWidth": 0.8,
          "radius": "20%"
        },
        "functions": [
          "dig_in",
          "dig_out"
        ],
        "voltage": {
          "out": 0,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      {
        "id": "AUDIO",
        "name": "Line - In",
        "description": "Audio input for sound reactive WLED",
        "type": "source",
        "x": -106,
        "y": 157,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
        "height": 23,
        "postype": "left",
        "position": "left",
        "border": {
          "type": "dashed",
          "color": "blue",
          "lineWidth": 1,
          "radius": "20%"
        },
        "functions": [
          "audio_in"
        ],
        "voltage": {
          "out": 3.3,
          "toleranceMin": 0,
          "toleranceMax": 3.6
        },
        "behavior": {
          "preferredLineWidth": 3,
          "hideConditions": [
            {
              "fieldId": "LineInMic",
              "values": [
                0,
                1
              ]
            }
          ]
        }
      }
    ],
    "fields": [
      {
        "id": "Fuse",
        "type": "select",
        "name": "Fuse: ",
        "selectedValue": 10,
        "unit": "A",
        "options": [
          {
            "value": 4,
            "label": "4 A",
            "image": {
              "url": "./miniOTO_4A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          },
          {
            "value": 5,
            "label": "5 A",
            "image": {
              "url": "./miniOTO_5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          },
          {
            "value": 7.5,
            "label": "7.5 A",
            "image": {
              "url": "./miniOTO_7.5A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          },
          {
            "value": 10,
            "label": "10 A",
            "image": {
              "url": "./miniOTO_10A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          },
          {
            "value": 15,
            "label": "15 A",
            "image": {
              "url": "./miniOTO_15A_top.jpg",
              "width": 60,
              "height": 20
            },
            "x": 133,
            "y": 9
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 100,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "LineInMic",
        "type": "select",
        "name": "LineIn/Mic: ",
        "selectedValue": 0,
        "unit": "",
        "options": [
          {
            "value": 0,
            "label": "No",
            "image": {
              "url": "",
              "width": 0,
              "height": 0
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 1,
            "label": "Microphone",
            "image": {
              "url": "./INMP441_SOLDERED.png",
              "width": 60,
              "height": 60
            },
            "x": -5,
            "y": 68
          },
          {
            "value": 2,
            "label": "Line-In",
            "image": {
              "url": "./MHC_LineInToI2S.png",
              "width": 166,
              "height": 102
            },
            "x": -112,
            "y": 82
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 100,
          "hide": true,
          "showNameIfSelected": true
        }
      },
      {
        "id": "UController",
        "type": "select",
        "name": "Controller: ",
        "selectedValue": 1,
        "unit": "",
        "options": [
          {
            "value": 0,
            "label": "No",
            "image": {
              "url": "",
              "width": 0,
              "height": 0
            },
            "x": 0,
            "y": 0
          },
          {
            "value": 1,
            "label": "ESP8266 D1 mini",
            "image": {
              "url": "./ESP8266D1mini_rotated.png",
              "width": 162,
              "height": 118
            },
            "x": 70,
            "y": 68
          },
          {
            "value": 2,
            "label": "ESP32 D1 mini",
            "image": {
              "url": "./ESP32D1mini_rotated.png",
              "width": 166,
              "height": 132
            },
            "x": 76,
            "y": 60
          }
        ],
        "ui": {
          "displayName": false,
          "customImage": true,
          "color": "black",
          "fieldWidth": 100,
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
    ],
    "runtime": {
      "inputFieldsBox": {
        "x": 120,
        "y": 83,
        "borderType": "transparent",
        "borderColor": "black",
        "borderLineWidth": 0,
        "borderRadius": "0%",
        "backgroundColor": "transparent",
        "backgroundColorSelected": "white",
        "rotate180only": true
      }
    }
  }
});
