import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon } from "@heroicons/react/24/outline";

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
    <div id={_id}>
      {/* Increased card height to accommodate longer titles and more description space */}
      <Card className="hover:bg-slate-800 hover:text-white transition-col group scale-70 h-[310px] max-h-[350px] max-w-[275px] shadow-md hover:shadow-xl hover:scale-75 transition-transform duration-300 ease-in-out cursor-pointer">
        <CardHeader className="flex flex-row items-start space-x-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imgUrl} className="h-16 w-16" />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {/* Title wraps correctly for long text */}
            <CardTitle className="text-xl font-bold leading-tight">
              {communityName}
            </CardTitle>
            <div className="flex items-center text-base text-muted-foreground mt-1 group-hover:text-slate-200">
              <UsersIcon className="h-6 w-6 mr-1" />
              <span>100+</span>
            </div>
          </div>
        </CardHeader>
        {/* Increased max height for description and maintained overflow handling */}
        <CardDescription className="pl-6 pr-5 pb-6 max-h-[140px] text-lg text-slate-900 overflow-y-auto group-hover:text-white">
          {communityDescription}
        </CardDescription>
      </Card>
    </div>
  );
}
