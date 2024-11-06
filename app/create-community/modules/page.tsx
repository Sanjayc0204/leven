import { Separator } from "@/components/ui/separator";
import ModuleSelection from "./community-modules-form";

export default function CommunityInformationPage() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col flex-grow items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight">Modules</h2>
          <p className="text-muted-foreground text-base">
            Choose which modules you want in your community.
          </p>
          <div className="w-1/2">
            <Separator className="my-6 mx-30" />
          </div>
          <div className="w-1/2">
            <ModuleSelection />
          </div>
        </div>
      </div>
    </>
  );
}
