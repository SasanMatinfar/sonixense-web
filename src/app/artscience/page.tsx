import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import VideoFacade from "@/components/media/VideoFacade";

export const metadata: Metadata = { title: "ArtScience", description: "Where sonification meets art and experience design — a SoniXense practice area.", alternates: { canonical: "/artscience" }, openGraph: { title: "SoniXense — ArtScience", description: "Where sonification meets art and experience design — a SoniXense practice area.", url: "/artscience" } };
const videos = [{ id: "329952640", title: "ArtScience film" }, { id: "1064898268", title: "ArtScience film 2" }, { id: "124601569", title: "ArtScience film 3" }];

export default function ArtSciencePage() { return <><SiteHeader /><main id="main-content"><article className="section artscience-page"><Container><Link href="/" className="section-label">← Back to SoniXense</Link><header className="artscience-page__header"><SectionLabel>Practice area / ArtScience</SectionLabel><h1>Where science,<br />technology, and art<br /><em>converge.</em></h1><p>For creative-technology and experience-design partners building multisensory installations and interactions.</p><blockquote>Navid Navab — Media artist and creative technologist working across kinetic sculpture, sound art, and responsive installations exhibited internationally, 2008–2024.</blockquote></header><div className="artscience-page__media">{videos.map((video) => <VideoFacade key={video.id} provider="vimeo" videoId={video.id} title={video.title} />)}</div></Container></article></main><SiteFooter /></>; }
