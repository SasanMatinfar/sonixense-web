import Image from "next/image";
import Link from "next/link";
import MovementTag from "@/components/ui/MovementTag";
import { awardsFrame } from "@/content/awards";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import FounderCard from "@/components/team/FounderCard";
import { people } from "@/content/people";

export default function TeamSection() {
  return (
    <section id="team" className="chapter chapter--team" aria-labelledby="team-title">
      <Container>
        <SectionLabel>07 — Co-founders</SectionLabel>
        <div className="section-heading">
          <h2 id="team-title">Technology, medicine,<br />science, and art.</h2>
          <p>A multidisciplinary founding team building one perceptual technology platform.</p>
        </div>
        <div className="team__grid">
          {people.map((person, index) => <FounderCard key={person.id} person={person} index={index} />)}
        </div>

        <div className="awards" id="awards">
          <MovementTag index="07B">Awards &amp; recognition</MovementTag>
          <div className="awards__frame awards__frame--ranked">
            {awardsFrame.map((award) => {
              const media = award.awardMedia ?? award.media;
              return <Link href={`/team/${award.founderIds[0]}#recognition`} className={`awards__item awards__item--${award.slot}`} key={award.id} data-award={award.id}>
                <div className={`awards__media awards__media--${media.fit ?? "cover"}`}>
                  <Image src={media.src} alt={media.alt} fill sizes="(max-width: 700px) 90vw, 50vw" style={{ objectFit: media.fit ?? "cover" }} />
                </div>
                <div className="awards__caption"><strong>{award.award}</strong><span>{award.year}{award.project ? ` · ${award.shortProject ?? award.project}` : ""}</span><small>{award.founderIds.map((id) => people.find((person) => person.id === id)?.name).join(" + ")} ↗</small></div>
              </Link>;
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
