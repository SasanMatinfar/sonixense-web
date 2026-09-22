import SectionLabel from "@/components/ui/SectionLabel";
import PerceptionGapField from "@/components/PerceptionGapField";

export default function PerceptionSection() {
  return (
    <section id="perception" className="chapter chapter--perception" aria-labelledby="problem-title">
      <div className="gap-container">
        <div className="gap-stage">
          <header className="gap-stage__intro">
            <SectionLabel>02 — The perception gap</SectionLabel>
            <h2 id="problem-title">
              <span>Machines can scale perception.</span>
              <span>Human attention cannot.</span>
            </h2>
          </header>
          <PerceptionGapField>
            <p className="gap-field__automation">
              <span>As automation grows,</span> <span>this gap becomes more critical.</span>
            </p>
            <p className="gap-field__conclusion">
              <span>Decision is</span> <span>still <em>human.</em></span>
            </p>
          </PerceptionGapField>
        </div>
      </div>
    </section>
  );
}
