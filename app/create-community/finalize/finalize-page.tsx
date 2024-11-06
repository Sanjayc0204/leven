"use client";

import { useStepStore } from "../store/createCommunityStepStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useUserProfileStore } from "@/app/store/userProfileStore";

// Map module names to specific image URLs
const moduleImageMap: { [key: string]: string } = {
  Leetcode: "https://leetcode.com/static/images/LeetCode_Sharing.png",
  // Add other modules here as needed
};

export default function FinalizeSelections() {
  const formData = useStepStore((state) => state.formData);
  const selectedModules = useStepStore((state) => state.selectedModules);
  const setStepData = useStepStore((state) => state.setStepData);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const modulesIdArray = selectedModules.map((item) => item._id);

  const communityData = {
    ...formData,
    creator_ID: userProfile?._id || "",
    modules: modulesIdArray,
  };

  console.log("Form data", communityData);

  useEffect(() => {
    setStepData(3);
  }, [setStepData]); // Add dependencies to ensure this runs only once when the component mounts

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Community Information Section */}
      <Card className="shadow-lg">
        <div className="relative h-48 w-full">
          {formData.image && (
            <Image
              src={formData.image}
              alt={`${formData.name} cover image`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          )}
        </div>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">{formData.name}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {formData.description}
          </p>
        </CardContent>
      </Card>

      {/* Separator */}
      <Separator className="my-6 mx-auto" />

      {/* Selected Modules Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Selected Modules</h3>
        <ScrollArea className="h-48 pr-2">
          <div className="grid grid-cols-2 gap-4">
            {selectedModules.length > 0 ? (
              selectedModules.map((module) => (
                <Card key={module._id} className="p-4 flex items-center">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      src={moduleImageMap[module.name] || "/default-image.png"} // Use the mapped image or a default
                      alt={module.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{module.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {"No description available"}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No modules selected.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Link href="/create-community/modules">
          <Button variant="outline">Back</Button>
        </Link>
        <Button>Confirm and Create Community</Button>
      </div>
    </div>
  );
}
