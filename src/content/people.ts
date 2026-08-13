export type Person = {
  id: string;
  name: string;
  title: string;
  expertise: string;
  credibility: string;
  profileHref: string;
  image: string;
  imagePosition?: string;
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
    image: "/images/founders/sasan.png",
    imagePosition: "center 38%",
    bio: "Biomedical engineer and sonic interaction researcher working at the intersection of medical imaging, medical XR, and sound.",
    affiliation: "SoniXense · TUM CAMP research origin",
    expertiseAreas: ["Sonification", "Machine learning", "Medical XR"],
  },
  {
    id: "navid-navab",
    name: "Navid Navab",
    title: "CIO (Chief of Innovation)",
    expertise: "ArtScientist",
    credibility: "Media artist and creative technologist — kinetic sculpture, sound art, and responsive installations exhibited internationally, 2008–2024",
    profileHref: "https://www.navidnavab.com/",
    image: "/images/founders/navid.png",
    imagePosition: "center 26%",
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
    image: "/images/founders/veronica.jpg",
    imagePosition: "center 40%",
    bio: "Biomedical engineer focused on biomechanical modeling and advanced medical XR applications.",
    affiliation: "Senior Researcher, TUM CAMP",
    expertiseAreas: ["Biomechanical modeling", "Extended reality", "Computer-assisted procedures"],
  },
  {
    id: "nassir-navab",
    name: "Prof. Dr. Nassir Navab",
    title: "CSO",
    expertise: "Scientific Advisory and Research Direction",
    credibility: "70,000+ citations, TUM Chair for Computer Aided Medical Procedures & AR, MICCAI board member",
    profileHref: "https://www.linkedin.com/in/nassir-navab-0251103/",
    image: "/images/founders/nassir.png",
    bio: "A pioneer in biomedical engineering, surgical data science, medical XR, and medical robotics.",
    affiliation: "TUM Chair for Computer Aided Medical Procedures & AR",
    expertiseAreas: ["Surgical data science", "Medical XR", "Medical robotics"],
  },
];
