"use client";

import { useCommunityStore } from "@/app/store/communityStore";
// import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
import DailyQuests from "@/components/ui/daily-quests";
// import { useLeaderboard } from "@/components/queries/fetchLeaderboard";
// import DailyQuests from "@/components/ui/daily-quests";
// import Leaderboard from "@/components/ui/leaderboard";
import LeaderboardAlt from "@/components/ui/leaderboard-alt";
import LeaderboardSkeleton from "@/components/ui/leaderboard-skeleton";
import LeetcodeRubric from "@/components/ui/leetcode-components/leetcode-rubric";
import { useEffect, useState } from "react";

interface CommunityPageProps {
  params: { communityId: string };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  const setCommunity = useCommunityStore((state) => state.setCommunityData);
  const [isDataReady, setDataReady] = useState(false);
  const [trigger, setTrigger] = useState(-1);
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

  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  if (data) {
    return (
      <>
        <div className="p-4 bg-slate-100 h-screen">
          <div className="flex">
            {isDataReady ? <LeaderboardAlt /> : <LeaderboardSkeleton />}
            <div className="pl-4">
              {/* <LeetcodeRubric /> */}
              <DailyQuests />
            </div>
          </div>
        </div>
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
