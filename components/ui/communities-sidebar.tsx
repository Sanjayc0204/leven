import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export default function CommunitySidebar() {
  return (
    <div className="relative h-screen w-16 bg-slate-300 p-2 pt-3">
      <button className="group relative">
        <Avatar className="h-12 w-12 transition-all group-hover:rounded-2xl https://github.com/shadcn.png duration-200 ease-in-out">
          <AvatarImage src="https://github.com/shadcn.png" alt="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100" />
      </button>
    </div>
  );
}
