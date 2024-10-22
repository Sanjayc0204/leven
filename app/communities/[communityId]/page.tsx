"use client";

interface CommunityPageProps {
  params: { communityId: string };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = params;
  return (
    <div>
      <h1>Community ID: {communityId}</h1>
      {/* Use communityId to fetch data or display content */}
    </div>
  );
}
