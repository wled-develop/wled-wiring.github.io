import type { Edge, Node } from "@xyflow/react";

import type { ComponentDataType, EdgeDataType } from "../types";
import { buildSimulationModel } from "./buildSimulationModel";
import { createSimulationFingerprint } from "./simulationFingerprint";
import { denseLinearSystemSolver } from "./denseLinearSystemSolver";
import {
  DCDC_INPUT_CURRENT_CONVERGENCE_A,
  type DcdcInputStateByElementId,
  createInitialDcdcInputStates,
  dcdcDynamicOutputCurrentLimit,
  updateDcdcInputStates,
} from "./dcdcSimulation";
import { getLedCurrentA } from "./ledCurrentLookups";
import type {
  LinearSystem,
  SimulationCheckIssue,
  SimulationElement,
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

const MIN_RESISTANCE_OHM = 1e-9;
const MAX_NONLINEAR_ITERATIONS = 100;
const LED_CURRENT_CONVERGENCE_A = 0.000005;
const SOURCE_VOLTAGE_CONVERGENCE_V = 0.00005;
const CURRENT_LIMIT_TOLERANCE_A = 0.0005;
const DEFAULT_VOLTAGE_DROP_PCT_AT_150_CURRENT = 50;
const NONLINEAR_RELAXATION = 0.35;

type VoltageSourceStamp = {
  elementId: string;
  positiveCircuitNodeId: string;
  negativeCircuitNodeId: string;
  voltageV: number;
  currentVariableIndex?: number;
};

type LinearDcModel = {
  system: LinearSystem;
  circuitNodeIndexById: Map<string, number>;
  voltageSources: VoltageSourceStamp[];
};

type LedCurrentByElementId = Map<string, number>;

type VoltageSourceState = {
  voltageV: number;
  wasOverloaded: boolean;
};

type VoltageSourceStateByElementId = Map<string, VoltageSourceState>;

const numberParameter = (
  parameters: Record<string, string | number | boolean> | undefined,
  key: string,
) => {
  const value = parameters?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const stringParameter = (
  parameters: Record<string, string | number | boolean> | undefined,
  key: string,
) => {
  const value = parameters?.[key];
  return typeof value === "string" ? value : undefined;
};

const issue = (
  id: string,
  title: string,
  description: string,
  targets?: SimulationCheckIssue["targets"],
): SimulationCheckIssue => ({
  id,
  severity: "error",
  title,
  description,
  targets,
});

const addEntry = (
  entries: LinearSystem["entries"],
  row: number | undefined,
  column: number | undefined,
  value: number,
) => {
  if(row === undefined || column === undefined || value === 0) return;
  entries.push({row, column, value});
};

const addRhs = (
  rhs: number[],
  row: number | undefined,
  value: number,
) => {
  if(row === undefined || value === 0) return;
  rhs[row] += value;
};

const stampResistor = (
  entries: LinearSystem["entries"],
  nodeIndexById: Map<string, number>,
  aCircuitNodeId: string | undefined,
  bCircuitNodeId: string | undefined,
  resistanceOhm: number | undefined,
) => {
  if(!aCircuitNodeId || !bCircuitNodeId || resistanceOhm === undefined) return;
  if(!Number.isFinite(resistanceOhm) || resistanceOhm <= 0) return;

  const conductance = 1 / Math.max(resistanceOhm, MIN_RESISTANCE_OHM);
  const a = nodeIndexById.get(aCircuitNodeId);
  const b = nodeIndexById.get(bCircuitNodeId);

  addEntry(entries, a, a, conductance);
  addEntry(entries, b, b, conductance);
  addEntry(entries, a, b, -conductance);
  addEntry(entries, b, a, -conductance);
};

const stampCurrentSource = (
  rhs: number[],
  nodeIndexById: Map<string, number>,
  positiveCircuitNodeId: string | undefined,
  negativeCircuitNodeId: string | undefined,
  currentA: number | undefined,
) => {
  if(!positiveCircuitNodeId || !negativeCircuitNodeId || currentA === undefined) return;
  if(!Number.isFinite(currentA)) return;

  addRhs(rhs, nodeIndexById.get(positiveCircuitNodeId), -currentA);
  addRhs(rhs, nodeIndexById.get(negativeCircuitNodeId), currentA);
};

const stampVoltageSource = (
  entries: LinearSystem["entries"],
  rhs: number[],
  nodeIndexById: Map<string, number>,
  source: VoltageSourceStamp,
) => {
  const variableIndex = source.currentVariableIndex;
  if(variableIndex === undefined) return;

  const positive = nodeIndexById.get(source.positiveCircuitNodeId);
  const negative = nodeIndexById.get(source.negativeCircuitNodeId);

  addEntry(entries, positive, variableIndex, 1);
  addEntry(entries, negative, variableIndex, -1);
  addEntry(entries, variableIndex, positive, 1);
  addEntry(entries, variableIndex, negative, -1);
  addRhs(rhs, variableIndex, source.voltageV);
};

const createCircuitNodeIndexById = (model: SimulationModel) => {
  const nodeIndexById = new Map<string, number>();
  model.circuitNodes.forEach((node) => {
    if(node.id === model.referenceNodeId) return;
    nodeIndexById.set(node.id, nodeIndexById.size);
  });
  return nodeIndexById;
};

const getLedCurrentForElement = (
  element: SimulationElement,
  settings: SimulationSettings,
  voltageV: number,
) => {
  const curveId = stringParameter(element.parameters, "currentCurve");
  const currentScaleFactor = numberParameter(element.parameters, "currentScaleFactor") ?? 1;
  if(!curveId) return undefined;

  const result = getLedCurrentA(
    curveId,
    settings.ledColorMode,
    voltageV,
    settings.brightnessPercent / 100,
  );
  return result.ok ? result.currentA * currentScaleFactor : undefined;
};

const nominalLedVoltage = (element: SimulationElement) => (
  stringParameter(element.parameters, "ledType")?.includes("24V") ? 24 : 5
);

const createInitialLedCurrents = (model: SimulationModel): LedCurrentByElementId => {
  const currents = new Map<string, number>();

  model.elements.forEach((element) => {
    if(element.type !== "digitalLed") return;

    const currentA = getLedCurrentForElement(element, model.settings, nominalLedVoltage(element));
    if(currentA !== undefined) {
      currents.set(element.id, currentA);
    }
  });

  return currents;
};

const createLedCurrentsFromVoltages = (
  model: SimulationModel,
  circuitVoltages: Map<string, number>,
): LedCurrentByElementId => {
  const currents = new Map<string, number>();

  model.elements.forEach((element) => {
    if(element.type !== "digitalLed") return;

    const supplyVoltage = circuitVoltages.get(element.terminals.supplyOut);
    const gndVoltage = circuitVoltages.get(element.terminals.gndOut);
    const voltageV = supplyVoltage !== undefined && gndVoltage !== undefined
      ? supplyVoltage - gndVoltage
      : nominalLedVoltage(element);
    const currentA = getLedCurrentForElement(element, model.settings, voltageV);

    if(currentA !== undefined) {
      currents.set(element.id, currentA);
    }
  });

  return currents;
};

const maxLedCurrentDeltaA = (
  current: LedCurrentByElementId,
  next: LedCurrentByElementId,
) => {
  const elementIds = new Set([...current.keys(), ...next.keys()]);
  let maxDeltaA = 0;

  elementIds.forEach((elementId) => {
    maxDeltaA = Math.max(maxDeltaA, Math.abs((current.get(elementId) ?? 0) - (next.get(elementId) ?? 0)));
  });

  return maxDeltaA;
};

const relaxedLedCurrents = (
  current: LedCurrentByElementId,
  next: LedCurrentByElementId,
): LedCurrentByElementId => {
  const elementIds = new Set([...current.keys(), ...next.keys()]);
  const relaxed = new Map<string, number>();

  elementIds.forEach((elementId) => {
    const currentA = current.get(elementId) ?? 0;
    const nextA = next.get(elementId) ?? 0;
    relaxed.set(elementId, currentA + (nextA - currentA) * NONLINEAR_RELAXATION);
  });

  return relaxed;
};

const voltageSourceNominalVoltage = (element: SimulationElement) => {
  if(element.type === "voltageSource") {
    return numberParameter(element.parameters, "voltageV");
  }

  if(element.type === "dcdcConverter") {
    return numberParameter(element.parameters, "outputVoltageV");
  }

  return undefined;
};

const voltageSourceCurrentLimit = (element: SimulationElement) => {
  if(element.type === "voltageSource") {
    return numberParameter(element.parameters, "currentLimitA");
  }

  if(element.type === "dcdcConverter") {
    return numberParameter(element.parameters, "outputCurrentLimitA");
  }

  return undefined;
};

const voltageSourceEffectiveCurrentLimit = (
  element: SimulationElement,
  dcdcInputStates: DcdcInputStateByElementId = new Map(),
) => {
  const fixedLimitA = voltageSourceCurrentLimit(element);
  const dynamicDcdcLimitA = dcdcDynamicOutputCurrentLimit(element, dcdcInputStates);
  const limits = [fixedLimitA, dynamicDcdcLimitA].filter((limit): limit is number => (
    limit !== undefined && Number.isFinite(limit) && limit >= 0
  ));

  return limits.length > 0 ? Math.min(...limits) : undefined;
};

const createInitialVoltageSourceStates = (model: SimulationModel): VoltageSourceStateByElementId => {
  const states: VoltageSourceStateByElementId = new Map();

  model.elements.forEach((element) => {
    const voltageV = voltageSourceNominalVoltage(element);
    if(voltageV === undefined) return;

    states.set(element.id, {
      voltageV,
      wasOverloaded: false,
    });
  });

  return states;
};

const degradedVoltageForCurrent = (
  nominalVoltageV: number,
  currentA: number,
  currentLimitA: number,
  voltageDropPctAt150Current: number,
) => {
  if(currentLimitA <= 0) return nominalVoltageV;
  if(currentA <= currentLimitA + CURRENT_LIMIT_TOLERANCE_A) return nominalVoltageV;

  const overload = Math.min(0.5, Math.max(0, currentA / currentLimitA - 1));
  const voltageFractionAt150 = Math.min(1, Math.max(0, voltageDropPctAt150Current / 100));
  const dropSlope = (1 - voltageFractionAt150) / 0.5;
  const voltageFraction = Math.max(0, 1 - dropSlope * overload);

  return nominalVoltageV * voltageFraction;
};

const degradedVoltageForEquivalentLoad = (
  nominalVoltageV: number,
  solvedCurrentA: number,
  solvedVoltageV: number,
  currentLimitA: number,
  voltageDropPctAt150Current: number,
) => {
  if(currentLimitA <= 0) {
    return {
      voltageV: nominalVoltageV,
      wasOverloaded: false,
    };
  }

  const equivalentConductance = Math.abs(solvedVoltageV) > SOURCE_VOLTAGE_CONVERGENCE_V
    ? Math.abs(solvedCurrentA / solvedVoltageV)
    : undefined;
  if(equivalentConductance === undefined || !Number.isFinite(equivalentConductance)) {
    return {
      voltageV: degradedVoltageForCurrent(
        nominalVoltageV,
        solvedCurrentA,
        currentLimitA,
        voltageDropPctAt150Current,
      ),
      wasOverloaded: solvedCurrentA > currentLimitA + CURRENT_LIMIT_TOLERANCE_A,
    };
  }

  const nominalCurrentA = equivalentConductance * nominalVoltageV;
  if(nominalCurrentA <= currentLimitA + CURRENT_LIMIT_TOLERANCE_A) {
    return {
      voltageV: nominalVoltageV,
      wasOverloaded: false,
    };
  }

  const voltageFractionAt150 = Math.min(1, Math.max(0, voltageDropPctAt150Current / 100));
  const dropSlope = (1 - voltageFractionAt150) / 0.5;
  if(dropSlope <= 0) {
    return {
      voltageV: nominalVoltageV,
      wasOverloaded: true,
    };
  }

  const voltageV = nominalVoltageV * (1 + dropSlope) /
    (1 + nominalVoltageV * dropSlope * equivalentConductance / currentLimitA);
  const minVoltageV = nominalVoltageV * voltageFractionAt150;
  const clampedVoltageV = Math.min(nominalVoltageV, Math.max(minVoltageV, voltageV));

  return {
    voltageV: clampedVoltageV,
    wasOverloaded: true,
  };
};

const updateVoltageSourceStates = (
  model: SimulationModel,
  linearModel: LinearDcModel,
  values: number[],
  currentStates: VoltageSourceStateByElementId,
  dcdcInputStates: DcdcInputStateByElementId,
) => {
  const elementById = new Map(model.elements.map((element) => [element.id, element]));
  const nextStates: VoltageSourceStateByElementId = new Map(currentStates);
  let maxVoltageDeltaV = 0;

  linearModel.voltageSources.forEach((source) => {
    if(source.currentVariableIndex === undefined) return;

    const element = elementById.get(source.elementId);
    if(!element) return;

    const nominalVoltageV = voltageSourceNominalVoltage(element);
    const currentLimitA = voltageSourceEffectiveCurrentLimit(element, dcdcInputStates);
    if(nominalVoltageV === undefined || currentLimitA === undefined) return;

    const currentA = Math.abs(values[source.currentVariableIndex] ?? 0);
    const voltageDropPctAt150Current = numberParameter(element.parameters, "voltageDropPctAt150Current")
      ?? DEFAULT_VOLTAGE_DROP_PCT_AT_150_CURRENT;
    const previousState = currentStates.get(source.elementId);
    const sourceUpdate = degradedVoltageForEquivalentLoad(
      nominalVoltageV,
      currentA,
      previousState?.voltageV ?? nominalVoltageV,
      currentLimitA,
      voltageDropPctAt150Current,
    );
    const targetVoltageV = currentLimitA > 0 ? sourceUpdate.voltageV : nominalVoltageV;
    const previousVoltageV = previousState?.voltageV ?? nominalVoltageV;
    const nextVoltageV = previousVoltageV + (targetVoltageV - previousVoltageV) * NONLINEAR_RELAXATION;

    maxVoltageDeltaV = Math.max(maxVoltageDeltaV, Math.abs(previousVoltageV - targetVoltageV));
    nextStates.set(source.elementId, {
      voltageV: nextVoltageV,
      wasOverloaded: sourceUpdate.wasOverloaded || currentA > currentLimitA + CURRENT_LIMIT_TOLERANCE_A,
    });
  });

  return {
    nextStates,
    maxVoltageDeltaV,
  };
};

const createExtremeVoltageSourceOverloadIssues = (
  model: SimulationModel,
  linearModel: LinearDcModel,
  values: number[],
  dcdcInputStates: DcdcInputStateByElementId,
) => {
  const issues: SimulationCheckIssue[] = [];
  const elementById = new Map(model.elements.map((element) => [element.id, element]));

  linearModel.voltageSources.forEach((source) => {
    if(source.currentVariableIndex === undefined) return;

    const element = elementById.get(source.elementId);
    const currentLimitA = element ? voltageSourceEffectiveCurrentLimit(element, dcdcInputStates) : undefined;
    if(currentLimitA === undefined || currentLimitA <= 0) return;

    const currentA = Math.abs(values[source.currentVariableIndex] ?? 0);
    if(currentA > currentLimitA * 1.5 + CURRENT_LIMIT_TOLERANCE_A) {
      issues.push(issue(
        `simulation-current-limit-extreme:${source.elementId}`,
        "Current limit exceeded too far",
        `Voltage source current ${currentA.toFixed(3)} A is above 150% of the limit ${currentLimitA.toFixed(3)} A. Simulation was stopped.`,
        [{type: "element", elementId: source.elementId}],
      ));
    }
  });

  return issues;
};

const voltageSourcesFromElements = (
  model: SimulationModel,
  voltageSourceStates: VoltageSourceStateByElementId = new Map(),
): VoltageSourceStamp[] => {
  const sources = model.elements.flatMap((element) => {
    if(element.type === "voltageSource") {
      const voltageV = numberParameter(element.parameters, "voltageV");
      if(voltageV === undefined) return [];
      return [{
        elementId: element.id,
        positiveCircuitNodeId: element.terminals.positive,
        negativeCircuitNodeId: element.terminals.negative,
        voltageV: voltageSourceStates.get(element.id)?.voltageV ?? voltageV,
      }];
    }

    if(element.type === "dcdcConverter") {
      const voltageV = numberParameter(element.parameters, "outputVoltageV");
      if(voltageV === undefined) return [];
      return [{
        elementId: element.id,
        positiveCircuitNodeId: element.terminals.outPositive,
        negativeCircuitNodeId: element.terminals.outNegative,
        voltageV: voltageSourceStates.get(element.id)?.voltageV ?? voltageV,
      }];
    }

    return [];
  });
  const uniqueSources = new Map<string, VoltageSourceStamp>();

  sources.forEach((source) => {
    const key = [
      source.positiveCircuitNodeId,
      source.negativeCircuitNodeId,
      source.voltageV.toFixed(6),
    ].join("|");
    if(!uniqueSources.has(key)) {
      uniqueSources.set(key, source);
    }
  });

  return Array.from(uniqueSources.values());
};

const collectActiveCircuitNodeIds = (model: SimulationModel) => {
  const activeCircuitNodeIds = new Set<string>();
  activeCircuitNodeIds.add(model.referenceNodeId);

  model.elements.forEach((element) => {
    Object.values(element.terminals).forEach((circuitNodeId) => {
      activeCircuitNodeIds.add(circuitNodeId);
    });
  });

  let changed = true;
  while(changed) {
    changed = false;

    model.wires.forEach((wire) => {
      const sourceActive = activeCircuitNodeIds.has(wire.sourceCircuitNodeId);
      const targetActive = activeCircuitNodeIds.has(wire.targetCircuitNodeId);
      if(!sourceActive && !targetActive) return;

      if(!sourceActive) {
        activeCircuitNodeIds.add(wire.sourceCircuitNodeId);
        changed = true;
      }
      if(!targetActive) {
        activeCircuitNodeIds.add(wire.targetCircuitNodeId);
        changed = true;
      }
    });
  }

  return activeCircuitNodeIds;
};

const buildLinearDcModel = (
  model: SimulationModel,
  ledCurrentByElementId: LedCurrentByElementId = new Map(),
  voltageSourceStates: VoltageSourceStateByElementId = new Map(),
  dcdcInputStates: DcdcInputStateByElementId = new Map(),
): LinearDcModel => {
  const activeCircuitNodeIds = collectActiveCircuitNodeIds(model);
  const circuitNodeIndexById = createCircuitNodeIndexById({
    ...model,
    circuitNodes: model.circuitNodes.filter((node) => activeCircuitNodeIds.has(node.id)),
  });
  const voltageSources = voltageSourcesFromElements(model, voltageSourceStates).map((source, index) => ({
    ...source,
    currentVariableIndex: circuitNodeIndexById.size + index,
  }));
  const size = circuitNodeIndexById.size + voltageSources.length;
  const entries: LinearSystem["entries"] = [];
  const rhs = Array(size).fill(0) as number[];

  model.wires.forEach((wire) => {
    if(
      !activeCircuitNodeIds.has(wire.sourceCircuitNodeId) ||
      !activeCircuitNodeIds.has(wire.targetCircuitNodeId)
    ) {
      return;
    }

    stampResistor(
      entries,
      circuitNodeIndexById,
      wire.sourceCircuitNodeId,
      wire.targetCircuitNodeId,
      wire.resistanceOhm,
    );
  });

  model.elements.forEach((element) => {
    if(element.type === "resistor" || element.type === "fuse") {
      stampResistor(
        entries,
        circuitNodeIndexById,
        element.terminals.a,
        element.terminals.b,
        numberParameter(element.parameters, "resistanceOhm"),
      );
    }

    if(element.type === "currentSource") {
      stampCurrentSource(
        rhs,
        circuitNodeIndexById,
        element.terminals.positive,
        element.terminals.negative,
        numberParameter(element.parameters, "currentA"),
      );
    }

    if(element.type === "constantPowerSink") {
      const powerW = numberParameter(element.parameters, "powerW");
      const minVoltageV = numberParameter(element.parameters, "minVoltageV") ?? 1;
      if(powerW !== undefined && minVoltageV > 0) {
        stampCurrentSource(
          rhs,
          circuitNodeIndexById,
          element.terminals.positive,
          element.terminals.negative,
          powerW / minVoltageV,
        );
      }
    }

    if(element.type === "dcdcConverter") {
      stampCurrentSource(
        rhs,
        circuitNodeIndexById,
        element.terminals.inPositive,
        element.terminals.inNegative,
        dcdcInputStates.get(element.id)?.currentA ?? 0,
      );
    }

    if(element.type === "digitalLed") {
      stampResistor(
        entries,
        circuitNodeIndexById,
        element.terminals.supplyIn,
        element.terminals.supplyOut,
        numberParameter(element.parameters, "supplyResistanceOhm"),
      );
      stampResistor(
        entries,
        circuitNodeIndexById,
        element.terminals.gndIn,
        element.terminals.gndOut,
        numberParameter(element.parameters, "gndResistanceOhm"),
      );
      stampCurrentSource(
        rhs,
        circuitNodeIndexById,
        element.terminals.supplyOut,
        element.terminals.gndOut,
        ledCurrentByElementId.get(element.id)
          ?? getLedCurrentForElement(element, model.settings, nominalLedVoltage(element)),
      );
    }
  });

  voltageSources.forEach((source) => {
    stampVoltageSource(entries, rhs, circuitNodeIndexById, source);
  });

  return {
    system: {
      size,
      entries,
      rhs,
    },
    circuitNodeIndexById,
    voltageSources,
  };
};

const voltageForCircuitNode = (
  model: SimulationModel,
  circuitNodeIndexById: Map<string, number>,
  values: number[],
  circuitNodeId: string | undefined,
) => {
  if(!circuitNodeId) return undefined;
  if(circuitNodeId === model.referenceNodeId) return 0;

  const index = circuitNodeIndexById.get(circuitNodeId);
  return index !== undefined ? values[index] : undefined;
};

const createCircuitVoltages = (
  model: SimulationModel,
  linearModel: LinearDcModel,
  values: number[],
) => {
  const circuitVoltages = new Map<string, number>();
  model.circuitNodes.forEach((node) => {
    const voltage = voltageForCircuitNode(model, linearModel.circuitNodeIndexById, values, node.id);
    if(voltage !== undefined) {
      circuitVoltages.set(node.id, voltage);
    }
  });
  return circuitVoltages;
};

const createLedElementVoltageResults = (
  model: SimulationModel,
  circuitVoltages: Map<string, number>,
) => (
  model.elements.flatMap((element) => {
    if(element.type !== "digitalLed" || !element.componentId) return [];

    const supplyVoltage = circuitVoltages.get(element.terminals.supplyOut);
    const gndVoltage = circuitVoltages.get(element.terminals.gndOut);

    return [{
      elementId: element.id,
      nodeId: element.componentId,
      sourceElementId: element.sourceElementId,
      deltaVoltageV: supplyVoltage !== undefined && gndVoltage !== undefined
        ? supplyVoltage - gndVoltage
        : undefined,
    }];
  })
);

const createLedStripVoltageSummaryResults = (
  ledElementVoltageResults: ReturnType<typeof createLedElementVoltageResults>,
) => {
  const grouped = new Map<string, typeof ledElementVoltageResults>();

  ledElementVoltageResults.forEach((result) => {
    const key = `${result.nodeId}:${result.sourceElementId ?? ""}`;
    const group = grouped.get(key) ?? [];
    group.push(result);
    grouped.set(key, group);
  });

  return Array.from(grouped.values()).map((group) => {
    const deltaVoltages = group.flatMap((result) => (
      result.deltaVoltageV !== undefined ? [result.deltaVoltageV] : []
    ));

    return {
      nodeId: group[0].nodeId,
      sourceElementId: group[0].sourceElementId,
      minDeltaVoltageV: deltaVoltages.length > 0 ? Math.min(...deltaVoltages) : undefined,
      elementCount: group.length,
    };
  });
};

const createSolvedCheckIssues = (
  model: SimulationModel,
  linearModel: LinearDcModel,
  values: number[],
  circuitVoltages: Map<string, number>,
  voltageSourceStates: VoltageSourceStateByElementId,
  dcdcInputStates: DcdcInputStateByElementId,
) => {
  const issues: SimulationCheckIssue[] = [];
  const elementById = new Map(model.elements.map((element) => [element.id, element]));

  linearModel.voltageSources.forEach((source) => {
    if(source.currentVariableIndex === undefined) return;

    const element = elementById.get(source.elementId);
    const currentA = Math.abs(values[source.currentVariableIndex] ?? 0);
    const currentLimitA = element ? voltageSourceEffectiveCurrentLimit(element, dcdcInputStates) : undefined;
    const wasOverloaded = voltageSourceStates.get(source.elementId)?.wasOverloaded;

    if(currentLimitA !== undefined && currentLimitA >= 0 && (wasOverloaded || currentA > currentLimitA + CURRENT_LIMIT_TOLERANCE_A)) {
      if(element?.type === "dcdcConverter" && dcdcInputStates.get(source.elementId)?.wasInputPowerLimited) {
        issues.push(issue(
          `simulation-dcdc-input-power-limit:${source.elementId}`,
          "DCDC input power limited",
          `DCDC output current ${currentA.toFixed(3)} A exceeds the dynamic input-power limit ${currentLimitA.toFixed(3)} A. The output voltage was reduced by the DCDC input power model.`,
          [{type: "element", elementId: source.elementId}],
        ));
        return;
      }

      const description = currentA > currentLimitA + CURRENT_LIMIT_TOLERANCE_A
        ? `Voltage source current ${currentA.toFixed(3)} A exceeds limit ${currentLimitA.toFixed(3)} A. The output voltage was reduced by the source overload model.`
        : `Voltage source load exceeded limit ${currentLimitA.toFixed(3)} A before output voltage reduction. Final current is ${currentA.toFixed(3)} A after output voltage reduction.`;
      issues.push(issue(
        `simulation-current-limit:${source.elementId}`,
        "Current limit exceeded",
        description,
        [{type: "element", elementId: source.elementId}],
      ));
    }
  });

  model.elements.forEach((element) => {
    if(element.type !== "fuse") return;

    const nominalCurrentA = numberParameter(element.parameters, "nominalCurrentA");
    const resistanceOhm = numberParameter(element.parameters, "resistanceOhm");
    const aVoltage = circuitVoltages.get(element.terminals.a);
    const bVoltage = circuitVoltages.get(element.terminals.b);

    if(
      nominalCurrentA === undefined ||
      resistanceOhm === undefined ||
      resistanceOhm <= 0 ||
      aVoltage === undefined ||
      bVoltage === undefined
    ) {
      return;
    }

    const currentA = Math.abs((aVoltage - bVoltage) / resistanceOhm);
    if(currentA > nominalCurrentA + 0.0005) {
      issues.push(issue(
        `simulation-fuse-current:${element.id}`,
        "Fuse current exceeded",
        `Fuse current ${currentA.toFixed(3)} A exceeds nominal current ${nominalCurrentA.toFixed(3)} A.`,
        [{type: "element", elementId: element.id}],
      ));
    }
  });

  return issues;
};

const createSimulationResult = (
  model: SimulationModel,
  diagramFingerprint: string,
  checkIssues: SimulationCheckIssue[],
  linearModel: LinearDcModel,
  values: number[],
  voltageSourceStates: VoltageSourceStateByElementId,
  dcdcInputStates: DcdcInputStateByElementId,
): SimulationResult => {
  const circuitVoltages = createCircuitVoltages(model, linearModel, values);
  const ledElementVoltageResults = createLedElementVoltageResults(model, circuitVoltages);
  const ledStripVoltageSummaryResults = createLedStripVoltageSummaryResults(ledElementVoltageResults);
  const pinCurrentById = new Map<string, number>();
  const pinIdsByCircuitNodeId = new Map<string, string[]>();

  model.pins.forEach((pin) => {
    if(!pin.circuitNodeId) return;
    const pinIds = pinIdsByCircuitNodeId.get(pin.circuitNodeId) ?? [];
    pinIds.push(pin.id);
    pinIdsByCircuitNodeId.set(pin.circuitNodeId, pinIds);
  });

  const wireResults = model.wires.map((wire) => {
    const sourceVoltage = circuitVoltages.get(wire.sourceCircuitNodeId);
    const targetVoltage = circuitVoltages.get(wire.targetCircuitNodeId);
    const voltageDropV = sourceVoltage !== undefined && targetVoltage !== undefined
      ? sourceVoltage - targetVoltage
      : undefined;
    const currentA = voltageDropV !== undefined
      ? voltageDropV / wire.resistanceOhm
      : undefined;

    if(currentA !== undefined) {
      pinIdsByCircuitNodeId.get(wire.sourceCircuitNodeId)?.forEach((pinId) => {
        pinCurrentById.set(pinId, (pinCurrentById.get(pinId) ?? 0) + currentA);
      });
      pinIdsByCircuitNodeId.get(wire.targetCircuitNodeId)?.forEach((pinId) => {
        pinCurrentById.set(pinId, (pinCurrentById.get(pinId) ?? 0) - currentA);
      });
    }

    return {
      wireId: wire.id,
      edgeId: wire.edgeId,
      currentA,
      voltageDropV,
      resistanceOhm: wire.resistanceOhm,
    };
  });
  const solvedCheckIssues = createSolvedCheckIssues(model, linearModel, values, circuitVoltages, voltageSourceStates, dcdcInputStates);
  const allCheckIssues = [...checkIssues, ...solvedCheckIssues];

  return {
    modelVersion: 1,
    settings: model.settings,
    createdAt: new Date().toISOString(),
    diagramFingerprint,
    pinResults: model.pins.map((pin) => ({
      pinId: pin.id,
      nodeId: pin.nodeId,
      handleId: pin.handleId,
      currentA: pinCurrentById.get(pin.id),
      voltageV: voltageForCircuitNode(model, linearModel.circuitNodeIndexById, values, pin.circuitNodeId),
    })),
    virtualPinResults: model.virtualPins.map((pin) => ({
      virtualPinId: pin.id,
      nodeId: pin.nodeId,
      handleId: pin.handleId,
      voltageV: voltageForCircuitNode(model, linearModel.circuitNodeIndexById, values, pin.circuitNodeId),
    })),
    wireResults,
    ledElementVoltageResults,
    ledStripVoltageSummaryResults,
    checkIssues: allCheckIssues,
    status: allCheckIssues.some((item) => item.severity === "error")
      ? "error"
      : allCheckIssues.some((item) => item.severity === "warning")
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

  let ledCurrentByElementId = createInitialLedCurrents(modelResult.model);
  let voltageSourceStates = createInitialVoltageSourceStates(modelResult.model);
  let dcdcInputStates = createInitialDcdcInputStates(modelResult.model);
  let linearModel = buildLinearDcModel(
    modelResult.model,
    ledCurrentByElementId,
    voltageSourceStates,
    dcdcInputStates,
  );
  let solverResult = denseLinearSystemSolver.solve(linearModel.system);
  let converged = false;

  for(let iteration = 0; iteration < MAX_NONLINEAR_ITERATIONS; iteration += 1) {
    if(solverResult.status !== "ok" || !solverResult.values) {
      return {
        ok: false,
        diagramFingerprint,
        issues: [
          ...modelResult.issues,
          issue(
            "simulation-solver:failed",
            "Simulation solver failed",
            solverResult.message ?? `Solver returned status ${solverResult.status}.`,
          ),
        ],
      };
    }

    const circuitVoltages = createCircuitVoltages(modelResult.model, linearModel, solverResult.values);
    const rawNextLedCurrentByElementId = createLedCurrentsFromVoltages(modelResult.model, circuitVoltages);
    const nextLedCurrentByElementId = relaxedLedCurrents(ledCurrentByElementId, rawNextLedCurrentByElementId);
    const dcdcInputUpdate = updateDcdcInputStates(
      modelResult.model,
      linearModel.voltageSources,
      solverResult.values,
      circuitVoltages,
      dcdcInputStates,
      {
        currentLimitToleranceA: CURRENT_LIMIT_TOLERANCE_A,
        nonlinearRelaxation: NONLINEAR_RELAXATION,
        sourceVoltageConvergenceV: SOURCE_VOLTAGE_CONVERGENCE_V,
      },
    );
    const sourceUpdate = updateVoltageSourceStates(
      modelResult.model,
      linearModel,
      solverResult.values,
      voltageSourceStates,
      dcdcInputUpdate.nextStates,
    );

    if(
      maxLedCurrentDeltaA(ledCurrentByElementId, rawNextLedCurrentByElementId) <= LED_CURRENT_CONVERGENCE_A &&
      sourceUpdate.maxVoltageDeltaV <= SOURCE_VOLTAGE_CONVERGENCE_V &&
      dcdcInputUpdate.maxCurrentDeltaA <= DCDC_INPUT_CURRENT_CONVERGENCE_A
    ) {
      ledCurrentByElementId = rawNextLedCurrentByElementId;
      voltageSourceStates = sourceUpdate.nextStates;
      dcdcInputStates = dcdcInputUpdate.nextStates;
      converged = true;
      break;
    }

    ledCurrentByElementId = nextLedCurrentByElementId;
    voltageSourceStates = sourceUpdate.nextStates;
    dcdcInputStates = dcdcInputUpdate.nextStates;
    linearModel = buildLinearDcModel(
      modelResult.model,
      ledCurrentByElementId,
      voltageSourceStates,
      dcdcInputStates,
    );
    solverResult = denseLinearSystemSolver.solve(linearModel.system);
  }

  if(!converged) {
    return {
      ok: false,
      diagramFingerprint,
      issues: [
        ...modelResult.issues,
        issue(
          "simulation-solver:led-current-not-converged",
          "Simulation solver did not converge",
          "Voltage-dependent LED currents did not converge within the iteration limit.",
        ),
      ],
    };
  }

  const extremeOverloadIssues = createExtremeVoltageSourceOverloadIssues(
    modelResult.model,
    linearModel,
    solverResult.values ?? [],
    dcdcInputStates,
  );

  if(extremeOverloadIssues.length > 0) {
    return {
      ok: false,
      diagramFingerprint,
      issues: [
        ...modelResult.issues,
        ...extremeOverloadIssues,
      ],
    };
  }

  const result = createSimulationResult(
    modelResult.model,
    diagramFingerprint,
    modelResult.issues,
    linearModel,
    solverResult.values ?? [],
    voltageSourceStates,
    dcdcInputStates,
  );

  return {
    ok: true,
    model: modelResult.model,
    result,
    issues: result.checkIssues,
  };
};
