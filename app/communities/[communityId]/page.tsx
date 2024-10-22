"use client";

import NavBar from "@/components/ui/navbar";
import { useCommunityById } from "@/components/queries/fetchCommunityById";

interface CommunityPageProps {
  params: { communityId: string };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  const { isLoading, isError, data, error } = useCommunityById(
    `${communityId}`
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  if (data) {
    console.log(data);
    return <div>Yay!</div>;
  }
  return (
    <div>
      <NavBar />
      <h1>{communityId}</h1>
    </div>
  );
}
