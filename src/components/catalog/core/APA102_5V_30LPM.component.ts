import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "APA102_5V_30LPM",
    "version": 1,
    "display": {
      "name": "compData.APA102_5V_30LPM.name",
      "descriptionShort": "compData.APA102_5V_30LPM.descriptionShort",
      "description": "compData.APA102_5V_30LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./APA102_5V_30LPM.png",
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
          "toleranceMin": 4,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "Clock_start",
        "name": "Clock input",
        "description": "Must be tied to GND",
        "type": "source",
        "x": 2.7,
        "y": 15.5,
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
          "dig_clock_in"
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
        "id": "DATA_start",
        "name": "DATA input",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 9.5,
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
        "y": 3.5,
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
          "toleranceMin": 4,
          "toleranceMax": 5
        },
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "Clock_end",
        "name": "Clock output",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 15.5,
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
          "dig_clock_out"
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
        "id": "DATA_end",
        "name": "DATA output",
        "description": "",
        "type": "source",
        "x": 2.7,
        "y": 9.5,
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
        "y": 3.5,
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
        "y": 21.5,
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
        "id": "Clock_middle",
        "name": "Clock",
        "description": "Must not be connected",
        "type": "source",
        "x": 0,
        "y": 15.5,
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
        "id": "DATA_middle",
        "name": "DATA",
        "description": "",
        "type": "source",
        "x": 0,
        "y": 9.5,
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
        "y": 3.5,
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
        "url": "./APA102_5V_30LPM.png",
        "width": 85,
        "height": 25
      },
      "technicalID": "APA102_5V_30LPM",
      "name": "compData.APA102_5V_30LPM.name",
      "description": "compData.APA102_5V_30LPM.descriptionShort",
      "popover": {
        "description": "compData.APA102_5V_30LPM.description"
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
          "name": "5V pin",
          "description": "5V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5,
          "prefferedLineDirection": "left"
        },
        {
          "hid": "Clock_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 2.7,
          "y": 15.5,
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
          "description": "Must be tied to GND",
          "name": "Clock input",
          "functions": [
            "dig_clock_in"
          ],
          "prefferedLineDirection": "left",
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "DATA_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 2.7,
          "y": 9.5,
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
          "y": 3.5,
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
          "description": "",
          "name": "GND pin",
          "functions": [
            "gnd"
          ],
          "prefferedLineDirection": "left"
        },
        {
          "hid": "5V_end",
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
          "name": "5V pin",
          "description": "5V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5,
          "prefferedLineDirection": "right"
        },
        {
          "hid": "Clock_end",
          "type": "source",
          "x": 2.7,
          "y": 15.5,
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
          "name": "Clock output",
          "functions": [
            "dig_clock_out"
          ],
          "prefferedLineDirection": "right",
          "Vout": 5,
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "DATA_end",
          "type": "source",
          "x": 2.7,
          "y": 9.5,
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
          "y": 3.5,
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
          "description": "",
          "name": "GND pin",
          "functions": [
            "gnd"
          ],
          "prefferedLineDirection": "right"
        },
        {
          "hid": "5V_middle",
          "type": "source",
          "x": 0,
          "y": 21.5,
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
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 4,
          "tolVmax": 5,
          "repeated": "yes",
          "repeatAtFirst": "no"
        },
        {
          "hid": "Clock_middle",
          "type": "source",
          "x": 0,
          "y": 15.5,
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
          "description": "Must not be connected",
          "name": "Clock",
          "functions": [
            "not_connected"
          ],
          "repeated": "yes",
          "repeatAtFirst": "no",
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "DATA_middle",
          "type": "source",
          "x": 0,
          "y": 9.5,
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
          "y": 3.5,
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
