import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import MovementTag from "@/components/ui/MovementTag";
import VideoFacade from "@/components/media/VideoFacade";
import TechnologyField from "@/components/TechnologyField";

const deploySystems = ["Imaging", "Navigation", "Robotics", "XR", "Intelligent sensing"] as const;
const deployFacts = [
  ["API · SDK", "A software layer that plugs into existing pipelines."],
  ["Hardware-independent", "Works with the imaging, tracking and robotic systems already in place."],
  ["Real-time rendering", "Low-latency output to speakers, headphones and XR audio."],
] as const;

export default function TechnologySection() {
  return (
    <section id="technology" className="chapter chapter--technology" aria-labelledby="technology-title">
      <Container>
        <SectionLabel>03 — SoniXense Technology</SectionLabel>

        <div className="tech-open">
          <h2 id="technology-title">From complex machine information<br /><em>to perceptually organized sound.</em></h2>
        </div>

        <div className="tf-wrap">
          <p className="tf__intro">SoniXense transforms complex, multimodal system data into high-level insights through intuitive auditory cues.</p>
          <TechnologyField />
        </div>

        <div className="movement movement--experience" id="experience">
          <MovementTag index="03B">Experience</MovementTag>
          <div className="experience__bridge" aria-hidden="true">
            <span>You just watched the system become sound</span><i>→</i><span>Now hear it</span>
          </div>
          <div className="demo__header">
            <h3>Put on headphones.<br /><em>Hear what you would normally watch.</em></h3>
            <p>SoniXense should be heard, not over-explained.</p>
          </div>
          <VideoFacade provider="youtube" videoId="IuDm7Pg7I40" title="SoniXense surgical navigation film" />
        </div>

        <div className="movement" id="deployment">
          <MovementTag index="03C">Deployment</MovementTag>
          <div className="movement__head">
            <h3>Built to run inside <em>real systems.</em></h3>
            <p>SoniXense is a software intelligence layer for the imaging, sensing, navigation, robotic and XR systems already in use.</p>
          </div>
          <div className="deploy">
            <div className="deploy__systems">{deploySystems.map((s) => <span key={s}>{s}</span>)}</div>
            <div className="deploy__layer"><small>Software intelligence layer</small><strong>SoniXense</strong></div>
            <p className="deploy__out"><span aria-hidden="true">↓</span> Speakers · Headphones · XR audio</p>
            <ul className="deploy__facts">
              {deployFacts.map(([name, text]) => <li key={name}><strong>{name}</strong><span>{text}</span></li>)}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
