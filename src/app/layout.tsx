import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reddix Robotics — Autonomous Mobile Robotics Portfolio",
  description:
    "Engineering robust intelligence in physical space. Autonomous Mobile Robots (AMRs), SLAM navigation, ROS 2 pipelines, and custom embedded motor controllers.",
  keywords: ["Robotics", "AMR", "Autonomous Mobile Robot", "ROS 2", "SLAM", "Embedded", "LiDAR", "Three.js"],
  authors: [{ name: "Reddix Robotics" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-black text-white antialiased overflow-x-clip w-full max-w-full">
      <body className="min-h-screen bg-black text-[#f5f5f5] selection:bg-[#ff3344] selection:text-white m-0 p-0 overflow-x-clip w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
