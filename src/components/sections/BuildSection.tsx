import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import ShapeComposition from "@/components/visual/ShapeComposition";
import SiteFooter from "@/components/SiteFooter";
import { associations } from "@/content/home";

export default function BuildSection() {
  return (
    <section id="build" className="chapter chapter--build" aria-labelledby="closing-title">
      <ShapeComposition variant="nested-portal" intensity="high" />
      <Container className="build__cta">
        <SectionLabel>08 — Build with SoniXense</SectionLabel>
        <h2 id="closing-title">Hear beyond vision.</h2>
        <p>Bring auditory intelligence into your system.</p>
        <ButtonLink href="mailto:contact@sonixense.com">Talk to us →</ButtonLink>
      </Container>
      <Container className="build__ecosystem">
        <h3 id="ecosystem-title">Research origins · funding · scientific community</h3>
        <div className="ecosystem__logos build__plate">
          {associations.map((item) => (
            <a className={`ecosystem__logo ecosystem__logo--${item.id}`} key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
              <span className="ecosystem__mark">
                <Image src={item.image} alt={item.name} width={item.width} height={item.height} sizes="(max-width: 640px) 42vw, 220px" />
              </span>
            </a>
          ))}
        </div>
      </Container>
      <SiteFooter />
    </section>
  );
}
