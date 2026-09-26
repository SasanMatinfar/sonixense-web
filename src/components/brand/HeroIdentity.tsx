import Image from "next/image";
import logo from "../../../SoniXense-Brand-Kit/01-Logo/SVG/sonixense-horizontal-white.svg";

export default function HeroIdentity() {
  return (
    <div className="hero-identity" aria-hidden="true">
      <Image
        className="hero-identity__pattern"
        src="/images/hero/sonixense-identity-pattern.png"
        alt=""
        width={684}
        height={922}
        priority
        sizes="(max-width: 640px) 80vw, (max-width: 900px) 34vw, 30vw"
      />
      <Image className="hero-identity__logo" src={logo} alt="" />
    </div>
  );
}
