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
        console.log("Moduledata", module);
        if (module.moduleId.name === "Leetcode" && schemeObject === null) {
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
      <Card className="w-full max-w-sm">
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
