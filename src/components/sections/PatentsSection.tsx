import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

const areas = [
  { name: "Complex medical data sonification", icon: "data" },
  { name: "Surgical navigation", icon: "navigation" },
  { name: "Ophthalmology", icon: "eye" },
  { name: "Cardiac surgery", icon: "heart" },
  { name: "Ultrasound", icon: "ultrasound" },
] as const;

function AreaIcon({ kind }: { kind: (typeof areas)[number]["icon"] }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "data" && <><path d="M8 10h22M8 17h15M8 24h9M8 31h12M8 38h22" /><path d="M25 24h4l3-10 5 25 4-15h3" /></>}
    {kind === "navigation" && <><circle cx="24" cy="24" r="13" /><circle cx="24" cy="24" r="4" /><path d="M24 4v9m0 22v9M4 24h9m22 0h9" /></>}
    {kind === "eye" && <><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" /><circle cx="24" cy="24" r="7" /><circle cx="24" cy="24" r="2" /></>}
    {kind === "heart" && <><path d="M24 40 8 25C-2 13 13 2 24 14 35 2 50 13 40 25L24 40Z" /><path d="M9 24h9l3-7 5 14 3-7h10" /></>}
    {kind === "ultrasound" && <><path d="m20 8 8 0 14 30a35 35 0 0 1-36 0L20 8Z" /><path d="M17 18a15 15 0 0 0 14 0M13 27a25 25 0 0 0 22 0M9 35a33 33 0 0 0 30 0" /></>}
  </svg>;
}

export default function PatentsSection() {
  return (
    <section id="patents" className="chapter chapter--patents" aria-labelledby="patents-title">
      <Container>
        <SectionLabel>06 — Patents</SectionLabel>
        <div className="patents__heading patents__heading--summary">
          <h2 id="patents-title">Protected <em>technology.</em></h2>
          <p>SoniXense’s technology is protected by multiple patents in sound-based interaction and perceptual technologies.</p>
        </div>
        <div className="patent-scope">
          <div className="patent-scope__identity">
            <svg className="patent-scope__emblem" viewBox="0 0 360 320" fill="none" aria-hidden="true">
              <circle className="patent-scope__orbit" cx="180" cy="156" r="132" />
              <circle className="patent-scope__orbit" cx="180" cy="156" r="110" />
              <path className="patent-scope__paper" d="M112 48h100l40 40v170H112Z" />
              <path d="M212 48v40h40M137 113h88M137 134h66M137 155h48" />
              <path className="patent-scope__seal" d="m219 180 39 14v32c0 24-21 39-39 47-18-8-39-23-39-47v-32Z" />
              <path className="patent-scope__check" d="m202 223 12 12 24-27" />
              <path d="M137 211h22M137 230h15" />
            </svg>
            <p>Multiple patents.<br /><em>One protected platform.</em></p>
          </div>
          <div className="patent-scope__areas">
            <p className="patent-scope__label">Areas of protection</p>
            <ul>{areas.map((area) => <li key={area.icon}><span className="patent-scope__icon"><AreaIcon kind={area.icon} /></span><h3>{area.name}</h3></li>)}</ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
