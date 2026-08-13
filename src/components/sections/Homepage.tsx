import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import SignatureI from "@/components/ui/SignatureI";
import LivingSonicField from "@/components/sonic-field/LivingSonicField";
import VideoFacade from "@/components/media/VideoFacade";
import FounderCard from "@/components/team/FounderCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/layout/SkipLink";
import { associations, humanEvents, machineEvents, technologyBehaviors } from "@/content/home";
import { people } from "@/content/people";
import { patentPortfolio, researchEcosystem, selectedPublications } from "@/content/research";

const platformFlow = [
  { step: "Sense", detail: "Sensors · Imaging · AI · Digital twins" },
  { step: "Understand", detail: "SoniXense Intelligence" },
  { step: "Sonify", detail: "Spatial · Interactive · Contextual sound" },
  { step: "Perceive", detail: "Human awareness · Decision · Action" },
] as const;

const surgeryCapabilities = [
  { name: "Navigation", detail: "Position · target · trajectory" },
  { name: "Tissue Interaction", detail: "Contact · deformation · force · structure" },
  { name: "Intelligent Assistance", detail: "AI · robotics · digital twins" },
] as const;

export default function Homepage() {
  return <><SkipLink /><SiteHeader /><main id="main-content">
    <section className="hero hero--living" aria-labelledby="hero-title"><LivingSonicField /><Container className="hero__grid"><div className="hero__copy"><SectionLabel>SoniXense</SectionLabel><h1 id="hero-title"><span>Beyond</span><em className="hero__vision-line" aria-label="Vision."><span aria-hidden="true">V<SignatureI />s<SignatureI />on.</span></em></h1><p className="hero__tagline">Empowering experiences through intelligent sonic innovation.</p><p className="hero__intro">SoniXense transforms complex information into intuitive auditory experiences that extend human perception beyond visual-only interfaces.</p><div className="button-row"><ButtonLink href="#experience">Experience SoniXense</ButtonLink><ButtonLink href="#technology" secondary>Discover the technology</ButtonLink></div></div></Container></section>

    <section className="section problem" aria-labelledby="problem-title"><Container><SectionLabel>The perception gap</SectionLabel><div className="problem__statements"><h2 id="problem-title">Machines can scale perception.<br />Human attention cannot.</h2><strong>Humans still make the <em>critical decisions.</em></strong></div><div className="capacity-field" aria-label="Scalable machine capacity compared with finite human perceptual bandwidth"><div className="capacity-field__machine"><p>Machine capacity expands</p><div>{machineEvents.map((event,index) => <span key={event} style={{ "--capacity-index": index } as CSSProperties}>{event}</span>)}</div></div><div className="capacity-field__bridge"><i /><strong>Perceptual<br />interface</strong><i /></div><div className="capacity-field__human"><p>Human capacity remains finite</p><div>{humanEvents.map((event) => <span key={event}>{event}</span>)}</div><small>One human decision-maker</small></div></div></Container></section>

    <section id="technology" className="section platform" aria-labelledby="technology-title"><Container><SectionLabel>SoniXense Technology</SectionLabel><div className="section-heading"><h2 id="technology-title">Machine intelligence becomes<br /><em>perceptual intelligence.</em></h2><p>One auditory intelligence platform, integrated into the systems people already use.</p></div><div className="platform-flow">{platformFlow.map((item,index) => <article key={item.step}><span>0{index + 1}</span><h3>{item.step}</h3><p>{item.detail}</p>{index < platformFlow.length - 1 ? <i aria-hidden="true">→</i> : null}</article>)}</div><div className="platform-capabilities">{technologyBehaviors.map((item) => <article key={item.name}><h3>{item.name === "Guide" ? "Navigate" : item.name}</h3><p>{item.lead}</p></article>)}</div></Container></section>

    <section id="experience" className="section demo" aria-labelledby="experience-title"><Container><div className="demo__header"><div><SectionLabel>Experience</SectionLabel><h2 id="experience-title">Put on headphones.<br /><em>Hear what you would normally watch.</em></h2></div><p>SoniXense should be heard, not over-explained.</p></div><VideoFacade provider="youtube" videoId="IuDm7Pg7I40" title="SoniXense surgical navigation film" /></Container></section>

    <section id="surgery" className="section surgery-frontier" aria-labelledby="surgery-title"><Container><SectionLabel>First frontier</SectionLabel><div className="surgery-frontier__heading"><h2 id="surgery-title">Surgery.</h2><p>Auditory intelligence for image-guided intervention, physical interaction, and increasingly intelligent operating-room systems.</p></div><div className="surgery-frontier__visual" role="img" aria-label="Abstract image-guided intervention field"><div className="surgery-frontier__anatomy"><span /><span /><span /></div><div className="surgery-frontier__instrument" /><div className="surgery-frontier__signal"><i /><i /><i /></div></div><div className="surgery-frontier__capabilities">{surgeryCapabilities.map((item,index) => <article key={item.name}><span>0{index + 1}</span><h3>{item.name}</h3><p>{item.detail}</p></article>)}</div></Container></section>

    <section id="artscience" className="section artscience-home" aria-labelledby="artscience-title"><Container><div className="artscience-home__grid"><div><SectionLabel>From science to experience</SectionLabel><h2 id="artscience-title">Where technology<br />becomes <em>ArtScience.</em></h2><p>The same technologies that make complex systems perceptible can create entirely new forms of human experience.</p><Link href="/artscience" className="artscience-home__link">Explore SoniXense ArtScience →</Link><div className="artscience-home__domains"><span>Medicine</span><span>Robotics</span><span>XR</span><span>Human–AI Interaction</span><span>ArtScience</span></div></div><VideoFacade provider="vimeo" videoId="329952640" title="SoniXense ArtScience film" /></div></Container></section>

    <section id="team" className="section team" aria-labelledby="team-title"><Container><SectionLabel>Co-founders</SectionLabel><div className="section-heading"><h2 id="team-title">Technology, medicine,<br />science, and art.</h2><p>A multidisciplinary founding team building one perceptual technology platform.</p></div><div className="team__grid">{people.map((person,index) => <FounderCard key={person.id} person={person} index={index} />)}</div></Container></section>

    <section id="company" className="section foundation" aria-labelledby="foundation-title"><Container><SectionLabel>Company · Science · IP</SectionLabel><div className="foundation__heading"><h2 id="foundation-title">Built on science.<br /><em>Protected by IP.</em></h2><p>SoniXense is a spin-off in formation emerging from the DFG-funded Synergia project and research at TUM CAMP.</p></div><div className="foundation__grid"><article className="foundation__origin"><span>Origin</span><h3>Research became technology.</h3><p>Peer-reviewed research, international scientific collaboration, and years of work across sonification, medical imaging, and computer-assisted procedures.</p><div>{researchEcosystem.map((group) => <p key={group.category}><small>{group.category}</small>{group.names.join(" · ")}</p>)}</div></article><article className="foundation__ip"><span>Protected technology</span><h3>{patentPortfolio.heading}</h3><p>{patentPortfolio.body}</p><ul><li>Auditory interaction technologies</li><li>Surgical navigation</li><li>Multimodal interfaces</li><li>Intelligent perceptual systems</li></ul><small>Selected public patent metadata pending approval.</small></article><article className="foundation__evidence"><span>Scientific evidence</span>{selectedPublications.map((item) => <div key={`${item.venue}-${item.year}`}><strong>{item.year}</strong><h3>{item.venue}</h3><p>{item.relevance}</p></div>)}<p className="foundation__award">3× Sonification Award winner</p></article></div><div className="foundation__links"><a href="https://synergia.camp.cit.tum.de/project/" target="_blank" rel="noopener noreferrer">Synergia project ↗</a><a href="https://www.cs.cit.tum.de/camp/start/" target="_blank" rel="noopener noreferrer">CAMP at TUM ↗</a></div></Container></section>

    <section className="institutions" aria-label="Research origins, funding, and scientific community"><Container><p>Research origins · funding · scientific community</p><div>{associations.map((item) => <figure key={item.name}><Image src={item.image} alt={`${item.name} logo`} width={item.width} height={item.height} sizes="120px" /><figcaption>{item.name}</figcaption></figure>)}</div></Container></section>

    <section id="contact" className="section closing-cta" aria-labelledby="closing-title"><Container><SectionLabel>Build with SoniXense</SectionLabel><h2 id="closing-title">Hear beyond vision.</h2><ButtonLink href="mailto:sasan.matinfar@tum.de">Talk to us →</ButtonLink></Container></section>
  </main><SiteFooter /></>;
}
