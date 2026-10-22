"use client";

import React from "react";
import { AchievementItem } from "@/lib/content/types";
import { Award, Trophy } from "lucide-react";

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <section id="achievements" className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-12 bg-black border-t border-zinc-900 overflow-hidden w-full">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">
          / HONORS & MILESTONES
        </p>
        <h2 className="mt-2 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white break-words">
          KEY ACHIEVEMENTS
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 min-w-0 w-full"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-950/50 border border-sky-800/40 text-sky-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{item.date}</span>
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-zinc-500 uppercase tracking-wider">
                  {item.issuer}
                </p>

                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.metric && (
                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-sky-400">
                  <span className="text-zinc-500">METRIC:</span>
                  <span className="font-semibold">{item.metric}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
