"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SoniXenseLogo from "@/components/brand/SoniXenseLogo";

export default function HomeLogoLink() {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className="wordmark"
      aria-label="SoniXense — Home"
      onClick={(event) => {
        if (pathname !== "/") return;
        event.preventDefault();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }}
    >
      <SoniXenseLogo />
    </Link>
  );
}
