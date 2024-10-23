"use client";

import { ICommunity } from "@/models/Community.model";
import { useQuery } from "@tanstack/react-query";

// Function to fetch communities from the API
const fetchCommunityById = async (searchQuery = ""): Promise<ICommunity> => {
  const res = await fetch(`/api/communities/${searchQuery}`);
  if (!res.ok) {
    throw new Error("Failed to fetch communities");
  }
  return res.json(); // Assuming the API returns an array of communities
};

// Custom React Query hook to fetch communities
export const useCommunityById = (searchQuery = "") => {
  return useQuery<ICommunity, Error>({
    queryKey: ["community", searchQuery], // queryKey is passed as part of the options object
    queryFn: () => fetchCommunityById(searchQuery), // queryFn also goes inside the options object
  });
};
