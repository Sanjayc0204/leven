import { IUser } from "@/models/User.model";
import { create } from "zustand";

export const useUserProfileStore = create<{
  userProfile: IUser | null;
  setUserProfile: (data: IUser) => void;
  userCommunities: Array<{ _id: string; name: string }> | null;
  setUserCommunities: (data: Array<{ _id: string; name: string }>) => void;
}>((set) => ({
  userProfile: null,
  setUserProfile: (data) => set({ userProfile: data }),
  userCommunities: null,
  setUserCommunities: (data) => set({ userCommunities: data }),
}));
