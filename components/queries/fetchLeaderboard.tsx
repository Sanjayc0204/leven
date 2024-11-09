import { useQuery } from "@tanstack/react-query";

const fetchLeaderboard = async (communityId = "") => {
  const response = await fetch(`/api/communities/${communityId}/leaderboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json(); // Return the JSON data
};

export const useLeaderboard = (communityId = "") => {
  return useQuery({
    queryKey: ["leaderboard", communityId],
    queryFn: () => fetchLeaderboard(communityId),
    enabled: !!communityId, // Ensure the query runs only if communityId is provided
  });
};
