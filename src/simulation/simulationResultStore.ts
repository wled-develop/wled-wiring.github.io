import { create } from "zustand";

import type { SimulationResult } from "./simulationTypes";

type SimulationWireHover = {
  edgeId: string;
  x: number;
  y: number;
} | null;

type SimulationResultState = {
  result: SimulationResult | null;
  wireHover: SimulationWireHover;
  setResult: (result: SimulationResult | null) => void;
  setWireHover: (wireHover: SimulationWireHover) => void;
};

export const useSimulationResultStore = create<SimulationResultState>((set) => ({
  result: null,
  wireHover: null,
  setResult: (result) => set({result, wireHover: null}),
  setWireHover: (wireHover) => set({wireHover}),
}));
