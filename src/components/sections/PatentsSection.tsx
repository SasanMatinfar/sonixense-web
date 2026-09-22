import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

// Legal status: both records below are published European patent applications (Technische Universität München).
// Neither is described as granted. Google Patents currently lists both as no longer pending; confirm before any
// claim about status beyond "published application".
const inventions = [
  {
    id: "data-to-sound",
    number: "EP4535160A1",
    kind: "Published European patent application",
    title: "Data-to-Sound interactive feedback",
    text: "Multidimensional data features — position, density, tissue class — become sound through a sound model: direct mapping, physical modeling, or learned.",
    href: "https://patents.google.com/patent/EP4535160A1/en",
  },
  {
    id: "tool-adjustment",
    number: "EP4186456A1",
    kind: "Published European patent application",
    title: "Multi-dimensional tool adjustment based on acoustic signal",
    text: "Several acoustic properties — pitch, pulsing, loudness — each carry one degree of freedom and converge as a tool approaches its target.",
    href: "https://patents.google.com/patent/EP4186456A1/en",
  },
] as const;

const furtherInventions = [
  "Auditory support for retinal membrane peeling",
  "Auditory surgical navigation and intraprocedural guidance",
  "Auditory augmentation of ultrasound-guided tool–tissue interaction",
  "Physics-based surgical sonification",
] as const;

const wave = [
  "M0 55 C20 55 21 22 39 22 S57 89 73 89 S90 36 106 36 S125 71 139 71 S158 49 180 49",
  "M0 55 C19 55 22 37 39 37 S57 73 73 73 S90 44 106 44 S125 63 139 63 S158 53 180 53",
  "M0 55 C21 55 23 47 39 47 S57 63 73 63 S90 51 106 51 S125 58 139 58 S158 55 180 55",
];

export default function PatentsSection() {
  return (
    <section id="patents" className="chapter chapter--patents" aria-labelledby="patents-title">
      <Container>
        <SectionLabel>06 — Patents</SectionLabel>
        <div className="patents__heading">
          <h2 id="patents-title">Protected <em>technology.</em></h2>
          <p>The methods that turn data and interaction into sound are documented as inventions, not just implemented as software.</p>
        </div>

        <div className="patents__figures">
          <article className="patents__figure patents__figure--lead">
            <div className="patents__diagram" role="img" aria-label="Multidimensional data passes through a sound model and becomes an auditory representation">
              <div className="patents__lattice" aria-hidden="true">
                {Array.from({ length: 20 }).map((_, i) => <i key={i} />)}
              </div>
              <span className="patents__node">Sound<br />model</span>
              <svg viewBox="0 0 180 110" preserveAspectRatio="none" aria-hidden="true">{wave.map((d) => <path key={d} d={d} />)}</svg>
              <code className="patents__number">{inventions[0].number}</code>
              <small className="patents__stage patents__stage--a">Multidimensional data</small>
              <small className="patents__stage patents__stage--b">Modeling</small>
              <small className="patents__stage patents__stage--c">Auditory representation</small>
            </div>
            <Caption item={inventions[0]} />
          </article>

          <article className="patents__figure">
            <div className="patents__diagram patents__diagram--tracks" role="img" aria-label="Pitch, pulsing and loudness converge toward target values as a tool approaches its target">
              <div className="patents__tracks" aria-hidden="true">
                <span><b>Pitch</b><i /></span><span><b>Pulsing</b><i /></span><span><b>Loudness</b><i /></span>
                <em />
              </div>
              <code className="patents__number">{inventions[1].number}</code>
              <small className="patents__stage patents__stage--a">Tool position</small>
              <small className="patents__stage patents__stage--c">Converging acoustic properties</small>
            </div>
            <Caption item={inventions[1]} />
          </article>
        </div>

        <div className="patents__portfolio">
          <p className="patents__portfolio-label">Further inventions in the portfolio</p>
          <ul>{furtherInventions.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="patents__note">Applications and patent families in this portfolio have different legal statuses; only the two records above are cited by number.</p>
        </div>
      </Container>
    </section>
  );
}

function Caption({ item }: { item: (typeof inventions)[number] }) {
  return (
    <div className="patents__caption">
      <small>{item.kind}</small>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <a href={item.href} target="_blank" rel="noopener noreferrer">View {item.number} ↗</a>
    </div>
  );
}
