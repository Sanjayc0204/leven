interface CommunityPageProps {
  params: { communityId: string };
  children: React.ReactNode;
}

export default function Layout({ children }: CommunityPageProps) {
  return <>{children}</>;
}
