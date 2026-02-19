"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type ArrowDirection = "left" | "right";

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

function PanelWaveArrowButton({
  onClick,
  direction,
  ariaLabel,
}: {
  onClick: () => void;
  direction: ArrowDirection;
  ariaLabel: string;
}) {
  const arrowPath = direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
  const hoverShift =
    direction === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5";

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="group">
      <div className="relative h-14 w-14 rounded-full transition-shadow duration-500 group-hover:shadow-[0_0_35px_#DB5F42]">
        <span className="absolute inset-0 border-2 border-[#DB5F42]/70 wave morph-ring morph-fast transition-transform duration-500 group-hover:scale-[1.36]" />
        <span
          className="absolute inset-[2px] border-2 border-[#DB5F42]/58 wave-alt morph-ring transition-transform duration-500 group-hover:scale-[1.7]"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="absolute inset-[4px] border-2 border-[#E9C9DF]/48 wave morph-ring transition-transform duration-500 group-hover:scale-[2]"
          style={{ animationDelay: "0.45s" }}
        />
        <span
          className="absolute inset-[7px] border-2 border-[#DB5F42]/38 wave-alt morph-ring morph-slow transition-transform duration-500 group-hover:scale-[2.3]"
          style={{ animationDelay: "0.7s" }}
        />
        <span
          className={`absolute inset-0 flex items-center justify-center text-[#F9D9CB] transition-transform duration-500 ${hoverShift}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={arrowPath} />
          </svg>
        </span>
      </div>
    </button>
  );
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
          } snap-y snap-mandatory`}
          id="main-page-scroll"
          style={{ overflowY: "auto" }}
        >
          {children}
        </div>

        {/* RIGHT PAGE */}
        <div
          className={`absolute inset-0 z-20 transition-transform duration-800 ease-[cubic-bezier(0.2,0.0,0.0,1.0)] ${
            activePanel === "right" ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`}
        >
          <div className="relative min-h-screen bg-[rgb(var(--bg))] px-6 text-white">
            <div className="absolute left-[max(var(--gutter-x),var(--safe-x))] top-1/2 z-30 -translate-y-1/2">
              <PanelWaveArrowButton
                onClick={() => setActivePanel("none")}
                direction="left"
                ariaLabel="Return to homepage"
              />
            </div>

            <div className="mx-auto w-full max-w-5xl pb-10 pt-[max(var(--section-y),var(--safe-top))]">
              {panel}
            </div>
          </div>
        </div>

        {/* LEFT PAGE */}
        <div
          className={`absolute inset-0 z-20 transition-transform duration-800 ease-[cubic-bezier(0.2,0.0,0.0,1.0)] ${
            activePanel === "left" ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          <div className="relative min-h-screen bg-[rgb(var(--bg))] px-6 text-white">
            <div className="absolute right-[max(var(--gutter-x),var(--safe-right))] top-1/2 z-30 -translate-y-1/2">
              <PanelWaveArrowButton
                onClick={() => setActivePanel("none")}
                direction="right"
                ariaLabel="Return to homepage"
              />
            </div>

            <div className="mx-auto w-full max-w-5xl pb-10 pt-[max(var(--section-y),var(--safe-top))]">
              {leftPanel}
            </div>
          </div>
        </div>

      </div>
    </SlidePanelContext.Provider>
  );
}
