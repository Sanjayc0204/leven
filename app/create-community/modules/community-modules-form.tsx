"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { useStepStore } from "../store/createCommunityStepStore";
import Link from "next/link";

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

async function fetchModules() {
  const res = await fetch("/api/modules/moduleList");
  if (res.ok) {
    const data = await res.json();
    return data.data;
  } else {
    console.log("Bad request");
    return [];
  }
}

// Mapping module names to images
const imgMap = new Map([
  ["Leetcode", "https://leetcode.com/static/images/LeetCode_Sharing.png"],
  // Add more mappings as needed
]);

export default function ModuleSelection() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading as true

  const setStepData = useStepStore((state) => state.setStepData);

  const selectedModulesFromStore = useStepStore(
    (state) => state.selectedModules
  );
  const setSelectedModulesInStore = useStepStore(
    (state) => state.setSelectedModules
  );

  // Fetch modules on component mount
  useEffect(() => {
    async function loadModules() {
      setIsLoading(true); // Ensure loading state is true before fetching
      const fetchedModules = await fetchModules();
      setModules(fetchedModules || []);
      setIsLoading(false); // Set loading to false after fetching
    }
    loadModules();
  }, []);

  // Set initial selected modules from the store
  useEffect(() => {
    setSelectedModules(selectedModulesFromStore);
  }, [selectedModulesFromStore]);

  // Increment stepData only on initial mount
  useEffect(() => {
    setStepData(2);
  }, []); // Empty dependency array to run only once on mount

  const toggleModule = (module: Module) => {
    setSelectedModules((prev) => {
      const isSelected = prev.some((m) => m._id === module._id);
      const updatedModules = isSelected
        ? prev.filter((m) => m._id !== module._id)
        : [...prev, module];

      // Sync the selected modules with the store
      setSelectedModulesInStore(updatedModules);
      return updatedModules;
    });
  };

  if (isLoading) {
    // Display loading message or spinner while loading
    return (
      <div className="flex items-center justify-center h-48">
        <div>Loading...</div> {/* Replace with a spinner if available */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-4 m-2">
          {modules.map((module) => (
            <Card
              key={module._id}
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedModules.some((m) => m._id === module._id)
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
                {selectedModules.some((m) => m._id === module._id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Type: {module.moduleType}
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>Points Scheme:</p>
                  <ul className="pl-4 list-disc">
                    <li>Easy: {module.customizations.pointsScheme.easy}</li>
                    <li>Medium: {module.customizations.pointsScheme.medium}</li>
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
          {selectedModules.length} modules selected
        </p>
      </div>
      <div className="py-4 flex justify-between">
        <Link href="/create-community">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/create-community/finalize">
          <Button disabled={selectedModules.length === 0} className="ml-auto">
            Continue with Selected Modules
          </Button>
        </Link>
      </div>
    </div>
  );
}
