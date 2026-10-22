import React from "react";
import SmoothScrollProvider from "@/components/site/SmoothScrollProvider";
import CustomCursor from "@/components/site/CustomCursor";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      {/* Trailing dual-ring custom cursor */}
      <CustomCursor />

      {/* Persistent chrome header */}
      <Navbar />

      {/* Main content */}
      <main className="relative flex flex-1 flex-col bg-black w-full max-w-full overflow-x-clip">
        {children}
      </main>

      {/* Persistent chrome footer */}
      <Footer />
    </SmoothScrollProvider>
  );
}
