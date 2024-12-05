"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Image Section with Gradient Fade */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto scale-x-[-1]">
          <Image
            src="https://images.ctfassets.net/7ajcefednbt4/fFUIUeknqmGAsckVCG6HJ/80992143037fca194d9206b925c91f1b/MB.jpg"
            alt="Leven Community"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white"></div>
        </div>

        {/* Content Section */}
        <div className="w-1/2 flex items-center justify-center flex-grow">
          <div className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-0">
              Leven
            </h1>
            <h2 className="text-muted-foreground p-2">Get better, together</h2>
            <Link href="/communities" passHref>
              <Button
                variant="expandIcon"
                Icon={ArrowRightIcon}
                iconPlacement="right"
              >
                Browse Basecamps
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
