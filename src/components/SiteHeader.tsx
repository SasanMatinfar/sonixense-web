"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import MobileMenu from "@/components/layout/MobileMenu";
import HomeLogoLink from "@/components/brand/HomeLogoLink";

const links = [["Technology", "/#technology"], ["Surgery", "/#surgery"], ["Science", "/#science"], ["Team", "/#team"], ["Talk to us", "mailto:contact@sonixense.com"]] as const;

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > .hero, main > .chapter"));
    let frame = 0;
    let active: HTMLElement | undefined;
    header.style.removeProperty("--header-tone");

    const update = () => {
      frame = 0;
      const line = header.getBoundingClientRect().bottom + 24;
      const section = sections.find((item) => {
        const bounds = item.getBoundingClientRect();
        return bounds.top <= line && bounds.bottom > line;
      });
      if (!section || section === active) return;
      active = section;
      const style = getComputedStyle(section);
      const tone = style.getPropertyValue(section.classList.contains("hero") ? "--env-01" : "--env-a").trim();
      if (tone) header.style.setProperty("--header-tone", tone);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return <header ref={headerRef} className="site-header">
    <div className="site-container site-header__inner">
      <HomeLogoLink />
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <MobileMenu />
    </div>
  </header>;
}
