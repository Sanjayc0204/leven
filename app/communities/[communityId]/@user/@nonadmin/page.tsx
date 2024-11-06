"use client";

import { useCommunityStore } from "@/app/store/communityStore";
// import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
// import { useLeaderboard } from "@/components/queries/fetchLeaderboard";
import { AppSidebar } from "@/components/ui/app-sidebar";
import CommunityHeader from "@/components/ui/communities-header";
import DailyQuests from "@/components/ui/daily-quests";
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
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  const setCommunity = useCommunityStore((state) => state.setCommunityData);
  const [isDataReady, setDataReady] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const { isLoading, isError, data, error } = useCommunityById(
    communityId,
    trigger
  );

  console.log("You are not an admin");

  useEffect(() => {
    if (data) {
      setCommunity(data);
      setDataReady(true);
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
          <AppSidebar communityName={data.name} />
          <SidebarInset>
            <div className="sticky top-0 bg-white">
              <CommunityHeader
                onDataFetch={() => setTrigger((prev) => prev + 1)}
              />
            </div>
            <div className="p-4 bg-slate-100 h-screen">
              <div className="flex">
                {isDataReady ? <LeaderboardAlt /> : <LeaderboardSkeleton />}
                <div className="pl-4">
                  <LeetcodeRubric />
                  {/* <DailyQuests /> */}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>

        {/* <div className="p-4 text-sm">
          <CustomTrigger />
          </div> */}
      </>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4"></h1>
        </main>
      </div>
    </div>
  );
}
