import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

const researchAreas = [
  "Sonification", "Spatial audio", "Medical XR", "Vibroacoustics",
  "AI / computational modeling", "Human perception", "Clinical interaction",
] as const;

const progression = [
  ["Science", "The DFG-funded Synergia project, a collaboration of TUM and TU Dresden, anchored at the TUM CAMP chair."],
  ["Translation", "Years of work in sonification, medical imaging and computer-assisted procedures, carried from research prototypes toward clinical workflows."],
  ["Company", "SoniXense is a spin-off in formation, emerging from Synergia and research at TUM CAMP."],
] as const;

export default function ScienceSection() {
  return (
    <section id="science" className="chapter chapter--science scientific-foundation" aria-labelledby="scientific-foundation-title">
      <Container>
        <SectionLabel>05 — Scientific foundation</SectionLabel>
        <div className="scientific-foundation__heading">
          <h2 id="scientific-foundation-title">
            Funded research,
            <br />
            <em>translated into technology.</em>
          </h2>
          <p>SoniXense grows out of a publicly funded academic research ecosystem, not a lab demo.</p>
        </div>

        <article className="scientific-foundation__anchor science-anchor">
          <div className="science-anchor__copy">
            <span className="scientific-foundation__kicker">DFG-funded research</span>
            <h3>SYNERGIA</h3>
            <p className="scientific-foundation__subtitle">Multisensory Integration in High-Intensity Environments — Bridging AI Analysis and Human Perception.</p>
            <p className="scientific-foundation__description">An interdisciplinary project investigating sonification, spatial audio, AI and human perception in demanding surgical environments.</p>
            <p className="scientific-foundation__metadata">Academic research ecosystem · TUM / CAMP · TU Dresden</p>
            <a href="https://synergia.camp.cit.tum.de/" target="_blank" rel="noopener noreferrer">Explore Synergia ↗</a>
          </div>
          <div className="science-anchor__visual">
            <div className="scientific-foundation__research-field" aria-hidden="true">
              <span>Imaging / sensing</span><span>Computational models</span><span>Spatial audio</span>
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <ul className="science-anchor__areas" aria-label="Research areas">
              {researchAreas.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </article>

        <ol className="progression" aria-label="From science to company">
          {progression.map(([name, text], i) => (
            <li key={name}><span>0{i + 1}</span><strong>{name}</strong><p>{text}</p></li>
          ))}
        </ol>

        <div className="scientific-foundation__support science-support">
          <div><span>Peer-reviewed research</span><p>MICCAI · IPMI · IEEE · Scientific Reports · Medical Image Analysis</p></div>
          <a href="https://www.cs.cit.tum.de/camp/start/" target="_blank" rel="noopener noreferrer">CAMP at TUM ↗</a>
        </div>

        <a className="chapter-handoff" href="#patents">
          <span>Research</span><i aria-hidden="true">→</i><span>Invention</span><i aria-hidden="true">→</i><span>Protected technology</span>
        </a>
      </Container>
    </section>
  );
}
