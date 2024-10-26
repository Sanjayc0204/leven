"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          {/* Center the text and button */}
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-0">
            Condyte
          </h1>
          <h2 className="text-muted-foreground p-1">Get better, together</h2>
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
    </div>
  );
}
