export default function MovementTag({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="movement__tag"><span>{index}</span>{children}</p>;
}
