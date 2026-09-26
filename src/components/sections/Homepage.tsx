import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroIdentity from "@/components/brand/HeroIdentity";
import PerceptionSection from "@/components/sections/PerceptionSection";
import SiteHeader from "@/components/SiteHeader";
import SkipLink from "@/components/layout/SkipLink";
import TechnologySection from "@/components/sections/TechnologySection";
import SurgerySection from "@/components/sections/SurgerySection";
import ScienceSection from "@/components/sections/ScienceSection";
import PatentsSection from "@/components/sections/PatentsSection";
import TeamSection from "@/components/sections/TeamSection";
import BuildSection from "@/components/sections/BuildSection";

export default function Homepage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <section id="hero" className="hero hero--living" aria-labelledby="hero-title">
          <HeroIdentity />
          <Container className="hero__grid">
            <div className="hero__copy">
              <SectionLabel>01 — SoniXense</SectionLabel>
              <h1 id="hero-title">
                <span>Beyond</span>
                <span className="hero__vision-line">Vision.</span>
              </h1>
              <p className="hero__tagline">
                Auditory intelligence for complex human–machine systems.
              </p>
              <p className="hero__intro">
                SoniXense transforms complex surgical data into meaningful auditory intelligence, helping surgeons perceive critical information without looking away from the patient. From navigation and tissue interaction to AI-driven insights, we add a new perceptual channel to surgery.
              </p>
              <div className="button-row">
                <ButtonLink href="#experience">Experience SoniXense</ButtonLink>
                <a className="hero__secondary-link" href="mailto:contact@sonixense.com">
                  Talk to us <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Container>
        </section>

        <PerceptionSection />

        <TechnologySection />
        <SurgerySection />
        <ScienceSection />
        <PatentsSection />
        <TeamSection />
        <BuildSection />
      </main>
    </>
  );
}
