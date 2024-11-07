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
import { LayoutDashboardIcon, SquarePen } from "lucide-react";

// Static Menu items outside the component
const items = [
  {
    title: "Communities",
    url: "/communities",
    icon: UserGroupIcon,
  },
];

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

interface AppSidebarProps {
  communityName: string;
  isAdmin: boolean;
}

export function AppSidebar({ communityName, isAdmin }: AppSidebarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Determine relative dashboard URL
  const dashboardPath = pathname.includes("dashboard")
    ? pathname
    : `${pathname}/dashboard`;

  const editCommunityPath = pathname.includes("edit-community")
    ? pathname
    : `${pathname}/edit-modules`;
  // Dynamic menu items inside the component
  const dynamicItems = [
    {
      title: "Dashboard",
      url: dashboardPath, // Dynamically generate the dashboard path
      icon: LayoutDashboardIcon,
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
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
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
