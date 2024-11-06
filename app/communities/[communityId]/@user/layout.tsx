"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";

export default function Layout({
  admin,
  nonadmin,
}: {
  admin: React.ReactNode;
  nonadmin: React.ReactNode;
}) {
  const communityData = useCommunityStore((state) => state.communityData);
  const userData = useUserProfileStore((state) => state.userProfile);

  return <>{communityData?.creator_ID === userData?._id ? admin : nonadmin}</>;
}
