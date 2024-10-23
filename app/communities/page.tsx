"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import SearchBar from "@/components/ui/searchbar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommunityCard from "@/components/ui/community-card";
import { useCommunities } from "@/components/queries/fetchCommunities";
import CommunityCardSkeleton from "@/components/ui/community-card-skeleton";
import LargeCommunityCard from "@/components/ui/community-card-lg";

export default function Communities() {
  const { isLoading, isError, data, error } = useCommunities("");

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
        </div>
        <div className="flex flex-wrap flex-grow items-center justify-center ">
          <CommunityCardSkeleton />
          <CommunityCardSkeleton />
          <CommunityCardSkeleton />
        </div>
      </>
    );
  if (isError) return <div>Error! {error.message}</div>;

  if (data)
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
        </div>
        <div className="flex flex-wrap items-center justify-center m-8 gap-8 ">
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
      </>
    );
}
