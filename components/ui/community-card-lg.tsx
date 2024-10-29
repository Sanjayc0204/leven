import { Users, Ship } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface LargeCommunityCardProps {
  imgUrl: string;
  communityName: string;
  communityDescription: string;
  _id: string;
}

export default function LargeCommunityCard({
  imgUrl,
  communityName,
  communityDescription,
  _id,
}: LargeCommunityCardProps) {
  return (
    <Link href={`/communities/${_id}`} passHref>
      <Card className="w-[280px] h-[195px] overflow-hidden group hover:bg-slate-900 hover:text-slate-100 transition-colors ease-in-out duration-300">
        <div className="relative h-24 overflow-hidden">
          <Image
            alt="Community Background Image"
            src={imgUrl}
            height={96}
            width={280}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-1 ">
            <Ship className="h-4 w-4 text-primary group-hover:text-slate-100" />
            <h2 className="text-lg font-bold group-hover:text-slate-100 truncate overflow-hidden whitespace-nowrap">
              {communityName}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 group-hover:text-slate-300">
            {communityDescription}
          </p>
          <div className="flex items-center text-xs text-muted-foreground group-hover:text-slate-300">
            <Users className="h-3 w-3 mr-1 group-hover:text-slate-100" />
            <span>21,018,212</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
