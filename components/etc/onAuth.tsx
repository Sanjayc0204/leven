"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserProfile } from "../queries/fetchUserProfile";
import { useUserProfileStore } from "@/app/store/userProfileStore";

export default function OnAuth() {
  const { data: session, status } = useSession();

  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
  const setUserCommunities = useUserProfileStore(
    (state) => state.setUserCommunities
  );

  const { data, refetch } = useUserProfile(`${session?.user?.email}` || "");

  useEffect(() => {
    if (data) {
      console.log("yayay");
      setUserProfile(data.data);
      setUserCommunities(data.data.communities);
    } else {
      setUserProfile(null);
      setUserCommunities(null);
    }
  }, [data, setUserCommunities, setUserProfile]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      refetch();
    }
  }, [status, refetch, session?.user?.email]);

  return null;
}
