"use client";
import { ICommunity } from "@/models/Community.model";
import { useQuery } from "@tanstack/react-query";

const fetchModules = async () => {
  const res = await fetch("/api/modules");
  if (!res.ok) {
    throw new Error("Failed to fetch modules");
  }
  return res.json();
};

export const useModules = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: () => fetchModules(),
  });
};
