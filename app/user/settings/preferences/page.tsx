import { Separator } from "@/components/ui/separator";
import PreferencesForm from "./preferences-form";

export default function PreferencesDefaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Set your preferences with regards to Leven.
        </p>
      </div>
      <Separator />
      <PreferencesForm />
    </div>
  );
}
