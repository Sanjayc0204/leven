"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "./navbar";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CommunityHeader({
  onDataFetch,
}: {
  onDataFetch: () => void;
}) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);

  const currentCommunity = useCommunityStore((state) => state.communityData);
  const setToggleJoin = useCommunityStore((state) => state.setToggleJoin);
  const toggleJoin = useCommunityStore((state) => state.toggleJoin);
  const currentCommunityID = currentCommunity?._id as string;
  const userCommunities =
    useUserProfileStore((state) => state.userCommunities) ?? [];
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const setUserCommunities = useUserProfileStore(
    (state) => state.setUserCommunities
  );
  console.log("User Communities: ", userCommunities);

  async function handleLeave() {
    setIsLoading(true);
    try {
      console.log("userprofile", userProfile?._id);
      const response = await fetch(
        `/api/communities/${currentCommunityID}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: `${userProfile?._id}` }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `An error has occurred: ${response.status} ${response.statusText}`
        );
      } else {
        setUserCommunities(
          userCommunities?.filter((_id) => _id !== currentCommunityID)
        );
        onDataFetch();
        setToggleJoin(!toggleJoin);
        toast({
          title: "Success",
          description: "You have left the community.",
        });
      }
    } catch (error) {
      console.error("Failed to leave community:", error);
      toast({
        title: "Error",
        description: "Failed to leave the community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoin() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/communities/${currentCommunityID}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: `${userProfile?._id}` }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `An error has occurred: ${response.status} ${response.statusText}`
        );
      } else {
        setUserCommunities([...userCommunities, currentCommunityID]);
        onDataFetch();
        setToggleJoin(!toggleJoin);
        toast({
          title: "Success",
          description: "You have joined the community.",
        });
      }
    } catch (error) {
      console.error("Failed to join community:", error);
      toast({
        title: "Error",
        description: "Failed to join the community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            return (
              <BreadcrumbItem key={href}>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={href}>{segment}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex justify-center gap-4">
        {userCommunities?.includes(currentCommunityID) ? (
          <Button onClick={handleLeave} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Leaving...
              </>
            ) : (
              "Leave"
            )}
          </Button>
        ) : (
          <Button onClick={handleJoin} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join"
            )}
          </Button>
        )}
        {status === "authenticated" ? (
          <AvatarIcon img={session.user.image} />
        ) : status === "loading" ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        ) : (
          <Button onClick={() => signIn("google")}>Log In</Button>
        )}
      </div>
    </header>
  );
}
