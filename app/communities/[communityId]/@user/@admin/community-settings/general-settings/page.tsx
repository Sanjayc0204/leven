import { Separator } from "@/components/ui/separator";

export default function CommunityInformationPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Adjust your stats carefully—like a true warrior. Here, every choice
            matters.
          </p>
        </div>
        <Separator />
      </div>
    </>
  );
}
