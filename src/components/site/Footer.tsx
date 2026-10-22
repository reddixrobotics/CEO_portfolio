"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail } from "lucide-react";

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-zinc-900 bg-black px-4 py-16 sm:px-12 w-full max-w-full overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 max-w-3xl bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 sm:flex-row w-full">
        {/* Brand & Logo Section */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left group">
          <Link
            href="/"
            aria-label="Reddix Robotics Home"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative h-12 w-48 sm:h-14 sm:w-56">
              <Image
                src="/images/reddix-logo-dual-hd-2x.png"
                alt="Reddix Robotics Logo"
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-contain object-center sm:object-left drop-shadow-[0_0_10px_rgba(0,229,255,0.2)] group-hover:drop-shadow-[0_0_16px_rgba(0,229,255,0.45)] transition-all duration-300"
                priority
              />
            </div>
          </Link>
          <p className="font-mono text-xs text-zinc-400 mt-2 max-w-full break-words tracking-wide">
            Autonomous Mobile Robotics &amp; Embedded Systems
          </p>
          <span className="font-mono text-[10px] text-zinc-600 mt-0.5 tracking-wider uppercase">
            ESTD 2025 • HYDERABAD, INDIA
          </span>
        </div>

        {/* Social / Contact Icons */}
        <div className="flex items-center gap-3 sm:gap-3.5 text-zinc-400">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/reddixrobotics"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddix Robotics LinkedIn"
            title="LinkedIn"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-950/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.35)]"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/reddixrobotics?igsi=NW43ZWR3eTZnY2J1&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddix Robotics Instagram"
            title="Instagram"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-300 transition-all duration-300 hover:border-pink-500/80 hover:text-pink-400 hover:bg-pink-950/20 hover:shadow-[0_0_15px_rgba(244,63,94,0.35)]"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@reddix_robotics"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddix Robotics YouTube"
            title="YouTube"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-300 transition-all duration-300 hover:border-red-500/80 hover:text-red-400 hover:bg-red-950/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.35)]"
          >
            <YoutubeIcon className="h-4 w-4" />
          </a>

          {/* Email */}
          <a
            href="mailto:reddixrobotics@gmail.com"
            aria-label="Email Reddix Robotics"
            title="Email"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-950/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.35)]"
          >
            <Mail className="h-4 w-4" />
          </a>

          {/* Scroll To Top */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-white hover:bg-cyan-950/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.35)]"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 max-w-5xl border-t border-zinc-900/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-600 gap-4 text-center sm:text-left">
        <span className="max-w-full break-words">© {new Date().getFullYear()} REDDIX ROBOTICS. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-cyan-400 transition-colors">
            CMS Portal
          </Link>
          <span className="text-zinc-600">Next.js 16 • R3F • GSAP</span>
        </div>
      </div>
    </footer>
  );
}
