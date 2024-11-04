"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function SidebarTriggerClient() {
  const pathname = usePathname();

  if (pathname === "" || pathname === "/communities") {
    return null;
  }

  return <SidebarTrigger />;
}
