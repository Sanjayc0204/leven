import { useQuery } from "@tanstack/react-query";

const fetchTasksByCommunityId = async (communityId = "") => {
  const response = await fetch(`/api/communities/${communityId}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch Tasks");
  }
  return response.json(); // Return the JSON data
};

export const useTasksByCommunityId = (communityId = "") => {
  return useQuery({
    queryKey: ["communityIdTasks", communityId],
    queryFn: () => fetchTasksByCommunityId(communityId),
    enabled: !!communityId, // Ensure the query runs only if communityId is provided
  });
};
