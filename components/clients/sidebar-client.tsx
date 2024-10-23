"use client"; // Ensure this is a client component
import { usePathname } from "next/navigation"; // Import usePathname hook
import { SidebarProvider } from "../ui/sidebar";

export function ClientSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current path

  // Check if the route starts with '/communities' but exclude the exact '/communities' route
  const isSidebarRoute =
    pathname.startsWith("/communities") && pathname !== "/communities";

  return isSidebarRoute ? (
    <SidebarProvider>{children}</SidebarProvider>
  ) : (
    <>{children}</>
  );
}
