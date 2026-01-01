"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const TrackerInitializer: React.FC = () => {
  const pathname = usePathname();

  // Ensure tracker_anon_id exists even if CDN tracker is blocked
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getLocalAnonId = () => {
      try {
        return localStorage.getItem("tracker_anon_id");
      } catch {
        return null;
      }
    };

    const setLocalAnonId = (id: string) => {
      if (!id) return;
      // Avoid race: do not overwrite if already present
      if (getLocalAnonId()) return;
      try {
        localStorage.setItem("tracker_anon_id", id);
      } catch {}
    };

    const trySyncFromTracker = (): string | null => {
      const w = window as unknown as {
        tracker?: { getSessionId: () => string | null };
      };
      if (w.tracker && typeof w.tracker.getSessionId === "function") {
        const id = w.tracker.getSessionId();
        if (id && !getLocalAnonId()) setLocalAnonId(id);
        return id ?? null;
      }
      return null;
    };

    const createViaApi = async (): Promise<string | null> => {
      try {
        const res = await fetch("/api/tracker/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const data = (await res.json()) as { anon_id?: string };
          return data.anon_id ?? null;
        }
      } catch {}
      return null;
    };

    const generateFallback = () => {
      return `tracker_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    };

    const ensureAnonId = async () => {
      if (getLocalAnonId()) return; // already set

      // slight delay to allow CDN tracker to initialize
      await new Promise((r) => setTimeout(r, 60));
      if (getLocalAnonId()) return;

      // 1) Try window.tracker first if available
      const fromTracker = trySyncFromTracker();
      if (fromTracker || getLocalAnonId()) return;

      // 2) Wait briefly for tracker-ready event, then fallback to API/local
      let resolved = false;
      const onReady = async () => {
        if (resolved) return;
        resolved = true;
        const id = trySyncFromTracker();
        if (!id && !getLocalAnonId()) {
          const apiId = await createViaApi();
          if (apiId) setLocalAnonId(apiId);
          else if (!getLocalAnonId()) setLocalAnonId(generateFallback());
        }
        window.removeEventListener(
          "salescentri:tracker-ready",
          onReady as EventListener
        );
      };

      window.addEventListener(
        "salescentri:tracker-ready",
        onReady as EventListener,
        { once: true }
      );

      // Safety timeout if event never fires (e.g., ad blocker)
      setTimeout(onReady, 500);
    };

    void ensureAnonId();
  }, []);

  // Bridge SPA route changes to the external tracker
  useEffect(() => {
    const triggerPageView = () => {
      if (typeof window === "undefined") return;
      const w = window as unknown as {
        salescentriTrackerReady?: boolean;
        tracker?: { trackPageView: (url?: string, title?: string) => void };
      };
      if (
        w.salescentriTrackerReady &&
        w.tracker &&
        typeof w.tracker.trackPageView === "function"
      ) {
        w.tracker.trackPageView();
        return;
      }
      let done = false;
      const onReady = () => {
        if (done) return;
        done = true;
        if (w.tracker && typeof w.tracker.trackPageView === "function") {
          w.tracker.trackPageView();
        }
        window.removeEventListener(
          "salescentri:tracker-ready",
          onReady as EventListener
        );
      };
      window.addEventListener(
        "salescentri:tracker-ready",
        onReady as EventListener,
        { once: true }
      );
      setTimeout(onReady, 200);
    };

    triggerPageView();
  }, [pathname]);

  return null;
};
