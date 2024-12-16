import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommunityModules } from "@/components/queries/fetchCommunityModules";
import { useCommunityStore } from "@/app/store/communityStore";
import LoadingSpinner from "../loading-spinner";
import { useEffect, useState } from "react";
import { GripHorizontal } from "lucide-react";

interface settingsSchema {
  toImplement: null;
}

interface moduleIdSchema {
  moduleType: string;
  name: string;
  _id: string;
}

interface pointsSchema {
  [key: string]: number;
}

interface customizationsSchema {
  pointsScheme: pointsSchema | null;
}

interface moduleDataSchema {
  customizations: customizationsSchema;
  moduleId: moduleIdSchema;
  moduleName: string;
  settings: settingsSchema;
  _id: string;
}

const difficultyMap = new Map([
  ["easy", "bg-green-500"],
  ["medium", "bg-yellow-500"],
  ["hard", "bg-red-500"],
]);

export default function LeetcodeRubric() {
  const communityId = useCommunityStore((state) => state.communityData)?._id;
  const [schemeObject, setSchemeObject] = useState<pointsSchema | null>(null);
  const { data, error, isLoading, isError } = useCommunityModules(
    communityId as string
  );

  useEffect(() => {
    if (data && !isLoading && !isError) {
      data.data.map((module: moduleDataSchema) => {
        if (module.moduleName === "Leetcode" && schemeObject === null) {
          setSchemeObject(module.customizations.pointsScheme);
        }
      });
      console.log("Scheme", schemeObject);
    }
  }, [data, isError, isLoading, schemeObject]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    console.error(error);
    return <div>error</div>;
  }

  if (data) {
    return (
      <Card className="w-full box-border min-w-fit">
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
          <CardTitle className="text-lg">LeetCode Points</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Earn points for each solved problem. Compare with friends!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {schemeObject &&
              Object.entries(schemeObject).map(([difficulty, points]) => (
                <li
                  key={difficulty}
                  className="flex items-center justify-between"
                >
                  <Badge
                    variant="secondary"
                    className={`${difficultyMap.get(
                      difficulty.toLowerCase()
                    )} text-white`}
                  >
                    {difficulty}
                  </Badge>
                  <span className="font-medium">
                    {points as number} {points === 1 ? "point" : "points"}
                  </span>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
}
