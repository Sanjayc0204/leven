"use client";

import { useCommunityStore } from "@/app/store/communityStore";
// import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
// import { useLeaderboard } from "@/components/queries/fetchLeaderboard";
import { AppSidebar } from "@/components/ui/app-sidebar";
import CommunityHeader from "@/components/ui/communities-header";
// import DailyQuests from "@/components/ui/daily-quests";
// import DailyQuests from "@/components/ui/daily-quests";
import { Icons } from "@/components/ui/icon";
// import Leaderboard from "@/components/ui/leaderboard";
import LeaderboardAlt from "@/components/ui/leaderboard-alt";
import LeaderboardSkeleton from "@/components/ui/leaderboard-skeleton";
import LeetcodeRubric from "@/components/ui/leetcode-components/leetcode-rubric";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

interface CommunityPageProps {
  params: { communityId: string };
  children: React.ReactNode;
}

export default function Layout({ params, children }: CommunityPageProps) {
  const { communityId } = params;
  const setCommunity = useCommunityStore((state) => state.setCommunityData);

  const [trigger, setTrigger] = useState(-1);
  const { isLoading, isError, data, error } = useCommunityById(
    communityId,
    trigger
  );
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("data:", data);

  useEffect(() => {
    if (data) {
      setCommunity(data);
      console.log("Setting data!");
    }
  }, [data, setCommunity]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Icons.spinner className="h-16 w-16 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  if (data) {
    return (
      <>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "14rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar communityName={data.name} isAdmin={true} />
          <SidebarInset>
            <div className="sticky top-0 bg-white">
              <CommunityHeader
                onDataFetch={() => setTrigger((prev) => prev + 1)}
              />
            </div>
            {children}
          </SidebarInset>
        </SidebarProvider>

        {/* <div className="p-4 text-sm">
          <CustomTrigger />
          </div> */}
      </>
    );
  }
}
