"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Person } from "@/content/people";

export default function FounderDialog({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => { const node = dialog.current; if (!node) return; if (open && !node.open) node.showModal(); else if (!open && node.open) node.close(); }, [open]);
  useEffect(() => { const node = dialog.current; if (!node) return; const close = () => { setOpen(false); trigger.current?.focus(); }; node.addEventListener("close", close); return () => node.removeEventListener("close", close); }, []);

  return <>
    <button ref={trigger} type="button" className="founder-card__more" onClick={() => setOpen(true)}>Read profile</button>
    <dialog ref={dialog} className="founder-dialog" onClick={(e) => { if (e.target === dialog.current) dialog.current.close(); }}>
      <button type="button" className="founder-dialog__close" onClick={() => dialog.current?.close()} aria-label={`Close ${person.name} profile`}>×</button>
      <div className="founder-dialog__layout"><div className="founder-dialog__image"><Image src={person.image} alt="" fill sizes="(max-width: 700px) 80vw, 360px" style={{ objectFit: "cover", objectPosition: person.imagePosition }} /></div>
      <div><p className="section-label">{person.title} / {person.expertise}</p><h2>{person.name}</h2><p className="founder-dialog__affiliation">{person.affiliation}</p><p className="founder-dialog__bio">{person.bio}</p><p className="founder-dialog__credit">{person.credibility}</p><a href={person.profileHref} target="_blank" rel="noopener noreferrer">External profile ↗</a></div></div>
    </dialog>
  </>;
}
