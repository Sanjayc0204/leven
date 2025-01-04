import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CommunityInviteCardProps {
  communityName: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  onButtonClick: () => void;
}

export default function CommunityInviteCard({
  communityName,
  description,
  memberCount,
  imageUrl,
  onButtonClick,
}: CommunityInviteCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-slate-0 text-black shadow-md">
      <CardHeader className="text-center pb-2">
        <h2 className="text-xl font-semibold">
          You&apos;ve been invited to join
        </h2>
      </CardHeader>
      <CardContent className="flex items-center space-x-4 pb-4">
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={communityName}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold">{communityName}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
          <p className="text-gray-500 text-sm mt-1">
            {memberCount.toLocaleString()} members
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-slate-900 hover:bg-slate-700 text-white"
          onClick={onButtonClick}
        >
          Accept Invite
        </Button>
      </CardFooter>
    </Card>
  );
}
