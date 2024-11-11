import React from "react";
import { Check, Clock, GripHorizontal, Star } from "lucide-react"; // Removed Zap
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: "easy" | "medium" | "hard";
  progress: number;
}

const quests: Quest[] = [
  {
    id: "1",
    title: "Solve an Easy Problem",
    description: "Complete any easy difficulty problem on LeetCode",
    reward: 10,
    completed: false,
    type: "easy",
    progress: 60,
  },
  {
    id: "2",
    title: "Tackle a Medium Challenge",
    description: "Solve a medium difficulty problem in any category",
    reward: 20,
    completed: false,
    type: "medium",
    progress: 30,
  },
  {
    id: "3",
    title: "Hard Problem Hero",
    description: "Successfully solve a hard difficulty problem",
    reward: 50,
    completed: true,
    type: "hard",
    progress: 100,
  },
];

export default function DailyQuests() {
  const completedQuests = quests.filter((quest) => quest.completed).length;
  const totalQuests = quests.length;
  const progressPercentage = (completedQuests / totalQuests) * 100;

  // Function to return color based on the quest type
  const getQuestColor = (type: string) => {
    if (type === "easy") return "bg-green-200";
    if (type === "medium") return "bg-yellow-200";
    if (type === "hard") return "bg-red-200";
    return "";
  };

  return (
    <Card className="min-w-fit w-full h-fit box-border">
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
      </div>{" "}
      {/* Reduced the width */}
      <CardHeader className="p-3">
        {" "}
        {/* Reduced padding */}
        <CardTitle className="text-xl font-bold">
          {" "}
          {/* Reduced font size */}
          Daily Quests
        </CardTitle>
        <CardDescription className="text-sm">
          Complete quests to earn rewards and improve
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {" "}
        {/* Reduced spacing */}
        <Progress value={progressPercentage} className="w-full h-1" />
        <p className="text-xs text-muted-foreground">
          {" "}
          {/* Reduced text size */}
          {completedQuests} of {totalQuests} quests completed
        </p>
        <ul className="space-y-3">
          {" "}
          {/* Reduced spacing */}
          {quests.map((quest) => (
            <li
              key={quest.id}
              className={`space-y-1 p-1 rounded-lg ${getQuestColor(
                quest.type
              )}`} // Apply background color based on quest type, reduced padding
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {" "}
                  {/* Reduced spacing */}
                  {quest.completed ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <Clock className="text-yellow-500 w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{quest.title}</span>{" "}
                  {/* Reduced font size */}
                </div>
                <div className="flex items-center space-x-1">
                  {" "}
                  {/* Reduced spacing */}
                  <Star className="w-3 h-3 text-yellow-500" />{" "}
                  {/* Reduced icon size */}
                  <span className="text-xs font-medium">
                    {quest.reward}
                  </span>{" "}
                  {/* Reduced font size */}
                </div>
              </div>
              <p className="text-xs text-gray-700 font-normal">
                {quest.description}
              </p>{" "}
              {/* Reduced font size */}
              <div className="flex items-center space-x-1">
                {" "}
                {/* Reduced spacing */}
                <Progress
                  value={quest.progress}
                  className="flex-grow h-1"
                />{" "}
                {/* Reduced progress bar height */}
                <span className="text-xs font-medium">
                  {quest.progress}%
                </span>{" "}
                {/* Reduced font size */}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-2">
        {" "}
        {/* Reduced padding */}
        <Button className="w-full text-xs py-2">Claim Rewards</Button>{" "}
        {/* Reduced button size */}
      </CardFooter>
    </Card>
  );
}
