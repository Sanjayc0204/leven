import { useQuery } from "@tanstack/react-query";

const fetchCommunityModules = async (communityId = "") => {
  const response = await fetch(
    `/api/communities/${communityId}/module/getAllModules`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
};

export const useCommunityModules = (communityId = "") => {
  return useQuery({
    queryKey: ["communityModules", communityId],
    queryFn: () => fetchCommunityModules(communityId),
    enabled: !!communityId,
  });
};
