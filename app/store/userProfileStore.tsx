import { IUser } from "@/models/User.model";
import { create } from "zustand";

export const useUserProfileStore = create<{
  userProfile: IUser | null;
  setUserProfile: (data: IUser | null) => void;
  userCommunities: Array<string> | null;
  setUserCommunities: (data: Array<string> | null) => void;
}>((set) => ({
  userProfile: null,
  setUserProfile: (data) => set({ userProfile: data }),
  userCommunities: null,
  setUserCommunities: (data) => set({ userCommunities: data }),
}));
