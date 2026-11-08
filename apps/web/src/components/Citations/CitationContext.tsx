import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box } from "theme-ui";

interface CitationContextValue {
  activeRefId: string | null;
  highlightReference: (refId: string) => void;
  clearHighlight: () => void;
}

const CitationContext = createContext<CitationContextValue>({
  activeRefId: null,
  highlightReference: () => {},
  clearHighlight: () => {},
});

export const useCitation = () => useContext(CitationContext);

export interface CitationProviderProps {
  children: React.ReactNode;
}

export function CitationProvider({ children }: CitationProviderProps) {
  const [activeRefId, setActiveRefId] = useState<string | null>(null);
  const targetYRef = useRef<number | null>(null);
  const hasArrivedRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHighlight = useCallback(() => {
    setActiveRefId(null);
    targetYRef.current = null;
    hasArrivedRef.current = false;

    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const markArrived = useCallback(() => {
    if (hasArrivedRef.current) return;
    hasArrivedRef.current = true;
    if (typeof window !== "undefined") {
      targetYRef.current = window.scrollY;
    }
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    // While traveling towards the reference:
    if (!hasArrivedRef.current) {
      // Check if we arrived close to target
      if (
        targetYRef.current !== null &&
        Math.abs(window.scrollY - targetYRef.current) <= 20
      ) {
        markArrived();
        return;
      }

      // Reset debounce: when scrolling ceases for 180ms, the scroll has arrived
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
      settleTimerRef.current = setTimeout(markArrived, 180);
      return;
    }

    // Once arrived, check if the user has scrolled away from the target reference
    if (targetYRef.current !== null) {
      const delta = Math.abs(window.scrollY - targetYRef.current);
      if (delta > 35) {
        clearHighlight();
      }
    }
  }, [clearHighlight, markArrived]);

  // Manage window listeners when an active reference is highlighted
  useEffect(() => {
    if (!activeRefId) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", markArrived, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", markArrived);
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [activeRefId, handleScroll, markArrived]);

  const highlightReference = useCallback(
    (rawId: string) => {
      if (!rawId) return;
      const cleanId = rawId.replace(/^#/, "").replace(/^ref-/, "");

      // Clear any prior timer and set active reference
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      hasArrivedRef.current = false;
      setActiveRefId(cleanId);

      if (typeof window === "undefined" || typeof document === "undefined") {
        return;
      }

      const targetElement =
        document.getElementById(`ref-${cleanId}`) ||
        document.getElementById(cleanId);

      if (!targetElement) return;

      const navbar =
        document.querySelector("header") ||
        document.querySelector("nav") ||
        document.querySelector(".navbar");
      const navbarHeight = navbar?.getBoundingClientRect().height || 80;
      const targetRect = targetElement.getBoundingClientRect();
      const rawTargetTop = targetRect.top + window.scrollY - navbarHeight - 24;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const finalScrollY = Math.min(maxScroll, Math.max(0, rawTargetTop));

      targetYRef.current = finalScrollY;

      const currentY = window.scrollY;
      const distance = Math.abs(currentY - finalScrollY);

      if (distance < 20) {
        // Already at destination
        hasArrivedRef.current = true;
        targetYRef.current = currentY;
      } else {
        // Perform smooth scroll to target
        window.scrollTo({
          top: finalScrollY,
          behavior: "smooth",
        });

        // Set initial settling debounce timer in case scroll events don't fire
        settleTimerRef.current = setTimeout(markArrived, 300);
      }
    },
    [markArrived],
  );

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (target) {
      const href = target.getAttribute("href");
      if (href?.startsWith("#ref-") || href?.startsWith("#reference-")) {
        e.preventDefault();
        const refId = href.replace(/^#(ref-|reference-)/, "");
        highlightReference(refId);
      }
    }
  };

  return (
    <CitationContext.Provider
      value={{ activeRefId, highlightReference, clearHighlight }}
    >
      <Box onClick={handleContainerClick}>{children}</Box>
    </CitationContext.Provider>
  );
}

export default CitationProvider;
