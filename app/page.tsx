"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">
          {/* Center the text and button */}
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">
            Hey there, let&apos;s get to work.
          </h1>
          <Link href="/communities" passHref>
            <Button
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
            >
              Browse Communities
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
