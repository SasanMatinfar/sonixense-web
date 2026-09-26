import PerceptionGapField from "@/components/PerceptionGapField";
import "../pitch.css";
export default function PerceptionPitch() {
  return <main className="pitch pitch--gap"><header><p>The perception gap</p><h1>Machines can scale perception.<br />Human attention cannot.</h1></header><div className="pitch__diagram"><PerceptionGapField pitch><p className="gap-field__conclusion">Decision is still <em>human.</em></p></PerceptionGapField></div></main>;
}
