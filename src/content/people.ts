export type ProfileMedia = { src: string; alt: string; label: string; available?: boolean };
export type ProfileHighlight = { title: string; detail: string };
export type ProfileLink = { label: string; href: string };
export type Person = {
  id: string; name: string; title: string; expertise: string; image: string;
  imagePosition?: string; cardImagePosition?: string; cardImageScale?: number;
  preview: readonly string[]; statement: string; bio: readonly string[];
  signature: { label: string; title: string; description: string; sequence?: readonly string[]; media?: ProfileMedia };
  highlights: readonly ProfileHighlight[];
  awards?: readonly { title: string; context: string; media: ProfileMedia; featured?: boolean }[];
  work?: readonly ProfileHighlight[]; invention?: string; leadership?: readonly ProfileHighlight[];
  metrics?: readonly { value: string; label: string }[];
  links: readonly ProfileLink[];
};

export const people: Person[] = [
  {
    id: "sasan-matinfar", name: "Dr. Sasan Matinfar", title: "CEO / Co-Founder",
    expertise: "Surgical Sonification & Multisensory Medical Technology",
    image: "/images/founders/sasan.png", imagePosition: "center 38%",
    preview: ["Surgical sonification research lead", "3× Data Sonification Award", "MICCAI Young Scientist Award"],
    statement: "Researcher and inventor connecting computation, medicine, perception and music through surgical sound.",
    bio: [
      "Sasan Matinfar is an interdisciplinary researcher exploring how complex surgical information can become perceptually accessible through sound and multisensory interaction. At TUM CAMP, he leads the Sonification Team and serves as Scientific Coordinator of the DFG Synergia project between TUM and TU Dresden.",
      "He conceived From Tissue to Sound, a research framework that connects medical imaging, vibroacoustic sensing and interaction data with computational auditory feedback. His work spans computer-assisted intervention, medical XR, adaptive interfaces and multisensory human–AI interaction.",
      "He earned a PhD in Computer Science summa cum laude from TUM under Prof. Nassir Navab. Studies in Musicology at the University of Music Franz Liszt Weimar and Piano Performance at the Art University of Tehran inform his approach to sound as a way of understanding medical data."
    ],
    signature: { label: "Signature contribution", title: "From Tissue to Sound", description: "A research framework for transforming multimodal intraoperative information and tool–tissue dynamics into meaningful auditory representations.", sequence: ["Tissue / interaction", "Modeling", "Sound"], media: { src: "/team/sasan/research-demo.jpg", alt: "Surgical sonification research demonstration", label: "Research / demo image" } },
    highlights: [
      { title: "Research Lead", detail: "CAMP Sonification Team · TUM" },
      { title: "Scientific Coordinator", detail: "DFG Synergia · TUM / TU Dresden" },
      { title: "Interdisciplinary training", detail: "Computer science, musicology and piano performance" }
    ],
    awards: [
      { title: "MICCAI Young Scientist Award", context: "2017", media: { src: "/team/sasan/miccai-young-scientist-award.jpg", alt: "Sasan Matinfar receiving the 2017 MICCAI Young Scientist Award", label: "MICCAI award photograph" }, featured: true },
      { title: "Data Sonification Awards", context: "2025 · 2026 ×2", media: { src: "/team/sasan/sonification-awards.jpg", alt: "Sasan Matinfar's Data Sonification Awards", label: "Award photograph" } },
      { title: "MICCAI Best Paper Award Nominee", context: "2023 · finalist distinction", media: { src: "/team/sasan/miccai-best-paper.jpg", alt: "MICCAI 2023 Best Paper Award finalist recognition", label: "Recognition photograph" } }
    ],
    invention: "Lead inventor across multiple international patent families in surgical sonification and intelligent surgical assistance. The underlying records include published patents, filed applications and work in preparation; these have different legal statuses.",
    work: [{ title: "From Tissue to Sound", detail: "Research framework and 2025 Medical Image Analysis publication" }, { title: "Ocular Stethoscope", detail: "Auditory support for retinal membrane peeling" }],
    links: [{ label: "TUM CAMP profile", href: "https://www.cs.cit.tum.de/camp/members/sasan-matinfar-1/" }, { label: "Synergia team", href: "https://synergia.camp.cit.tum.de/team/" }]
  },
  {
    id: "navid-navab", name: "Navid Navab", title: "Chief Innovation Officer / Co-Founder",
    expertise: "ArtScience, Sound & Material Intelligence", image: "/images/founders/navid.png",
    imagePosition: "center 26%", cardImagePosition: "center 10%",
    preview: ["Golden Nica · 2025", "Lumen Prize", "Creator of Organism"],
    statement: "An ArtScience practice that makes the behavior of matter, machines and complex systems audible.",
    bio: [
      "Navid Navab is a media artist, composer and ArtScience practitioner whose work draws on contemporary music, biomedical sonification and philosophical biology. Their installations and performances explore how sound emerges from physical behavior, resonance and responsive machines.",
      "Their work spans kinetic sound sculpture, responsive environments and gestural composition, and has been presented internationally. As a researcher, Navab has led interdisciplinary experiments across art, science and technology since 2008 and directs the Topological Media Lab.",
      "For SoniXense, this practice brings a distinctive way of thinking about sound: as a medium through which complex physical processes can be sensed and understood. Organism belongs to this artistic lineage; it is not a medical technology project."
    ],
    signature: { label: "Signature work", title: "Organism", description: "Created with Garnet Willis, the work pairs a robotically prepared historic pipe organ with a robotically steered chaotic pendulum. The work makes nonlinear dynamics and material behavior audible through a responsive technological system.", media: { src: "/team/navid/organism.jpg", alt: "Organism performance installation by Navid Navab", label: "Installation photograph" } },
    highlights: [{ title: "ArtScience", detail: "Sound, kinetic systems and material intelligence" }, { title: "International practice", detail: "Installations and performances presented internationally" }, { title: "Topological Media Lab", detail: "Director of an interdisciplinary artistic research lab" }],
    awards: [{ title: "Golden Nica", context: "Prix Ars Electronica · Digital Musics & Sound Art · 2025 · for Organism, with Garnet Willis", media: { src: "/team/navid/golden-nica.jpg", alt: "Navid Navab's 2025 Golden Nica for Organism", label: "Golden Nica photograph" }, featured: true }, { title: "Lumen Prize", context: "For Organism", media: { src: "/team/navid/lumen.jpg", alt: "Lumen Prize recognition for Organism", label: "Lumen Prize / exhibition photograph" } }],
    work: [{ title: "Organism", detail: "Responsive organ and chaotic pendulum performance installation" }, { title: "Material sound practice", detail: "Kinetic sculpture, responsive architecture and gestural composition" }],
    links: [{ label: "Artist website", href: "https://www.navidnavab.com/about" }]
  },
  {
    id: "veronica-ruozzi", name: "Dr. Veronica Ruozzi", title: "CTO / Co-Founder",
    expertise: "Biomechanical Modeling & Physics-Based Sonification",
    image: "/images/founders/veronica.JPG", imagePosition: "center 40%", cardImageScale: 1.14,
    preview: ["BioSonix · physics to sound", "Data Sonification Award · 2026", "Cardiovascular XR research"],
    statement: "Biomedical engineer translating the physical behavior of surgical interactions into auditory guidance.",
    bio: [
      "Veronica Ruozzi is a biomedical engineer and researcher working in physical and numerical modeling of surgical interactions, physics-based sonification and medical XR at TUM CAMP. Her work connects biomechanical simulation with multisensory interfaces for computer-assisted procedures.",
      "She earned a PhD cum laude in Biomedical Engineering from Politecnico di Milano. Her doctoral research studied physics-based extended reality for real-time guidance in minimally invasive cardiovascular interventions.",
      "Her contribution to SoniXense sits at the bridge between tool–tissue interaction and auditory representation: physical changes in tissue can become meaningful sound."
    ],
    signature: { label: "Signature contribution", title: "BioSonix", description: "Physics-based sonification of tool–tissue interaction. Biomechanical modeling of tissue deformation drives auditory representations of interaction dynamics and tissue properties.", sequence: ["Tool–tissue interaction", "Biomechanics", "Sound"], media: { src: "/team/veronica/biosonix.jpg", alt: "BioSonix physics-based sonification research", label: "BioSonix research image" } },
    highlights: [{ title: "BioSonix", detail: "Physics-based tool–tissue sonification" }, { title: "Cardiovascular XR", detail: "Physics-based guidance for minimally invasive intervention" }, { title: "Retinal sonification", detail: "Physics-based iOCT sonification research for subretinal injection" }],
    awards: [{ title: "Data Sonification Award", context: "2026 · BioSonix", media: { src: "/team/veronica/sonification-award.jpg", alt: "Veronica Ruozzi's 2026 Data Sonification Award for BioSonix", label: "Award photograph" }, featured: true }],
    links: [{ label: "TUM CAMP profile", href: "https://www.cs.cit.tum.de/en/camp/members/template-personal-page-postdoc-3/" }, { label: "Synergia team", href: "https://synergia.camp.cit.tum.de/team/" }]
  },
  {
    id: "nassir-navab", name: "Prof. Dr. Nassir Navab", title: "CSO / Co-Founder",
    expertise: "Medical XR, Robotics & Surgical Intelligence", image: "/images/founders/nassir.png",
    imagePosition: "center 38%", cardImagePosition: "center 70%",
    preview: ["Pioneer in medical XR", "60+ international patents", "TUM CAMP chair"],
    statement: "An internationally recognized pioneer in computer-assisted medical procedures and medical augmented reality.",
    bio: [
      "Nassir Navab is Professor of Computer Aided Medical Procedures at TUM. His research group develops technologies linking medicine and computer science to improve medical interventions, with work spanning augmented reality, imaging, surgical navigation and intelligent systems.",
      "He completed his doctorate at INRIA / Paris XI, followed by postdoctoral research at the MIT Media Laboratory. Before joining TUM as a full professor in 2003, he was a Distinguished Member of Technical Staff at Siemens Corporate Research in Princeton.",
      "His long research trajectory in computer-assisted intervention and medical XR provides a clinical and computational foundation for the auditory interaction research behind SoniXense."
    ],
    signature: { label: "Foundational contribution", title: "Medical XR & Surgical Intelligence", description: "Decades of research connecting imaging, navigation and computer-assisted medical procedures with new ways to support clinicians.", media: { src: "/team/nassir/medical-xr.jpg", alt: "Nassir Navab's medical extended reality research", label: "Medical XR research image" } },
    highlights: [{ title: "Computer-assisted medicine", detail: "TUM chair connecting medical procedures and augmented reality" }, { title: "Scientific leadership", detail: "MICCAI Society board member from 2006; editorial service for IEEE TMI, Medical Image Analysis and Medical Physics" }, { title: "Research trajectory", detail: "INRIA / Paris XI · MIT Media Laboratory · Siemens Corporate Research · TUM" }],
    metrics: [{ value: "60+", label: "International patents" }, { value: "Hundreds", label: "Scientific publications" }],
    work: [{ title: "Medical augmented reality", detail: "Research in imaging and navigation for medical procedures" }, { title: "CAMP research group", detail: "Computer-assisted medical procedures and augmented reality at TUM" }],
    links: [{ label: "TUM Professor profile", href: "https://www.professoren.tum.de/navab-nassir" }, { label: "TUM CAMP", href: "https://www.cs.cit.tum.de/camp/" }]
  }
];
