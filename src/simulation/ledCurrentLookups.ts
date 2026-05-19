import type { LedSimulationColorMode } from "./simulationTypes";

export type LedCurrentCurveParameters = {
  i0A: number;
  iLimitA: number;
  k: number;
  v0: number;
};

export type LedCurrentCurve = Record<LedSimulationColorMode, LedCurrentCurveParameters>;

export const LED_CURRENT_CURVES: Record<string, LedCurrentCurve> = {
  WS2814_24V: {
    R: {i0A: 0, iLimitA: 0.030, k: 1.2, v0: 20.5},
    G: {i0A: 0, iLimitA: 0.030, k: 1.2, v0: 20.5},
    B: {i0A: 0, iLimitA: 0.030, k: 1.2, v0: 20.5},
    RGB_WHITE: {i0A: 0, iLimitA: 0.040, k: 1.2, v0: 20.5},
    SEPARATE_WHITE: {i0A: 0, iLimitA: 0.040, k: 1.2, v0: 20.5},
    SEPARATE_AND_RGB_WHITE: {i0A: 0, iLimitA: 0.070, k: 1.2, v0: 20.5},
  },
};

export type LedCurrentCurveId = keyof typeof LED_CURRENT_CURVES;

export type LedCurrentCurveResult =
  | {ok: true; currentA: number}
  | {ok: false; reason: "missing_curve" | "missing_color_mode" | "invalid_parameters"; message: string};

export const isLedCurrentCurveId = (value: string): value is LedCurrentCurveId =>
  Object.prototype.hasOwnProperty.call(LED_CURRENT_CURVES, value);

const sigmoid = (value: number) => {
  if(value >= 0) {
    const expNegative = Math.exp(-value);
    return 1 / (1 + expNegative);
  }

  const expPositive = Math.exp(value);
  return expPositive / (1 + expPositive);
};

export const calculateLedCurrentA = (
  parameters: LedCurrentCurveParameters,
  voltageV: number,
) => parameters.i0A + parameters.iLimitA * sigmoid(parameters.k * (voltageV - parameters.v0));

export const getLedCurrentA = (
  curveId: string,
  colorMode: LedSimulationColorMode,
  voltageV: number,
  brightness: number,
): LedCurrentCurveResult => {
  if(!isLedCurrentCurveId(curveId)) {
    return {
      ok: false,
      reason: "missing_curve",
      message: `Missing LED current curve: ${curveId}.`,
    };
  }

  const parameters = LED_CURRENT_CURVES[curveId][colorMode];

  if(parameters == undefined) {
    return {
      ok: false,
      reason: "missing_color_mode",
      message: `Missing LED current curve color mode: ${curveId}/${colorMode}.`,
    };
  }

  if(
    !Number.isFinite(parameters.i0A) ||
    !Number.isFinite(parameters.iLimitA) ||
    !Number.isFinite(parameters.k) ||
    !Number.isFinite(parameters.v0)
  ) {
    return {
      ok: false,
      reason: "invalid_parameters",
      message: `LED current curve has invalid parameters: ${curveId}/${colorMode}.`,
    };
  }

  const clampedBrightness = Math.min(1, Math.max(0, brightness));

  return {
    ok: true,
    currentA: calculateLedCurrentA(parameters, voltageV) * clampedBrightness,
  };
};
