import { site } from "@/content/siteContent";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
            {site.hero.badge}
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {site.hero.headline}
          </h1>

          <p className="text-base leading-relaxed text-white/70 md:text-lg">
            {site.hero.subheadline}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={site.hero.ctaPrimary.href}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:opacity-90 transition"
            >
              {site.hero.ctaPrimary.label}
            </a>
            <a
              href={site.hero.ctaSecondary.href}
              className="rounded-full border border-white/20 bg-white/0 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition"
            >
              {site.hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* right side: placeholder “demo frame” */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="rounded-xl border border-white/10 bg-black p-4">
            <div className="text-xs text-white/60">Preview</div>
            <div className="mt-3 h-48 w-full rounded-lg border border-white/10 bg-white/5 md:h-64" />
            <div className="mt-4 text-sm text-white/70">
              Replace this block with a hero video (optional).
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}