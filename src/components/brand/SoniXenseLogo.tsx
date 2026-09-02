import Image from "next/image";
import horizontalOnDark from "../../../SoniXense-Brand-Kit/01-Logo/SVG/sonixense-horizontal-on-dark.svg";
import wordmarkWhite from "../../../SoniXense-Brand-Kit/01-Logo/SVG/sonixense-wordmark-white.svg";

export default function SoniXenseLogo({ variant = "horizontal" }: { variant?: "horizontal" | "wordmark" }) {
  const wordmark = variant === "wordmark";
  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      <Image
        className="brand-logo__asset"
        src={wordmark ? wordmarkWhite : horizontalOnDark}
        alt=""
        width={wordmark ? 158 : 166}
        height={wordmark ? 17 : 32}
        priority={!wordmark}
      />
    </span>
  );
}
