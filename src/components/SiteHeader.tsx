import MobileMenu from "@/components/layout/MobileMenu";
import HomeLogoLink from "@/components/brand/HomeLogoLink";

const links = [["Technology", "/#technology"], ["Surgery", "/#surgery"], ["Science", "/#science"], ["Team", "/#team"], ["Build", "/#build"]] as const;

export default function SiteHeader() {
  return <header className="site-header">
    <div className="site-container site-header__inner">
      <HomeLogoLink />
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <MobileMenu />
    </div>
  </header>;
}
