"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Person } from "@/content/people";

function ProfileSection({ title, items }: { title: string; items?: readonly string[] }) {
  if (!items?.length) return null;
  return <section><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default function FounderDialog({ person, children }: { person: Person; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => { const node = dialog.current; if (!node) return; if (open && !node.open) node.showModal(); else if (!open && node.open) node.close(); }, [open]);
  useEffect(() => { const node = dialog.current; if (!node) return; const close = () => { setOpen(false); trigger.current?.focus(); }; node.addEventListener("close", close); return () => node.removeEventListener("close", close); }, []);

  return <>
    <button ref={trigger} type="button" className="founder-card__trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>{children}</button>
    <dialog ref={dialog} className="founder-dialog" onClick={(event) => { const node = dialog.current; if (!node) return; const bounds = node.getBoundingClientRect(); const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom; if (outside) node.close(); }}>
      <button type="button" className="founder-dialog__close" onClick={() => dialog.current?.close()} aria-label={`Close ${person.name} profile`}>×</button>
      <div className="founder-dialog__layout"><div className="founder-dialog__image"><Image src={person.image} alt="" fill sizes="(max-width: 700px) 80vw, 360px" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></div>
      <div><p className="section-label">{person.title} / {person.expertise}</p><h2>{person.name}</h2><p className="founder-dialog__affiliation">{person.affiliation}</p><p className="founder-dialog__bio">{person.bio}</p><p className="founder-dialog__credit">{person.credibility}</p><div className="founder-dialog__expertise"><h3>Expertise</h3><ul>{person.expertiseAreas.map((area) => <li key={area}>{area}</li>)}</ul></div><div className="founder-dialog__details"><ProfileSection title="Selected research and projects" items={person.selectedProjects} /><ProfileSection title="Selected publications" items={person.selectedPublications} /><ProfileSection title="Patents" items={person.patents} /><ProfileSection title="Awards" items={person.awards} /></div><a href={person.profileHref} target="_blank" rel="noopener noreferrer">External profile ↗</a></div></div>
    </dialog>
  </>;
}
