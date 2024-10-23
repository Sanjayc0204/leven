"use client";

import { useCommunityById } from "@/components/queries/fetchCommunityById";
import { AppSidebar } from "@/components/ui/app-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface CommunityPageProps {
  params: { communityId: string };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  const { isLoading, isError, data, error } = useCommunityById(communityId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  if (data) {
    return (
      <>
        <SidebarProvider>
          <AppSidebar communityName={data.name} />
          <SidebarTrigger />
          <div>Yay!</div>;
        </SidebarProvider>
      </>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4"></h1>
        </main>
      </div>
    </div>
  );
}
