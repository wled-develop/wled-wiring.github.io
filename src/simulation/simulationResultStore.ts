import { create } from "zustand";

import type { SimulationResult } from "./simulationTypes";

type SimulationResultState = {
  result: SimulationResult | null;
  setResult: (result: SimulationResult | null) => void;
};

export const useSimulationResultStore = create<SimulationResultState>((set) => ({
  result: null,
  setResult: (result) => set({result}),
}));
