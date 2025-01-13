"use client";

import { SidebarNav } from "@/app/user/settings/components/nav-bar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

interface settingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: settingsLayoutProps) {
  const pathname = usePathname();
  const filteredPathname = pathname?.split("/").filter(Boolean) || ["a", "b"];

  const profilePath =
    filteredPathname[filteredPathname.length - 1] === "community-settings"
      ? pathname
      : `/${filteredPathname[0] || ""}/${
          filteredPathname[1] || ""
        }/community-settings`;

  const generalSettingsPath = pathname?.includes("general-settings")
    ? pathname
    : `/${filteredPathname[0] || ""}/${filteredPathname[1] || ""}/${
        filteredPathname[2] || ""
      }/general-settings`;

  const modulesPath = pathname?.includes("modules")
    ? pathname
    : `/${filteredPathname[0] || ""}/${filteredPathname[1] || ""}/${
        filteredPathname[2] || ""
      }/modules`;

  const sidebarNavItems = [
    { title: "Community Profile", href: profilePath },
    { title: "Modules", href: modulesPath },
    { title: "General", href: generalSettingsPath },
  ];
  return (
    <div className="hidden space-y-3 p-5 pb-8 md:block">
      <div className="space-y-0.5">
        {/* Flex container to align "Settings" and "ExitSettings" in the same row */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>
        <p className="text-muted-foreground">Manage your Community</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
