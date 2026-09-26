import type { ProfileMedia } from "./people";

export type Recognition = {
  id: string;
  award: string;
  year: number;
  project?: string;
  shortProject?: string;
  description: string;
  media: ProfileMedia & { fit?: "cover" | "contain" };
  founderIds: readonly string[];
  awardMedia?: ProfileMedia & { fit?: "cover" | "contain" };
  publicationUrl?: string;
  awardUrl?: string;
  video?: { src: string; provider?: "local" | "vimeo" };
  videoUrl?: string;
  credit?: { label: string; href: string };
};

// A shared achievement is defined once; founder pages select by membership.
export const recognitions: readonly Recognition[] = [
  {
    id: "miccai-2017", award: "MICCAI Young Scientist Award", year: 2017,
    description: "Young Scientist recognition from the Medical Image Computing and Computer Assisted Intervention Society.",
    media: { src: "/awards/miccai_sasan.jpg", alt: "Sasan Matinfar’s MICCAI Young Scientist Award certificate, 2017", label: "Award certificate", available: true, fit: "contain" },
    founderIds: ["sasan-matinfar"], awardUrl: "/awards/miccai_sasan.pdf",
  },
  {
    id: "ocular-2025",
    awardMedia: { src: "/awards/sonification_2025.jpg", alt: "Data Sonification Award winner 2025", label: "Award", available: true, fit: "contain" }, award: "Data Sonification Award", year: 2025, project: "Ocular Stethoscope",
    description: "Auditory support for retinal membrane peeling, making subtle tissue elevations perceptible through sound.",
    media: { src: "/awards/ocular.jpg", alt: "Ocular Stethoscope retinal sonification demonstration", label: "Demo still", available: true },
    founderIds: ["sasan-matinfar"], video: { src: "/awards/ocular.mp4" },
    publicationUrl: "https://link.springer.com/chapter/10.1007/978-3-031-72089-5_41", awardUrl: "/awards/sonification_2025.pdf",
  },
  {
    id: "biosonix-2026",
    awardMedia: { src: "/awards/sonification_2026_both_biosonix_MMII.jpg", alt: "Data Sonification Award winner 2026", label: "Award", available: true, fit: "contain" }, award: "Data Sonification Award", year: 2026, project: "BioSonix",
    description: "Shared work by Sasan Matinfar and Veronica Ruozzi connects biomechanical tissue deformation with physics-based sound, making tool–tissue dynamics audible.",
    media: { src: "/awards/biosonix.png", alt: "BioSonix framework connecting anatomy, tissue deformation and physics-based sonification", label: "BioSonix project figure", available: true, fit: "contain" },
    founderIds: ["sasan-matinfar", "veronica-ruozzi"],
    publicationUrl: "https://link.springer.com/chapter/10.1007/978-3-031-96625-5_2", awardUrl: "/awards/sonification_2026_both_biosonix_MMII.pdf",
    credit: { label: "Project figure: Ruozzi, Matinfar et al. · BioSonix", href: "https://arxiv.org/html/2508.14688v1" },
  },
  {
    id: "mmii-2026", award: "Data Sonification Award", year: 2026,
    project: "Multimodal Medical Image Interaction (MMII)", shortProject: "MMII",
    description: "Recognition for multimodal interaction with medical images.",
    media: { src: "/awards/sonification_2026_both_biosonix_MMII.jpg", alt: "Data Sonification Award 2026 for MMII", label: "Award recognition", available: true, fit: "contain" },
    founderIds: ["sasan-matinfar"], awardUrl: "/awards/sonification_2026_both_biosonix_MMII.pdf",
    // No verified MMII publication or demo URL has been supplied.
  },
  {
    id: "golden-nica-2025",
    awardMedia: { src: "/awards/golden_nica_navid.jpg", alt: "Navid Navab — Prix Ars Electronica Golden Nica 2025", label: "Golden Nica", available: true, fit: "contain" }, award: "Golden Nica", year: 2025, project: "Organism",
    description: "Prix Ars Electronica · Digital Musics & Sound Art. Created with Garnet Willis, Organism brings kinetic systems, material behavior and sound into dialogue.",
    media: { src: "/images/artscience/1064898268.jpg", alt: "Organism and Excitable Chaos performance film", label: "Organism project film", available: true },
    video: { src: "1064898268", provider: "vimeo" },
    founderIds: ["navid-navab"], awardUrl: "https://ars.electronica.art/aeblog/en/2025/07/07/sound-as-a-living-process/",
  },
  {
    id: "lumen-2025",
    awardMedia: { src: "/awards/lumen-winner.png", alt: "Official Lumen Prize 2025 winner artwork: Organism In Turbulence", label: "Lumen Prize winner", available: true }, award: "Lumen Prize — Identity & Culture Award", year: 2025, project: "Organism: In Turbulence",
    description: "A performance that brings a historic pipe organ into a responsive encounter between physical turbulence, robotic control and sound.",
    media: { src: "/awards/organism-lumen-detail.jpg", alt: "Organism: In Turbulence — close-up of the wooden organ pipes and robotic mechanisms", label: "Official Lumen artwork photograph", available: true },
    founderIds: ["navid-navab"], awardUrl: "https://lumenprize.org/2025-winners/identity-culture",
    videoUrl: "https://x.com/lumenprize/status/1992141119807775219",
    credit: { label: "Artwork image: Navid Navab / The Lumen Prize", href: "https://lumenprize.org/2025-winners/identity-culture" },
  },
  {
    id: "sonifeye-2017",
    awardMedia: { src: "/awards/ieee_ismar_navid.jpg", alt: "IEEE ISMAR 2017 Best Paper Award for SonifEye", label: "Award certificate", available: true, fit: "contain" }, award: "IEEE ISMAR — Best Paper Award", year: 2017, project: "SonifEye",
    description: "Sonification of visual information using physical modeling sound synthesis: an earlier research lineage connected to SoniXense’s scientific foundations.",
    media: { src: "/awards/sonifeye-research.jpg", alt: "SonifEye experimental microscopic view with needle and OCT overlay", label: "SonifEye research figure", available: true },
    publicationUrl: "https://doi.org/10.1109/TVCG.2017.2734327",
    credit: { label: "Research image: Roodaki et al. · SonifEye, Fig. 3", href: "https://mediatum.ub.tum.de/doc/1519558/1519558.pdf#page=94" },
    founderIds: ["nassir-navab"], awardUrl: "https://www.ismar.net/posts/ismar2017/",
  },
];
export const awardsForFounder = (id: string) => recognitions.filter((award) => award.founderIds.includes(id));

// Explicit editorial order and scale for the homepage collage.
export const awardsFrame = [
  ["golden-nica-2025", "lead"],
  ["miccai-2017", "miccai"],
  ["lumen-2025", "lumen"],
  ["sonifeye-2017", "ieee"],
  ["ocular-2025", "sonification-2025"],
  ["biosonix-2026", "sonification-2026"],
  ["mmii-2026", "sonification-mmii"],
].map(([id, slot]) => ({ ...recognitions.find((award) => award.id === id)!, slot }));
