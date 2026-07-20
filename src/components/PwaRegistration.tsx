"use client";

import { useEffect } from "react";

/** Registers the offline-fallback service worker. Silently no-ops if unsupported. */
export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a progressive enhancement — ignore registration failures.
    });
  }, []);

  return null;
}
