"use client";

import React, { useEffect, useState, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface TextScrambleProps {
  text: string;
  trigger?: boolean;
  triggerOnHover?: boolean;
  className?: string;
  speed?: number;
}

const GLYPHS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_#/-=<>*+[]{}";

export default function TextScramble({
  text,
  trigger = true,
  triggerOnHover = true,
  className = "",
  speed = 30,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const animatingRef = useRef(false);

  const scramble = () => {
    if (prefersReducedMotion()) {
      setDisplayText(text);
      return;
    }

    if (animatingRef.current) return;
    animatingRef.current = true;

    let frame = 0;
    const totalFrames = text.length * 3;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockedCharsCount = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < lockedCharsCount) {
          result += text[i];
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(result);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
        animatingRef.current = false;
      }
    }, speed);
  };

  useEffect(() => {
    if (trigger) {
      scramble();
    }
  }, [text, trigger]);

  return (
    <span
      className={`inline-block font-mono ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover) scramble();
      }}
      aria-label={text}
    >
      <span aria-hidden="true">{displayText}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
