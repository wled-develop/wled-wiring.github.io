import type { ComponentDataType } from "../types";
import type { LedSimulationColorMode, SimulationCheckIssue, SimulationParameterPrimitive } from "./simulationTypes";

export type LedCurrentCurveParameters = {
  i0A: number;
  iLimitA: number;
  k: number;
  v0: number;
  kUI?: number;
};

export type LedCurrentCurve = Record<LedSimulationColorMode, LedCurrentCurveParameters>;

export type LedStripSimulationOptionKey = "supplyResistance" | "gndResistance" | "currentCurve";

export type LedStripResistanceOption = {
  id: string;
  name: string;
  description: string;
  resistanceOhm: number;
};

export type LedStripCurrentCurveOption = {
  id: string;
  name: string;
  description: string;
  curve: LedCurrentCurve;
};

export type LedStripSimulationOptionSelection = {
  supplyResistance: {
    options: string[];
    recommended?: string;
  };
  gndResistance: {
    options: string[];
    recommended?: string;
  };
  currentCurve: {
    options: string[];
    recommended?: string;
  };
};

export type LedStripSimulationOptionValues = Record<LedStripSimulationOptionKey, string>;

export const LED_STRIP_RESISTANCE_OPTIONS: Record<string, LedStripResistanceOption> = {
  typical_5mm: {
    id: "typical_5mm",
    name: "ledSimulationOptions.resistance.typical_5mm.name",
    description: "ledSimulationOptions.resistance.typical_5mm.description",
    resistanceOhm: 0.115,
  },
  good_5mm: {
    id: "good_5mm",
    name: "ledSimulationOptions.resistance.good_5mm.name",
    description: "ledSimulationOptions.resistance.good_5mm.description",
    resistanceOhm: 0.09,
  },
  poor_5mm: {
    id: "poor_5mm",
    name: "ledSimulationOptions.resistance.poor_5mm.name",
    description: "ledSimulationOptions.resistance.poor_5mm.description",
    resistanceOhm: 0.24,
  },
  narrow_fcob_path: {
    id: "narrow_fcob_path",
    name: "ledSimulationOptions.resistance.narrow_fcob_path.name",
    description: "ledSimulationOptions.resistance.narrow_fcob_path.description",
    resistanceOhm: 0.12,
  },
};

export const LED_STRIP_CURRENT_CURVE_OPTIONS: Record<string, LedStripCurrentCurveOption> = {
  ws2814_24v_typical: {
    id: "ws2814_24v_typical",
    name: "ledSimulationOptions.currentCurve.ws2814_24v_typical.name",
    description: "ledSimulationOptions.currentCurve.ws2814_24v_typical.description",
    curve: {
      R: {i0A: 0.0000005, iLimitA: 0.00295, k: 0.00701, v0: 0.27109, kUI: 0},
      G: {i0A: 0.0000200, iLimitA: 0.00274, k: 0.01233, v0: 0.28563, kUI: 0.0000075},
      B: {i0A: 0.0000300, iLimitA: 0.00267, k: 0.01635, v0: 0.29811, kUI: 0.0000062},
      RGB_WHITE: {i0A: 0, iLimitA: 0.00730, k: 0.01263, v0: 0.28616, kUI: 0.0000206},
      SEPARATE_WHITE: {i0A: 0, iLimitA: 0.00259, k: 0.02235, v0: 0.28928, kUI: 0.0000099},
      SEPARATE_AND_RGB_WHITE: {i0A: 0, iLimitA: 0.00954, k: 0.01505, v0: 0.28725, kUI: 0.0000278},
    },
  },
  ws2814_24v_conservative: {
    id: "ws2814_24v_conservative",
    name: "ledSimulationOptions.currentCurve.ws2814_24v_conservative.name",
    description: "ledSimulationOptions.currentCurve.ws2814_24v_conservative.description",
    curve: {
      R: {i0A: 0, iLimitA: 0.034, k: 1.3, v0: 20.0},
      G: {i0A: 0, iLimitA: 0.034, k: 1.3, v0: 20.0},
      B: {i0A: 0, iLimitA: 0.034, k: 1.3, v0: 20.0},
      RGB_WHITE: {i0A: 0, iLimitA: 0.046, k: 1.3, v0: 20.0},
      SEPARATE_WHITE: {i0A: 0, iLimitA: 0.046, k: 1.3, v0: 20.0},
      SEPARATE_AND_RGB_WHITE: {i0A: 0, iLimitA: 0.080, k: 1.3, v0: 20.0},
    },
  },
  ws2814_24v_low_current: {
    id: "ws2814_24v_low_current",
    name: "ledSimulationOptions.currentCurve.ws2814_24v_low_current.name",
    description: "ledSimulationOptions.currentCurve.ws2814_24v_low_current.description",
    curve: {
      R: {i0A: 0, iLimitA: 0.024, k: 1.1, v0: 20.8},
      G: {i0A: 0, iLimitA: 0.024, k: 1.1, v0: 20.8},
      B: {i0A: 0, iLimitA: 0.024, k: 1.1, v0: 20.8},
      RGB_WHITE: {i0A: 0, iLimitA: 0.034, k: 1.1, v0: 20.8},
      SEPARATE_WHITE: {i0A: 0, iLimitA: 0.034, k: 1.1, v0: 20.8},
      SEPARATE_AND_RGB_WHITE: {i0A: 0, iLimitA: 0.058, k: 1.1, v0: 20.8},
    },
  },
};

const optionKeys: LedStripSimulationOptionKey[] = ["supplyResistance", "gndResistance", "currentCurve"];

const recommendedOptionId = (
  selection: LedStripSimulationOptionSelection[LedStripSimulationOptionKey],
) => selection.recommended ?? (selection.options.length === 1 ? selection.options[0] : undefined);

export const createDefaultLedSimulationOptionValues = (
  selection: LedStripSimulationOptionSelection | undefined,
): LedStripSimulationOptionValues | undefined => {
  if(!selection) return undefined;

  const values = {} as LedStripSimulationOptionValues;
  for(const key of optionKeys) {
    const recommended = recommendedOptionId(selection[key]);
    if(!recommended) return undefined;
    values[key] = recommended;
  }

  return values;
};

export const initializeLedSimulationOptionValues = (componentData: ComponentDataType): ComponentDataType => {
  const defaults = createDefaultLedSimulationOptionValues(componentData.ledSimulationOptions);
  if(!defaults) return componentData;

  return {
    ...componentData,
    ledSimulationOptionValues: {
      ...defaults,
      ...componentData.ledSimulationOptionValues,
    },
  };
};

export const withUpdatedLedSimulationOptionDefaults = (componentData: ComponentDataType): ComponentDataType => {
  const defaults = createDefaultLedSimulationOptionValues(componentData.ledSimulationOptions);
  if(!defaults) return componentData;

  const currentValues = componentData.ledSimulationOptionValues;
  const nextValues = {...defaults};

  optionKeys.forEach((key) => {
    const currentValue = currentValues?.[key];
    if(currentValue && componentData.ledSimulationOptions?.[key].options.includes(currentValue)) {
      nextValues[key] = currentValue;
    }
  });

  return {
    ...componentData,
    ledSimulationOptionValues: nextValues,
  };
};

const createIssue = (
  nodeId: string,
  message: string,
): SimulationCheckIssue => ({
  id: `simulation-led-options:${nodeId}:${message.replace(/\W+/g, "-").toLowerCase()}`,
  severity: "error",
  title: "LED simulation options need an update",
  description: `${message} Please update this component from the current component template.`,
  targets: [{type: "node", nodeId}],
});

export const resolveLedSimulationOptionParameter = (
  componentData: ComponentDataType,
  nodeId: string,
  optionKey: LedStripSimulationOptionKey,
): {ok: true; value: SimulationParameterPrimitive} | {ok: false; issue: SimulationCheckIssue} => {
  const selection = componentData.ledSimulationOptions?.[optionKey];
  if(!selection) {
    return {ok: false, issue: createIssue(nodeId, `Missing LED simulation option definition for ${optionKey}.`)};
  }

  const selectedId = componentData.ledSimulationOptionValues?.[optionKey];
  if(!selectedId) {
    return {ok: false, issue: createIssue(nodeId, `Missing selected LED simulation option for ${optionKey}.`)};
  }

  if(!selection.options.includes(selectedId)) {
    return {ok: false, issue: createIssue(nodeId, `Selected LED simulation option ${selectedId} is not allowed for ${optionKey}.`)};
  }

  if(optionKey === "currentCurve") {
    const option = LED_STRIP_CURRENT_CURVE_OPTIONS[selectedId];
    if(!option) {
      return {ok: false, issue: createIssue(nodeId, `Unknown LED current curve option ${selectedId}.`)};
    }
    return {ok: true, value: option.id};
  }

  const option = LED_STRIP_RESISTANCE_OPTIONS[selectedId];
  if(!option || !Number.isFinite(option.resistanceOhm) || option.resistanceOhm <= 0) {
    return {ok: false, issue: createIssue(nodeId, `Unknown or invalid LED resistance option ${selectedId}.`)};
  }

  return {ok: true, value: option.resistanceOhm};
};
