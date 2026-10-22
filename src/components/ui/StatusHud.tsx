"use client";

import React, { useEffect, useState } from "react";

interface StatusHudProps {
  location?: string;
  timezone?: string;
  statusWords?: string[];
}

export default function StatusHud({
  location = "REDDIX LABS",
  timezone = "GMT+5:30",
  statusWords = ["SLAM MAPPING", "AUTONOMOUS", "SYSTEM NOMINAL"],
}: StatusHudProps) {
  const [timeStr, setTimeStr] = useState<string>("--:--:--");
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(" ")[0]);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusWords.length);
    }, 4000);
    return () => {
      clearInterval(clockInterval);
      clearInterval(statusInterval);
    };
  }, [statusWords.length]);

  return (
    <div
      className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] leading-tight select-none"
    >
      {/* Time — white, tabular nums */}
      <span className="tabular-nums font-bold text-white tracking-wider">{timeStr}</span>

      {/* Separator */}
      <span className="text-zinc-600 font-normal">|</span>

      {/* Location */}
      <span className="text-zinc-400 font-medium">{location}</span>

      {/* Timezone (hidden on small mobile) */}
      <span className="hidden md:inline text-zinc-500">({timezone})</span>

      {/* Separator */}
      <span className="text-zinc-600 font-normal">|</span>

      {/* Status indicator with pulsing green dot */}
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
          style={{ boxShadow: "0 0 8px #10b981" }}
        />
        <span className="font-semibold text-emerald-400 whitespace-nowrap tracking-wider">
          {statusWords[statusIndex]}
        </span>
      </span>
    </div>
  );
}
