"use client";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { useCommunityByTokenId } from "@/components/queries/fetchCommunityByInviteToken";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CommunityInviteCard from "@/components/ui/community-invite-card";
import { LoadingOverlay } from "@/components/ui/loadingOverlay";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

function ErrorDialog({
  errorMessage,
  isOpen,
  onClose,
}: {
  errorMessage: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ViewInvitePage() {
  const tokenId = usePathname().split("/").at(-1);
  const { isLoading, isError, data, error } = useCommunityByTokenId(tokenId);
  const userData = useUserProfileStore((state) => state.userProfile);
  const { status } = useSession();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [joinIsLoading, setJoinIsLoading] = useState(false);

  const mutation = useMutation({ mutationFn: joinCommunityByToken });

  function joinCommunityByToken() {
    return fetch(`/api/communities/inviteJoin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userData?._id ? String(userData._id) : "",
      },
      body: JSON.stringify({
        token: tokenId,
      }),
    })
      .then(async (response) => {
        setJoinIsLoading(false);
        if (!response.ok) {
          const errorResponse = await response.json();
          setErrorMessage(errorResponse.error);
          setDialogIsOpen(true);
          throw new Error(`Error: ${errorResponse.error}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error joining community via invite:", error.message);
        throw error;
      });
  }

  function onClick() {
    if (status === "authenticated") {
      setJoinIsLoading(true);
      mutation.mutate();
    } else {
      signIn("google");
    }
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error! Check console for more info</div>;
  }

  function closeDialog() {
    setDialogIsOpen(false);
  }

  if (data) {
    console.log("Community Data: ", data);
    return (
      <LoadingOverlay isLoading={joinIsLoading}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <ErrorDialog
            errorMessage={errorMessage}
            isOpen={dialogIsOpen}
            onClose={() => closeDialog()}
          />
          <CommunityInviteCard
            communityName={data.name}
            description={data.description}
            memberCount={data.membersCount}
            imageUrl={data.image}
            onButtonClick={onClick}
          />
        </div>
      </LoadingOverlay>
    );
  }
}
