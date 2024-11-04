import { ICommunity } from "@/models/Community.model";
import { create } from "zustand";

export const useCommunityStore = create<{
  communityData: ICommunity | null;
  setCommunityData: (data: ICommunity) => void;
}>((set) => ({
  communityData: null,
  setCommunityData: (data) => set({ communityData: data }), // Action to update the state
}));
