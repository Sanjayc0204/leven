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

export const useCommunityById = (searchQuery = "") => {
  return useQuery<ICommunity, Error>({
    queryKey: ["community", searchQuery], // queryKey is passed as part of the options object
    queryFn: () => fetchCommunityById(searchQuery), // queryFn also goes inside the options object
    enabled: !!searchQuery,
  });
};
