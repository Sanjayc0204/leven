import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { History, LayoutDashboardIcon, SquarePen } from "lucide-react";
import { boolean } from "zod";

// Static Menu items outside the component
const items = [
  {
    title: "All Communities",
    url: "/communities",
    icon: UserGroupIcon,
  },
];

interface AppSidebarProps {
  communityName: string;
  isAdmin: boolean;
}

export function AppSidebar({ communityName, isAdmin }: AppSidebarProps) {
  const pathname = usePathname();
  const filteredPathname = pathname.split("/").filter(Boolean);
  console.log(`${filteredPathname[0]}/${filteredPathname[1]}/dashboard`);

  // Determine relative dashboard URL
  const dashboardPath = pathname.includes("dashboard")
    ? pathname
    : `/${filteredPathname[0] || ""}/${filteredPathname[1] || ""}/dashboard`;

  const editCommunityPath = pathname.includes("edit-community")
    ? pathname
    : `/${filteredPathname[0] || ""}/${filteredPathname[1] || ""}/edit-modules`;

  const activityHistoryPath = pathname.includes("activity-history")
    ? pathname
    : `/${filteredPathname[0] || ""}/${
        filteredPathname[1] || ""
      }/activity-history`;
  // Dynamic menu items inside the component
  const dynamicItems = [
    {
      title: "Dashboard",
      url: dashboardPath, // Dynamically generate the dashboard path
      icon: LayoutDashboardIcon,
    },

    {
      title: "Activity History",
      url: activityHistoryPath, // Dynamically generate the dashboard path
      icon: History,
    },
  ];

  const adminItems = [
    {
      title: "Edit Modules",
      url: editCommunityPath,
      icon: SquarePen,
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{communityName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  ...items,
                  ...dynamicItems,
                  ...(isAdmin ? adminItems : []),
                ].map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
