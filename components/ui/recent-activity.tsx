import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useTasksByUserId } from "../queries/fetchTasksByUserId";
import LoadingSpinner from "./loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ScrollArea } from "./scroll-area";
import {
  Activity,
  Code,
  GitFork,
  GripHorizontal,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { Badge } from "./badge";

type ActivityItem = {
  _id: string;
  description: string;
  completedAt: string;
  points: number;
  metadata: string[];
  type: "submission" | "discussion" | "contribution" | "achievement";
};

export default function RecentActivity() {
  const userId = useUserProfileStore((state) => state.userProfile)?.data._id;
  const communityId = useCommunityStore((state) => state.communityData)?._id;
  const { data, isLoading, isError, error } = useTasksByUserId(
    userId,
    communityId as string
  );

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "submission":
        return <Code className="h-4 w-4" />;
      case "discussion":
        return <MessageSquare className="h-4 w-4" />;
      case "contribution":
        return <GitFork className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    console.log("Hoi");
    return <LoadingSpinner />;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  if (data) {
    const activities = data;
    return (
      <Card className=" min-w-fit w-full h-full box-border">
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
        <CardContent>
          <ScrollArea className="min-h-fit h-full pr-4">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 border rounded-lg ${
                    index !== activities.length - 1 ? "mb-4" : ""
                  }`}
                >
                  <p className="text-sm font-medium">
                    {activity.user} just earned {activity.points} points!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.metadata.map((tag, tagIndex) => (
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
