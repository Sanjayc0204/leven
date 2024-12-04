"use client";

import { useCommunityStore } from "@/app/store/communityStore";
// import { useUserProfileStore } from "@/app/store/userProfileStore";
import LoadingSpinner from "./loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ScrollArea } from "./scroll-area";
import {
  // Activity,
  // Code,
  // GitFork,
  GripHorizontal,
  // MessageSquare,
  // Trophy,
  Clock,
} from "lucide-react";
import { Badge } from "./badge";
import { formatDistanceToNow } from "date-fns";
import { useTasksByCommunityId } from "../queries/fetchTasksByCommunity";

interface ActivityItem {
  communityId: string;
  completedAt: string;
  description: string;
  metadata: [string];
  moduleId: string;
  points: number;
  __v: number;
  _id: string;
  userId: {
    username: string;
    _id: string;
  };
}

// type ActivityItem = {
//   _id: string;
//   description: string;
//   completedAt: string;
//   points: number;
//   metadata: string[];
//   type: "submission" | "discussion" | "contribution" | "achievement";
// };

export default function RecentActivity() {
  // const userId = useUserProfileStore((state) => state.userProfile)?.data._id;
  const communityId = useCommunityStore((state) => state.communityData)?._id;
  const { data, isLoading, isError, error } = useTasksByCommunityId(
    communityId as string
  );

  // const getActivityIcon = (type: ActivityItem["type"]) => {
  //   switch (type) {
  //     case "submission":
  //       return <Code className="h-4 w-4" />;
  //     case "discussion":
  //       return <MessageSquare className="h-4 w-4" />;
  //     case "contribution":
  //       return <GitFork className="h-4 w-4" />;
  //     case "achievement":
  //       return <Trophy className="h-4 w-4" />;
  //     default:
  //       return <Activity className="h-4 w-4" />;
  //   }
  // };

  const getTimeDifference = (completedAt: string) => {
    const a = formatDistanceToNow(new Date(completedAt), { addSuffix: true });
    return a;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  if (data) {
    const activities = data.data;
    console.log("activities: ", activities);
    return (
      <Card className="w-full h-full flex flex-col overflow-hidden">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move drag-handle bg-gray-200 rounded-lg px-1"
          aria-label="Drag handle"
          role="button"
          tabIndex={0}
        >
          <GripHorizontal
            className="text-gray-400 hover:text-gray-600"
            size={18}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {activities.map((activity: ActivityItem, index: number) => (
                <div
                  key={activity._id}
                  className={`p-4 border rounded-lg ${
                    index !== activities.length - 1 ? "mb-4" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      <b>{activity.userId.username}</b> just earned{" "}
                      <b>{activity.points} points!</b>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeDifference(activity.completedAt)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.metadata.map((tag: string, tagIndex: number) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
}
