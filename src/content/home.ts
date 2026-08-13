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
export const humanEvents = ["Vision", "Hearing", "Attention", "Cognition", "Decision"] as const;

export const associations = [
  { name: "TUM", image: "/images/logos/tum.png", width: 1730, height: 590 },
  { name: "MRI", image: "/images/logos/mri.png", width: 440, height: 236 },
  { name: "CAMP", image: "/images/logos/camp.jpg", width: 812, height: 870 },
  { name: "DFG", image: "/images/logos/dfg.png", width: 3840, height: 490 },
  { name: "MICCAI", image: "/images/logos/miccai.png", width: 153, height: 127 },
] as const;
