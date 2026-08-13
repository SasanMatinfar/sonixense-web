export type SonicFieldMode = "hero" | "overload" | "intelligence" | "integration" | "navigation" | "final";

export default function SonicFieldFallback({ mode = "hero", className = "" }: { mode?: SonicFieldMode; className?: string }) {
  return (
    <div className={`sonic-field sonic-field--${mode} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 800 620" role="presentation">
        <defs>
          <radialGradient id={`perception-${mode}`}>
            <stop offset="0" stopColor="var(--color-perception)" stopOpacity=".24" />
            <stop offset="1" stopColor="var(--color-perception)" stopOpacity="0" />
          </radialGradient>
          <pattern id={`grid-${mode}`} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="var(--color-structure)" strokeOpacity=".16" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="620" fill={`url(#grid-${mode})`} />
        <ellipse className="sonic-field__region" cx="520" cy="285" rx="210" ry="170" fill={`url(#perception-${mode})`} />
        <g className="sonic-field__structure" fill="none" stroke="var(--color-structure)" strokeWidth="1.5">
          <path d="M62 478C184 368 250 443 346 326S545 120 742 168" />
          <path d="M85 186C204 250 290 198 377 262S535 420 720 378" opacity=".55" />
          <path d="M194 548L267 113M425 555L593 72" opacity=".3" />
        </g>
        <g className="sonic-field__trajectory" fill="none" stroke="var(--color-foreground)" strokeDasharray="5 11" strokeOpacity=".55">
          <path d="M124 488Q365 394 622 193" />
        </g>
        <g fill="var(--color-foreground)">
          <circle cx="124" cy="488" r="3" /><circle cx="346" cy="326" r="3" /><circle cx="622" cy="193" r="3" />
          <circle cx="235" cy="228" r="2" opacity=".55" /><circle cx="490" cy="433" r="2" opacity=".55" />
        </g>
        <g className="sonic-field__vision-boundary" fill="none" stroke="var(--color-perception)" strokeOpacity=".58">
          <path d="M485 72V548" strokeDasharray="2 9" /><path d="M485 94C548 148 548 472 485 526" opacity=".35" />
        </g>
        <g className="sonic-field__resonance" fill="none" stroke="var(--color-perception-secondary)" strokeOpacity=".42">
          <ellipse cx="625" cy="193" rx="54" ry="25" /><ellipse cx="625" cy="193" rx="88" ry="46" /><ellipse cx="625" cy="193" rx="127" ry="70" />
        </g>
        <g className="sonic-field__target" fill="none" stroke="var(--color-action)">
          <circle cx="622" cy="193" r="29" /><circle cx="622" cy="193" r="9" fill="var(--color-action)" />
          <path d="M622 144V164M622 222V242M573 193H593M651 193H671" />
        </g>
        <g className="sonic-field__signal" fill="var(--color-action)">
          <circle cx="346" cy="326" r="6" /><circle cx="424" cy="279" r="4" /><circle cx="520" cy="234" r="3" />
        </g>
      </svg>
    </div>
  );
}
