"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  ["01", "Technology", "/#technology"], ["02", "Applications", "/#surgery"],
  ["03", "ArtScience", "/#artscience"], ["04", "Team", "/#team"], ["05", "Company", "/#company"],
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const panel = document.getElementById("mobile-menu");
        const focusable = panel?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!focusable?.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKeyDown); trigger?.focus(); };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} type="button" className="menu-trigger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>Menu</button>
      {open ? <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
        <div className="mobile-menu__top"><span className="wordmark">soniXense</span><button ref={closeRef} type="button" className="menu-close" onClick={() => setOpen(false)} aria-label="Close navigation">×</button></div>
        <nav aria-label="Mobile navigation" className="mobile-menu__nav">
          {links.map(([index, label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}><span>{index}</span>{label}</a>)}
        </nav>
        <div className="mobile-menu__footer"><a className="mobile-menu__cta" href="mailto:sasan.matinfar@tum.de">Get in Touch</a><a className="mobile-menu__social" href="https://www.linkedin.com/in/sasan-matinfar" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div>
      </div> : null}
    </>
  );
}
