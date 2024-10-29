import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityCardLargeSkeleton() {
  return (
    <Card className="w-[280px] h-[195px] overflow-hidden">
      <div className="relative h-24 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex items-center mt-4">
          <Skeleton className="h-3 w-3 rounded-full mr-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
