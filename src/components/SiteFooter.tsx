import Link from "next/link";
import Container from "@/components/ui/Container";

export default function SiteFooter() {
  return <footer className="site-footer"><Container className="site-footer__inner">
    <div><Link href="/" className="wordmark">SoniXense</Link><p>Creative deep tech for auditory interaction.</p></div>
    <nav aria-label="Footer navigation"><Link href="/#technology">Technology</Link><Link href="/#surgery">Applications</Link><Link href="/#artscience">ArtScience</Link><Link href="/#team">Team</Link><Link href="/#company">Science &amp; IP</Link><Link href="/#integration">Company</Link></nav>
    <div className="site-footer__contact"><a href="mailto:contact@sonixense.com">Contact</a><a href="https://www.linkedin.com/company/sonixense" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><span>Munich, Germany</span></div>
    <p className="site-footer__legal">© {new Date().getFullYear()} SoniXense — spin-off in formation</p>
  </Container></footer>;
}
