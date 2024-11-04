"use client";
import { ICommunity } from "@/models/Community.model";
import { useQuery } from "@tanstack/react-query";

// Function to fetch communities from the API
const fetchCommunities = async (): Promise<ICommunity[]> => {
  const res = await fetch(`/api/communities/all`);
  if (!res.ok) {
    throw new Error("Failed to fetch communities");
  }
  return res.json(); // Assuming the API returns an array of communities
};

// Custom React Query hook to fetch communities
export const useCommunities = () => {
  return useQuery<ICommunity[], Error>({
    queryKey: ["communities"], // queryKey is passed as part of the options object
    queryFn: () => fetchCommunities(), // queryFn also goes inside the options object
  });
};
