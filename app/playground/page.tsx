"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  maxStreak?: number;
}

export default function Component(
  { streak, maxStreak = 30 }: StreakBadgeProps = { streak: 5 }
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getGradient = (streak: number, max: number) => {
    const percentage = Math.min((streak / max) * 100, 100);
    return `linear-gradient(135deg, #ff4e50 0%, #f9d423 ${percentage}%, #f9d423 100%)`;
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-semibold transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-4"
      }`}
      style={{
        background: getGradient(streak, maxStreak),
        boxShadow: "0 4px 6px rgba(255, 78, 80, 0.25)",
      }}
      role="status"
      aria-live="polite"
    >
      <Flame className="h-5 w-5 animate-pulse text-white" />
      <span className="text-white">{streak} Day Streak</span>
    </div>
  );
}
