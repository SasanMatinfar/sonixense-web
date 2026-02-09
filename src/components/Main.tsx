import { site } from "@/content/siteContent";

export default function Main() {
  const { title, subtitle, heroImage } = site.main;

  return (
    <section className="min-h-screen bg-black px-6 text-white flex items-center">
      <div className="mx-auto w-full max-w-3xl text-center">

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-white/70 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="block w-full object-contain max-h-[48vh]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}