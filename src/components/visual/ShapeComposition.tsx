export type ShapeVariant =
  | "nested-portal"
  | "overlap"
  | "edge-arch"
  | "signal-layers"
  | "circle-intersection";

type ShapeCompositionProps = {
  variant: ShapeVariant;
  intensity?: "low" | "medium" | "high";
  className?: string;
};

export default function ShapeComposition({
  variant,
  intensity = "medium",
  className = "",
}: ShapeCompositionProps) {
  return (
    <div
      className={`shape-composition shape-composition--${variant} shape-composition--${intensity} ${className}`}
      aria-hidden="true"
    >
      <i className="shape-composition__field shape-composition__field--1" />
      <i className="shape-composition__field shape-composition__field--2" />
      <i className="shape-composition__field shape-composition__field--3" />
      <i className="shape-composition__field shape-composition__field--4" />
      <i className="shape-composition__orb" />
    </div>
  );
}
