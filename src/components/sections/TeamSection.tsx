import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import MovementTag from "@/components/ui/MovementTag";
import FounderCard from "@/components/team/FounderCard";
import { people } from "@/content/people";
import { awardsFrame } from "@/content/awards";

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
          <div className="awards__frame">
            {awardsFrame.map((item) => (
              <figure className={`awards__item awards__item--${item.slot}`} key={`${item.who}-${item.title}`} data-asset={item.media.src}>
                <div className="awards__media" role="img" aria-label={item.media.available ? item.media.alt : `${item.media.alt}. Photograph pending.`}>
                  {item.media.available
                    ? <Image src={item.media.src} alt="" fill sizes="(max-width: 700px) 100vw, 60vw" style={{ objectFit: "cover" }} />
                    : <span className="awards__pending" aria-hidden="true"><i />Photograph forthcoming</span>}
                </div>
                <figcaption><strong>{item.title}</strong><span>{item.caption}</span><small>{item.who}</small></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
