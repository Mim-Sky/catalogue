'use client';

import { createContext, useContext, useEffect, useState } from "react";

export const ReducedMotionContext = createContext(false);

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const updateMotionPreference = () => {
      setIsReducedMotion(
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    updateMotionPreference();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  return (
    <ReducedMotionContext.Provider value={isReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export const useReducedMotion = () => useContext(ReducedMotionContext);
