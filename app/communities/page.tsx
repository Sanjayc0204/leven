import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon } from "@heroicons/react/24/outline";
export default function Communities() {
  return (
    <h1 className="flex h-screen items-center justify-center">
      <Card className=" scale-70 h-[250px] hover:shadow-xl hover:scale-75 transition-transform duration-300 ease-in-out cursor-pointer">
        <CardHeader className="flex flex-row flex-grow items-center">
          <Avatar className="mr-3 h-16 w-16">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="h-16 w-16"
            />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <div className="mt-0 ml-2">
            <CardTitle className="text-lg ">Community Name</CardTitle>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <UsersIcon className="h-4 w-4" />
              <span>1234 members</span>
            </div>
          </div>
        </CardHeader>
        <CardDescription className="px-6">
          Lorem Ipsum Dolor Sit Amet
        </CardDescription>
      </Card>
    </h1>
  );
}
