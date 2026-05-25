import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "WS2814_24V_60LPM",
    "version": 1,
    "display": {
      "name": "compData.WS2814_24V_60LPM.name",
      "descriptionShort": "compData.WS2814_24V_60LPM.descriptionShort",
      "description": "compData.WS2814_24V_60LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./WS2814_24V_60LPM.png",
        "width": 253,
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
        "y": 4.35,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 6,
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
        "id": "DATA_start",
        "name": "DATA input",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 12,
        "xalign": "start",
        "yalign": "start",
        "width": 6,
        "height": 6,
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
        "y": 19.5,
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
        "id": "24V_end",
        "name": "24V pin",
        "description": "24V supply input",
        "type": "source",
        "x": 2.7,
        "y": 4.35,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 6,
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
        "id": "DATA_end",
        "name": "DATA output",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 12,
        "xalign": "end",
        "yalign": "start",
        "width": 6,
        "height": 6,
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
        "y": 19.5,
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
        "id": "24V_middle",
        "name": "24V pin",
        "description": "24V supply input",
        "type": "source",
        "x": 0,
        "y": 4.35,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
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
        "id": "DATA_middle",
        "name": "DATA",
        "description": "",
        "type": "source",
        "x": 0,
        "y": 12,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
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
        "y": 19.5,
        "xalign": "start",
        "yalign": "start",
        "width": 10,
        "height": 6,
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
    ],
    "simulation": {
      "version": 1,
      "elements": [
        {
          "id": "strip-led",
          "type": "digitalLed",
          "terminals": {
            "supplyIn": "24V_start",
            "supplyOut": "24V_end",
            "gndIn": "GND_start",
            "gndOut": "GND_end"
          },
          "parameters": {
            "supplyResistanceOhm": {
              "ledSimulationOption": "supplyResistance"
            },
            "gndResistanceOhm": {
              "ledSimulationOption": "gndResistance"
            },
            "ledType": "WS2814_24V",
            "ledsPerMeter": 60,
            "physLedsPerLogicLed": 6,
            "currentCurve": {
              "ledSimulationOption": "currentCurve"
            }
          }
        }
      ]
    }
  },
  "compatibility": {
    "templateData": {
      "image": {
        "url": "./WS2814_24V_60LPM.png",
        "width": 253,
        "height": 25
      },
      "technicalID": "WS2814_24V_60LPM",
      "name": "compData.WS2814_24V_60LPM.name",
      "description": "compData.WS2814_24V_60LPM.descriptionShort",
      "popover": {
        "description": "compData.WS2814_24V_60LPM.description"
      },
      "showName": true,
      "technicalVersion": 1,
      "group": "led",
      "rotation": 0,
      "rotatable": true,
      "borderWidth": 2,
      "resizableX": true,
      "physLengthStep": 0.016667,
      "ledSimulationOptions": {
        "supplyResistance": {
          "options": [
            "typical_5mm",
            "good_5mm",
            "poor_5mm"
          ],
          "recommended": "typical_5mm"
        },
        "gndResistance": {
          "options": [
            "typical_5mm",
            "good_5mm",
            "poor_5mm"
          ],
          "recommended": "typical_5mm"
        },
        "currentCurve": {
          "options": [
            "ws2814_24v_typical",
            "ws2814_24v_conservative",
            "ws2814_24v_low_current"
          ],
          "recommended": "ws2814_24v_typical"
        }
      },
      "ledSimulationOptionValues": {
        "supplyResistance": "typical_5mm",
        "gndResistance": "typical_5mm",
        "currentCurve": "ws2814_24v_typical"
      },
      "simdata": {
        "version": 1,
        "elements": [
          {
            "id": "strip-led",
            "type": "digitalLed",
            "terminals": {
              "supplyIn": "24V_start",
              "supplyOut": "24V_end",
              "gndIn": "GND_start",
              "gndOut": "GND_end"
            },
            "parameters": {
              "supplyResistanceOhm": {
                "ledSimulationOption": "supplyResistance"
              },
              "gndResistanceOhm": {
                "ledSimulationOption": "gndResistance"
              },
              "ledType": "WS2814_24V",
              "ledsPerMeter": 60,
              "physLedsPerLogicLed": 6,
              "currentCurve": {
                "ledSimulationOption": "currentCurve"
              }
            }
          }
        ]
      },
      "handles": [
        {
          "hid": "24V_start",
          "type": "source",
          "x": 2.7,
          "y": 4.35,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 6,
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
          "hid": "DATA_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 2.7,
          "y": 12,
          "xalign": "start",
          "yalign": "start",
          "width": 6,
          "height": 6,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "",
          "name": "DATA input",
          "functions": [
            "dig_in"
          ],
          "prefferedLineDirection": "left",
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "GND_start",
          "type": "source",
          "x": 2.7,
          "y": 19.5,
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
          "functions": [
            "gnd"
          ],
          "prefferedLineDirection": "left"
        },
        {
          "hid": "24V_end",
          "type": "source",
          "x": 2.7,
          "y": 4.35,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 6,
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
          "hid": "DATA_end",
          "type": "source",
          "x": 2.7,
          "y": 12,
          "xalign": "end",
          "yalign": "start",
          "width": 6,
          "height": 6,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "",
          "name": "DATA output",
          "functions": [
            "dig_out"
          ],
          "prefferedLineDirection": "right",
          "Vout": 5,
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "GND_end",
          "type": "source",
          "x": 2.7,
          "y": 19.5,
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
          "functions": [
            "gnd"
          ],
          "prefferedLineDirection": "right"
        },
        {
          "hid": "24V_middle",
          "type": "source",
          "x": 0,
          "y": 4.35,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 6,
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
          "hid": "DATA_middle",
          "type": "source",
          "x": 0,
          "y": 12,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 6,
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
          "y": 19.5,
          "xalign": "start",
          "yalign": "start",
          "width": 10,
          "height": 6,
          "borderType": "dotted",
          "borderColor": "black",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "GND",
          "name": "GND pin",
          "functions": [
            "gnd"
          ],
          "repeated": "yes",
          "repeatAtFirst": "no"
        }
      ]
    },
    "nodeOrigin": [
      0.5,
      0.5
    ]
  }
});
