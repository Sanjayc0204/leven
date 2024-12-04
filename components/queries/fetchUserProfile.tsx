import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async (searchQuery: string) => {
  const res = await fetch(`/api/users/${searchQuery}/profile`);
  if (!res.ok) {
    throw new Error("Failed to fetch userProfile");
  }
  return res.json();
};

export const useUserProfile = (searchQuery = "") => {
  console.log("User Profile Query", process.env.MONGODB_URI);
  return useQuery({
    queryKey: ["userProfile", searchQuery],
    queryFn: () => fetchUserProfile(searchQuery),
    enabled: typeof searchQuery === "string" && searchQuery.trim().length > 0,
  });
};
