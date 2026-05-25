import { defineComponent } from '../defineComponent';

export default defineComponent({
  "schemaVersion": 1,
  "source": {
    "type": "core"
  },
  "component": {
    "id": "WS2805_12V_60LPM",
    "version": 1,
    "display": {
      "name": "compData.WS2805_12V_60LPM.name",
      "descriptionShort": "compData.WS2805_12V_60LPM.descriptionShort",
      "description": "compData.WS2805_12V_60LPM.description",
      "group": "led",
      "showName": true
    },
    "geometry": {
      "image": {
        "url": "./WS2805_12V_60LPM.png",
        "width": 126,
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
        "id": "12V_start",
        "name": "12V pin",
        "description": "12V supply input",
        "type": "source",
        "x": 3.2,
        "y": 4,
        "xalign": "start",
        "yalign": "start",
        "width": 7,
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
          "toleranceMin": 10,
          "toleranceMax": 12
        },
        "behavior": {
          "preferredLineDirection": "left"
        }
      },
      {
        "id": "BACKUP_start",
        "name": "Backup input",
        "description": "Must be tied to GND",
        "type": "source",
        "x": 3.2,
        "y": 15.5,
        "xalign": "start",
        "yalign": "start",
        "width": 7,
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
          "dig_backup_in"
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
        "x": 3.2,
        "y": 9.6,
        "xalign": "start",
        "yalign": "start",
        "width": 7,
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
        "x": 3.2,
        "y": 21.5,
        "xalign": "start",
        "yalign": "start",
        "width": 7,
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
        "id": "12V_end",
        "name": "12V pin",
        "description": "12V supply input",
        "type": "source",
        "x": 3.2,
        "y": 4,
        "xalign": "end",
        "yalign": "start",
        "width": 7,
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
          "toleranceMin": 10,
          "toleranceMax": 12
        },
        "behavior": {
          "preferredLineDirection": "right"
        }
      },
      {
        "id": "BACKUP_end",
        "name": "Backup output",
        "description": "",
        "type": "source",
        "x": 3.2,
        "y": 15.5,
        "xalign": "end",
        "yalign": "start",
        "width": 7,
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
          "dig_backup_out"
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
        "x": 3.2,
        "y": 9.6,
        "xalign": "end",
        "yalign": "start",
        "width": 7,
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
        "x": 3.2,
        "y": 21.5,
        "xalign": "end",
        "yalign": "start",
        "width": 7,
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
        "id": "12V_middle",
        "name": "12V pin",
        "description": "12V supply input",
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
          "color": "red",
          "lineWidth": 0.8,
          "radius": "30%"
        },
        "functions": [
          "suppl_in"
        ],
        "voltage": {
          "toleranceMin": 10,
          "toleranceMax": 12
        },
        "behavior": {
          "repeated": true,
          "repeatAtFirst": false
        }
      },
      {
        "id": "BACKUP_middle",
        "name": "Backup",
        "description": "Must not be connected",
        "type": "source",
        "x": 0,
        "y": 15.5,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
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
        "y": 9.6,
        "xalign": "start",
        "yalign": "start",
        "width": 12,
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
        "y": 21.5,
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
        "url": "./WS2805_12V_60LPM.png",
        "width": 126,
        "height": 25
      },
      "technicalID": "WS2805_12V_60LPM",
      "name": "compData.WS2805_12V_60LPM.name",
      "description": "compData.WS2805_12V_60LPM.descriptionShort",
      "popover": {
        "description": "compData.WS2805_12V_60LPM.description"
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
          "hid": "12V_start",
          "type": "source",
          "x": 3.2,
          "y": 4,
          "xalign": "start",
          "yalign": "start",
          "width": 7,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "12V pin",
          "description": "12V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 10,
          "tolVmax": 12,
          "prefferedLineDirection": "left"
        },
        {
          "hid": "BACKUP_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 3.2,
          "y": 15.5,
          "xalign": "start",
          "yalign": "start",
          "width": 7,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "Must be tied to GND",
          "name": "Backup input",
          "functions": [
            "dig_backup_in"
          ],
          "prefferedLineDirection": "left",
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "DATA_start",
          "mustBeConnected": true,
          "type": "source",
          "x": 3.2,
          "y": 9.6,
          "xalign": "start",
          "yalign": "start",
          "width": 7,
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
          "x": 3.2,
          "y": 21.5,
          "xalign": "start",
          "yalign": "start",
          "width": 7,
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
          "hid": "12V_end",
          "type": "source",
          "x": 3.2,
          "y": 4,
          "xalign": "end",
          "yalign": "start",
          "width": 7,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "red",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "name": "12V pin",
          "description": "12V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 10,
          "tolVmax": 12,
          "prefferedLineDirection": "right"
        },
        {
          "hid": "BACKUP_end",
          "type": "source",
          "x": 3.2,
          "y": 15.5,
          "xalign": "end",
          "yalign": "start",
          "width": 7,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "",
          "name": "Backup output",
          "functions": [
            "dig_backup_out"
          ],
          "prefferedLineDirection": "right",
          "Vout": 5,
          "tolVmin": 4.5,
          "tolVmax": 5.2
        },
        {
          "hid": "DATA_end",
          "type": "source",
          "x": 3.2,
          "y": 9.6,
          "xalign": "end",
          "yalign": "start",
          "width": 7,
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
          "x": 3.2,
          "y": 21.5,
          "xalign": "end",
          "yalign": "start",
          "width": 7,
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
          "hid": "12V_middle",
          "type": "source",
          "x": 0,
          "y": 4,
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
          "name": "12V pin",
          "description": "12V supply input",
          "functions": [
            "suppl_in"
          ],
          "tolVmin": 10,
          "tolVmax": 12,
          "repeated": "yes",
          "repeatAtFirst": "no"
        },
        {
          "hid": "BACKUP_middle",
          "type": "source",
          "x": 0,
          "y": 15.5,
          "xalign": "start",
          "yalign": "start",
          "width": 12,
          "height": 5,
          "borderType": "dotted",
          "borderColor": "green",
          "borderLineWidth": 0.8,
          "borderRadius": "30%",
          "postype": "centered",
          "position": "left",
          "description": "Must not be connected",
          "name": "Backup",
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
          "y": 9.6,
          "xalign": "start",
          "yalign": "start",
          "width": 12,
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
          "y": 21.5,
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
