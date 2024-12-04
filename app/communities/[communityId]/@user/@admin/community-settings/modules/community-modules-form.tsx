"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { useCommunityStore } from "@/app/store/communityStore";
import { useModules } from "@/components/queries/fetchModules";
import { ICommunityModule } from "@/models/Community.model";

interface Module {
  _id: string;
  name: string;
  moduleType: string;
  customizations: {
    pointsScheme: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  createdAt: string;
}

const imgMap = new Map([
  ["Leetcode", "https://leetcode.com/static/images/LeetCode_Sharing.png"],
]);

export default function ModuleSelection() {
  const commModules = useCommunityStore(
    (state) => state.communityData
  )?.modules;
  const [allModules, setAllModules] = useState<Module[]>();
  const { data, isLoading, isError, error } = useModules();
  const [communityModules, setCommunityModules] = useState(commModules);

  useEffect(() => {
    setCommunityModules(commModules);
  }, [commModules]);

  function toggleModule(module: Module) {
    // Check if any module in communityModules has the same moduleId as the clicked module's ._id
    if (
      communityModules?.some(
        (m) => (m.moduleId as unknown as string) === module._id
      )
    ) {
      // Remove the module from the communityModules array
      setCommunityModules(
        communityModules.filter(
          (m) => (m.moduleId as unknown as string) != module._id
        )
      );
    } else {
      console.log("moduel not in community");
      // Add the module to the communityModules array, replacing ._id with .moduleId
      const newModule = {
        moduleId: module._id,
        moduleName: module.name,
        customizations: module.customizations,
      };
      const newCommunityModules = [...(communityModules || []), newModule];
      setCommunityModules(newCommunityModules as unknown as ICommunityModule[]);
    }
  }

  useEffect(() => {
    if (data) {
      setAllModules(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }
  if (data && !isLoading) {
    console.log("all modules", allModules);

    return (
      <div>
        <div className="w-full max-w-4xl mx-auto p-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4 m-2">
              {allModules?.map((module) => (
                <Card
                  key={module._id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    communityModules?.some(
                      (m) => (m.moduleId as unknown as string) === module._id
                    )
                      ? "ring-2 ring-primary"
                      : "hover:ring-2 hover:ring-primary/50"
                  }`}
                  onClick={() => toggleModule(module)}
                >
                  <div className="relative">
                    <img
                      src={imgMap.get(module.name) || "/default-image.png"}
                      alt={module.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {communityModules?.some(
                      (m) => (m.moduleId as unknown as string) === module._id
                    ) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {module.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Type: {module.moduleType}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>Points Scheme:</p>
                      <ul className="pl-4 list-disc">
                        <li>Easy: {module.customizations.pointsScheme.easy}</li>
                        <li>
                          Medium: {module.customizations.pointsScheme.medium}
                        </li>
                        <li>Hard: {module.customizations.pointsScheme.hard}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {communityModules?.length} modules selected
            </p>
          </div>
          <div className="py-4 flex justify-between">
            <Button
              disabled={communityModules?.length === 0}
              className="ml-auto"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
