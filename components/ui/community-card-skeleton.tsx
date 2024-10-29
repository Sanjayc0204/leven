import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "./skeleton";

export default function CommunityCardSkeleton() {
  return (
    <div>
      {/* Increased card height to accommodate longer titles and more description space */}
      <Card className="transition-col group scale-70 h-[310px] max-h-[350px] max-w-[275px] w-[275px] shadow-md">
        <CardHeader className="flex flex-row items-start space-x-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            {/* Title wraps correctly for long text */}
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center text-base text-muted-foreground mt-1 group-hover:text-slate-200">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-12 ml-2" />
            </div>
          </div>
        </CardHeader>
        <div className="px-6 pb-6">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6 mt-2" />
        </div>
      </Card>
    </div>
  );
}
