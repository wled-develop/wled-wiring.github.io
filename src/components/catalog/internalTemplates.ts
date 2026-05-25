import { createReactFlowTemplate, normalizeComponentPackage } from './normalizeComponent';
import { defineComponent } from './defineComponent';

const wireInfoNodePackage = defineComponent({
  schemaVersion: 1,
  source: {type: 'core'},
  component: {
    id: 'WireInfoNode',
    version: 1,
    display: {
      name: 'compData.WireInfoNode.name',
      descriptionShort: 'compData.WireInfoNode.descriptionShort',
      description: 'compData.WireInfoNode.description',
      group: 'special',
    },
    geometry: {
      image: {url: './WireInfo.jpg', width: 100, height: 50},
      noBackgroundImage: true,
      rotation: 0,
      rotatable: false,
      resizableX: false,
      borderWidth: 2,
    },
    handles: [],
  },
  compatibility: {
    nodeOrigin: [0.5, 0.5],
    templateData: {
      image: {url: './WireInfo.jpg', width: 100, height: 50},
      technicalID: 'WireInfoNode',
      name: 'compData.WireInfoNode.name',
      description: 'compData.WireInfoNode.descriptionShort',
      popover: {
        description: 'compData.WireInfoNode.description',
      },
      technicalVersion: 1,
      group: 'special',
      rotation: 0,
      rotatable: false,
      borderWidth: 2,
      resizableX: false,
      noBackgroundImage: true,
      wireInfoForNodeId: '',
      correspondingWireSelected: false,
      handles: [],
    },
  },
});

export const WireInfoNode = createReactFlowTemplate(normalizeComponentPackage(wireInfoNodePackage));
