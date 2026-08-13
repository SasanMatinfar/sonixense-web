import Image from "next/image";
import type { Person } from "@/content/people";
import FounderDialog from "./FounderDialog";

export default function FounderCard({ person, index }: { person: Person; index: number }) {
  return <article className="founder-card">
    <div className="founder-card__image"><Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></div>
    <div className="founder-card__body"><p className="section-label">0{index + 1} / {person.title}</p><h3>{person.name}</h3><p className="founder-card__expertise">{person.expertise}</p><p className="founder-card__affiliation">{person.affiliation}</p><p>{person.bio}</p><ul className="founder-card__areas" aria-label={`${person.name} expertise`}>{person.expertiseAreas.map((area) => <li key={area}>{area}</li>)}</ul><FounderDialog person={person} /></div>
  </article>;
}
