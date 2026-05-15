import type { Edge, Node } from "@xyflow/react";

import { createDiagramCheckContext } from "../check/checkContext";
import type { CheckHandle, CheckNet, CheckNetClassification } from "../check/checkContext";
import type { ComponentDataType, EdgeDataType, HandleDataType } from "../types";
import { calculateCopperWireResistanceFromEdgeData } from "./wireResistance";
import type {
  ComponentSimulationElementUse,
  ComponentSimulationElementType,
  SimulationCheckIssue,
  SimulationCheckNetRef,
  SimulationCircuitNode,
  SimulationComponent,
  SimulationElement,
  SimulationModel,
  SimulationNetClassification,
  SimulationParameterPrimitive,
  SimulationParameterRef,
  SimulationPin,
  SimulationPinRole,
  SimulationSettings,
} from "./simulationTypes";

export type BuildSimulationModelResult =
  | {ok: true; model: SimulationModel; issues: SimulationCheckIssue[]}
  | {ok: false; issues: SimulationCheckIssue[]};

const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  ledColorMode: "RGB_WHITE",
  brightnessPercent: 100,
};

const pinId = (nodeId: string, handleId: string) => `${nodeId}::${handleId}`;

class UnionFind {
  private parent = new Map<string, string>();

  add(value: string) {
    if(!this.parent.has(value)) {
      this.parent.set(value, value);
    }
  }

  find(value: string): string {
    const parent = this.parent.get(value);
    if(parent === undefined || parent === value) {
      return value;
    }

    const root = this.find(parent);
    this.parent.set(value, root);
    return root;
  }

  union(a: string, b: string) {
    this.add(a);
    this.add(b);

    const rootA = this.find(a);
    const rootB = this.find(b);

    if(rootA !== rootB) {
      this.parent.set(rootB, rootA);
    }
  }

  values() {
    return Array.from(this.parent.keys());
  }
}

const isHiddenByCondition = (node: Node<ComponentDataType>, handle: HandleDataType) => (
  handle.hideConditions?.some((condition) => {
    const selectedValue = node.data.selectFields?.find((field) => (
      field.technicalID === condition.selectHID
    ))?.selectedValue;

    return selectedValue !== undefined && condition.values.includes(selectedValue);
  }) || false
);

const visibleHandles = (node: Node<ComponentDataType>) => (
  [
    ...(node.data.handles || []),
    ...(node.data.repeatedHandleArray || []),
  ].filter((handle) => !isHiddenByCondition(node, handle))
);

const allHandles = (node: Node<ComponentDataType>) => [
  ...(node.data.handles || []),
  ...(node.data.repeatedHandleArray || []),
];

const handlePosition = (node: Node<ComponentDataType>, handle: HandleDataType) => ({
  x: node.position.x + handle.x,
  y: node.position.y + handle.y,
});

type DigitalLedSectionPlan = {
  startIndex: number;
  logicLedCount: number;
  supplyPinIds: string[];
  gndPinIds: string[];
};

type DigitalLedElementUse = Extract<ComponentSimulationElementUse, {type: "digitalLed"}>;

type DigitalLedElementPlan = {
  element: DigitalLedElementUse;
  parameters: Record<string, SimulationParameterPrimitive> | undefined;
  sections: DigitalLedSectionPlan[];
};

const isDigitalLedElement = (
  element: ComponentSimulationElementUse,
): element is DigitalLedElementUse => element.type === "digitalLed";

const netClassifications: Record<CheckNetClassification, SimulationNetClassification | undefined> = {
  gnd_net_type: "gnd",
  suppl_net_type: "supply",
  pwm_net_type: "pwm",
  digital_net_type: undefined,
  analog_net_type: undefined,
  audio_net_type: undefined,
  eth_net_type: undefined,
  usb_net_type: undefined,
  rs485_a_net_type: undefined,
  rs485_b_net_type: undefined,
  N_net_type: undefined,
  L_net_type: undefined,
  PE_net_type: undefined,
};

const mapNetClassifications = (classifications: CheckNetClassification[]) => (
  classifications.flatMap((classification) => {
    const mapped = netClassifications[classification];
    return mapped ? [mapped] : [];
  })
);

const pinRoleFromFunctions = (functions: string[]): SimulationPinRole => {
  if(functions.includes("gnd")) return "gnd";
  if(
    functions.includes("suppl_in") ||
    functions.includes("suppl_out") ||
    functions.includes("usb_power_out") ||
    functions.includes("usb_full")
  ) {
    return "supply";
  }
  if(
    functions.includes("pwm_out") ||
    functions.includes("pwm_in_R") ||
    functions.includes("pwm_in_G") ||
    functions.includes("pwm_in_B") ||
    functions.includes("pwm_in_W") ||
    functions.includes("pwm_in_WW")
  ) {
    return "pwm";
  }

  return "other";
};

const getInputFieldValue = (
  node: Node<ComponentDataType>,
  technicalID: string,
): SimulationParameterPrimitive | undefined => (
  node.data.inputFields?.find((field) => field.technicalID === technicalID)?.value
);

const getSelectFieldValue = (
  node: Node<ComponentDataType>,
  technicalID: string,
): SimulationParameterPrimitive | undefined => (
  node.data.selectFields?.find((field) => field.technicalID === technicalID)?.selectedValue
);

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

const resolveParameter = (
  ref: SimulationParameterRef,
  node: Node<ComponentDataType>,
  settings: SimulationSettings,
): {ok: true; value: SimulationParameterPrimitive} | {ok: false; message: string} => {
  if(typeof ref === "number" || typeof ref === "string" || typeof ref === "boolean") {
    return {ok: true, value: ref};
  }

  if("const" in ref) {
    return {ok: true, value: ref.const};
  }

  if("field" in ref) {
    const value = getInputFieldValue(node, ref.field);
    if(value !== undefined) return {ok: true, value};
    if(ref.default !== undefined) return {ok: true, value: ref.default};

    return {ok: false, message: `Missing input field value: ${ref.field}.`};
  }

  if("select" in ref) {
    const value = getSelectFieldValue(node, ref.select);
    if(value !== undefined) return {ok: true, value};
    if(ref.default !== undefined) return {ok: true, value: ref.default};

    return {ok: false, message: `Missing select field value: ${ref.select}.`};
  }

  if("table" in ref) {
    const selector = resolveParameter(ref.by, node, settings);
    if(!selector.ok) return selector;

    const value = ref.table[String(selector.value)];
    if(value !== undefined) return {ok: true, value};
    if(ref.default !== undefined) return {ok: true, value: ref.default};

    return {ok: false, message: `No table value for selector ${String(selector.value)}.`};
  }

  if("lookup" in ref) {
    return {ok: false, message: `Lookup references are not implemented yet: ${ref.lookup}.`};
  }

  return {
    ok: true,
    value: ref.ledLookup,
  };
};

const resolveParameters = (
  element: ComponentSimulationElementUse,
  node: Node<ComponentDataType>,
  settings: SimulationSettings,
  issues: SimulationCheckIssue[],
) => {
  const parameters = element.parameters;
  if(!parameters) return undefined;

  const resolved: Record<string, SimulationParameterPrimitive> = {};

  Object.entries(parameters).forEach(([key, ref]) => {
    const result = resolveParameter(ref, node, settings);
    if(result.ok) {
      resolved[key] = result.value;
      return;
    }

    issues.push(issue(
      `simulation-parameter:${node.id}:${element.id}:${key}`,
      "Simulation parameter could not be resolved",
      result.message,
      [{type: "node", nodeId: node.id}],
    ));
  });

  return resolved;
};

const scaleDigitalLedParameters = (
  element: ComponentSimulationElementUse,
  node: Node<ComponentDataType>,
  parameters: Record<string, SimulationParameterPrimitive> | undefined,
  issues: SimulationCheckIssue[],
) => {
  if(element.type !== "digitalLed" || !parameters) {
    return parameters;
  }

  const physLedsPerLogicLed = parameters.physLedsPerLogicLed;
  if(typeof physLedsPerLogicLed !== "number" || !Number.isFinite(physLedsPerLogicLed) || physLedsPerLogicLed <= 0) {
    issues.push(issue(
      `simulation-led-grouping:${node.id}:${element.id}`,
      "Invalid LED grouping",
      "Digital LED simulation needs a positive physLedsPerLogicLed value.",
      [{type: "node", nodeId: node.id}],
    ));
    return parameters;
  }

  const scaled = {...parameters};
  const supplyResistanceOhm = scaled.supplyResistanceOhm;
  const gndResistanceOhm = scaled.gndResistanceOhm;
  const ledsPerMeter = scaled.ledsPerMeter;

  if(typeof supplyResistanceOhm === "number") {
    scaled.supplyResistanceOhm = supplyResistanceOhm * physLedsPerLogicLed;
    scaled.physicalSupplyResistanceOhm = supplyResistanceOhm;
  }

  if(typeof gndResistanceOhm === "number") {
    scaled.gndResistanceOhm = gndResistanceOhm * physLedsPerLogicLed;
    scaled.physicalGndResistanceOhm = gndResistanceOhm;
  }

  if(typeof ledsPerMeter === "number") {
    scaled.logicLedsPerMeter = ledsPerMeter / physLedsPerLogicLed;
  }

  scaled.currentScaleFactor = physLedsPerLogicLed;

  return scaled;
};

const terminalPinIds = (
  node: Node<ComponentDataType>,
  element: ComponentSimulationElementUse,
  handleByPinId: Map<string, CheckHandle>,
  issues: SimulationCheckIssue[],
): {status: "ok"; terminals: Record<string, string>} | {status: "ignored"} | {status: "invalid"} => {
  const terminals: Record<string, string> = {};
  let hasInvalidTerminal = false;
  let hasHiddenTerminal = false;

  Object.entries(element.terminals).forEach(([terminalName, handleId]) => {
    const id = pinId(node.id, handleId);
    if(handleByPinId.has(id)) {
      terminals[terminalName] = id;
      return;
    }

    const handle = allHandles(node).find((candidate) => candidate.hid === handleId);
    if(handle && isHiddenByCondition(node, handle)) {
      hasHiddenTerminal = true;
      return;
    }

    hasInvalidTerminal = true;
    issues.push(issue(
      `simulation-terminal:${node.id}:${element.id}:${terminalName}`,
      "Simulation terminal points to a missing pin",
      `Element terminal ${terminalName} references missing handle ${handleId}.`,
      [{type: "node", nodeId: node.id}],
    ));
  });

  if(hasInvalidTerminal) {
    return {status: "invalid"};
  }

  if(hasHiddenTerminal) {
    return {status: "ignored"};
  }

  return {status: "ok", terminals};
};

const unionShortBridgeTerminals = (
  nodes: Node<ComponentDataType>[],
  handleByPinId: Map<string, CheckHandle>,
  unionFind: UnionFind,
  issues: SimulationCheckIssue[],
) => {
  nodes.forEach((node) => {
    node.data.simdata?.elements
      ?.filter((element) => element.type === "shortBridge")
      .forEach((element) => {
        const terminalResolution = terminalPinIds(node, element, handleByPinId, issues);
        if(terminalResolution.status !== "ok") return;

        const a = terminalResolution.terminals.a;
        const b = terminalResolution.terminals.b;

        if(a && b) {
          unionFind.union(a, b);
        }
      });
  });
};

const createSimulationCheckNetRef = (net: CheckNet): SimulationCheckNetRef => ({
  id: net.id,
  classifications: mapNetClassifications(net.classifications),
  pinIds: net.handles.map((handle) => pinId(handle.node.id, handle.handle.hid)),
  wireIds: net.edges.map((edge) => edge.id),
});

const collectReferenceCandidate = (
  element: ComponentSimulationElementUse,
  node: Node<ComponentDataType>,
  settings: SimulationSettings,
  handleByPinId: Map<string, CheckHandle>,
  issues: SimulationCheckIssue[],
) => {
  if(element.type !== "voltageSource") return undefined;

  const terminalResolution = terminalPinIds(node, element, handleByPinId, issues);
  if(terminalResolution.status !== "ok") return undefined;

  const currentLimit = resolveParameter(element.parameters.currentLimitA, node, settings);
  if(!currentLimit.ok || typeof currentLimit.value !== "number") return undefined;

  return {
    currentLimitA: currentLimit.value,
    negativePinId: terminalResolution.terminals.negative,
  };
};

const simulationPinId = (
  nodeId: string,
  elementId: string,
  rail: "supply" | "gnd",
  segment: string,
  index: number,
) => `${nodeId}::simulation:${elementId}:${rail}:${segment}:${index}`;

const middleHandleId = (baseHandleId: string, index: number) => `${baseHandleId}_middle_${index}`;

const terminalBaseHandleId = (handleId: string) => (
  handleId.replace(/_(start|end)$/, "")
);

const sortedLedPhysLengths = (
  node: Node<ComponentDataType>,
  requiredBoundaryIndexes: Set<number>,
) => {
  const nodeLength = node.data.nodeLength || 1;
  const byStartIndex = new Map<number, number | undefined>();
  byStartIndex.set(0, undefined);

  node.data.physLengths?.forEach((physLength) => {
    if(
      Number.isInteger(physLength.startIndex) &&
      physLength.startIndex >= 0 &&
      physLength.startIndex < nodeLength
    ) {
      byStartIndex.set(physLength.startIndex, physLength.length);
    }
  });

  requiredBoundaryIndexes.forEach((startIndex) => {
    if(startIndex > 0 && startIndex < nodeLength && !byStartIndex.has(startIndex)) {
      byStartIndex.set(startIndex, undefined);
    }
  });

  return Array.from(byStartIndex.entries())
    .map(([startIndex, length]) => ({startIndex, length}))
    .sort((a, b) => a.startIndex - b.startIndex);
};

const connectedMiddleBoundaryIndexes = (
  node: Node<ComponentDataType>,
  edges: Edge<EdgeDataType>[],
  baseHandleIds: string[],
) => {
  const baseHandleIdSet = new Set(baseHandleIds);
  const indexes = new Set<number>();

  edges.forEach((edge) => {
    const handleId = edge.source === node.id ? edge.sourceHandle : edge.target === node.id ? edge.targetHandle : undefined;
    if(!handleId) return;

    const match = /^(.+)_middle_(\d+)$/.exec(handleId);
    if(!match || !baseHandleIdSet.has(match[1])) return;

    indexes.add(Number(match[2]));
  });

  return indexes;
};

const findMiddleHandlePinId = (
  node: Node<ComponentDataType>,
  baseHandleId: string,
  boundaryIndex: number,
) => {
  const expectedHandleId = middleHandleId(baseHandleId, boundaryIndex);
  const handle = visibleHandles(node).find((candidate) => (
    candidate.hid === expectedHandleId ||
    (candidate.repeatIndex === boundaryIndex && candidate.hid === expectedHandleId)
  ));

  return handle ? pinId(node.id, handle.hid) : undefined;
};

const collectLedBoundaryPinId = (
  node: Node<ComponentDataType>,
  element: DigitalLedElementUse,
  rail: "supply" | "gnd",
  boundaryIndex: number,
  terminalPins: Record<string, string>,
  unionFind: UnionFind,
) => {
  const nodeLength = node.data.nodeLength || 1;

  if(rail === "supply") {
    if(boundaryIndex === 0) return terminalPins.supplyIn;
    if(boundaryIndex === nodeLength) return terminalPins.supplyOut;
  } else {
    if(boundaryIndex === 0) return terminalPins.gndIn;
    if(boundaryIndex === nodeLength) return terminalPins.gndOut;
  }

  const boundaryPinId = simulationPinId(node.id, element.id, rail, "boundary", boundaryIndex);
  unionFind.add(boundaryPinId);

  const terminalName = rail === "supply" ? "supplyIn" : "gndIn";
  const baseHandleId = terminalBaseHandleId(String(element.terminals[terminalName]));
  const concreteMiddlePinId = findMiddleHandlePinId(node, baseHandleId, boundaryIndex);

  if(concreteMiddlePinId) {
    unionFind.union(boundaryPinId, concreteMiddlePinId);
  }

  return boundaryPinId;
};

const collectDigitalLedElementPlans = (
  nodes: Node<ComponentDataType>[],
  edges: Edge<EdgeDataType>[],
  settings: SimulationSettings,
  handleByPinId: Map<string, CheckHandle>,
  unionFind: UnionFind,
  issues: SimulationCheckIssue[],
) => {
  const plans = new Map<string, DigitalLedElementPlan>();

  nodes.forEach((node) => {
    node.data.simdata?.elements
      ?.filter(isDigitalLedElement)
      .forEach((element) => {
        const terminalResolution = terminalPinIds(node, element, handleByPinId, issues);
        if(terminalResolution.status !== "ok") return;

        const resolvedParameters = resolveParameters(element, node, settings, issues);
        const parameters = scaleDigitalLedParameters(element, node, resolvedParameters, issues);
        const ledsPerMeter = parameters?.ledsPerMeter;
        const physLedsPerLogicLed = parameters?.physLedsPerLogicLed;

        if(
          typeof ledsPerMeter !== "number" ||
          typeof physLedsPerLogicLed !== "number" ||
          !Number.isFinite(ledsPerMeter) ||
          !Number.isFinite(physLedsPerLogicLed) ||
          ledsPerMeter <= 0 ||
          physLedsPerLogicLed <= 0
        ) {
          issues.push(issue(
            `simulation-led-segments:${node.id}:${element.id}:parameters`,
            "LED strip segmentation failed",
            "Digital LED simulation needs numeric ledsPerMeter and physLedsPerLogicLed parameters.",
            [{type: "node", nodeId: node.id}],
          ));
          return;
        }

        const nodeLength = node.data.nodeLength || 1;
        const physLengths = sortedLedPhysLengths(
          node,
          connectedMiddleBoundaryIndexes(node, edges, [
            terminalBaseHandleId(element.terminals.supplyIn),
            terminalBaseHandleId(element.terminals.gndIn),
          ]),
        );
        const sections = physLengths.flatMap((physLength, index): DigitalLedSectionPlan[] => {
          const endIndex = physLengths[index + 1]?.startIndex ?? nodeLength;
          const lengthM = physLength.length;

          if(typeof lengthM !== "number" || !Number.isFinite(lengthM) || lengthM <= 0) {
            issues.push(issue(
              `simulation-led-segments:${node.id}:${element.id}:${physLength.startIndex}:length`,
              "LED strip segment length is missing",
              `LED segment starting at index ${physLength.startIndex} needs a positive physical length.`,
              [{type: "node", nodeId: node.id}],
            ));
            return [];
          }

          const logicLedCount = Math.round(lengthM * ledsPerMeter / physLedsPerLogicLed);
          if(logicLedCount <= 0) return [];

          const supplyPinIds = Array.from({length: logicLedCount + 1}, (_unused, ledIndex) => {
            if(ledIndex === 0) {
              return collectLedBoundaryPinId(
                node,
                element,
                "supply",
                physLength.startIndex,
                terminalResolution.terminals,
                unionFind,
              );
            }
            if(ledIndex === logicLedCount) {
              return collectLedBoundaryPinId(
                node,
                element,
                "supply",
                endIndex,
                terminalResolution.terminals,
                unionFind,
              );
            }

            const id = simulationPinId(node.id, element.id, "supply", `${physLength.startIndex}:led`, ledIndex);
            unionFind.add(id);
            return id;
          });

          const gndPinIds = Array.from({length: logicLedCount + 1}, (_unused, ledIndex) => {
            if(ledIndex === 0) {
              return collectLedBoundaryPinId(
                node,
                element,
                "gnd",
                physLength.startIndex,
                terminalResolution.terminals,
                unionFind,
              );
            }
            if(ledIndex === logicLedCount) {
              return collectLedBoundaryPinId(
                node,
                element,
                "gnd",
                endIndex,
                terminalResolution.terminals,
                unionFind,
              );
            }

            const id = simulationPinId(node.id, element.id, "gnd", `${physLength.startIndex}:led`, ledIndex);
            unionFind.add(id);
            return id;
          });

          return [{
            startIndex: physLength.startIndex,
            logicLedCount,
            supplyPinIds,
            gndPinIds,
          }];
        });

        plans.set(`${node.id}:${element.id}`, {
          element,
          parameters,
          sections,
        });
      });
  });

  return plans;
};

export const buildSimulationModel = (
  nodes: Node<ComponentDataType>[],
  edges: Edge<EdgeDataType>[],
  settings: SimulationSettings = DEFAULT_SIMULATION_SETTINGS,
): BuildSimulationModelResult => {
  const issues: SimulationCheckIssue[] = [];
  const checkContext = createDiagramCheckContext(nodes, edges);
  const checkNetByPinId = new Map<string, CheckNet>();
  const handleByPinId = new Map<string, CheckHandle>();
  const unionFind = new UnionFind();

  checkContext.handles.forEach((handle) => {
    const id = pinId(handle.node.id, handle.handle.hid);
    handleByPinId.set(id, handle);
    unionFind.add(id);

    const net = checkContext.getNetByHandle(handle);
    if(net) {
      checkNetByPinId.set(id, net);
    }
  });

  unionShortBridgeTerminals(nodes, handleByPinId, unionFind, issues);
  const digitalLedElementPlans = collectDigitalLedElementPlans(
    nodes,
    edges,
    settings,
    handleByPinId,
    unionFind,
    issues,
  );

  const rootToCircuitNodeId = new Map<string, string>();
  const pinToCircuitNodeId = new Map<string, string>();

  unionFind.values().forEach((id) => {
    const root = unionFind.find(id);
    const circuitNodeId = rootToCircuitNodeId.get(root) || `circuit:${rootToCircuitNodeId.size + 1}`;
    rootToCircuitNodeId.set(root, circuitNodeId);
    pinToCircuitNodeId.set(id, circuitNodeId);
  });

  const circuitNodes: SimulationCircuitNode[] = Array.from(rootToCircuitNodeId.entries()).map(([
    root,
    id,
  ]) => {
    const groupedPinIds = Array.from(pinToCircuitNodeId.entries())
      .filter(([, circuitNodeId]) => circuitNodeId === id)
      .map(([groupedPinId]) => groupedPinId);
    const sourceCheckNetId = groupedPinIds
      .map((groupedPinId) => checkNetByPinId.get(groupedPinId)?.id)
      .find((checkNetId) => checkNetId !== undefined);

    return {
      id,
      sourceCheckNetId,
      pinIds: groupedPinIds.length > 0 ? groupedPinIds : [root],
    };
  });

  const pins: SimulationPin[] = checkContext.handles.map((handle) => {
    const id = pinId(handle.node.id, handle.handle.hid);

    return {
      id,
      nodeId: handle.node.id,
      handleId: handle.handle.hid,
      circuitNodeId: pinToCircuitNodeId.get(id),
      sourceCheckNetId: checkNetByPinId.get(id)?.id,
      functions: handle.functions,
      role: pinRoleFromFunctions(handle.functions),
      position: handlePosition(handle.node, handle.handle),
    };
  });

  const wires = edges.flatMap((edge) => {
    if(!edge.sourceHandle || !edge.targetHandle) {
      issues.push(issue(
        `simulation-wire:${edge.id}:missing-handle`,
        "Wire endpoint is incomplete",
        "Wire is missing a source or target handle.",
        [{type: "wire", edgeId: edge.id}],
      ));
      return [];
    }

    const sourcePinId = pinId(edge.source, edge.sourceHandle);
    const targetPinId = pinId(edge.target, edge.targetHandle);
    const sourceCircuitNodeId = pinToCircuitNodeId.get(sourcePinId);
    const targetCircuitNodeId = pinToCircuitNodeId.get(targetPinId);

    if(!sourceCircuitNodeId || !targetCircuitNodeId) {
      issues.push(issue(
        `simulation-wire:${edge.id}:missing-node`,
        "Wire endpoint is not part of the simulation model",
        "Wire references a handle that was not found in the diagram.",
        [{type: "wire", edgeId: edge.id}],
      ));
      return [];
    }

    if(!edge.data) {
      issues.push(issue(
        `simulation-wire:${edge.id}:missing-data`,
        "Wire data is missing",
        "Wire has no physical data for length and cross section.",
        [{type: "wire", edgeId: edge.id}],
      ));
      return [];
    }

    const resistance = calculateCopperWireResistanceFromEdgeData(edge.data);

    if(!resistance.ok) {
      issues.push(issue(
        `simulation-wire:${edge.id}:${resistance.reason}`,
        "Wire resistance could not be calculated",
        resistance.message,
        [{type: "wire", edgeId: edge.id}],
      ));
      return [];
    }

    return [{
      id: `wire:${edge.id}`,
      edgeId: edge.id,
      sourceCircuitNodeId,
      targetCircuitNodeId,
      resistanceOhm: resistance.resistanceOhm,
      lengthM: resistance.lengthM,
      crosssectionMm2: resistance.crosssectionMm2,
      material: resistance.material,
    }];
  });

  const referenceCandidates = nodes.flatMap((node) => (
    node.data.simdata?.elements
      ?.map((element) => collectReferenceCandidate(element, node, settings, handleByPinId, issues))
      .filter((candidate) => candidate !== undefined) || []
  ));
  const referenceCandidate = referenceCandidates
    .sort((a, b) => b.currentLimitA - a.currentLimitA)[0];
  const referenceNodeId = referenceCandidate
    ? pinToCircuitNodeId.get(referenceCandidate.negativePinId)
    : pins.find((pin) => pin.role === "gnd")?.circuitNodeId;

  if(!referenceNodeId) {
    issues.push(issue(
      "simulation-reference-node:missing",
      "No simulation reference node found",
      "Simulation needs a GND pin or a voltage source negative terminal as 0 V reference.",
    ));
  }

  const elements: SimulationElement[] = [];
  const components: SimulationComponent[] = nodes.map((node) => {
    const nodePinIds = visibleHandles(node).map((handle) => pinId(node.id, handle.hid));
    const elementIds: string[] = [];

    node.data.simdata?.elements?.forEach((element) => {
      const digitalLedElementPlan = element.type === "digitalLed"
        ? digitalLedElementPlans.get(`${node.id}:${element.id}`)
        : undefined;

      if(digitalLedElementPlan) {
        digitalLedElementPlan.sections.forEach((section) => {
          for(let ledIndex = 0; ledIndex < section.logicLedCount; ledIndex += 1) {
            const elementId = `component:${node.id}:${element.id}:section-${section.startIndex}:led-${ledIndex + 1}`;
            const terminals = {
              supplyIn: pinToCircuitNodeId.get(section.supplyPinIds[ledIndex]),
              supplyOut: pinToCircuitNodeId.get(section.supplyPinIds[ledIndex + 1]),
              gndIn: pinToCircuitNodeId.get(section.gndPinIds[ledIndex]),
              gndOut: pinToCircuitNodeId.get(section.gndPinIds[ledIndex + 1]),
            };

            if(!terminals.supplyIn || !terminals.supplyOut || !terminals.gndIn || !terminals.gndOut) {
              continue;
            }

            elements.push({
              id: elementId,
              componentId: node.id,
              sourceElementId: element.id,
              type: element.type as ComponentSimulationElementType,
              terminals: {
                supplyIn: terminals.supplyIn,
                supplyOut: terminals.supplyOut,
                gndIn: terminals.gndIn,
                gndOut: terminals.gndOut,
              },
              parameters: digitalLedElementPlan.parameters,
            });
            elementIds.push(elementId);
          }
        });
        return;
      }

      if(element.type === "digitalLed") return;

      const terminalResolution = terminalPinIds(node, element, handleByPinId, issues);
      if(terminalResolution.status !== "ok") return;

      const terminalPins = terminalResolution.terminals;
      const resolvedTerminals = Object.fromEntries(
        Object.entries(terminalPins).flatMap(([terminalName, terminalPinId]) => {
          const circuitNodeId = pinToCircuitNodeId.get(terminalPinId);
          return circuitNodeId ? [[terminalName, circuitNodeId]] : [];
        }),
      );
      const elementId = `component:${node.id}:${element.id}`;

      const parameters = resolveParameters(element, node, settings, issues);

      elements.push({
        id: elementId,
        componentId: node.id,
        sourceElementId: element.id,
        type: element.type as ComponentSimulationElementType,
        terminals: resolvedTerminals,
        parameters: scaleDigitalLedParameters(element, node, parameters, issues),
      });
      elementIds.push(elementId);
    });

    return {
      id: `component:${node.id}`,
      nodeId: node.id,
      technicalID: node.data.technicalID,
      simdata: node.data.simdata,
      elementIds,
      pinIds: nodePinIds,
    };
  });

  if(issues.some((item) => item.severity === "error") || !referenceNodeId) {
    return {ok: false, issues};
  }

  return {
    ok: true,
    issues,
    model: {
      version: 1,
      settings,
      nodes: nodes.map((node) => ({
        id: node.id,
        technicalID: node.data.technicalID,
        technicalVersion: node.data.technicalVersion,
        position: node.position,
      })),
      checkNets: checkContext.componentLinkedNets.map(createSimulationCheckNetRef),
      circuitNodes,
      wires,
      components,
      elements,
      pins,
      virtualPins: [],
      referenceNodeId,
    },
  };
};
