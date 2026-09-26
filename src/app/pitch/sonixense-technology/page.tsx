import TechnologyField from "@/components/TechnologyField";
import "../pitch.css";

/** Canonical slide composition, independent of the responsive website section. */
export default function TechnologyPitch() {
  return (
    <main className="pitch pitch--technology">
      <header>
        <p>03 — SONIXENSE TECHNOLOGY</p>
        <h1>From complex machine information<br /><em>to perceptually organized sound.</em></h1>
      </header>
      <p className="pitch__intro">SoniXense transforms complex, multimodal system data into high-level insights through intuitive auditory cues.</p>
      <div className="pitch__diagram"><TechnologyField pitch /></div>
    </main>
  );
}
