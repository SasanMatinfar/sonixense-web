import { site } from "@/content/siteContent";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-semibold tracking-tight text-white">
          {site.brand}
        </a>

        <nav className="hidden gap-6 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 hover:text-white transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition"
        >
          Request demo
        </a>
      </div>
    </header>
  );
}