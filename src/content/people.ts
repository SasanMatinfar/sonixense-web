export type Person = {
  id: string;
  name: string;
  title: string;
  expertise: string;
  credibility: string;
  profileHref: string;
  email: string;
  image: string;
  imagePosition?: string;
  cardImagePosition?: string;
  cardImageScale?: number;
  bio: string;
  affiliation: string;
  expertiseAreas: readonly string[];
  selectedProjects?: readonly string[];
  selectedPublications?: readonly string[];
  patents?: readonly string[];
  awards?: readonly string[];
  contextualImages?: readonly { src: string; alt: string }[];
};

export const people: Person[] = [
  {
    id: "sasan-matinfar",
    name: "Dr. Sasan Matinfar",
    title: "CEO",
    expertise: "Sonification and Machine Learning",
    credibility: "PhD (summa cum laude), 3x Sonification Award winner, MICCAI Best Paper finalist",
    profileHref: "https://www.linkedin.com/in/sasan-matinfar",
    email: "sasan@sonixense.com",
    image: "/images/founders/sasan.png",
    imagePosition: "center 38%",
    bio: "Biomedical engineer and sonic interaction researcher working at the intersection of medical imaging, medical XR, and sound.",
    affiliation: "SoniXense · TUM CAMP research origin",
    expertiseAreas: ["Sonification", "Machine learning", "Medical XR"],
  },
  {
    id: "navid-navab",
    name: "Navid Navab",
    title: "Chief Innovation Officer",
    expertise: "ArtScientist",
    credibility: "Media artist and creative technologist — kinetic sculpture, sound art, and responsive installations exhibited internationally, 2008–2024",
    profileHref: "https://www.navidnavab.com/",
    email: "navid@sonixense.com",
    image: "/images/founders/navid.png",
    imagePosition: "center 26%",
    cardImagePosition: "center 10%",
    bio: "ArtScientist and composer with over a decade of interdisciplinary research and production experience.",
    affiliation: "Independent media artist and creative technologist",
    expertiseAreas: ["Sound art", "Responsive installations", "Creative technology"],
  },
  {
    id: "veronica-ruozzi",
    name: "Dr. Veronica Ruozzi",
    title: "CTO",
    expertise: "Biomechanical Modeling",
    credibility: "Senior Researcher, TUM CAMP — extended reality and multisensory applications for computer-assisted procedures",
    profileHref: "https://www.linkedin.com/in/veronica-ruozzi-4aaa731bb/",
    email: "veronica@sonixense.com",
    image: "/images/founders/veronica.jpg",
    imagePosition: "center 40%",
    cardImageScale: 1.14,
    bio: "Biomedical engineer focused on biomechanical modeling and advanced medical XR applications.",
    affiliation: "Senior Researcher, TUM CAMP",
    expertiseAreas: ["Biomechanical modeling", "Extended reality", "Computer-assisted procedures"],
  },
  {
    id: "nassir-navab",
    name: "Prof. Dr. Nassir Navab",
    title: "CSO",
    expertise: "Scientific Advisory and Research Direction",
    credibility: "Internationally recognized pioneer in medical computing, surgical data science, and medical augmented reality",
    profileHref: "https://www.linkedin.com/in/nassir-navab-0251103/",
    email: "nassir@sonixense.com",
    image: "/images/founders/nassir.png",
    imagePosition: "center 38%",
    cardImagePosition: "center 70%",
    bio: "A pioneer in biomedical engineering, surgical data science, medical XR, and medical robotics.",
    affiliation: "TUM Chair for Computer Aided Medical Procedures & AR",
    expertiseAreas: ["Surgical data science", "Medical XR", "Medical robotics"],
  },
];
