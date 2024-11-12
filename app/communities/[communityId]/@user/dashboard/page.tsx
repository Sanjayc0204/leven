"use client";
import { useEffect, useState } from "react";
import { useCommunityStore } from "@/app/store/communityStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
import LeaderboardAlt from "@/components/ui/leaderboard-alt";
import LeetcodeRubric from "@/components/ui/leetcode-components/leetcode-rubric";
import RecentActivity from "@/components/ui/recent-activity";
import DailyQuests from "@/components/ui/daily-quests";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Responsive, WidthProvider } from "react-grid-layout";
import { DashboardChart } from "@/components/ui/dashboard-chart";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CommunityPageProps {
  params: { communityId: string };
}

const dashboardComponents = [
  { id: "a", component: <LeaderboardAlt /> },
  { id: "b", component: <LeetcodeRubric /> },
  { id: "c", component: <DailyQuests /> },
  { id: "d", component: <RecentActivity /> },
  { id: "e", component: <DashboardChart /> },
];

export default function DashboardPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  const setCommunity = useCommunityStore((state) => state.setCommunityData);
  const [isDataReady, setDataReady] = useState(false);
  const { isLoading, isError, data, error } = useCommunityById(communityId, -1);

  useEffect(() => {
    if (data) {
      setCommunity(data);
      setDataReady(true);
    }
  }, [data, setCommunity]);

  if (isError) {
    return <div className="p-4 text-red-500">Error! {error.message}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const layouts = {
    lg: [
      { i: "a", x: 0, y: 0, w: 2.0, h: 3, minW: 2.0, minH: 3 },
      { i: "b", x: 2, y: 0, w: 2.5, h: 1.4, maxH: 1.4, minH: 1.4 },
      { i: "c", x: 2, y: 1.4, w: 2.5, h: 2.75 },
      { i: "d", x: 0, y: 3, w: 2, h: 1.5, maxH: 1.5 },
      { i: "e", x: 0, y: 4.5, w: 4.5, h: 2.5, maxH: 1.5 },
    ],
  };

  const ResponsiveGridLayout = WidthProvider(Responsive);

  return (
    <div className="bg-slate-200 z-0">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 4.5 }}
        draggableHandle=".drag-handle"
      >
        {dashboardComponents.map(({ id, component }) => (
          <div key={id} className="p-0 z-0">
            {component}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
