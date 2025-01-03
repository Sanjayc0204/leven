"use client";
import { useQuery } from "@tanstack/react-query";

interface tokenResponse {
  creator: string;
  description: string;
  id: string;
  isPrivate: boolean;
  membersCount: number;
  name: string;
  image: string;
}

const fetchCommunityByInviteToken = async (
  searchQuery = ""
): Promise<tokenResponse> => {
  const res = await fetch(`/api/communities/invite/${searchQuery}`);
  if (!res.ok) {
    throw new Error("Failed to fetch communities");
  }
  return res.json();
};

export const useCommunityByTokenId = (searchQuery = "") => {
  return useQuery<tokenResponse, Error>({
    queryKey: ["token", searchQuery],
    queryFn: () => fetchCommunityByInviteToken(searchQuery),
    enabled: !!searchQuery,
  });
};
