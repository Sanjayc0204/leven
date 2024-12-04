"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useTasksByUserId } from "@/components/queries/fetchTasksByUserId";
import { useUserProfile } from "@/components/queries/fetchUserProfile";
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
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

interface SummaryCardProps {
  taskHistory: TaskEntry[];
  userName: string;
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
                    <span>
                      {format(new Date(task.completedAt), "PPp")}
                      {
                        //{formatDistanceToNow(new Date(task.completedAt),{addSuffix:true})}
                      }
                    </span>
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

function SummaryCard({ taskHistory, userName }: SummaryCardProps) {
  const totalPoints = taskHistory.reduce((acc, task) => acc + task.points, 0);
  return (
    <Card className="mb-6 flex-grow">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          {userName}&aposs task completion overview
        </CardDescription>
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

//TODO: Improve Click Performance

export default function UserPage() {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter(Boolean);
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    error: userError,
  } = useUserProfile(pathArray[pathArray.length - 1]);
  const [userId, setUserId] = useState("");
  const communityId = useCommunityStore((state) => state.communityData)
    ?._id as string;

  useEffect(() => {
    if (userData) {
      setUserId(userData.data._id);
    }
  }, [userData]);

  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    isError: tasksIsError,
    error: tasksError,
  } = useTasksByUserId(userId || "", communityId);

  if (userIsLoading || tasksIsLoading) return <div>Loading...</div>;

  if (userIsError || tasksIsError) {
    console.error(userError || tasksError);
    return <div>Error loading data</div>;
  }

  if (userData && tasksData) {
    console.log("usertasks", tasksData);
    return (
      <div className="p-4 bg-slate-100 h-screen flex flex-col">
        <div className="flex">
          <SummaryCard
            taskHistory={tasksData}
            userName={userData.data.username}
          />
        </div>
        <ActivityTable currentTasks={tasksData} />
      </div>
    );
  }
}
