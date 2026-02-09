import { site } from "@/content/siteContent";

export default function Main() {
  const { title, subtitle, heroImage } = site.main;

  return (
    <section className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        
        {/* Title */}
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-white/70 leading-relaxed">
          {subtitle}
        </p>

        {/* Image block */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-2">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}