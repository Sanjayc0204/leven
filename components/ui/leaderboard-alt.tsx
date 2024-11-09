"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeaderboard } from "../queries/fetchLeaderboard";
import LeaderboardSkeleton from "./leaderboard-skeleton";
import { useCommunityStore } from "@/app/store/communityStore";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Flame,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface LeaderboardUser {
  currentStreak: number;
  userId: string;
  username: string;
  previousRank: number;
  totalPoints: number;
  image: string;
}

const rankColors: { [key: number]: string } = {
  1: "",
  2: "",
  3: "",
};

function StreakDisplay({ streak }: { streak: number }) {
  if (streak <= 0) return null;

  // Define dynamic classes and messages based on streak value
  const bgColor =
    streak >= 10
      ? "bg-red-200 dark:bg-red-800"
      : streak >= 5
      ? "bg-orange-200 dark:bg-orange-800"
      : "bg-red-100 dark:bg-red-900";

  const flameColor =
    streak >= 10
      ? "text-red-700"
      : streak >= 5
      ? "text-orange-600"
      : "text-red-500";

  return (
    <div
      className={`inline-flex items-center gap-1 ${bgColor} rounded-lg px-1.5 py-0.5`}
    >
      <Flame className={`w-3 h-3 ${flameColor}`} />
      <span className="text-xs font-semibold text-red-700 dark:text-red-300">
        {streak}
      </span>
    </div>
  );
}

interface UserRankProps {
  currentRank: number;
  previousRank: number;
}

function UserRank({ currentRank, previousRank }: UserRankProps) {
  const rankDifference = previousRank - currentRank;
  let content;
  let tooltipContent;

  if (rankDifference > 0) {
    content = (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      >
        <ArrowUp className="w-3 h-3 mr-1" />
        {rankDifference}
      </Badge>
    );
    tooltipContent = `Moved up ${rankDifference} position${
      rankDifference > 1 ? "s" : ""
    }`;
  } else if (rankDifference < 0) {
    content = (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      >
        <ArrowDown className="w-3 h-3 mr-1" />
        {Math.abs(rankDifference)}
      </Badge>
    );
    tooltipContent = `Moved down ${Math.abs(rankDifference)} position${
      Math.abs(rankDifference) > 1 ? "s" : ""
    }`;
  } else {
    content = (
      <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      >
        <Minus className="w-3 h-3" />
      </Badge>
    );
    tooltipContent = "No change in rank";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function LeaderboardCard() {
  const pathArray = usePathname().split("/").filter(Boolean);
  const userProfilePath = `/${pathArray[0]}/${pathArray[1]}/users/`;
  const { communityData } = useCommunityStore();
  const { isLoading, isError, data, error, refetch } = useLeaderboard(
    communityData?._id as string
  );
  const toggleJoin = useCommunityStore((state) => state.toggleJoin);
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch, toggleJoin]);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (isError) {
    return (
      <Card className="w-[500px] h-[400px]">
        <CardHeader>Error!</CardHeader>
        <CardDescription>{error.message}</CardDescription>
      </Card>
    );
  }

  if (data) {
    const leaderboardArray: LeaderboardUser[] = data.data;
    console.log("Chairman Mao", leaderboardArray);
    return (
      <Card className="w-[500px] h-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Leaderboard</CardTitle>
          <CardDescription className="font-normal text-muted-foreground text-sm">
            Rise to the top and compete to be the best
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-y-auto h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="w-20 text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardArray.map(
                  (user: LeaderboardUser, index: number) => (
                    <TableRow
                      key={user.userId}
                      className={`${
                        rankColors[index + 1] || ""
                      } hover:bg-accent cursor-pointer`}
                      onClick={() => router.push(userProfilePath + user.userId)}
                    >
                      <TableCell className="font-medium text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} alt={user.username} />
                            <AvatarFallback>
                              {user.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.username}</span>
                            <StreakDisplay streak={user.currentStreak} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {user.totalPoints.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserRank
                          currentRank={index + 1}
                          previousRank={user.previousRank}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function LeaderboardAlt() {
  return <LeaderboardCard />;
}
