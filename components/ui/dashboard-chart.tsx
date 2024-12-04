"use client";

import { useCommunityStore } from "@/app/store/communityStore";
// import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useTasksByUserId } from "../queries/fetchTasksByUserId";
import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { format, formatDate } from "date-fns";
import { useTasksByCommunityId } from "../queries/fetchTasksByCommunity";

interface TaskEntry {
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

interface FormattedEntry {
  date: string;
  activity: number;
}

interface CombinedEntry {
  date: string;
  activity: number;
  avgActivity: number;
}

interface DailyAvg {
  date: string;
  activity: number;
  avgActivity: number;
  avgPoints: number;
}

interface ChartCardInterface {
  chartData: FormattedEntry[];
  selectedCategory: string;
  chartConfig: {
    activity: { label: string; color: string };
    avgActivity: { label: string; color: string };
  };
  setSelectedCategory: React.Dispatch<"Points" | "Tasks">;
  setRange: (range: string) => void;
  range: string;
  dailyAverage: DailyAvg[];
}

function ChartCard({
  chartData,
  selectedCategory,
  chartConfig,
  setSelectedCategory,
  setRange,
  range,
  dailyAverage,
}: ChartCardInterface) {
  console.log("Daily Average", typeof range);
  const chartDataMap = new Map(
    chartData.map((item: FormattedEntry) => [item.date, item.activity])
  );

  console.log("Chartmap", chartDataMap.get("12/1/2024"));

  const combinedDataArray = dailyAverage.map((element: CombinedEntry) => ({
    date: element.date,
    avgActivity: element.avgActivity || 0,
    activity: chartDataMap.get(element.date) || 0,
  }));

  console.log("chart data3", combinedDataArray);
  combinedDataArray.sort((element1: CombinedEntry, element2: CombinedEntry) => {
    const date1 = new Date(element1.date);
    const date2 = new Date(element2.date);

    return date1.getTime() - date2.getTime();
  });

  const tickFormatter = (dateStr: string) => {
    const date = format(new Date(dateStr), "MMM dd");
    return date;
  };

  if (!chartData) {
    return (
      <div className="w-full h-full flex items-center justify-center font-bold text-4xl">
        No activity data available
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-center gap-2 space-y-0 py-5">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>Track your progress over time</CardDescription>
        </div>
        <div className="flex items-center justify-center">
          <div className="px-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="week" className="rounded-lg">
                  Last Week
                </SelectItem>
                <SelectItem value="month" className="rounded-lg">
                  Last Month
                </SelectItem>
                <SelectItem value="year" className="rounded-lg">
                  Last Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Points" className="rounded-lg">
                  Points
                </SelectItem>
                <SelectItem value="Tasks" className="rounded-lg">
                  Tasks
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={combinedDataArray}>
            <XAxis dataKey="date" tickFormatter={tickFormatter} />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="activity"
              type="natural"
              fill={chartConfig.activity.color}
              fillOpacity={0.4}
              stroke={chartConfig.activity.color}
            />
            <Area
              dataKey="avgActivity"
              type="natural"
              fill={chartConfig.avgActivity.color}
              fillOpacity={0.4}
              stroke={chartConfig.avgActivity.color}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
}

export function DashboardChart() {
  // const userId = useUserProfileStore((state) => state.userProfile?.data._id);
  const communityId = useCommunityStore(
    (state) => state.communityData?._id
  ) as string;
  const [selectedCategory, setSelectedCategory] = useState<"Points" | "Tasks">(
    "Points"
  );
  const [range, setRange] = useState("week");

  const { data, isLoading, isError, error } = useTasksByUserId(
    "672ce741c1ef242211fe7d9b",
    communityId || ""
  );
  const { data: communityTasksData } = useTasksByCommunityId(
    communityId as string
  );

  const [activityTimeArray, setActivityTimeArray] = useState<FormattedEntry[]>(
    []
  );

  const chartConfigMap: {
    [key in "Points" | "Tasks"]: {
      activity: { label: string; color: string };
      avgActivity: { label: string; color: string };
    };
  } = {
    Points: {
      activity: {
        label: "Points",
        color: "hsl(173 58% 39%)",
      },
      avgActivity: {
        label: "Avg Points",
        color: "hsl(12 76% 61%)",
      },
    },
    Tasks: {
      activity: {
        label: "Tasks",
        color: "hsl(210 58% 50%)",
      },
      avgActivity: {
        label: "Avg Tasks",
        color: "hsl(12 76% 61%)",
      },
    },
  };

  const chartConfig = chartConfigMap[selectedCategory];

  type DailyAverage = {
    date: string;
    activity: number;
    avgPoints: number;
    avgTasks: number;
    avgActivity: number;
  };

  const [dailyAverage, setDailyAverage] = useState<DailyAverage[]>([]);

  useEffect(() => {
    if (communityTasksData) {
      console.log("jahangir", communityTasksData.data);
      const dateMap: Record<
        string,
        { points: number; tasks: number; users: Set<string> }
      > = {};

      communityTasksData.data.forEach((task: TaskEntry) => {
        const date = formatDate(new Date(task.completedAt), "MM/dd/yyyy");
        const userId = task.userId;

        if (!dateMap[date]) {
          dateMap[date] = { points: 0, tasks: 0, users: new Set() };
        }

        dateMap[date].points += task.points;
        dateMap[date].tasks += 1;
        if (!dateMap[date].users.has(userId._id)) {
          dateMap[date].users.add(userId._id);
        }
      });

      let averages: DailyAverage[] = Object.keys(dateMap).map((date) => {
        const { points, tasks, users } = dateMap[date];
        if (selectedCategory === "Points") {
          return {
            date,
            avgActivity: points / users.size,
            avgPoints: 0,
            avgTasks: 0,
            activity: 0,
          };
        }
        if (selectedCategory === "Tasks") {
          console.log("sheesh");
          return {
            date,
            avgActivity: tasks / users.size,
            avgPoints: 0,
            avgTasks: 0,
            activity: 0,
          };
        }
        return {
          date,
          avgActivity: 0,
          avgPoints: 0,
          avgTasks: 0,
          activity: 0,
        };
      });

      console.log("community averages: ", averages);

      const filterByRange = (days: number) => {
        const todayDate = Date.now();
        return averages?.filter((item) => {
          const itemDate = new Date(item?.date);
          const diffInDays =
            (todayDate - itemDate.getTime()) / (1000 * 60 * 60 * 24);
          console.log("Itemdate:", itemDate, diffInDays);
          return diffInDays <= days;
        });
      };

      if (range === "week") {
        averages = filterByRange(7);
      } else if (range === "month") {
        averages = filterByRange(30);
      } else if (range === "year") {
        averages = filterByRange(365);
      }

      setDailyAverage(averages);
    }
  }, [communityTasksData, selectedCategory, range]);

  useEffect(() => {
    if (data) {
      console.log("dashboard data", data);
      let formattedData = data.reduce(
        (acc: [FormattedEntry], record: TaskEntry) => {
          const date = new Date(record.completedAt).toLocaleDateString(
            "en-US",
            {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          );
          const existingRecord = acc.find((item) => item.date === date);

          if (existingRecord) {
            existingRecord.activity +=
              selectedCategory === "Points" ? record.points : 1;
          } else {
            acc.push({
              date,
              activity: selectedCategory === "Points" ? record.points : 1,
            });
          }
          return acc;
        },
        []
      );

      const filterByRange = (days: number) => {
        const todayDate = Date.now();
        return formattedData.filter((item: FormattedEntry) => {
          const itemDate = new Date(item.date);
          const diffInDays =
            (todayDate - itemDate.getTime()) / (1000 * 60 * 60 * 24);
          console.log("Itemdate:", itemDate, diffInDays);
          return diffInDays <= days;
        });
      };

      if (range === "week") {
        formattedData = filterByRange(7);
      } else if (range === "month") {
        formattedData = filterByRange(30);
      } else if (range === "year") {
        formattedData = filterByRange(365);
      }

      setActivityTimeArray(formattedData.reverse());
    }
  }, [data, selectedCategory, range]);

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    console.error(error);
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-4 bg-background rounded-lg shadow w-full h-full">
      <ChartCard
        chartData={activityTimeArray}
        selectedCategory={selectedCategory}
        chartConfig={chartConfig}
        setSelectedCategory={setSelectedCategory}
        setRange={setRange}
        range={range}
        dailyAverage={dailyAverage}
      />
    </div>
  );
}
