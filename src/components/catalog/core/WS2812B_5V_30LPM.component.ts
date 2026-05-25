import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "WS2812B_5V_30LPM",
    "version": 1,
    "display": {
      "name": "compData.WS2812B_5V_30LPM.name",
      "descriptionShort": "compData.WS2812B_5V_30LPM.descriptionShort",
      "description": "compData.WS2812B_5V_30LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./WS2812B_5V_30LPM.png",
        "width": 85,
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
        "id": "5V_start",
        "name": "5V pin",
        "description": "5V supply input",
        "type": "source",
        "x": 2.7,
        "y": 19.2,
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
          "toleranceMin": 4,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "DATA_start",
        "name": "DATA input",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 12.6,
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
          "dig_in"
        ],
        "voltage": {
          "toleranceMin": 4.5,
          "toleranceMax": 5.2
        },
        "behavior": {
          "mustBeConnected": true,
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "GND_start",
        "name": "GND pin",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 6.1,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 4,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "5V_end",
        "name": "5V pin",
        "description": "5V supply input",
        "type": "source",
        "x": 2.7,
        "y": 19.2,
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
          "toleranceMin": 4,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "DATA_end",
        "name": "DATA output",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 12.6,
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
          "dig_out"
        ],
        "voltage": {
          "out": 5,
          "toleranceMin": 4.5,
          "toleranceMax": 5.2
        },
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "GND_end",
        "name": "GND pin",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 6.1,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 4,
        "postype": "centered",
        "position": "left",
        "border": {
          "type": "dotted",
          "color": "black",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "gnd"
        ],
        "voltage": {},
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "5V_middle",
        "name": "5V pin",
        "description": "5V supply input",
        "type": "source",
        "x": 0,
        "y": 19.2,
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
          "toleranceMin": 4,
          "toleranceMax": 5
        },
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "DATA_middle",
        "name": "DATA",
        "description": "",
        "type": "source",
        "x": 0,
        "y": 12.6,
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
          "not_connected"
        ],
        "voltage": {
          "toleranceMin": 4.5,
          "toleranceMax": 5.2
        },
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "GND_middle",
        "name": "GND pin",
        "description": "GND",
        "type": "source",
        "x": 0,
        "y": 6.1,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
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
          "gnd"
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
        "url": "./WS2812B_5V_30LPM.png",
        "width": 85,
        "height": 25
      },
      "technicalID": "WS2812B_5V_30LPM",
      "name": "compData.WS2812B_5V_30LPM.name",
      "description": "compData.WS2812B_5V_30LPM.descriptionShort",
      "popover": {
        "description": "compData.WS2812B_5V_30LPM.description"
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
          "hid": "5V_start",
          "type": "source",
          "x": 2.7,
          "y": 19.2,
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
          "name": "5V pin",
          "description": "5V supply input",
          "prefferedLineDirection": "left",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5
        },
        {
          "hid": "DATA_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 2.7,
          "y": 12.6,
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
          "description": "",
          "name": "DATA input",
          "prefferedLineDirection": "left",
          "functions": [
            "dig_in"
          ],
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "GND_start",
          "type": "source",
          "x": 2.7,
          "y": 6.1,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 4,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "",
          "name": "GND pin",
          "prefferedLineDirection": "left",
          "functions": [
            "gnd"
          ]
        },
        {
          "hid": "5V_end",
          "type": "source",
          "x": 2.7,
          "y": 19.2,
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
          "name": "5V pin",
          "description": "5V supply input",
          "prefferedLineDirection": "right",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5
        },
        {
          "hid": "DATA_end",
          "type": "source",
          "x": 2.7,
          "y": 12.6,
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
          "description": "",
          "name": "DATA output",
          "prefferedLineDirection": "right",
          "functions": [
            "dig_out"
          ],
          "Vout": 5,
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "GND_end",
          "type": "source",
          "x": 2.7,
          "y": 6.1,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 4,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "",
          "name": "GND pin",
          "prefferedLineDirection": "right",
          "functions": [
            "gnd"
          ]
        },
        {
          "hid": "5V_middle",
          "type": "source",
          "x": 0,
          "y": 19.2,
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
          "name": "5V pin",
          "description": "5V supply input",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5
        },
        {
          "hid": "DATA_middle",
          "type": "source",
          "x": 0,
          "y": 12.6,
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
          "description": "",
          "name": "DATA",
          "functions": [
            "not_connected"
          ],
          "repeated": "yes",
          "repeatAtFirst": "no",
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "GND_middle",
          "type": "source",
          "x": 0,
          "y": 6.1,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "GND",
          "name": "GND pin",
          "repeated": "yes",
          "repeatAtFirst": "no",
          "functions": [
            "gnd"
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
