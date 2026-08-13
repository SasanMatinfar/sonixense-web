import Link from "next/link";

export default function ButtonLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  const className = secondary ? "button button--secondary" : "button button--primary";
  return href.startsWith("/") ? <Link href={href} className={className}>{children}</Link> : <a href={href} className={className}>{children}</a>;
}
