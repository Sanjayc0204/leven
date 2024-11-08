import { useQuery } from "@tanstack/react-query";

const fetchTasksByUserId = async (userId = "", communityId = "") => {
  const response = await fetch(
    `/api/tasks/${userId}/all?communityId=${communityId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Tasks");
  }
  return response.json(); // Return the JSON data
};

export const useTasksByUserId = (userId = "", communityId = "") => {
  return useQuery({
    queryKey: ["userIdTasks", userId],
    queryFn: () => fetchTasksByUserId(userId, communityId),
    enabled: !!userId, // Ensure the query runs only if communityId is provided
  });
};
