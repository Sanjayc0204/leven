"use client";
import { useCommunityStore } from "@/app/store/communityStore";
import { useUserProfileStore } from "@/app/store/userProfileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CommunityPage() {
  const communityData = useCommunityStore((state) => state.communityData);
  const userData = useUserProfileStore((state) => state.userProfile);
  const [inputValue, setInputValue] = useState("Invite Link Will Appear Here");
  const [linkReady, setLinkReady] = useState(false);

  const mutation = useMutation({
    mutationFn: createInviteLink,
    onMutate: () => {
      setInputValue("Your link is loading!");
      setLinkReady(false);
    },
    onSuccess: (data) => {
      setInputValue(`leven-app.com/invite/${data?.token}`);
      console.log("Invite link: ", data);
      setLinkReady(true);
    },
    onError: (error) => {
      setInputValue("An error occurred, check console for more info");
      setLinkReady(false);
      console.error(error);
    },
  });

  function createInviteLink() {
    console.log("Fetching link");
    return fetch(`/api/communities/${communityData?._id}/generateInviteLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userData?._id ? String(userData._id) : "",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to generate invite link");
      }
      return response.json();
    });
  }

  const handleCopy = () => {
    if (linkReady) {
      navigator.clipboard.writeText(inputValue);
      toast({ description: "Copied to clipboard" });
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center my-20 w-full">
        <div className="w-[300px]">
          <div className="relative">
            <Copy
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
              onClick={() => handleCopy()}
            />
            <Input
              type="text"
              value={inputValue}
              readOnly
              className="w-full py-2 pl-10 text-sm text-gray-600 bg-white border border-slate-900 rounded-md focus:outline-none"
            />
          </div>
        </div>
        <Button className="ml-2" onClick={() => mutation.mutate()}>
          Generate Link
        </Button>
      </div>
    </div>
  );
}
