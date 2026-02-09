import { site } from "@/content/siteContent";

export default function DemoShowreel() {
  return (
    <section id="demos" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-white">
          {site.demos.title}
        </h2>
        <p className="mt-2 text-sm text-white/60">{site.demos.note}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {site.demos.items.map((demo) => (
            <div
              key={demo.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="text-white font-medium">{demo.title}</div>
              <div className="mt-1 text-sm text-white/70">
                {demo.description}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
                <video
                  controls
                  preload="metadata"
                  className="h-auto w-full"
                  src={demo.videoSrc}
                />
              </div>

              <div className="mt-2 text-xs text-white/50">
                Put the video file in{" "}
                <code className="text-white/70">public/videos/</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}