import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Separator } from "./separator";
import { CustomTrigger } from "./sidebar-trigger";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import CommunitySidebar from "./communities-sidebar";
import CommunityHeader from "./communities-header";

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
}

export function AppSidebar({ communityName }: AppSidebarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Determine relative dashboard URL
  const dashboardPath = pathname.includes("dashboard")
    ? pathname
    : `${pathname}/dashboard`;

  // Dynamic menu items inside the component
  const dynamicItems = [
    {
      title: "Dashboard",
      url: dashboardPath, // Dynamically generate the dashboard path
      icon: LayoutDashboardIcon,
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
                {[...items, ...dynamicItems].map((item) => (
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
