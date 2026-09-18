"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Person, ProfileMedia } from "@/content/people";

function MediaSlot({ media }: { media: ProfileMedia }) {
  return <div className="profile-media" data-asset={media.src} role="img" aria-label={media.available ? media.alt : `${media.alt}. Photograph pending.`}>
    {media.available ? <Image src={media.src} alt="" fill sizes="(max-width: 700px) 100vw, 70vw" style={{ objectFit: "cover" }} /> : <><span className="profile-media__line" aria-hidden="true" /><span>Image forthcoming</span><strong>{media.label}</strong></>}
  </div>;
}

export default function FounderDialog({ person, children }: { person: Person; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = dialog.current; if (!node) return; if (open && !node.open) node.showModal(); else if (!open && node.open) node.close(); }, [open]);
  useEffect(() => { const node = dialog.current; if (!node) return; const close = () => { setOpen(false); trigger.current?.focus(); }; node.addEventListener("close", close); return () => node.removeEventListener("close", close); }, []);

  return <>
    <button ref={trigger} type="button" className="founder-card__trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>{children}</button>
    <dialog ref={dialog} className="founder-dialog founder-profile" aria-labelledby={`${person.id}-title`} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <button type="button" className="founder-dialog__close" onClick={() => dialog.current?.close()} aria-label={`Close ${person.name} profile`}>×</button>
      <div className="profile-inner">
        <header className="profile-opening">
          <div className="profile-opening__copy"><p className="profile-kicker">Co-founder profile / {person.title}</p><h2 id={`${person.id}-title`}>{person.name}</h2><p className="profile-discipline">{person.expertise}</p><p className="profile-statement">{person.statement}</p></div>
          <div className="profile-portrait"><Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></div>
        </header>
        <section className="profile-signature" aria-labelledby={`${person.id}-signature`}><p className="profile-kicker">01 / {person.signature.label}</p><h3 id={`${person.id}-signature`}>{person.signature.title}</h3><p>{person.signature.description}</p>{person.signature.sequence && <div className="profile-sequence">{person.signature.sequence.map((step, index) => <span key={step}>{index > 0 && <i aria-hidden="true">→</i>}{step}</span>)}</div>}</section>
        <section className="profile-biography" aria-label="Biography"><p className="profile-kicker">02 / Biography</p><div>{person.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
        {person.awards?.length ? <section className="profile-awards" aria-label="Awards and recognition"><p className="profile-kicker">03 / Awards & recognition</p><div className="profile-awards__grid">{person.awards.map((award) => <article className={award.featured ? "profile-award profile-award--featured" : "profile-award"} key={award.title}><MediaSlot media={award.media} /><div><h3>{award.title}</h3><p>{award.context}</p></div></article>)}</div></section> : null}
        {person.metrics && <div className="profile-metrics">{person.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
        <section className="profile-highlights"><p className="profile-kicker">04 / Selected highlights</p><div>{person.highlights.map((highlight) => <article key={highlight.title}><h3>{highlight.title}</h3><p>{highlight.detail}</p></article>)}</div></section>
        {(person.work || person.invention || person.leadership || person.signature.media) && <section className="profile-work"><div><p className="profile-kicker">05 / Work & contribution</p>{person.invention && <div className="profile-work__lead"><h3>Invention & IP</h3><p>{person.invention}</p></div>}{person.work?.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}{person.leadership?.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>{person.signature.media && <MediaSlot media={person.signature.media} />}</section>}
        <footer className="profile-footer"><span className="profile-kicker">External profile</span><div>{person.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div></footer>
      </div>
    </dialog>
  </>;
}
