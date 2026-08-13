import Image from "next/image";
import type { Person } from "@/content/people";
import FounderDialog from "./FounderDialog";

export default function FounderCard({ person, index }: { person: Person; index: number }) {
  return <article className="founder-card">
    <FounderDialog person={person}><span className="founder-card__image"><Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></span><span className="founder-card__body"><span className="section-label">0{index + 1} / {person.title}</span><strong>{person.name}</strong><span className="founder-card__expertise">{person.expertise}</span><span className="founder-card__more">View profile <i aria-hidden="true">↗</i></span></span></FounderDialog>
  </article>;
}
