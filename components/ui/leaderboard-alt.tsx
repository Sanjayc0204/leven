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

interface LeaderboardUser {
  userId: string;
  username: string;
  totalPoints: number;
  image: string;
}

const rankColors: { [key: number]: string } = {
  1: "",
  2: "",
  3: "",
};

function LeaderboardCard() {
  const { communityData } = useCommunityStore();
  const { isLoading, isError, data, error } = useLeaderboard(
    communityData?._id as string
  );

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
                      className={rankColors[index + 1] || "hover:bg-accent"}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
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
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {user.totalPoints.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="ml-auto">
                          -
                        </Badge>
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
