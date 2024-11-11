"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import RecentActivity from "@/components/ui/recent-activity";

interface StreakBadgeProps {
  streak: number;
  maxStreak?: number;
}

export default function Component() {
  return <RecentActivity />;
}
