"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCommunityModules } from "@/components/queries/fetchCommunityModules";
import { useCommunityStore } from "@/app/store/communityStore";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type CustomizationValue = string | number | boolean;

interface ModuleCustomizations {
  [key: string]: {
    [key: string]: CustomizationValue;
  };
}

interface ModuleData {
  _id: string;
  name: string;
  customizations: ModuleCustomizations;
}

interface Module {
  moduleId: ModuleData;
}

interface ModuleDialogProps {
  module: Module | null;
}

function ModuleDialog({ module, refetch }: ModuleDialogProps) {
  console.log("Module:", module);

  const [formData, setFormData] = useState<ModuleCustomizations>(
    module?.customizations || {}
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(module?.customizations || {});
  }, [module]);

  const communityId = useCommunityStore((state) => state.communityData)?._id;

  if (!module) return null;

  const handleInputChange = (
    category: string,
    key: string,
    value: CustomizationValue
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/communities/${communityId}/module/${module?.moduleId._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData.pointsScheme }),
        }
      );

      if (res.ok) {
        setIsLoading(false);
        toast({
          title: "Module Updated",
          description: "The module settings have been successfully updated.",
        });
        refetch();
      } else {
        setIsLoading(false);
        throw new Error("Failed to update module");
      }
      console.log(
        "Updated customizations:",
        JSON.stringify({ ...formData.pointsScheme })
      );
    } catch {}
  }

  const renderInput = (
    category: string,
    key: string,
    value: CustomizationValue
  ) => {
    switch (typeof value) {
      case "number":
        return (
          <Input
            id={`${category}-${key}`}
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(category, key, Number(e.target.value))
            }
            className="col-span-2"
          />
        );
      case "boolean":
        return (
          <Switch
            id={`${category}-${key}`}
            checked={value as boolean}
            onCheckedChange={(checked) =>
              handleInputChange(category, key, checked)
            }
          />
        );
      default:
        return (
          <Input
            id={`${category}-${key}`}
            type="text"
            value={value as string}
            onChange={(e) => handleInputChange(category, key, e.target.value)}
            className="col-span-2"
          />
        );
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl">{module.moduleId.name}</DialogTitle>
        <p className="text-muted-foreground">Customize module settings</p>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        {Object.entries(formData).map(([category, settings]) => (
          <div key={category} className="grid gap-2">
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            <Separator />
            <div className="grid gap-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={`${category}-${key}`} className="capitalize">
                    {key}
                  </Label>
                  {renderInput(category, key, value)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button onClick={() => handleSubmit()} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

const moduleImageMap: { [key: string]: string } = {
  Leetcode: "https://leetcode.com/static/images/LeetCode_Sharing.png",
};

function CommunityModulesCard({ moduleData }: { moduleData: ModuleData }) {
  console.log("moduleData", moduleData);
  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50">
      <div className="relative">
        <img
          src={moduleImageMap[moduleData.moduleName] || "/default-image.png"}
          alt={moduleData.moduleName}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{moduleData.moduleName}</h3>
        <p className="text-sm text-muted-foreground mb-2"></p>
        <div className="text-sm text-muted-foreground">
          {Object.entries(moduleData.customizations).map(
            ([category, settings]) => (
              <div key={moduleData._id}>
                <p className="font-semibold capitalize">{category}:</p>
                <ul className="pl-4 list-disc">
                  {Object.entries(settings).map(([key, value]) => (
                    <li key={key} className="capitalize">
                      {key}: {value.toString()}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EditCommunityPage() {
  const communityData = useCommunityStore((state) => state.communityData);
  const { data, isLoading, isError, error, refetch } = useCommunityModules(
    communityData?._id as string
  );
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  if (isLoading) return <div>Loading</div>;

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  if (data) {
    const dataArray = data.data;
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col flex-grow items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight pt-2">
            Edit Modules
          </h2>
          <p className="text-muted-foreground text-base">
            Customize your community&apos;s modules.
          </p>
          <div className="w-3/4">
            <Separator className="my-4 mx-30" />
          </div>
          <div className="w-3/4 grid grid-cols-3 gap-4 m-2">
            {dataArray.map((module: Module) => (
              <Dialog
                key={module.moduleId._id}
                open={dialogIsOpen}
                onOpenChange={setDialogIsOpen}
              >
                <DialogTrigger
                  asChild
                  onClick={() => {
                    setSelectedModule(module);
                    setDialogIsOpen(true);
                  }}
                >
                  <div>
                    <CommunityModulesCard moduleData={module} />
                  </div>
                </DialogTrigger>
                <ModuleDialog module={selectedModule} refetch={refetch} />
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
