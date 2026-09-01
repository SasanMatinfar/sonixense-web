export type Publication = { year: number; venue: string; title?: string; url?: string; relevance: string };
export type PatentSummary = { heading: string; body: string };

// Only metadata explicitly verified in the existing approved website copy is published here.
export const selectedPublications: Publication[] = [
  { year: 2023, venue: "MICCAI · Scientific Reports", relevance: "Surgical guidance and auditory interaction" },
  { year: 2024, venue: "IEEE TVCG · MICCAI", relevance: "Multisensory systems and computer-assisted procedures" },
  { year: 2025, venue: "Medical Image Analysis · IPMI", relevance: "Physics-based sonification and medical imaging" },
  { year: 2026, venue: "IEEE Access · MICCAI Spotlight", relevance: "Auditory intelligence for complex medical systems" },
];

export const patentPortfolio: PatentSummary = {
  heading: "An international patent portfolio.",
  body: "Intellectual property across auditory interaction technologies supports continuity from research into future products and integration pathways.",
};

export const researchEcosystem = [
  { category: "Research origins", names: ["TUM", "CAMP", "Synergia"] },
  { category: "Funding", names: ["DFG"] },
  { category: "Scientific community / recognition", names: ["MICCAI"] },
] as const;
