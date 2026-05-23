import type { Edge, Node } from "@xyflow/react";

import i18next from "../i18n";
import type { ComponentDataType, EdgeDataType } from "../types";
import { runSimulation, type RunSimulationResult } from "./runSimulation";
import type { SimulationSettings } from "./simulationTypes";

export type SimulationWorkerRequest = {
  requestId: number;
  nodes: Node<ComponentDataType>[];
  edges: Edge<EdgeDataType>[];
  settings: SimulationSettings;
  language?: string;
};

export type SimulationWorkerResponse =
  | {
      requestId: number;
      ok: true;
      simulation: RunSimulationResult;
    }
  | {
      requestId: number;
      ok: false;
      error: string;
    };

self.onmessage = async (event: MessageEvent<SimulationWorkerRequest>) => {
  const {requestId, nodes, edges, settings, language} = event.data;

  try {
    if(language) {
      await i18next.changeLanguage(language);
    }

    const simulation = runSimulation(nodes, edges, settings);
    self.postMessage({
      requestId,
      ok: true,
      simulation,
    } satisfies SimulationWorkerResponse);
  } catch(error) {
    self.postMessage({
      requestId,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    } satisfies SimulationWorkerResponse);
  }
};
