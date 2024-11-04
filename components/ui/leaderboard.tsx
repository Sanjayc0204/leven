import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { useLeaderboard } from "../queries/fetchLeaderboard";
import LeaderboardSkeleton from "./leaderboard-skeleton";
import { useCommunityStore } from "@/app/store/communityStore";
import { ICommunity } from "@/models/Community.model";
import { IUser } from "@/models/User.model";

interface LeaderboardUser {
  userId: string;
  username: string;
  totalPoints: number;
  image: string;
}

const leaderboardData = [
  {
    name: "John Adamas",
    points: 200,
    img: "https://i.pravatar.cc/150?u=john",
  },
  {
    name: "Sam Alder",
    points: 1900,
    img: "https://i.pravatar.cc/150?u=sam",
  },
  {
    name: "Olivia Xue",
    points: 1850,
    img: "https://i.pravatar.cc/150?u=olivia",
  },
  {
    name: "Sven Svalbard",
    points: 1700,
    img: "https://i.pravatar.cc/150?u=sven",
  },
  {
    name: "Atul Roshan",
    points: 1700,
    img: "https://i.pravatar.cc/150?u=atul",
  },
];

const rankColors: { [key: number]: string } = {
  1: "bg-yellow-500 text-white",
  2: "bg-gray-400 text-black",
  3: "bg-amber-900 text-white",
};

interface leaderboardDivProps {
  name: string;
  points: number;
  img: string;
  index: number;
}

function LeaderboardCardDiv({ name, points, img, index }: leaderboardDivProps) {
  leaderboardData.sort((a, b) => b.points - a.points);
  return (
    <div
      className={`${
        rankColors[index] || "hover:bg-slate-100"
      } flex items-center p-2 rounded-lg transition-colors ease-in-out duration-200 my-2 hover:scale-105 transition-transform`}
    >
      <h1 className="p-2 mr-4 font-semibold text-lg">{index}</h1>
      <div className="flex items-center justify-center">
        <Avatar className="w-10 h-10 flex items-center">
          <AvatarImage src={img} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="p-1 ml-2 font-semibold">{name}</div>
      <div className="ml-auto p-2 flex">
        <div className="mr-8">
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 font-base text-sm"
          >
            -
          </Badge>
        </div>
        <div className="flex items-center justify-center font-bold text-right">
          {points}
        </div>
      </div>
    </div>
  );
}

function LeaderboardCard() {
  const { communityData } = useCommunityStore();
  const { isLoading, isError, data, error } = useLeaderboard(
    communityData?._id as string
  );
  if (isError) {
    console.log("err ", error);
  }
  if (data) {
    console.log("Mid moments", data.data);
  }
  console.log("monke ", communityData);
  if (isLoading) {
    return <LeaderboardSkeleton />;
  }
  if (isError) {
    return (
      <Card className="w-[500px] h-[400px]">
        <CardHeader>Error!</CardHeader>
        <CardDescription>{error.message}</CardDescription>
      </Card>
    );
  }
  if (data) {
    const leaderboardArray: LeaderboardUser[] = data.data;
    return (
      <Card className="w-[500px] h-[400px]">
        <div className="">
          <CardHeader>
            <CardTitle className="text-2xl">Leaderboard</CardTitle>
            <CardDescription className="font-normal text-muted-foreground text-sm">
              Rise to the top and compete to be the best
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="overflow-y-auto h-64">
          <div>
            {leaderboardArray.map((user: LeaderboardUser, index: number) => {
              return (
                <LeaderboardCardDiv
                  key={user.userId}
                  index={index + 1}
                  name={user.username}
                  points={user.totalPoints}
                  img={user.image}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function Leaderboard() {
  return <LeaderboardCard />;
}
