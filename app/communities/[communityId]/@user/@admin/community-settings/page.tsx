import { Separator } from "@/components/ui/separator";
import CommunityInformationForm from "./community-profile-form";

export default function CommunitySettingsDefaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Community Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see your community on Leven.
        </p>
      </div>
      <Separator />
      <CommunityInformationForm />
    </div>
  );
}
