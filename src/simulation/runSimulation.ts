import type { Edge, Node } from "@xyflow/react";

import type { ComponentDataType, EdgeDataType } from "../types";
import { buildSimulationModel } from "./buildSimulationModel";
import { createSimulationFingerprint } from "./simulationFingerprint";
import type {
  SimulationCheckIssue,
  SimulationModel,
  SimulationResult,
  SimulationSettings,
} from "./simulationTypes";

export type RunSimulationResult =
  | {
      ok: true;
      model: SimulationModel;
      result: SimulationResult;
      issues: SimulationCheckIssue[];
    }
  | {
      ok: false;
      diagramFingerprint: string;
      issues: SimulationCheckIssue[];
    };

const numberParameter = (
  parameters: Record<string, string | number | boolean> | undefined,
  key: string,
) => {
  const value = parameters?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const createMockCircuitVoltages = (model: SimulationModel) => {
  const circuitVoltages = new Map<string, number>();
  circuitVoltages.set(model.referenceNodeId, 0);

  model.elements
    .filter((element) => element.type === "voltageSource")
    .forEach((element) => {
      const voltageV = numberParameter(element.parameters, "voltageV");
      const positive = element.terminals.positive;
      const negative = element.terminals.negative;

      if(voltageV === undefined || !positive || !negative) return;

      const negativeVoltage = circuitVoltages.get(negative) ?? 0;
      circuitVoltages.set(negative, negativeVoltage);
      circuitVoltages.set(positive, negativeVoltage + voltageV);
    });

  return circuitVoltages;
};

const createMockSimulationResult = (
  model: SimulationModel,
  diagramFingerprint: string,
  checkIssues: SimulationCheckIssue[],
): SimulationResult => {
  const circuitVoltages = createMockCircuitVoltages(model);

  return {
    modelVersion: 1,
    settings: model.settings,
    createdAt: "mock-deterministic",
    diagramFingerprint,
    pinResults: model.pins.map((pin) => ({
      pinId: pin.id,
      nodeId: pin.nodeId,
      handleId: pin.handleId,
      voltageV: pin.circuitNodeId ? circuitVoltages.get(pin.circuitNodeId) : undefined,
    })),
    virtualPinResults: [],
    wireResults: model.wires.map((wire) => {
      const sourceVoltage = circuitVoltages.get(wire.sourceCircuitNodeId);
      const targetVoltage = circuitVoltages.get(wire.targetCircuitNodeId);

      return {
        wireId: wire.id,
        edgeId: wire.edgeId,
        resistanceOhm: wire.resistanceOhm,
        voltageDropV: sourceVoltage !== undefined && targetVoltage !== undefined
          ? sourceVoltage - targetVoltage
          : undefined,
      };
    }),
    checkIssues,
    status: checkIssues.some((issue) => issue.severity === "error")
      ? "error"
      : checkIssues.some((issue) => issue.severity === "warning")
        ? "warning"
        : "ok",
  };
};

export const runSimulation = (
  nodes: Node<ComponentDataType>[],
  edges: Edge<EdgeDataType>[],
  settings: SimulationSettings,
): RunSimulationResult => {
  const diagramFingerprint = createSimulationFingerprint(nodes, edges);
  const modelResult = buildSimulationModel(nodes, edges, settings);

  if(!modelResult.ok) {
    return {
      ok: false,
      diagramFingerprint,
      issues: modelResult.issues,
    };
  }

  const result = createMockSimulationResult(
    modelResult.model,
    diagramFingerprint,
    modelResult.issues,
  );

  return {
    ok: true,
    model: modelResult.model,
    result,
    issues: result.checkIssues,
  };
};
