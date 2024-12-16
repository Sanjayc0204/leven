"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
import { useUserProfile } from "@/components/queries/fetchUserProfile";
import { AppSidebar } from "@/components/ui/app-sidebar";
import CommunityHeader from "@/components/ui/communities-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Icons } from "@/components/ui/icon";
import { ICommunity } from "@/models/Community.model";

interface LayoutProps {
  admin: React.ReactNode;
  nonadmin: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout({ admin, nonadmin, children }: LayoutProps) {
  const pathname = usePathname();
  const communityId = pathname.split("/")[2];
  const session = useSession();

  const [shouldRenderSlots, setShouldRenderSlots] = useState(true);

  useEffect(() => {
    setShouldRenderSlots(
      !pathname.includes("/dashboard") &&
        !pathname.includes("/activity-history") &&
        !pathname.includes("/user")
    );
  }, [pathname]);

  // Fetch community and user data
  const {
    data: communityData,
    isLoading: communityLoading,
    isError: communityError,
  } = useCommunityById(communityId, -1);
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useUserProfile(session.data?.user.email || "");

  // Retrieve and set community and user data in the store
  const setCommunityData = useCommunityStore((state) => state.setCommunityData);
  const setUserData = useUserProfileStore((state) => state.setUserProfile);

  useEffect(() => {
    if (communityData) {
      setCommunityData(communityData);
    }
    if (userData) {
      setUserData(userData.data);
    }
  }, [communityData, userData, setCommunityData, setUserData]);

  // Loading and Error handling
  if (communityLoading || userLoading) {
    return (
      <SidebarProvider>
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Icons.spinner className="h-16 w-16 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (communityError || userError) {
    return <div>Error loading data.</div>;
  }

  const isAdmin = communityData?.creator_ID === userData?.data._id;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        communityName={communityData?.name || "Community"}
        isAdmin={isAdmin}
      />
      <SidebarInset>
        <div className="sticky top-0 bg-white z-20">
          <CommunityHeader
            onDataFetch={() => setCommunityData(communityData as ICommunity)}
          />
        </div>
        {shouldRenderSlots ? (isAdmin ? admin : nonadmin) : null}
        {!shouldRenderSlots ? children : null}
      </SidebarInset>
    </SidebarProvider>
  );
}
