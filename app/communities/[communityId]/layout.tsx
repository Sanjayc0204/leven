"use client";
import { useSession } from "next-auth/react";

export default function Layout({
  user,
  nonuser,
}: {
  user: React.ReactNode;
  nonuser: React.ReactNode;
}) {
  const { status } = useSession();
  if (status === "loading") return null;
  return <>{status === "authenticated" ? user : nonuser}</>;
}
