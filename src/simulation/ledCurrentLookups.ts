import type { LedSimulationColorMode } from "./simulationTypes";

export type LedCurrentPoint = {
  voltageV: number;
  currentA: number;
};

export type LedCurrentLookup = Record<LedSimulationColorMode, readonly LedCurrentPoint[]>;

export const LED_CURRENT_LOOKUPS: Record<string, LedCurrentLookup> = {
  WS2814_24V: {
    R: [
      {voltageV: 18, currentA: 0.002},
      {voltageV: 20, currentA: 0.006},
      {voltageV: 24, currentA: 0.01},
    ],
    G: [
      {voltageV: 18, currentA: 0.002},
      {voltageV: 20, currentA: 0.006},
      {voltageV: 24, currentA: 0.01},
    ],
    B: [
      {voltageV: 18, currentA: 0.002},
      {voltageV: 20, currentA: 0.006},
      {voltageV: 24, currentA: 0.01},
    ],
    RGB_WHITE: [
      {voltageV: 18, currentA: 0.006},
      {voltageV: 20, currentA: 0.018},
      {voltageV: 24, currentA: 0.03},
    ],
    SEPARATE_WHITE: [
      {voltageV: 18, currentA: 0},
      {voltageV: 20, currentA: 0},
      {voltageV: 24, currentA: 0},
    ],
    SEPARATE_AND_RGB_WHITE: [
      {voltageV: 18, currentA: 0.006},
      {voltageV: 20, currentA: 0.018},
      {voltageV: 24, currentA: 0.03},
    ],
  },
};

export type LedCurrentLookupId = keyof typeof LED_CURRENT_LOOKUPS;

export type LedCurrentLookupResult =
  | {ok: true; currentA: number}
  | {ok: false; reason: "missing_lookup" | "missing_color_mode" | "empty_points"; message: string};

export const isLedCurrentLookupId = (value: string): value is LedCurrentLookupId =>
  Object.prototype.hasOwnProperty.call(LED_CURRENT_LOOKUPS, value);

const interpolateLedCurrent = (points: readonly LedCurrentPoint[], voltageV: number): number => {
  const sortedPoints = [...points].sort((a, b) => a.voltageV - b.voltageV);

  if(sortedPoints.length===0) return 0;
  if(voltageV<=sortedPoints[0].voltageV) return sortedPoints[0].currentA;

  const lastPoint = sortedPoints[sortedPoints.length-1];
  if(voltageV>=lastPoint.voltageV) return lastPoint.currentA;

  for(let index=0; index<sortedPoints.length-1; index++) {
    const lower = sortedPoints[index];
    const upper = sortedPoints[index+1];

    if(voltageV>=lower.voltageV && voltageV<=upper.voltageV) {
      const ratio = (voltageV - lower.voltageV) / (upper.voltageV - lower.voltageV);
      return lower.currentA + (upper.currentA - lower.currentA) * ratio;
    }
  }

  return lastPoint.currentA;
};

export const getLedCurrentA = (
  lookupId: string,
  colorMode: LedSimulationColorMode,
  voltageV: number,
  brightness: number,
): LedCurrentLookupResult => {
  if(!isLedCurrentLookupId(lookupId)) {
    return {
      ok: false,
      reason: "missing_lookup",
      message: `Missing LED current lookup: ${lookupId}.`,
    };
  }

  const points = LED_CURRENT_LOOKUPS[lookupId][colorMode];

  if(points == undefined) {
    return {
      ok: false,
      reason: "missing_color_mode",
      message: `Missing LED current lookup color mode: ${lookupId}/${colorMode}.`,
    };
  }

  if(points.length===0) {
    return {
      ok: false,
      reason: "empty_points",
      message: `LED current lookup has no points: ${lookupId}/${colorMode}.`,
    };
  }

  const clampedBrightness = Math.min(1, Math.max(0, brightness));

  return {
    ok: true,
    currentA: interpolateLedCurrent(points, voltageV) * clampedBrightness,
  };
};
