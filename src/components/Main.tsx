"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/content/siteContent";
import SlidePanelShell, { useSlidePanel } from "@/components/SlidePanelShell";

function SubPage() {
  const { activePanel } = useSlidePanel();
  const showVideo = activePanel === "right";

  return (
    <div className="space-y-6">
      <h2 className="heading-font text-3xl tracking-tight text-center">
        Navigation
      </h2>

      <div className="mx-auto w-full max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black/40">
          {showVideo ? (
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/63ylNd6sqIE"
              title="Navigation video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GeneralSonificationPage() {
  return (
    <div className="space-y-6">
      <h2 className="heading-font text-3xl tracking-tight">
        General Sonification
      </h2>

      <p className="max-w-3xl text-white/75 leading-relaxed">
        Sonification maps data, motion, or interactions into sound so patterns
        can be heard as well as seen. This page can introduce your concept,
        workflow, and example use cases.
      </p>
    </div>
  );
}

type ArrowDirection = "left" | "right" | "down";
type WaveRing = {
  inset: number;
  border: string;
  wave: "wave" | "wave-alt";
  morph: "morph-fast" | "morph-slow" | "";
  delay: string;
  hoverScale: string;
};

type FounderProfile = {
  id: string;
  name: string;
  role: string;
  thumbnailSrc: string;
  portraitSrc: string;
  objectPosition?: string;
  bio: string;
  details: string;
  gallery: string[];
};

const founders: FounderProfile[] = [
  {
    id: "founder-1",
    name: "Dr. Sasan Matinfar",
    role: "Co-Founder, Sonification and Machine Learning",
    thumbnailSrc: "/images/founders/sasan.jpg",
    portraitSrc: "/images/founders/sasan.jpg",
    objectPosition: "center 38%",
    bio: "Dr. Sasan Matinfar is a biomedical engineer and sonic interaction researcher working at the intersection of medical imaging, medical XR, and Sound.",
    details: "",
    gallery: [
      "/images/founders/sasan-award.jpg",
      "/images/founders/sasan-son-award.jpg",
    ],
  },
  {
    id: "founder-2",
    name: "Navid Navab",
    role: "Co-Founder, ArtScientist",
    thumbnailSrc: "/images/founders/navid.png",
    portraitSrc: "/images/founders/navid.png",
    objectPosition: "center 26%",
    bio: "Navid Navab is ArtScientist and composer who brings over decade experience of interdisciplinary research and production.",
    details: "",
    gallery: ["/images/founders/navid-award.jpg", "/images/founders/navid-nica.jpg"],
  },
  {
    id: "founder-3",
    name: "Veronica Ruozzi",
    role: "Co-Founder, Biomechanical Modeling",
    thumbnailSrc: "/images/founders/veronica.jpg",
    portraitSrc: "/images/founders/veronica.jpg",
    objectPosition: "center 40%",
    bio: "Veronica Ruozzi — biomedical engineer focused on biomechanical modeling and advanced medical XR applications.",
    details: "",
    gallery: [],
  },
  {
    id: "founder-4",
    name: "Prof. Dr. Nassir Navab",
    role: "Co-Founder, Scientific Advisory and Research Direction",
    thumbnailSrc: "/images/founders/nassir.jpg",
    portraitSrc: "/images/founders/nassir.jpg",
    objectPosition: "center",
    bio: "Prof. Nassir Navab, TUM, with decades of pioneering work in biomedical engineering, surgical data science, medical XR, and medical robotics.",
    details: "",
    gallery: [],
  },
];

function WaveArrowButton({
  onClick,
  ariaLabel,
  direction,
  className,
  large = false,
}: {
  onClick: () => void;
  ariaLabel: string;
  direction: ArrowDirection;
  className?: string;
  large?: boolean;
}) {
  const iconSize = large ? "h-16 w-16" : "h-14 w-14";
  const arrowSize = large ? "h-7 w-7" : "h-6 w-6";
  const hoverShift =
    direction === "left"
      ? "group-hover:-translate-x-0.5"
      : direction === "right"
        ? "group-hover:translate-x-0.5"
        : "group-hover:translate-y-0.5";
  const arrowPath =
    direction === "left"
      ? "M15 6l-6 6 6 6"
      : direction === "right"
        ? "M9 6l6 6-6 6"
        : "M6 9l6 6 6-6";
  const ringSets: Record<ArrowDirection, WaveRing[]> = {
    left: [
      { inset: 0, border: "border-[#DB5F42]/72", wave: "wave", morph: "morph-fast", delay: "0s", hoverScale: "group-hover:scale-[1.35]" },
      { inset: 2, border: "border-[#DB5F42]/58", wave: "wave-alt", morph: "", delay: "0.15s", hoverScale: "group-hover:scale-[1.62]" },
      { inset: 5, border: "border-[#E9C9DF]/46", wave: "wave", morph: "morph-slow", delay: "0.4s", hoverScale: "group-hover:scale-[2.05]" },
    ],
    right: [
      { inset: 0, border: "border-[#DB5F42]/70", wave: "wave", morph: "morph-fast", delay: "0s", hoverScale: "group-hover:scale-[1.36]" },
      { inset: 2, border: "border-[#DB5F42]/58", wave: "wave-alt", morph: "", delay: "0.2s", hoverScale: "group-hover:scale-[1.7]" },
      { inset: 4, border: "border-[#E9C9DF]/48", wave: "wave", morph: "", delay: "0.45s", hoverScale: "group-hover:scale-[2]" },
      { inset: 7, border: "border-[#DB5F42]/38", wave: "wave-alt", morph: "morph-slow", delay: "0.7s", hoverScale: "group-hover:scale-[2.3]" },
    ],
    down: [
      { inset: 0, border: "border-[#DB5F42]/72", wave: "wave-alt", morph: "morph-fast", delay: "0s", hoverScale: "group-hover:scale-[1.34]" },
      { inset: 2, border: "border-[#DB5F42]/62", wave: "wave", morph: "", delay: "0.16s", hoverScale: "group-hover:scale-[1.6]" },
      { inset: 4, border: "border-[#E9C9DF]/54", wave: "wave-alt", morph: "", delay: "0.3s", hoverScale: "group-hover:scale-[1.88]" },
      { inset: 7, border: "border-[#DB5F42]/45", wave: "wave", morph: "morph-slow", delay: "0.52s", hoverScale: "group-hover:scale-[2.15]" },
      { inset: 10, border: "border-[#E9C9DF]/34", wave: "wave-alt", morph: "", delay: "0.78s", hoverScale: "group-hover:scale-[2.45]" },
    ],
  };
  const rings = ringSets[direction];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group ${className ?? ""}`}
    >
      <div
        className={`relative ${iconSize} rounded-full transition-shadow duration-500 group-hover:shadow-[0_0_35px_#DB5F42]`}
      >
        {rings.map((ring, index) => (
          <span
            key={`${direction}-${index}`}
            className={`absolute border-2 ${ring.border} ${ring.wave} morph-ring ${ring.morph} transition-transform duration-500 ${ring.hoverScale}`}
            style={{
              inset: `${ring.inset}px`,
              animationDelay: ring.delay,
            }}
          />
        ))}
        <span
          className={`absolute inset-0 flex items-center justify-center text-[#F9D9CB] transition-transform duration-500 ${hoverShift}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={arrowSize}
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

function MainContent() {
  const { openPanel, openLeftPanel } = useSlidePanel();
  const { title, subtitle, heroImage, endtitle } = site.main;
  const canUseDOM = typeof window !== "undefined";
  const subtitleBreak = "Intelligent Sonic Innovation";
  const hasSubtitleBreak = subtitle.includes(subtitleBreak);
  const subtitleFirstPart = hasSubtitleBreak
    ? subtitle.replace(subtitleBreak, "").trim()
    : subtitle;
  const [activeFounder, setActiveFounder] = useState<FounderProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const openFounderModal = (founder: FounderProfile) => {
    setActiveFounder(founder);
    setModalOpen(false);
  };

  const closeFounderModal = () => {
    setModalOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveFounder(null);
    }, 260);
  };

  useEffect(() => {
    if (!activeFounder) return undefined;
    const raf = window.requestAnimationFrame(() => {
      setModalOpen(true);
    });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFounderModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeFounder]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    []
  );

  const handleScrollDown = () => {
    const foundersSection = document.getElementById("founders-section");
    foundersSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleScrollToPatents = () => {
    if (typeof document === "undefined") return;
    const patentsSection = document.getElementById("patents-section");
    patentsSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-[rgb(var(--bg))] text-white overflow-x-clip">
      <section className="min-h-[100svh] py-[var(--section-y)]">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter-x)] min-h-[calc(100svh-3rem)] flex flex-col justify-center text-center">

        <h1 className="heading-font text-[clamp(3.2rem,9vw,6.2rem)] font-semibold tracking-tight">
          {title}
        </h1>

        {/* Subtitle — now bold */}
        <p className="mx-auto mt-4 max-w-4xl text-[clamp(1rem,3.8vw,1.75rem)] leading-tight text-[#DB5F42] font-bold">
          {subtitleFirstPart}
          {hasSubtitleBreak ? (
            <>
              <br />
              {subtitleBreak}
            </>
          ) : null}
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center relative">
          <div className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl">
            <div className="relative">
              <WaveArrowButton
                onClick={openLeftPanel}
                ariaLabel="Open general sonification page"
                direction="left"
                className="hidden md:block absolute top-1/2 -left-10 lg:-left-12 z-30 -translate-y-1/2"
              />

              <WaveArrowButton
                onClick={openPanel}
                ariaLabel="Open navigation page"
                direction="right"
                className="hidden md:block absolute top-1/2 -right-10 lg:-right-12 z-30 -translate-y-1/2"
              />

              <img
                src={heroImage.src}
                alt={heroImage.alt}
                className="block w-full object-contain max-h-[40vh] sm:max-h-[46vh]"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-[var(--content-gap)] md:hidden">
              <WaveArrowButton
                onClick={openLeftPanel}
                ariaLabel="Open general sonification page"
                direction="left"
                className="scale-90"
              />
              <WaveArrowButton
                onClick={openPanel}
                ariaLabel="Open navigation page"
                direction="right"
                className="scale-90"
              />
            </div>

            {/* End title — now bold + soft color */}
            <p className="mt-4 text-lg sm:text-xl tracking-wide text-[#E9C9DF] font-bold">
              {endtitle}
            </p>

            <div className="mt-5 sm:mt-6 flex justify-center">
              <WaveArrowButton
                onClick={handleScrollDown}
                ariaLabel="Scroll down"
                direction="down"
                large
              />
            </div>
          </div>

        </div>

        </div>
      </section>

      <section id="founders-section" className="min-h-[100svh] py-[var(--section-y)]">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter-x)] min-h-[calc(100svh-3rem)] flex flex-col items-center justify-between gap-[var(--stack-gap-loose)]">
          <div id="founders-content" className="w-full">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="heading-font text-3xl sm:text-4xl tracking-tight">
                The Pioneers in Surgical Sonification
              </h2>
              <p className="mx-auto mt-2 text-sm font-semibold tracking-[0.16em] text-[#E9C9DF]/85">
                STARTUP CO-FOUNDERS
              </p>
              <span className="mx-auto mt-4 block h-px w-24 sm:w-28 bg-gradient-to-r from-transparent via-[#DB5F42]/70 to-transparent" />
              <p className="mx-auto mt-3 max-w-2xl text-white/70 leading-relaxed">
                We combine consultancy and co-development, guiding companies from
                early vision to full integration - turning research into real life
                solutions. Click any co-founder to open a full profile modal.
              </p>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 min-[500px]:grid-cols-2 gap-[var(--content-gap)] lg:grid-cols-4">
              {founders.map((founder) => (
                <button
                  key={founder.id}
                  type="button"
                  onClick={() => openFounderModal(founder)}
                  className="group relative flex min-h-[17.5rem] sm:min-h-[18.5rem] flex-col items-center border border-white/10 bg-[linear-gradient(180deg,rgba(24,66,82,0.6)_0%,rgba(11,34,44,0.92)_100%)] px-3 sm:px-4 py-4 sm:py-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]"
                  aria-label={`Open profile for ${founder.name}`}
                >
                  <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#E9C9DF]/50 to-transparent" />
                  <div className="relative h-28 w-28 sm:h-[8.5rem] sm:w-[8.5rem] md:h-36 md:w-36 shrink-0">
                    <span className="absolute -inset-1 rounded-full border-[2.5px] border-[#DB5F42]/85 wave-founder morph-ring" />
                    <span
                      className="absolute inset-1 rounded-full border-[2.5px] border-[#E9C9DF]/80 wave-founder-alt morph-ring morph-fast"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="absolute inset-3 rounded-full border-2 border-[#DB5F42]/65 wave-founder morph-ring"
                      style={{ animationDelay: "0.35s" }}
                    />
                    <span
                      className="absolute inset-[10px] overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-[#2E5565] via-[#1C3F4D] to-[#152F3A] transition-transform duration-500 group-hover:scale-[1.1]"
                    >
                      <img
                        src={founder.thumbnailSrc}
                        alt={founder.name}
                        className="h-full w-full object-cover brightness-[1.18] contrast-[1.22] saturate-[0.62] sepia-[0.14] hue-rotate-[-8deg]"
                        style={{ objectPosition: founder.objectPosition ?? "center" }}
                      />
                    </span>
                  </div>

                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold tracking-wide text-[#F7DACC] leading-snug">
                    {founder.name}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-white/65 leading-snug max-w-[24ch]">
                    {founder.role}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <WaveArrowButton
            onClick={handleScrollToPatents}
            ariaLabel="Scroll to patents section"
            direction="down"
          />
        </div>
      </section>

      <section id="patents-section" className="py-[var(--section-y)]">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter-x)] text-center">
          <h2 className="heading-font text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#F2D3C5]">
            Patents
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-white/78 leading-relaxed text-lg sm:text-xl">
            Our patent portfolio delivers cutting-edge technologies for enhanced
            surgical navigation, and for transforming medical images into
            granular acoustic cues that let surgeons &quot;hear&quot; the anatomy.
          </p>
        </div>
      </section>

      <section className="py-[var(--section-y)]">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter-x)] text-center">
          <h2 className="heading-font text-4xl sm:text-5xl font-semibold tracking-tight text-[#F2D3C5]">
            Associations
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-[var(--content-gap)] sm:grid-cols-3 items-center">
            <div className="mx-auto flex h-20 w-full max-w-[11rem] sm:max-w-[12rem] items-center justify-center">
              <img
                src="/images/logos/tum.png"
                alt="TUM logo"
                className="max-h-full w-auto object-contain grayscale brightness-140 contrast-125 opacity-100"
              />
            </div>
            <div className="mx-auto flex h-20 w-full max-w-[11rem] sm:max-w-[12rem] items-center justify-center">
              <img
                src="/images/logos/camp.jpg"
                alt="CAMP logo"
                className="max-h-full w-auto object-contain grayscale brightness-125 contrast-90 mix-blend-lighten opacity-90"
              />
            </div>
            <div className="mx-auto flex h-20 w-full max-w-[11rem] sm:max-w-[12rem] items-center justify-center">
              <img
                src="/images/logos/dfg.png"
                alt="DFG logo"
                className="max-h-full w-auto object-contain grayscale brightness-125 contrast-90 mix-blend-lighten opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {canUseDOM && activeFounder
        ? createPortal(
        <div
          className={`fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/70 p-3 sm:p-4 md:p-6 backdrop-blur-sm transition-opacity duration-300 ${
            modalOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeFounderModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeFounder.name} profile`}
            className="relative w-full max-w-4xl h-[85svh] md:h-auto md:max-h-[88svh] overflow-y-auto rounded-t-[1.25rem] md:rounded-[2rem] border border-[#DB5F42]/35 bg-[#102e3b] p-4 sm:p-5 md:p-8 shadow-[0_16px_80px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: modalOpen
                ? "translate(0px, 0px) scale(1)"
                : "translate(0px, 30px) scale(0.98)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeFounderModal}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 md:right-6 md:top-6 rounded-full border border-white/20 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/80 hover:bg-white/10"
            >
              Close
            </button>

            <div className="text-center">
              <h3 className="heading-font text-3xl tracking-tight">
                {activeFounder.name}
              </h3>
              <p className="mt-1 text-sm text-white/75">{activeFounder.role}</p>
            </div>

            <div className="mt-7 flex flex-col items-center">
              <div className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-[#DB5F42]/50 bg-gradient-to-br from-[#2B5262] via-[#1B3E4C] to-[#132D38]">
                <img
                  src={activeFounder.portraitSrc}
                  alt={`${activeFounder.name} portrait`}
                  className="h-full w-full object-cover brightness-[1.2] contrast-[1.24] saturate-[0.6] sepia-[0.16] hue-rotate-[-8deg]"
                  style={{ objectPosition: activeFounder.objectPosition ?? "center" }}
                />
              </div>

              <div className="mt-6 max-w-3xl text-center">
                {activeFounder.bio ? (
                  <p className="text-white/80 leading-relaxed">{activeFounder.bio}</p>
                ) : null}
                {activeFounder.details ? (
                  <p className="mt-4 text-white/70 leading-relaxed">
                    {activeFounder.details}
                  </p>
                ) : null}
              </div>
            </div>

            {activeFounder.gallery.length > 0 ? (
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {activeFounder.gallery.map((image, index) => (
                    <div
                      key={`${activeFounder.id}-gallery-${index}`}
                      className="relative mx-auto w-[80%] aspect-square"
                    >
                      <img
                        src={image}
                        alt={`${activeFounder.name} gallery ${index + 1}`}
                        className="h-full w-full object-contain brightness-[1.01] contrast-[1.06] saturate-[0.96] sepia-[0.02]"
                        style={{ objectPosition: activeFounder.objectPosition ?? "center" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>,
        document.body
      )
        : null}
    </div>
  );
}

export default function Main() {
  return (
    <SlidePanelShell panel={<SubPage />} leftPanel={<GeneralSonificationPage />}>
      <MainContent />
    </SlidePanelShell>
  );
}
