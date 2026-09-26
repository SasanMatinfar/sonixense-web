"use client";

import FounderProfile from "./FounderProfile";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Person } from "@/content/people";

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
      {open && <FounderProfile person={person} />}
    </dialog>
  </>;
}
