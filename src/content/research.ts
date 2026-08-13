export type Publication = { year: number; venue: string; title?: string; url?: string; relevance: string };
export type PatentSummary = { heading: string; body: string };

// Only metadata explicitly verified in the existing approved website copy is published here.
export const selectedPublications: Publication[] = [
  { year: 2025, venue: "Medical Image Analysis", relevance: "Peer-reviewed work contributing to the scientific foundation of SoniXense." },
];

export const patentPortfolio: PatentSummary = {
  heading: "An expanding patent portfolio.",
  body: "Intellectual property across auditory interaction technologies supports continuity from research into future products and integration pathways.",
};

export const researchEcosystem = [
  { category: "Research origins", names: ["TUM", "CAMP", "Synergia"] },
  { category: "Funding", names: ["DFG"] },
  { category: "Scientific community / recognition", names: ["MICCAI"] },
] as const;
