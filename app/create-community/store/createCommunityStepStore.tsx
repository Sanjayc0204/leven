import { create } from "zustand";

interface Module {
  _id: string; // Use `_id` to match the schema shown in the screenshot
  name: string;
  moduleType: string;
  customizations: {
    pointsScheme: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  createdAt: string;
}

type CommunityInformationValues = {
  name: string;
  description: string;
  image: string;
};

export const useStepStore = create<{
  stepData: number;
  setStepData: (data: number) => void;

  stepLength: number;
  setStepLength: (data: number) => void;

  formData: CommunityInformationValues;
  setFormData: (data: CommunityInformationValues) => void;

  selectedModules: Module[]; // Updated to store full Module objects with new structure
  setSelectedModules: (modules: Module[]) => void;
}>((set) => ({
  stepData: 1,
  setStepData: (data) => set({ stepData: data }),

  stepLength: 0,
  setStepLength: (data) => set({ stepLength: data }),

  formData: {
    name: "",
    description: "",
    image: "",
  },
  setFormData: (data) => set({ formData: data }),

  selectedModules: [], // Initialize selectedModules as an empty array
  setSelectedModules: (modules) => set({ selectedModules: modules }), // Method to set selected modules
}));
