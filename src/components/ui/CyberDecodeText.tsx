"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface CyberDecodeTextProps {
  text: string;
  trigger?: boolean;
  triggerOnHover?: boolean;
  delay?: number;
  speed?: number;
  className?: string;
  cursorClass?: string;
}

const GLYPHS = "0123456789ABCDEF█▒░▚▞#$%=/\\<>_+-*[]";

export default function CyberDecodeText({
  text,
  trigger = true,
  triggerOnHover = true,
  delay = 0,
  speed = 28,
  className = "",
  cursorClass = "text-cyan-400 drop-shadow-[0_0_8px_#00e5ff]",
}: CyberDecodeTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const isAnimatingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDecode = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplayText(text);
      setActiveIdx(null);
      return;
    }

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const len = text.length;
    let step = 0;
    const totalSteps = Math.max(16, len * 2.2);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const lockedChars = Math.floor(progress * len);

      let result = "";
      for (let i = 0; i < len; i++) {
        if (text[i] === " " || text[i] === "\n") {
          result += text[i];
        } else if (i < lockedChars) {
          result += text[i];
        } else if (i === lockedChars) {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(result);
      setActiveIdx(lockedChars < len ? lockedChars : null);

      if (step >= totalSteps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setActiveIdx(null);
        isAnimatingRef.current = false;
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (trigger) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        startDecode();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, delay, startDecode]);

  return (
    <span
      className={`inline-block font-mono select-none ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover && !isAnimatingRef.current) {
          startDecode();
        }
      }}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline">
        {displayText.split("").map((char, i) => {
          const isCursor = i === activeIdx;
          return (
            <span
              key={i}
              className={isCursor ? cursorClass : undefined}
            >
              {char}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
