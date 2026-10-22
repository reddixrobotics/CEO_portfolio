import { Metadata } from "next";
import StartupJourneySection from "@/components/sections/StartupJourneySection";

export const metadata: Metadata = {
  title: "Startup Journey — Reddix Robotics",
  description:
    "Building Reddix Robotics step by step. From early academic autonomy research to scaling intelligent autonomous mobile robot fleets for real-world industries.",
};

export default function JourneyPage() {
  return <StartupJourneySection standalone={true} />;
}
