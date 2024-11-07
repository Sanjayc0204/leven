"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityById } from "@/components/queries/fetchCommunityById";
import { useUserProfile } from "@/components/queries/fetchUserProfile";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Layout({
  admin,
  nonadmin,
}: {
  admin: React.ReactNode;
  nonadmin: React.ReactNode;
}) {
  const pathname = usePathname();
  const communityId = pathname.split("/")[2];
  const session = useSession();
  const {
    data: communityData,
    isLoading: communityLoading,
    isError: communityError,
    error: communityErrorDetails,
  } = useCommunityById(communityId, -1);
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorDetails,
  } = useUserProfile(session.data?.user.email || "");

  const communityInfo = useCommunityStore((state) => state.communityData);
  const userInfo = useUserProfileStore((state) => state.userProfile);

  const setCommunityData = useCommunityStore((state) => state.setCommunityData);
  const setUserData = useUserProfileStore((state) => state.setUserProfile);

  if (communityLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (communityData && userData) {
    setCommunityData(communityData);
    setUserData(userData);
    if (communityData?.creator_ID === userData?.data._id) {
      console.log("You are an admin");
    } else {
      console.log("You are not an admin", communityData);
      console.log(communityData?.creator_ID === userData.data._id);
    }

    return (
      <>{communityData?.creator_ID === userData?.data._id ? admin : nonadmin}</>
    );
  }
}
