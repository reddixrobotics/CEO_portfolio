import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isRegistered = false;

export function registerGSAP() {
  if (typeof window !== "undefined" && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
}

/**
 * Cycle-proof GSAP context wrapper.
 * Prevents recursive context overflows during rapid client-side route transitions.
 */
export function createSafeGSAPContext(
  callback: (context: gsap.Context) => void,
  scope?: Element | React.RefObject<Element | null> | null
) {
  registerGSAP();

  const elementScope = scope && "current" in scope ? scope.current ?? undefined : scope ?? undefined;

  const ctx = gsap.context((self) => {
    try {
      callback(self);
    } catch (err) {
      console.warn("[GSAP Context Error]", err);
    }
  }, elementScope);

  const safeRevert = () => {
    try {
      if (ctx && typeof ctx.revert === "function") {
        ctx.revert();
      }
    } catch (e) {
      // Guard against cyclical reference traps in malformed component graphs
      console.warn("[GSAP Teardown Cycle Guard]", e);
    }
  };

  return {
    ctx,
    revert: safeRevert,
  };
}

export { gsap, ScrollTrigger };
