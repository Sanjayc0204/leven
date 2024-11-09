import { Separator } from "@/components/ui/separator";
import ModuleSelection from "./community-modules-form";

export default function CommunityInformationPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Modules</h3>
          <p className="text-sm text-muted-foreground">
            Choose which modules you want in your community.
          </p>
        </div>
        <Separator />
        <ModuleSelection />
      </div>
    </>
  );
}
