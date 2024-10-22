"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import { H1 } from "@/components/ui/Typography";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center">
        <div className="text-center">
          {" "}
          {/* Center the text and button */}
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">
            Hey there, let&apos;s get to work.
          </h1>{" "}
          {/* Added margin for spacing */}
          <Link href="/communities" passHref>
            <Button
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
            >
              {" "}
              Browse Communities
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
  // return (
  //   <div className="flex items-center justify-center">
  //     <h1 className="text-center text-4xl">Test Page</h1>
  //   </div>
  // );
}
