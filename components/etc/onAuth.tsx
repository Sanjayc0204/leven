"use client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useUserProfile } from "../queries/fetchUserProfile";
import { useUserProfileStore } from "@/app/store/userProfileStore";

export default function OnAuth() {
  const { data: session, status } = useSession();

  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
  const setUserCommunities = useUserProfileStore(
    (state) => state.setUserCommunities
  );

  // Memoize the email to avoid unnecessary re-renders
  const userEmail = useMemo(() => session?.user?.email, [session?.user?.email]);

  // Fetch profile data only if email is present and user is authenticated
  const { data, refetch } = useUserProfile(userEmail || "");

  useEffect(() => {
    if (data) {
      setUserProfile(data.data);
      setUserCommunities(data.data.communities);
    } else {
      setUserProfile(null);
      setUserCommunities(null);
    }
  }, [data, setUserCommunities, setUserProfile]);

  useEffect(() => {
    // Only refetch if authenticated and userEmail is present and data is not loaded
    if (status === "authenticated" && userEmail && !data) {
      console.log("refetching");
      refetch();
    }
  }, [status, refetch, userEmail, data]);

  return null;
}
