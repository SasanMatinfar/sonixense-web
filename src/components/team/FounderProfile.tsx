import Image from "next/image";
import type { Person, ProfileMedia } from "@/content/people";
import FounderAwards from "./FounderAwards";

function MediaSlot({ media }: { media: ProfileMedia }) {
  if (!media.available) return null;
  return <div className="profile-media" data-asset={media.src}>
    <Image src={media.src} alt={media.alt} fill sizes="(max-width: 700px) 100vw, 70vw" style={{ objectFit: "cover" }} />
  </div>;
}

export default function FounderProfile({ person }: { person: Person }) {
  return (
      <div className="profile-inner">
        <header className="profile-opening">
          <div className="profile-opening__copy"><p className="profile-kicker">Co-founder profile / {person.title}</p><h2 id={`${person.id}-title`}>{person.name}</h2><p className="profile-discipline">{person.expertise}</p><p className="profile-statement">{person.statement}</p></div>
          <div className="profile-portrait"><Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></div>
        </header>
        <section className="profile-signature" aria-labelledby={`${person.id}-signature`}><p className="profile-kicker">01 / {person.signature.label}</p><h3 id={`${person.id}-signature`}>{person.signature.title}</h3><p>{person.signature.description}</p>{person.signature.sequence && <div className="profile-sequence">{person.signature.sequence.map((step, index) => <span key={step}>{index > 0 && <i aria-hidden="true">→</i>}{step}</span>)}</div>}</section>
        <section className="profile-biography" aria-label="Biography"><p className="profile-kicker">02 / Biography</p><div>{person.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
        <FounderAwards founderId={person.id} />
        {person.metrics && <div className="profile-metrics">{person.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
        <section className="profile-highlights"><p className="profile-kicker">04 / Selected highlights</p><div>{person.highlights.map((highlight) => <article key={highlight.title}><h3>{highlight.title}</h3><p>{highlight.detail}</p></article>)}</div></section>
        {(person.work || person.invention || person.leadership || person.signature.media?.available) && <section className={person.signature.media?.available ? "profile-work" : "profile-work profile-work--text-only"}><div><p className="profile-kicker">05 / Work & contribution</p>{person.invention && <div className="profile-work__lead"><h3>Invention & IP</h3><p>{person.invention}</p></div>}{person.work?.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}{person.leadership?.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>{person.signature.media?.available && <MediaSlot media={person.signature.media} />}</section>}
        <footer className="profile-footer"><span className="profile-kicker">External profile</span><div>{person.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div></footer>
      </div>
  );
}
