import { useCommunityStore } from "@/app/store/communityStore";

export default function GeneralSettingsForm() {
  const communitySettingsData = useCommunityStore(
    (state) => state.communityData
  )?.settings;

  if (communitySettingsData) {
  }
}
