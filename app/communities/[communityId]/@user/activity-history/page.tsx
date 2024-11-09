"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useTasksByUserId } from "@/components/queries/fetchTasksByUserId";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Clock, Code, Trophy } from "lucide-react";

interface TaskEntry {
  _id: string;
  userId: string;
  communityId: string;
  moduleId: string;
  description: string;
  completedAt: string;
  metadata: string[];
  points: number;
  __v: number;
}

// const taskHistory: TaskEntry[] = [
//   {
//     _id: "672aaca2fe46364da4a3449b",
//     userId: "67297c206f4082ed030f7728",
//     communityId: "672a8e5cfe46364da4a342d0",
//     moduleId: "64ffdbcd9e73a0f2e05e48b9",
//     description: "Leetcode Submission",
//     completedAt: "2024-11-05T23:39:14.969+00:00",
//     points: 100,
//     __v: 0,
//   },
//   // Add more entries as needed for pagination demonstration
// ];

interface SummaryCardProps {
  taskHistory: TaskEntry[];
}

interface ActivityTableProps {
  currentTasks: TaskEntry[];
}

const difficultyMap = new Map([
  ["easy", "bg-green-500"],
  ["medium", "bg-yellow-500"],
  ["hard", "bg-red-500"],
]);

function ActivityTable({ currentTasks }: ActivityTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
        <CardDescription>
          A detailed list of your completed tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="font-medium">{task.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {task.metadata.map((tag) => (
                      <span key={tag} className="font-medium">
                        <Badge
                          className={`${
                            difficultyMap.get(tag) ? difficultyMap.get(tag) : ""
                          }`}
                        >
                          {tag}
                        </Badge>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(task.completedAt), "PPp")}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 font-medium">
                    <Trophy className="h-4 w-4 text-primary" />
                    {task.points}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ taskHistory }: SummaryCardProps) {
  const totalPoints = taskHistory.reduce((acc, task) => {
    return acc + task.points;
  }, 0);
  return (
    <Card className="mb-6 flex-grow">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Your task completion overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold text-center">
              {taskHistory.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold text-center">{totalPoints}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground text-center">
              Last Completed
            </p>
            <p className="text-2xl font-bold ">
              {taskHistory[0]
                ? format(new Date(taskHistory[0].completedAt), "MMM d, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunityPage() {
  const userEmail = useUserProfileStore((state) => state.userProfile)?.data._id;
  const communityId = useCommunityStore((state) => state.communityData)
    ?._id as string;
  console.log("userid", userEmail);
  const { data, isLoading, isError, error } = useTasksByUserId(
    (userEmail as unknown as string) || "",
    communityId
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  if (data) {
    console.log("tasks data", data);
    return (
      <>
        <div className="p-4 bg-slate-100 h-screen flex flex-col">
          <div className="flex">
            {" "}
            <SummaryCard taskHistory={data} />
          </div>
          <ActivityTable currentTasks={data} />
        </div>
      </>
    );
  }
}
