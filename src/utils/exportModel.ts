import type { ReactFlowInstance } from '@xyflow/react';

import { getCurrentURL } from './utils_functions';

export function createDiagramExportObject(reactFlow: ReactFlowInstance) {
  return {
    ...reactFlow.toObject(),
    application: {
      version: 1,
      name: 'WLED Wiring Model',
      url: getCurrentURL(),
    },
  };
}

export function createDiagramExportJson(reactFlow: ReactFlowInstance) {
  return JSON.stringify(createDiagramExportObject(reactFlow));
}
