export const technologyBehaviors = [
  { index: "01", name: "Monitor", lead: "Stay informed without watching.", body: "Continuous information without continuous visual attention." },
  { index: "02", name: "Guide", lead: "Know where to go.", body: "Spatial and procedural information supporting orientation, navigation, and decision-making." },
  { index: "03", name: "Interact", lead: "Understand what happens when you act.", body: "Information about tissue, tools, physical behavior, and system interaction." },
  { index: "04", name: "Supervise", lead: "Remain aware as systems act.", body: "Awareness of AI, digital twins, robotics, automated agents, and increasingly autonomous systems." },
] as const;

export const capabilities = [
  { name: "Ambient", lead: "Hear what changes.", body: "Continuous peripheral monitoring and awareness." },
  { name: "Guidance", lead: "Hear where to go.", body: "Spatial orientation, navigation, target relationships, trajectory, and decision support." },
  { name: "Tissue interaction", lead: "Hear what you touch.", body: "Tool–tissue interaction, deformation, hidden properties, physical behavior." },
  { name: "Awareness", lead: "Hear what the system knows.", body: "AI, digital twins, robotic systems, automated agents, and human supervision." },
] as const;

export const integration = [
  { name: "SDK", body: "Auditory intelligence designed to integrate with existing navigation and tracking systems." },
  { name: "Case-specific solutions", body: "Auditory interaction designed around individual clinical workflows and systems." },
  { name: "Future systems", body: "Auditory support for increasingly intelligent, automated, and autonomous systems." },
] as const;

export const machineEvents = ["Sensors", "Imaging", "Tracking", "AI", "Simulation", "Computation", "Robotics", "Data"] as const;
export const humanEvents = ["Vision", "Attention", "Working memory", "Cognition", "Decision"] as const;

export const associations = [
  { id: "tum", name: "Technical University of Munich", image: "/images/logos/tum.png", width: 1730, height: 590, href: "https://www.tum.de/" },
  { id: "mri", name: "TUM University Hospital · Klinikum rechts der Isar", image: "/images/logos/mri.png", width: 440, height: 236, href: "https://mri.tum.de/" },
  { id: "camp", name: "CAMP · Chair for Computer Aided Medical Procedures and Augmented Reality", image: "/logos/ecosystem/camp-transparent.png", width: 600, height: 600, href: "https://www.cs.cit.tum.de/camp/start/" },
  { id: "dfg", name: "DFG · German Research Foundation", image: "/images/logos/dfg.png", width: 3840, height: 490, href: "https://www.dfg.de/" },
  { id: "miccai", name: "MICCAI Society", image: "/logos/ecosystem/miccai.png", width: 204, height: 172, href: "https://miccai.org/" },
  { id: "tu-dresden", name: "TU Dresden", image: "/logos/ecosystem/tu-dresden-blue.svg", width: 169, height: 57, href: "https://tu-dresden.de/" },
  { id: "ceti", name: "CeTI · Centre for Tactile Internet with Human-in-the-Loop", image: "/logos/ecosystem/ceti.png", width: 1024, height: 283, href: "https://www.ceti.one/" },
  { id: "unternehmertum", name: "UnternehmerTUM", image: "/logos/ecosystem/unternehmertum.svg", width: 789, height: 503, href: "https://www.unternehmertum.de/" },
  { id: "concordia", name: "Concordia University", image: "/logos/ecosystem/concordia.svg", width: 395, height: 66, href: "https://www.concordia.ca/" },
  { id: "ars-electronica", name: "Ars Electronica", image: "/logos/ecosystem/ars-electronica.svg", width: 335, height: 50, href: "https://ars.electronica.art/" },
  { id: "ismar", name: "IEEE International Symposium on Mixed and Augmented Reality (ISMAR)", image: "/logos/ecosystem/ismar-undated.png", width: 980, height: 240, href: "https://www.ismar.net/" },
  { id: "sofa", name: "SOFA Framework · Simulation Open Framework Architecture", image: "/logos/ecosystem/sofa-framework.png", width: 300, height: 86, href: "https://www.sofa-framework.org/" },
] as const;
