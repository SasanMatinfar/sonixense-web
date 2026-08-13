import Link from "next/link";
import Container from "@/components/ui/Container";

export default function SiteFooter() {
  return <footer className="site-footer"><Container className="site-footer__inner">
    <div><Link href="/" className="wordmark">SoniXense</Link><p>Creative deep tech for auditory interaction.</p></div>
    <nav aria-label="Footer navigation"><Link href="/#technology">Technology</Link><Link href="/#surgery">Applications</Link><Link href="/#evidence">Research</Link><Link href="/#company">Company</Link></nav>
    <div className="site-footer__contact"><a href="mailto:sasan.matinfar@tum.de">Contact</a><a href="https://www.linkedin.com/in/sasan-matinfar" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><span>Garching, Germany</span></div>
    <p className="site-footer__legal">© {new Date().getFullYear()} SoniXense — spin-off in formation</p>
  </Container></footer>;
}
