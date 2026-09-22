import { people, type ProfileMedia } from "@/content/people";

export type AwardFrameItem = { slot: "lead" | "wide" | "tall" | "small-a" | "small-b"; title: string; caption: string; who: string; media: ProfileMedia };

// Single source of truth: photographs, titles and years come from the founder records in people.ts.
// Flip `available: true` on the media entry there once the real photograph is in /public.
const award = (personId: string, title: string) => {
  const found = people.find((p) => p.id === personId)?.awards?.find((a) => a.title === title);
  if (!found) throw new Error(`Award not found: ${personId} / ${title}`);
  return found.media;
};

export const awardsFrame: readonly AwardFrameItem[] = [
  { slot: "lead", title: "Golden Nica", caption: "Prix Ars Electronica · 2025", who: "Navid Navab", media: award("navid-navab", "Golden Nica") },
  { slot: "wide", title: "MICCAI Young Scientist Award", caption: "2017", who: "Sasan Matinfar", media: award("sasan-matinfar", "MICCAI Young Scientist Award") },
  { slot: "tall", title: "Data Sonification Awards", caption: "2025 · 2026", who: "Sasan Matinfar", media: award("sasan-matinfar", "Data Sonification Awards") },
  { slot: "small-a", title: "Data Sonification Award", caption: "2026 · BioSonix", who: "Veronica Ruozzi", media: award("veronica-ruozzi", "Data Sonification Award") },
  { slot: "small-b", title: "Lumen Prize", caption: "For Organism", who: "Navid Navab", media: award("navid-navab", "Lumen Prize") },
];
