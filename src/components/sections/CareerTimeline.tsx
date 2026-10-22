"use client";

import React from "react";
import StartupJourneySection from "./StartupJourneySection";
import { CareerItem } from "@/lib/content/types";

interface CareerTimelineProps {
  career?: CareerItem[];
}

export default function CareerTimeline({ career }: CareerTimelineProps) {
  return <StartupJourneySection standalone={false} />;
}
