import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LeaderboardCardDivSkeleton() {
  return (
    <div className="flex items-center p-2 rounded-lg my-2">
      <Skeleton className="h-8 w-8 mr-4" />
      <div className="flex items-center justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 ml-2" />
      <div className="ml-auto p-2 flex items-center">
        <Skeleton className="h-6 w-16 mr-8" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
}

function LeaderboardCardSkeleton() {
  return (
    <Card className="w-[500px] h-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">
          <Skeleton className="h-8 w-32" />
        </CardTitle>
        <CardDescription className="font-normal text-muted-foreground text-sm">
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto h-64">
        <div>
          {[...Array(5)].map((_, index) => (
            <LeaderboardCardDivSkeleton key={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LeaderboardSkeleton() {
  return <LeaderboardCardSkeleton />;
}
