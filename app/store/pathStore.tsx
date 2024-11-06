import { create } from "zustand";

export const usePathStore = create<{
  pathData: string | null;
  setPathData: (data: string) => void;
}>((set) => ({
  pathData: "/",
  setPathData: (data) => set({ pathData: data }),
}));
