"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface CommunityCardProps {
  imgUrl: string;
  communityName: string;
  communityDescription: string;
  _id: string;
}

export default function CommunityCard({
  imgUrl,
  communityName,
  communityDescription,
  _id,
}: CommunityCardProps) {
  return (
    <Link href={`/communities/${_id}`} passHref>
      <div id={_id} className="relative">
        {" "}
        {/* Ensure the parent is not clipping overflow */}
        <Card className="hover:bg-slate-800 hover:text-white transition-colors group h-[240px] max-h-[280px] max-w-[220px] shadow-md hover:shadow-xl cursor-pointer transform hover:scale-105 scale-100 duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-start space-x-2 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={imgUrl} />
              <AvatarFallback>CC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base font-bold leading-tight">
                {communityName}
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground mt-1 group-hover:text-slate-200 duration-200">
                <UsersIcon className="h-4 w-4 mr-1" />
                <span>100+</span>
              </div>
            </div>
          </CardHeader>
          <CardDescription className="px-4 pb-4 max-h-[110px] text-sm text-slate-900 overflow-y-auto group-hover:text-white duration-200">
            {communityDescription}
          </CardDescription>
        </Card>
      </div>
    </Link>
  );
}
