import { Metadata } from "next";
import VisionImpactSection from "@/components/sections/VisionImpactSection";

export const metadata: Metadata = {
  title: "Vision & Impact — Reddix Robotics",
  description:
    "Building a smarter, safer tomorrow. Intelligent robots, real-world impact, and a sustainable future through accessible autonomous robotics.",
};

export default function VisionPage() {
  return <VisionImpactSection standalone={true} />;
}
