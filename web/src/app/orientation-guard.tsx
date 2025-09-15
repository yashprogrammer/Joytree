"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function isLandscape(): boolean {
  if (typeof window === "undefined") return true;
  // Fallback: compare dimensions
  return window.matchMedia?.("(orientation: landscape)")?.matches ?? window.innerWidth >= window.innerHeight;
}

export default function OrientationGuard() {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(false);
  const eventName = "joytree:orientation-overlay";

  // Guard is active only on video and gifts pages
  const guardActive = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/c/") && (pathname.includes("/video") || pathname.includes("/gifts"))) return true;
    return false;
  }, [pathname]);

  useEffect(() => {
    if (!guardActive) {
      setShowOverlay(false);
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(new CustomEvent(eventName, { detail: { visible: false } }));
        } catch {}
      }
      return;
    }

    // Best-effort orientation lock (only works on supported browsers and often requires a user gesture)
    try {
      const scr = screen as unknown as { orientation?: { lock?: (o: "landscape" | "portrait") => Promise<void> } };
      if (scr?.orientation?.lock) {
        scr.orientation.lock("landscape").catch(() => {});
      }
    } catch {}

    const update = () => {
      const next = !isLandscape();
      setShowOverlay((prev) => {
        if (prev !== next) {
          try {
            window.dispatchEvent(new CustomEvent(eventName, { detail: { visible: next } }));
          } catch {}
        }
        return next;
      });
    };
    update();
    const mm = typeof window !== "undefined" ? window.matchMedia?.("(orientation: portrait)") : null;
    mm?.addEventListener?.("change", update);
    window.addEventListener("resize", update);
    return () => {
      mm?.removeEventListener?.("change", update);
      window.removeEventListener("resize", update);
    };
  }, [guardActive]);

  if (!guardActive || !showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--surface-light)] text-[var(--foreground)] flex items-center justify-center p-6 text-center">
      <div className="max-w-md grid gap-3 bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-medium">Please rotate your device</h1>
        <p className="text-sm muted">This step is best experienced in landscape. Rotate your phone to continue.</p>
      </div>
    </div>
  );
}


