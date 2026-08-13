export default function SoniXenseLogo() {
  return (
    <span className="brand-logo">
      <svg className="brand-logo__mark" viewBox="0 0 52 32" aria-hidden="true">
        <g fill="none" strokeLinecap="round">
          <path d="M2 7C12 7 13 15 24 15S37 5 50 5" stroke="var(--color-action)" strokeWidth="2" />
          <path d="M2 12C12 12 14 18 24 18S37 9 50 9" stroke="var(--color-action)" strokeOpacity=".72" strokeWidth="1.6" />
          <path d="M2 16C12 16 15 20 25 20S38 14 50 14" stroke="var(--color-perception)" strokeWidth="1.5" />
          <path d="M2 20C13 20 15 22 25 22S39 19 50 19" stroke="var(--color-perception)" strokeOpacity=".72" strokeWidth="1.35" />
          <path d="M2 24C13 24 16 24 26 24S39 24 50 24" stroke="var(--color-foreground)" strokeOpacity=".7" strokeWidth="1.2" />
          <path d="M2 28C14 28 17 26 27 26S40 28 50 28" stroke="var(--color-structure)" strokeWidth="1.2" />
        </g>
      </svg>
      <span className="brand-logo__wordmark">Soni<span>X</span>ense</span>
    </span>
  );
}
