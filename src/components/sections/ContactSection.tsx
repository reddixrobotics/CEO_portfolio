"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// Social Icons as precision futuristic SVGs
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XTwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection({ standalone = true }: { standalone?: boolean }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      const mailtoLink = `mailto:dhupam.saisatwika@gmail.com?subject=${encodeURIComponent(
        form.subject
      )}&body=${encodeURIComponent(
        `From: ${form.name} (${form.email})\n\n${form.message}`
      )}`;

      window.location.href = mailtoLink;
    }, 700);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-[#020406] text-white selection:bg-cyan-500 selection:text-black pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      {/* ─── Ambient Sci-Fi Background Elements ─── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ contain: "paint" }}>
        {/* Soft radial cyan lighting */}
        <div
          className="absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[130px]"
          style={{ background: "radial-gradient(circle, #00D9FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-10 h-[600px] w-[600px] rounded-full opacity-15 blur-[150px]"
          style={{ background: "radial-gradient(circle, #0088FF 0%, transparent 70%)" }}
        />

        {/* Perspective floor grid lines */}
        <div
          className="absolute inset-x-0 bottom-0 h-72 sm:h-80 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 217, 255, 0.18) 1px, transparent 1px),
              linear-gradient(to top, rgba(0, 217, 255, 0.18) 1px, transparent 1px)
            `,
            backgroundSize: "60px 40px",
            transform: "perspective(600px) rotateX(60deg) translateY(70px)",
            transformOrigin: "bottom center",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 80%)",
          }}
        />

        {/* Top-right subtle silhouette of drone with pulsing red LED indicator */}
        <div className="absolute top-20 right-8 sm:right-14 hidden lg:block opacity-60">
          <div className="relative h-14 w-32">
            <div className="absolute right-8 top-3 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ff0033] animate-pulse" />
          </div>
        </div>
      </div>

      {/* ─── 3D Robotic Hand Layer (Carefully anchored between columns) ─── */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:flex items-center justify-center overflow-hidden">
        <div className="relative h-full w-full max-w-[1550px]">
          {/* Main 3D Robotic Hand positioned in the center gap reaching toward the form */}
          <div
            className="absolute left-[45%] xl:left-[43%] top-[56%] -translate-x-1/2 -translate-y-1/2 w-[640px] md:w-[700px] lg:w-[820px] xl:w-[960px] opacity-85 mix-blend-screen"
            style={{
              maskImage:
                "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 95%)",
              animation: "floatHand 8s ease-in-out infinite",
            }}
          >
            <Image
              src="/images/contact/robotic-hand-hero.jpg"
              alt="Futuristic 3D Robotic Hand Reaching Toward Contact Form"
              width={1376}
              height={768}
              priority
              className="h-auto w-full object-contain filter drop-shadow-[0_0_30px_rgba(0,217,255,0.20)]"
            />
          </div>

          {/* Faint concentric holographic orbital rings matching reference */}
          <div
            className="absolute left-[45%] xl:left-[43%] top-[48%] h-[260px] w-[260px] md:h-[300px] md:w-[300px] xl:h-[340px] xl:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 opacity-55 pointer-events-none"
            style={{
              boxShadow: "0 0 50px rgba(0, 217, 255, 0.08)",
            }}
          >
            <div className="absolute inset-5 rounded-full border border-dashed border-cyan-400/25 animate-[spin_80s_linear_infinite]" />
            <div className="absolute inset-14 rounded-full border border-cyan-400/15" />
          </div>

          {/* Curved red telemetry arc line matching reference */}
          <svg
            className="absolute left-[42%] xl:left-[40%] top-[28%] h-[260px] w-[220px] opacity-75 pointer-events-none"
            viewBox="0 0 220 260"
            fill="none"
          >
            <path
              d="M 15 240 Q 140 160 190 20"
              stroke="#ff3344"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
            <circle cx="190" cy="20" r="2.5" fill="#ff3344" />
          </svg>
        </div>
      </div>

      {/* ─── Main Content Container (Two-Column Layout) ─── */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="grid grid-cols-1 items-start md:items-center gap-10 md:grid-cols-12 md:gap-6 xl:gap-12 w-full">
          {/* ════════ LEFT COLUMN: CONTACT INTRODUCTION ════════ */}
          <div className="flex flex-col justify-center md:col-span-5 xl:col-span-5 relative z-20 w-full min-w-0 max-w-lg md:max-w-none">
            {/* Small cyan label */}
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#00D9FF]">
                // CONTACT
              </span>
            </div>

            {/* Large Bold Heading */}
            <h1 className="mt-3 text-2xl sm:text-4xl lg:text-[38px] xl:text-[44px] font-black uppercase tracking-tight text-white leading-[1.12] break-words">
              LET’S BUILD <br />
              <span
                className="text-[#00D9FF]"
                style={{
                  textShadow:
                    "0 0 25px rgba(0, 217, 255, 0.6), 0 0 50px rgba(0, 217, 255, 0.3)",
                }}
              >
                THE FUTURE TOGETHER
              </span>
            </h1>

            {/* Short Description */}
            <p className="mt-3.5 max-w-full text-sm sm:text-[15px] leading-relaxed text-[#94A3B8] break-words">
              Have a project in mind, a collaboration opportunity, or just want to say hello? I’d
              love to hear from you.
            </p>

            {/* Vertically Stacked Contact Details */}
            <div className="mt-6 sm:mt-7 space-y-3.5 sm:space-y-4">
              {/* 1. EMAIL */}
              <div className="group flex items-center gap-3.5 sm:gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-black/80 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)]">
                  <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D9FF]">
                    EMAIL
                  </span>
                  <a
                    href="mailto:dhupam.saisatwika@gmail.com"
                    className="text-xs sm:text-sm font-semibold text-white transition-colors hover:text-[#00D9FF] break-all sm:break-normal"
                  >
                    dhupam.saisatwika@gmail.com
                  </a>
                  <span className="text-[10px] sm:text-[11px] font-medium text-cyan-400/70">
                    Usually responds within 24 hours
                  </span>
                </div>
              </div>

              {/* 2. PHONE */}
              <div className="group flex items-center gap-3.5 sm:gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-black/80 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)]">
                  <Phone className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D9FF]">
                    PHONE
                  </span>
                  <a
                    href="tel:+917036780248"
                    className="text-xs sm:text-sm font-semibold text-white transition-colors hover:text-[#00D9FF]"
                  >
                    +91 70367 80248
                  </a>
                  <span className="text-[10px] sm:text-[11px] font-medium text-cyan-400/70">
                    Mon - Fri, 9 AM - 6 PM (IST)
                  </span>
                </div>
              </div>

              {/* 3. LOCATION */}
              <div className="group flex items-center gap-3.5 sm:gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-black/80 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)]">
                  <MapPin className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D9FF]">
                    LOCATION
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">Hyderabad, India</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-cyan-400/70">
                    Open to remote opportunities
                  </span>
                </div>
              </div>

              {/* 4. LINKEDIN */}
              <div className="group flex items-center gap-3.5 sm:gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-black/80 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)]">
                  <LinkedinIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D9FF]">
                    LINKEDIN
                  </span>
                  <a
                    href="https://linkedin.com/in/dhupam-saisatwika"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-semibold text-white transition-colors hover:text-[#00D9FF] break-all sm:break-normal"
                  >
                    linkedin.com/in/dhupam-saisatwika
                  </a>
                  <span className="text-[10px] sm:text-[11px] font-medium text-cyan-400/70">Let’s connect!</span>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="mt-6 sm:mt-7 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/80 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/dhupam-saisatwika"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/80 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/80 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              >
                <XTwitterIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/80 text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Subtle Tagline */}
            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                INNOVATION THROUGH ROBOTICS &amp; AI
              </span>
            </div>
          </div>

          {/* ════════ MOBILE ROBOTIC VISUAL (Shown on small screens < 768px) ════════ */}
          <div className="relative w-full flex justify-center md:hidden my-2">
            <div
              className="relative w-full max-w-[360px] opacity-80 mix-blend-screen"
              style={{
                maskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 95%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 95%)",
              }}
            >
              <Image
                src="/images/contact/robotic-hand-hero.jpg"
                alt="Robotic Hand Visual"
                width={800}
                height={450}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: FUTURISTIC HUD CONTACT FORM ════════ */}
          <div className="relative flex justify-center md:justify-end md:col-span-7 xl:col-span-7 w-full z-20">
            {/* Chamfered Sci-Fi HUD Container */}
            <div className="relative w-full max-w-[540px] xl:max-w-[580px]">
              {/* Outer Glowing Cyber Chamfered Border Box */}
              <div
                className="relative overflow-hidden rounded-2xl border border-cyan-400/45 bg-[#030812]/90 p-4 sm:p-7 md:p-8 backdrop-blur-xl max-w-full"
                style={{
                  boxShadow:
                    "0 0 35px rgba(0, 217, 255, 0.16), inset 0 0 25px rgba(0, 217, 255, 0.05)",
                  clipPath:
                    "polygon(0 18px, 18px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px))",
                }}
              >
                {/* High-Tech HUD Corner & Edge Accent Markings */}
                <div className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#00D9FF]" />
                <div className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#00D9FF]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#00D9FF]" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#00D9FF]" />

                {/* Form Header */}
                <div className="relative">
                  <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#00D9FF]">
                    // SEND A MESSAGE
                  </span>

                  <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    GET IN{" "}
                    <span
                      className="text-[#00D9FF]"
                      style={{
                        textShadow: "0 0 20px rgba(0, 217, 255, 0.55)",
                      }}
                    >
                      TOUCH
                    </span>
                  </h2>

                  <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                    Drop me a message and I’ll get back to you soon.
                  </p>
                </div>

                {/* Submission Success Alert */}
                {submitted && (
                  <div className="mt-4 rounded-lg border border-cyan-400/60 bg-cyan-950/40 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00D9FF]" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">Transmission Prepared</p>
                        <p className="mt-1 text-xs text-cyan-200">
                          Your message has been formatted for{" "}
                          <span className="font-mono text-[#00D9FF]">
                            dhupam.saisatwika@gmail.com
                          </span>
                          . Opening your mail client...
                        </p>
                        <div className="mt-2.5 flex items-center gap-3">
                          <a
                            href={`mailto:dhupam.saisatwika@gmail.com?subject=${encodeURIComponent(
                              form.subject
                            )}&body=${encodeURIComponent(
                              `From: ${form.name} (${form.email})\n\n${form.message}`
                            )}`}
                            className="inline-flex items-center gap-1.5 rounded bg-[#00D9FF] px-3 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105"
                          >
                            Open Mail Client <ExternalLink className="h-3 w-3" />
                          </a>
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => setSubmitted(false)}
                            className="text-xs text-zinc-400 hover:text-white underline"
                          >
                            Send Another
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} noValidate suppressHydrationWarning className="mt-4 space-y-3.5">
                  {/* Name and Email side by side */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {/* Name Field */}
                    <div>
                      <label className="block font-mono text-[11px] font-semibold tracking-wider text-zinc-300">
                        Name <span className="text-[#00D9FF]">*</span>
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-400/70">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          suppressHydrationWarning
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          placeholder="Your full name"
                          className={`w-full rounded-lg border bg-[#050D18]/90 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none ${
                            errors.name
                              ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                              : "border-cyan-500/30 hover:border-cyan-500/50 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block font-mono text-[11px] font-semibold tracking-wider text-zinc-300">
                        Email <span className="text-[#00D9FF]">*</span>
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-400/70">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          required
                          suppressHydrationWarning
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="your@email.com"
                          className={`w-full rounded-lg border bg-[#050D18]/90 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none ${
                            errors.email
                              ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                              : "border-cyan-500/30 hover:border-cyan-500/50 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Field (Full Width) */}
                  <div>
                    <label className="block font-mono text-[11px] font-semibold tracking-wider text-zinc-300">
                      Subject <span className="text-[#00D9FF]">*</span>
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-400/70">
                        <FileText className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        suppressHydrationWarning
                        value={form.subject}
                        onChange={(e) => {
                          setForm({ ...form, subject: e.target.value });
                          if (errors.subject) setErrors({ ...errors, subject: undefined });
                        }}
                        placeholder="What is this regarding?"
                        className={`w-full rounded-lg border bg-[#050D18]/90 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none ${
                          errors.subject
                            ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            : "border-cyan-500/30 hover:border-cyan-500/50 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                        }`}
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field (Full Width Textarea) */}
                  <div>
                    <label className="block font-mono text-[11px] font-semibold tracking-wider text-zinc-300">
                      Message <span className="text-[#00D9FF]">*</span>
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3.5 text-cyan-400/70">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <textarea
                        required
                        suppressHydrationWarning
                        rows={4}
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="Your message here..."
                        className={`w-full rounded-lg border bg-[#050D18]/90 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none resize-none ${
                          errors.message
                            ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            : "border-cyan-500/30 hover:border-cyan-500/50 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                        }`}
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Bright Electric Cyan Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      suppressHydrationWarning
                      disabled={submitting}
                      className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D9FF] py-3.5 px-6 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-[#38E1FF] hover:shadow-[0_0_30px_rgba(0,217,255,0.55)] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Status Indicator Below the Panel */}
              <div className="mt-3.5 flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D9FF]" />
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  Always open to new ideas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for floating robotic hand */}
      <style jsx global>{`
        @keyframes floatHand {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px) rotate(0.4deg);
          }
        }
      `}</style>
    </section>
  );
}
