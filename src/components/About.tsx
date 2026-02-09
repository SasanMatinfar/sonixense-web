import { site } from "@/content/siteContent";

export default function About() {
  return (
    <section id="about" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-white">{site.about.title}</h2>
        <p className="mt-3 max-w-2xl text-white/70 leading-relaxed">
          {site.about.text}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {site.about.people.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageSrc}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-sm text-white/70">{p.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}