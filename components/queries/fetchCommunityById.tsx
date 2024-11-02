"use client";

import { ICommunity } from "@/models/Community.model";
import { useQuery } from "@tanstack/react-query";

const fetchCommunityById = async (searchQuery = ""): Promise<ICommunity> => {
  const res = await fetch(`/api/communities/${searchQuery}`);
  if (!res.ok) {
    throw new Error("Failed to fetch communities");
  }
  return res.json();
};

export const useCommunityById = (searchQuery = "", trigger: number) => {
  console.log("trigger", trigger);
  return useQuery<ICommunity, Error>({
    queryKey: ["community", searchQuery, trigger],
    queryFn: () => fetchCommunityById(searchQuery),
    enabled: !!searchQuery,
  });
};
