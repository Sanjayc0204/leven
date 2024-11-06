import { create } from "zustand";

export const useStepStore = create<{
  stepData: number;
  setStepData: (data: number) => void;
  stepLength: number;
  setStepLength: (data: number) => void;
}>((set) => ({
  stepData: 1,
  setStepData: (data) => set({ stepData: data }),
  stepLength: 0,
  setStepLength: (data) => set({ stepLength: data }),
}));
