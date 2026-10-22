import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-4 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950 border border-sky-800 text-sky-400">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              REDDIX CMS ADMIN
            </span>
            <span className="block text-[10px] font-mono text-zinc-500">
              Direct Firestore / Content Sync
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          View Live Site
        </Link>
      </header>

      {/* Admin Content Area (Native Scrolling & Cursor) */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
