import Link from "next/link";
import { notFound } from "next/navigation";
import { people } from "@/content/people";
import FounderProfile from "@/components/team/FounderProfile";

export function generateStaticParams() { return people.map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = people.find((p) => p.id === slug);
  return { title: person?.name ?? "Co-founder", alternates: { canonical: `/team/${slug}` } };
}
export default async function FounderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = people.find((p) => p.id === slug);
  if (!person) notFound();
  return <main className="founder-profile founder-page"><nav className="founder-page-nav"><Link href="/#team">← All co-founders</Link></nav><FounderProfile person={person} /></main>;
}
