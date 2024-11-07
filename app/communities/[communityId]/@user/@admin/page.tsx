"use client";

// import { useUserProfileStore } from "@/app/store/userProfileStore";
// import { useLeaderboard } from "@/components/queries/fetchLeaderboard";
// import DailyQuests from "@/components/ui/daily-quests";
// import DailyQuests from "@/components/ui/daily-quests";
// import Leaderboard from "@/components/ui/leaderboard";
import LeaderboardAlt from "@/components/ui/leaderboard-alt";
import LeetcodeRubric from "@/components/ui/leetcode-components/leetcode-rubric";

export default function CommunityPage() {
  return (
    <>
      <div className="p-4 bg-slate-100 h-screen">
        <div className="flex">
          <LeaderboardAlt />
          <div className="pl-4">
            <LeetcodeRubric />
            {/* <DailyQuests /> */}
          </div>
        </div>
      </div>

      {/* <div className="p-4 text-sm">
          <CustomTrigger />
          </div> */}
    </>
  );

  // return (
  //   <div className="flex h-screen">
  //     <div className="flex-1 overflow-auto">
  //       <main className="p-4">
  //         <h1 className="text-2xl font-bold mb-4"></h1>
  //       </main>
  //     </div>
  //   </div>
  // );
}
