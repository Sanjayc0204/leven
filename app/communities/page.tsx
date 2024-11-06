"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import SearchBar from "@/components/ui/searchbar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunities } from "@/components/queries/fetchCommunities";
import LargeCommunityCard from "@/components/ui/community-card-lg";
import CommunityCardLargeSkeleton from "@/components/ui/community-card-lg-skeleton";
import { Ghost, Plus } from "lucide-react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Communities() {
  const { isLoading, isError, data, error } = useCommunities();

  if (isLoading)
    return (
      <>
        <NavBar />

        <div className="flex items-center justify-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">
          <h2>Find Your People</h2>
        </div>
        {/* Flex container with center alignment for both SearchBar and Button */}
        <div className="flex items-center justify-center gap-4">
          {/* SearchBar will have fixed width */}
          <SearchBar />
          {/* Button will have its normal size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Filter</Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button>Create Community</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center m-8 gap-8 ">
          <CommunityCardLargeSkeleton />
          <CommunityCardLargeSkeleton />
          <CommunityCardLargeSkeleton />
        </div>
      </>
    );
  if (isError) return <div>Error! {error.message}</div>;

  if (data)
    return (
      <div className="backdrop-blur-sm bg-white/30">
        <NavBar />
        <div className="flex items-center justify-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">
          <h2>Find Your People</h2>
        </div>
        {/* Flex container with center alignment for both SearchBar and Button */}
        <div className="flex items-center justify-center gap-4">
          {/* SearchBar will have fixed width */}
          <SearchBar />
          {/* Button will have its normal size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Filter</Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        <div className="flex justify-center align-items pt-4">
          <Button
            variant="expandIcon"
            Icon={() => <Plus className="w-4 h-4" />} // Adjust size with Tailwind width and height classes
            iconPlacement="right"
            className=" bg-transparent text-black hover:bg-transparent underline"
          >
            Create Community
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center m-4 gap-8 max-w-[1000px] ">
            {data.map((community) => (
              <LargeCommunityCard
                imgUrl={community.image}
                communityName={community.name}
                communityDescription={community.description}
                _id={community._id as string}
                key={community._id as string}
              />
            ))}
          </div>
        </div>
      </div>
    );
}
