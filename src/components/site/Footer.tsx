"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-zinc-900 bg-black px-4 py-16 sm:px-12 w-full max-w-full overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 sm:flex-row w-full">
        <div className="text-center sm:text-left">
          <span className="font-sans text-xl font-black uppercase tracking-tight text-white">
            REDDIX ROBOTICS
          </span>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-full break-words">
            Autonomous Mobile Robotics & Embedded Systems
          </p>
        </div>

        {/* Social / Contact Icons (44px touch targets) */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:contact@reddixrobotics.com"
            aria-label="Email"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
          </a>
          <button
            type="button"
            suppressHydrationWarning
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-5xl border-t border-zinc-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-600 gap-4 text-center sm:text-left">
        <span className="max-w-full break-words">© {new Date().getFullYear()} REDDIX ROBOTICS. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-zinc-400 transition-colors">
            CMS Portal
          </Link>
          <span>Next.js 16 • R3F • GSAP</span>
        </div>
      </div>
    </footer>
  );
}
