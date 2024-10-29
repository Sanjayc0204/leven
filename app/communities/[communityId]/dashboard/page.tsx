"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { communityData, setCommunityData } = useCommunityStore();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const communityId = communityData ? "" : pathSegments[1];

  const { data, isLoading, isError, error } = useCommunityById(communityId);

  useEffect(() => {
    if (data && !communityData) {
      setCommunityData(data);
    }
  }, [data, communityData, setCommunityData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.message}</div>;
  }

  return <div>{communityData?.name || "No community data available"}</div>;
}
