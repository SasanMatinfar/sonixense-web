import { site } from "@/content/siteContent";

export default function Main() {
  const { title, subtitle, heroImage, endtitle } = site.main;

  return (
    <section className="min-h-screen px-6 text-white flex items-center bg-[rgb(var(--bg))]">
      <div className="mx-auto w-full max-w-3xl text-center">

    <h1 className="heading-font text-7xl sm:text-8xl font-semibold tracking-tight">
        {title}
    </h1>

        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#DB5F42]">
            {subtitle}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="block w-full object-contain max-h-[48vh]"
            />
            <p className="mt-6 text-sm tracking-wide text-[#DB5F42]">
                {endtitle}
            </p>
          </div>
        </div>
        <div className="mb-6 flex justify-center gap-3">
</div>

      </div>
    </section>
  );
}