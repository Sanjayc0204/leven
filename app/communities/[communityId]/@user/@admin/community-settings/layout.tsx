import ExitSettings from "@/app/user/settings/components/exit-settings";
import { SidebarNav } from "@/app/user/settings/components/nav-bar";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  { title: "Community Profile", href: "./" },
  { title: "Modules", href: "./modules" },
];

interface settingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: settingsLayoutProps) {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        {/* Flex container to align "Settings" and "ExitSettings" in the same row */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <ExitSettings />
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
