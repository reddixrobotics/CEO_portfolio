"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TextScramble from "@/components/ui/TextScramble";
import { useSmoothScroll } from "@/components/site/SmoothScrollProvider";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("journey");
  const { lenis } = useSmoothScroll();

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) {
      window.location.href = `/#${id}`;
      return;
    }

    if (lenis) {
      lenis.scrollTo(el, {
        offset: -80,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", `/#${id}`);
  };

  useEffect(() => {
    if (pathname === "/contact") {
      setActiveSection("contact");
      return;
    }
    if (pathname === "/admin") {
      setActiveSection("admin");
      return;
    }

    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["journey", "about", "projects", "achievements", "contact"].includes(hash)) {
        setActiveSection(hash);
      }
    }

    const sectionIds = ["about", "projects", "journey", "achievements", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full max-w-full items-center justify-between border-b border-cyan-400/25 bg-black/75 px-4 py-2.5 backdrop-blur-md transition-colors duration-300 sm:px-6 md:px-8 lg:px-10 shadow-[0_1px_12px_rgba(0,229,255,0.08)]">
      {/* ─── Mobile Brand Identity (visible on < sm) Matching Reference ─── */}
      <Link
        href="/"
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="group relative flex items-center gap-1.5 font-mono text-xs font-black uppercase tracking-[0.18em] text-white shrink-0 min-w-0 sm:hidden select-none"
      >
        <span className="relative pb-0.5 text-white">
          REDDIX
          <span className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
        </span>
        <span className="text-cyan-400 font-extrabold">ROBOTICS</span>
      </Link>

      {/* ─── Left nav: JOURNEY + ABOUT (Desktop & Tablet) ─── */}
      <nav className="hidden items-center gap-4 sm:flex md:gap-6 lg:gap-8">
        {/* JOURNEY */}
        <Link
          href="/#journey"
          onClick={(e) => scrollToSection("journey", e)}
          className={`relative font-mono uppercase transition-colors ${
            activeSection === "journey"
              ? "font-semibold text-white"
              : "font-medium text-zinc-400 hover:text-white"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.15em", paddingBottom: "4px" }}
        >
          <TextScramble text="JOURNEY" triggerOnHover={true} />
          {/* Cyan active underline bar */}
          {activeSection === "journey" && (
            <span
              className="absolute bottom-0 left-0 block w-full bg-cyan-400"
              style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
            />
          )}
        </Link>

        {/* ABOUT */}
        <Link
          href="/#about"
          onClick={(e) => scrollToSection("about", e)}
          className={`relative font-mono uppercase transition-colors ${
            activeSection === "about"
              ? "font-semibold text-white"
              : "font-medium text-zinc-400 hover:text-white"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.15em", paddingBottom: "4px" }}
        >
          <TextScramble text="ABOUT" triggerOnHover={true} />
          {/* Cyan active underline bar */}
          {activeSection === "about" && (
            <span
              className="absolute bottom-0 left-0 block w-full bg-cyan-400"
              style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
            />
          )}
        </Link>
      </nav>

      {/* ─── Center: square >> chevron button ─── */}
      <Link
        href="/"
        onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "/");
          }
        }}
        aria-label="Home"
        className="absolute left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div
          className="flex items-center justify-center border border-zinc-700 bg-zinc-950/90 backdrop-blur-sm transition-colors hover:border-zinc-500"
          style={{ width: "2.35rem", height: "2.35rem", borderRadius: "6px" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="text-white"
            style={{ width: "1.15rem", height: "1.15rem" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 7 5 5-5 5" />
            <path d="m13 7 5 5-5 5" />
          </svg>
        </div>
      </Link>

      {/* ─── Right nav: PROJECTS + ACHIEVEMENTS + CONTACT + ADMIN (Tablet & Desktop) ─── */}
      <nav className="hidden items-center gap-3 sm:flex md:gap-5 lg:gap-8">
        {/* PROJECTS */}
        <Link
          href="/#projects"
          onClick={(e) => scrollToSection("projects", e)}
          className={`relative font-mono uppercase transition-colors ${
            activeSection === "projects"
              ? "font-semibold text-white"
              : "font-medium text-zinc-400 hover:text-white"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.15em", paddingBottom: "4px" }}
        >
          <TextScramble text="PROJECTS" triggerOnHover={true} />
          {/* Cyan active underline bar */}
          {activeSection === "projects" && (
            <span
              className="absolute bottom-0 left-0 block w-full bg-cyan-400"
              style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
            />
          )}
        </Link>

        {/* ACHIEVEMENTS */}
        <Link
          href="/#achievements"
          onClick={(e) => scrollToSection("achievements", e)}
          className={`relative hidden md:inline-block font-mono uppercase transition-colors ${
            activeSection === "achievements"
              ? "font-semibold text-white"
              : "font-medium text-zinc-400 hover:text-white"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.15em", paddingBottom: "4px" }}
        >
          <TextScramble text="ACHIEVEMENTS" triggerOnHover={true} />
          {/* Cyan active underline bar */}
          {activeSection === "achievements" && (
            <span
              className="absolute bottom-0 left-0 block w-full bg-cyan-400"
              style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
            />
          )}
        </Link>

        {/* CONTACT */}
        <Link
          href="/#contact"
          onClick={(e) => {
            if (pathname === "/") {
              scrollToSection("contact", e);
            } else {
              setActiveSection("contact");
            }
          }}
          className={`relative font-mono uppercase transition-colors ${
            activeSection === "contact"
              ? "font-semibold text-white"
              : "font-medium text-zinc-400 hover:text-white"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.15em", paddingBottom: "4px" }}
        >
          <TextScramble text="CONTACT" triggerOnHover={true} />
          {/* Cyan active underline bar */}
          {activeSection === "contact" && (
            <span
              className="absolute bottom-0 left-0 block w-full bg-cyan-400"
              style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
            />
          )}
        </Link>
        {/* ADMIN — square-cornered bordered pill */}
        <Link
          href="/admin"
          className="border border-zinc-600 font-mono font-medium uppercase text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            padding: "0.28rem 0.65rem",
            borderRadius: "3px",
          }}
        >
          ADMIN
        </Link>
      </nav>

      {/* ─── Mobile 3-line cyan hamburger button (touch-friendly min-h 44px) ─── */}
      <button
        type="button"
        suppressHydrationWarning
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="ml-auto flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center transition-colors sm:hidden"
      >
        <span className="relative flex flex-col justify-between h-3.5 w-5">
          <span
            className={`block h-[2px] w-5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] transition-all duration-300 origin-center ${
              mobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] transition-all duration-300 origin-center ${
              mobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* ─── Mobile overlay menu ─── */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-black/95 backdrop-blur-2xl transition-all duration-300 sm:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col items-center gap-6">
          {[
            { id: "journey", label: "JOURNEY", href: "/#journey" },
            { id: "about", label: "ABOUT", href: "/#about" },
            { id: "projects", label: "PROJECTS", href: "/#projects" },
            { id: "achievements", label: "ACHIEVEMENTS", href: "/#achievements" },
            { id: "contact", label: "CONTACT", href: "/#contact" },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  setActiveSection(item.id);
                  if (item.href.startsWith("/#") && pathname === "/") {
                    scrollToSection(item.id, e);
                  }
                }}
                className={`relative flex min-h-[44px] items-center text-lg font-bold uppercase tracking-[0.22em] transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 block w-full bg-cyan-400"
                    style={{ height: "2px", boxShadow: "0 0 8px #00e5ff" }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-[44px] items-center font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-white"
          >
            [ADMIN PORTAL]
          </Link>
        </div>
      </div>
    </header>
  );
}
