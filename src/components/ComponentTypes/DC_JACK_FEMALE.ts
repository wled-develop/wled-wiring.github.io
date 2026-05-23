import {type Node} from '@xyflow/react';
import {ComponentDataType, ImageDataType, HandleDataType, CompInputFieldDataType, CompInputFieldsBoxType} from '../../types';

export const DC_JACK_FEMALE: Node = {
    id: '',
    type: 'general-component-type',
    position: { x: 0, y: 0 },

    data: { 
        image: {url:"./DC_Jack_Female.png", width: 90, height: 35} as ImageDataType,
        technicalID: "DC_JACK_FEMALE",
        name: "compData.DC_JACK_FEMALE.name",
        description: "compData.DC_JACK_FEMALE.descriptionShort",
        technicalVersion: 1,
        group: "electronics",
        rotation: 0,
        borderWidth: 2,
        resizableX: false,
        rotatable: true,
        inputFieldsBox: {
            x: 45,
            y: 45,
            borderType: "solid",
            borderColor: "black",
            borderLineWidth: 0,
            borderRadius: "0%",
            backgroundColor: "transparent",
        } as CompInputFieldsBoxType,
        inputFields: [
            {
                technicalID: "source_voltage",
                type: "number_input",
                name: "V",
                value: 5,
                min: 1,
                max: 48,
                step: 0.1,
                unit: "V",
                fieldWidth: 70,
                color: "black"
            } as CompInputFieldDataType,
            {
                technicalID: "source_current",
                type: "number_input",
                name: "I",
                value: 3,
                min: 0,
                max: 100,
                step: 0.1,
                unit: "A",
                fieldWidth: 70,
                color: "black"
            } as CompInputFieldDataType,
        ],
        simdata: {
            version: 1,
            elements: [
                {
                    id: "source",
                    type: "voltageSource",
                    terminals: {positive: "VOUT", negative: "GND"},
                    parameters: {
                        voltageV: {field: "source_voltage"},
                        currentLimitA: {field: "source_current"},
                        voltageDropPctAt150Current: 50,
                    },
                },
            ],
        },
        popover: {
            description: "compData.DC_JACK_FEMALE.description",
            buyLinks: [
            ]
        },
        handles: [
            {
                borderColor: "black",
                borderLineWidth: 0.8,
                borderRadius: "20%",
                borderType: "dotted",
                description: "GND",
                functions: [
                    "gnd"
                ],
                height: 10,
                hid: "GND",
                name: "GND",
                position: "left",
                postype: "right",
                tolVmax: 0,
                tolVmin: 0,
                type: "source",
                Vout: 0,
                width: 12,
                x: 84,
                xalign: "start",
                y: 12,
                yalign: "start",
                prefferedLineWidth: 1,
            } as HandleDataType,
            {
                borderColor: "red",
                borderLineWidth: 0.8,
                borderRadius: "20%",
                borderType: "dotted",
                description: "Supply voltage",
                functions: [
                    "suppl_out"
                ],
                height: 10,
                hid: "VOUT",
                name: "V out",
                position: "left",
                postype: "right",
                type: "source",
                Vout: 0,
                VoutDependency: "source_voltage",
                width: 12,
                x: 84,
                xalign: "start",
                y: 24.5,
                yalign: "start",
                prefferedLineWidth: 1,
            } as HandleDataType,
        ]
    } as ComponentDataType,
}
