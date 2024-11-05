"use client";
import { usePathStore } from "@/app/store/pathStore";
import { X } from "lucide-react";
import Link from "next/link";

export default function ExitSettings() {
  const prevPath = usePathStore((state) => state.pathData) || "/";
  console.log("Prev path", prevPath);
  return (
    <div className="flex justify-left items-left">
      <Link href={prevPath}>
        <X />
      </Link>
    </div>
  );
}
