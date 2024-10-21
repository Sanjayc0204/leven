import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import { H1 } from "@/components/ui/Typography";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        {" "}
        {/* Center the text and button */}
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">
          Hey there, let&apos;s get to work.
        </h1>{" "}
        {/* Added margin for spacing */}
        <Button
          variant="expandIcon"
          Icon={ArrowRightIcon}
          iconPlacement="right"
        >
          {" "}
          <Link href="/communities">Browse Communities</Link>
        </Button>
      </div>
    </div>
  );
}
