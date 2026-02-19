"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type SlidePanelControls = {
  openPanel: () => void;
  openLeftPanel: () => void;
  closePanel: () => void;
  activePanel: "none" | "right" | "left";
};

const SlidePanelContext = createContext<SlidePanelControls | null>(null);

export function useSlidePanel() {
  const ctx = useContext(SlidePanelContext);
  if (!ctx) {
    throw new Error("useSlidePanel must be used within <SlidePanelShell />");
  }
  return ctx;
}

export default function SlidePanelShell({
  children,
  panel,
  leftPanel,
}: {
  children: React.ReactNode;
  panel: React.ReactNode;
  leftPanel?: React.ReactNode;
}) {
  const [activePanel, setActivePanel] = useState<"none" | "right" | "left">(
    "none"
  );
  const horizontalScrollAccum = useRef(0);
  const wheelResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePanel("none");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const swipeThreshold = 120;
    const onWheel = (e: WheelEvent) => {
      if (activePanel === "none") return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

      horizontalScrollAccum.current += e.deltaX;

      if (wheelResetTimer.current) {
        window.clearTimeout(wheelResetTimer.current);
      }
      wheelResetTimer.current = window.setTimeout(() => {
        horizontalScrollAccum.current = 0;
      }, 180);

      if (activePanel === "right" && horizontalScrollAccum.current <= -swipeThreshold) {
        setActivePanel("none");
        horizontalScrollAccum.current = 0;
      }
      if (activePanel === "left" && horizontalScrollAccum.current >= swipeThreshold) {
        setActivePanel("none");
        horizontalScrollAccum.current = 0;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (wheelResetTimer.current) {
        window.clearTimeout(wheelResetTimer.current);
      }
    };
  }, [activePanel]);

  const controls = useMemo(
    () => ({
      openPanel: () => setActivePanel("right"),
      openLeftPanel: () => setActivePanel("left"),
      closePanel: () => setActivePanel("none"),
      activePanel,
    }),
    [activePanel]
  );

  return (
    <SlidePanelContext.Provider value={controls}>
      <div className="relative min-h-screen overflow-hidden">

        {/* PAGE 1 */}
        <div
          className={`absolute inset-0 z-10 transition-transform duration-800 ease-[cubic-bezier(0.2,0.0,0.0,1.0)] ${
            activePanel === "right"
              ? "-translate-x-full"
              : activePanel === "left"
                ? "translate-x-full"
                : "translate-x-0"
          }`}
          id="main-page-scroll"
          style={{ overflowY: "auto" }}
        >
          {children}
        </div>

        {/* RIGHT PAGE */}
        <div
          className={`absolute inset-0 z-20 transition-transform duration-800 ease-[cubic-bezier(0.2,0.0,0.0,1.0)] ${
            activePanel === "right" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="min-h-screen bg-[rgb(var(--bg))] px-6 text-white">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-6">
              <div className="text-sm tracking-wide text-white/70">
                
              </div>

              <button
                type="button"
                onClick={() => setActivePanel("none")}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
              >
                ← Back
              </button>
            </div>

            <div className="mx-auto w-full max-w-5xl pb-10">
              {panel}
            </div>
          </div>
        </div>

        {/* LEFT PAGE */}
        <div
          className={`absolute inset-0 z-20 transition-transform duration-800 ease-[cubic-bezier(0.2,0.0,0.0,1.0)] ${
            activePanel === "left" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="min-h-screen bg-[rgb(var(--bg))] px-6 text-white">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-6">
              <button
                type="button"
                onClick={() => setActivePanel("none")}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
              >
                Back →
              </button>
              <div className="text-sm tracking-wide text-white/70" />
            </div>

            <div className="mx-auto w-full max-w-5xl pb-10">
              {leftPanel}
            </div>
          </div>
        </div>

      </div>
    </SlidePanelContext.Provider>
  );
}
