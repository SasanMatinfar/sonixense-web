import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import SignatureI from "@/components/ui/SignatureI";
import LivingSonicField from "@/components/sonic-field/LivingSonicField";
import PerceptionGapField from "@/components/PerceptionGapField";
import VideoFacade from "@/components/media/VideoFacade";
import FounderCard from "@/components/team/FounderCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/layout/SkipLink";
import ShapeComposition from "@/components/visual/ShapeComposition";
import {
  associations,
} from "@/content/home";
import { people } from "@/content/people";
import {
  patentPortfolio,
  researchEcosystem,
  selectedPublications,
} from "@/content/research";

const technologyStages = [
  {
    step: "Integrate",
    title: "Multimodal data",
    detail: "Synchronize and fuse ultrasound/OCT, force sensing, tool pose, robotic states and AI-derived structures.",
    terms: ["Synchronization", "Spatial alignment", "Data fusion"],
  },
  {
    step: "Model",
    title: "System dynamics",
    detail: "Extract features and represent physical relationships, interactions and evolving system states.",
    terms: ["Feature extraction", "State estimation", "Interaction models"],
  },
  {
    step: "Sonify",
    title: "Sonification engine",
    detail: "Transform modeled dynamics into structured, multidimensional auditory representations.",
    terms: ["Model-driven", "Physics-based", "Adaptive mapping"],
  },
  {
    step: "Render",
    title: "Interactive audio",
    detail: "Render spatial and temporal sound in real time through existing audio systems and workflows.",
    terms: ["Real-time", "Spatial audio", "System integration"],
  },
] as const;

const surgeryCapabilities = [
  {
    name: "Ophthalmic surgery",
    focus: "Microscale tissue interaction",
    detail: "iOCT · imaging · tool tracking",
  },
  {
    name: "Cardiovascular intervention",
    focus: "Catheter–tissue interaction",
    detail: "Imaging · navigation · procedural state",
  },
  {
    name: "Robotic / minimally invasive surgery",
    focus: "Tool–tissue dynamics",
    detail: "Robotic state · interaction sensing · imaging",
  },
  {
    name: "Spine surgery",
    focus: "Spatial navigation",
    detail: "CT / navigation · tracking · trajectory",
  },
] as const;

const ipFamilies = [
  { name: "Auditory Surgical Navigation", kind: "Selected patent family" },
  {
    name: "Auditory Support for Retinal Surgery",
    kind: "International patent family",
  },
  { name: "Data-to-Sound Interactive Feedback", kind: "European patent" },
] as const;

const integrationSystems = [
  "Imaging",
  "Navigation",
  "Robotics",
  "XR",
  "Intelligent sensing",
] as const;

export default function Homepage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <section className="hero hero--living palette-a" aria-labelledby="hero-title">
          <ShapeComposition variant="nested-portal" intensity="high" />
          <LivingSonicField />
          <Container className="hero__grid">
            <div className="hero__copy">
              <SectionLabel>SoniXense</SectionLabel>
              <h1 id="hero-title">
                <span>Beyond</span>
                <em className="hero__vision-line" aria-label="Vision.">
                  <span aria-hidden="true">
                    V<SignatureI />s<SignatureI />
                    on.
                  </span>
                </em>
              </h1>
              <p className="hero__tagline">
                Auditory intelligence for complex human–machine systems.
              </p>
              <p className="hero__intro">
                SoniXense transforms complex information into intuitive auditory
                experiences that extend human perception beyond visual-only
                interfaces.
              </p>
              <div className="button-row">
                <ButtonLink href="#experience">Experience SoniXense</ButtonLink>
                <ButtonLink href="#technology" secondary>
                  Discover the technology
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="section problem palette-a" aria-labelledby="problem-title">
          <Container>
            <SectionLabel>The perception gap</SectionLabel>
            <div className="problem__statements">
              <h2 id="problem-title">
                <span className="problem__top-label">Machines can scale perception.</span>
                <strong className="problem__side-label">Human attention <em>cannot.</em></strong>
              </h2>
              <p className="problem__conclusion">
                <span>Decision is</span>
                <span>still <em>human.</em></span>
              </p>
            </div>
            <PerceptionGapField />
          </Container>
        </section>

        <section
          id="technology"
          className="section platform palette-a"
          aria-labelledby="technology-title"
        >
          <Container>
            <SectionLabel>SoniXense Technology</SectionLabel>
            <div className="platform__intro">
              <h2 id="technology-title">One platform for<br /><em>multimodal medical data.</em></h2>
              <p>SoniXense integrates heterogeneous medical and system data, models their dynamics, and transforms them into rich, interactive auditory representations.</p>
            </div>
            <div className="platform__architecture" aria-label="SoniXense technology architecture: integrate, model, sonify and render">
              {technologyStages.map((stage, index) => (
                <article className={`platform__stage platform__stage--${stage.step.toLowerCase()}`} key={stage.step}>
                  <div className="platform__stage-head"><span>0{index + 1}</span><span>{stage.step}</span></div>
                  <div className="platform__signal" aria-hidden="true">
                    {index === 0 && <><i/><i/><i/><i/><i/></>}
                    {index === 1 && <><i/><i/><i/><i/><i/><b/><b/><b/></>}
                    {index === 2 && <svg viewBox="0 0 240 90" preserveAspectRatio="none"><path d="M0 45 C15 45 15 24 30 24 S45 66 60 66 S75 28 90 28 S105 62 120 62 S135 20 150 20 S165 70 180 70 S195 32 210 32 S225 45 240 45"/><path d="M0 45 C15 45 15 37 30 37 S45 53 60 53 S75 36 90 36 S105 54 120 54 S135 34 150 34 S165 56 180 56 S195 40 210 40 S225 45 240 45"/></svg>}
                    {index === 3 && <svg viewBox="0 0 240 90" preserveAspectRatio="none"><path d="M0 45 C20 45 20 18 40 18 S60 72 80 72 S100 24 120 24 S140 66 160 66 S180 30 200 30 S220 45 240 45"/><path d="M0 45 C20 45 20 30 40 30 S60 60 80 60 S100 32 120 32 S140 58 160 58 S180 37 200 37 S220 45 240 45"/><path d="M0 45 C20 45 20 39 40 39 S60 51 80 51 S100 40 120 40 S140 50 160 50 S180 42 200 42 S220 45 240 45"/></svg>}
                  </div>
                  <h3>{stage.title}</h3>
                  <p>{stage.detail}</p>
                  <ul>{stage.terms.map(term => <li key={term}>{term}</li>)}</ul>
                  {index < technologyStages.length - 1 && <span className="platform__connector" aria-hidden="true">→</span>}
                </article>
              ))}
            </div>
            <div className="platform__footer">
              <p><span>Representation, not isolated tones.</span> Relationships and system behavior shape timbre, rhythm, texture and spatial position.</p>
              <p className="platform__feedback"><span aria-hidden="true">↶</span> User action changes the system; the data, model and sound update with it.</p>
            </div>
          </Container>
        </section>

        <section
          id="experience"
          className="section demo palette-b"
          aria-labelledby="experience-title"
        >
          <ShapeComposition variant="edge-arch" intensity="medium" />
          <Container>
            <div className="demo__header">
              <div>
                <SectionLabel>Experience</SectionLabel>
                <h2 id="experience-title">
                  Put on headphones.
                  <br />
                  <em>Hear what you would normally watch.</em>
                </h2>
              </div>
              <p>SoniXense should be heard, not over-explained.</p>
            </div>
            <VideoFacade
              provider="youtube"
              videoId="IuDm7Pg7I40"
              title="SoniXense surgical navigation film"
            />
          </Container>
        </section>

        <section
          id="surgery"
          className="section surgery-frontier"
          aria-labelledby="surgery-title"
        >
          <Container>
            <SectionLabel>First frontier</SectionLabel>
            <div className="surgery-frontier__heading">
              <h2 id="surgery-title">Making surgical interaction audible.</h2>
              <p>
                Surgery combines dense multimodal information with continuous
                physical interaction and time-critical decisions. SoniXense
                transforms evolving interactions and system states into
                real-time auditory representations.
              </p>
            </div>
            <div
              className="surgery-frontier__visual"
              role="img"
              aria-label="An abstract instrument trajectory meets deformable tissue. Subsurface structures, local deformation and a complex auditory response emerge from the contact."
            >
              <svg className="surgery-frontier__field" viewBox="0 0 1200 580" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <linearGradient id="frontier-tissue" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#97c9ca" stopOpacity=".04"/><stop offset=".52" stopColor="#80bec2" stopOpacity=".2"/><stop offset="1" stopColor="#97c9ca" stopOpacity=".03"/></linearGradient>
                  <linearGradient id="frontier-tool" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#e5f2ee" stopOpacity="0"/><stop offset=".7" stopColor="#c6e5e4" stopOpacity=".8"/><stop offset="1" stopColor="#f0f7f1"/></linearGradient>
                  <radialGradient id="frontier-contact"><stop stopColor="#ce7480" stopOpacity=".55"/><stop offset="1" stopColor="#ce7480" stopOpacity="0"/></radialGradient>
                  <filter id="frontier-blur"><feGaussianBlur stdDeviation="14"/></filter>
                </defs>
                <path className="surgery-frontier__tissue-fill" d="M0 345 C160 333 260 335 355 346 C430 354 473 381 521 397 C560 410 592 409 626 394 C684 368 737 351 813 356 C970 361 1080 331 1200 340 L1200 580 L0 580Z" fill="url(#frontier-tissue)"/>
                <g className="surgery-frontier__tissue-lines" fill="none">
                  <path d="M0 345 C160 333 260 335 355 346 C430 354 473 381 521 397 C560 410 592 409 626 394 C684 368 737 351 813 356 C970 361 1080 331 1200 340"/>
                  <path d="M0 370 C168 359 285 360 370 372 C451 387 484 423 545 431 C604 438 641 401 716 384 C857 356 1015 376 1200 361"/>
                  <path d="M0 399 C153 391 293 389 394 404 C463 414 507 450 565 453 C629 456 686 414 757 405 C914 386 1057 404 1200 387"/>
                  <path d="M0 435 C175 420 318 423 432 438 C494 447 530 472 593 471 C673 470 718 436 801 430 C968 416 1093 435 1200 422"/>
                  <path d="M0 478 C188 460 354 462 469 473 C570 485 650 486 736 463 C896 422 1063 469 1200 457"/>
                  <path d="M0 526 C204 501 368 502 502 509 C659 518 749 489 857 483 C1010 476 1103 497 1200 492"/>
                </g>
                <g className="surgery-frontier__subsurface" fill="none">
                  <path d="M385 515 C474 485 530 483 596 493 C669 504 725 474 782 455"/>
                  <path d="M419 535 C489 514 550 511 605 519 C681 529 734 500 789 481"/>
                  <path d="M452 549 C517 538 564 535 621 541 C688 546 742 524 791 509"/>
                </g>
                <g className="surgery-frontier__force" fill="none">
                  <path d="M545 396 C492 363 466 309 482 260"/><path d="M573 406 C558 360 563 310 586 272"/><path d="M600 404 C637 366 652 318 646 272"/>
                  <path d="M522 413 C459 409 418 379 389 340"/><path d="M621 412 C685 406 731 378 765 341"/>
                </g>
                <path className="surgery-frontier__tool-halo" d="M155 93 C294 147 417 235 553 393" fill="none" stroke="url(#frontier-tool)" strokeWidth="19" filter="url(#frontier-blur)"/>
                <path className="surgery-frontier__tool" d="M155 93 C294 147 417 235 553 393" fill="none" stroke="url(#frontier-tool)" strokeWidth="2"/>
                <path className="surgery-frontier__tool-guide" d="M185 103 C322 158 441 251 553 393" fill="none"/>
                <circle cx="553" cy="393" r="82" fill="url(#frontier-contact)"/>
                <circle className="surgery-frontier__contact-ring" cx="553" cy="393" r="30" fill="none"/>
                <circle cx="553" cy="393" r="4" fill="#e59492"/>
                <g className="surgery-frontier__response" fill="none">
                  <path d="M624 359 C677 300 702 305 742 352 S799 420 840 346 S903 239 945 335 S1005 424 1052 335 S1119 270 1200 313"/>
                  <path d="M626 358 C674 329 718 307 749 356 S801 391 844 340 S906 282 946 343 S1009 384 1050 335 S1122 301 1200 333"/>
                  <path d="M628 359 C699 350 724 332 754 357 S809 373 846 345 S908 318 951 347 S1011 358 1057 343 S1125 332 1200 349"/>
                  <path d="M630 358 C689 361 724 354 755 359 S812 361 850 350 S920 350 956 351 S1017 350 1060 350 S1138 351 1200 354"/>
                </g>
                <g className="surgery-frontier__particles" fill="#a5d8d8">
                  <circle cx="494" cy="348" r="1.5"/><circle cx="525" cy="321" r="1"/><circle cx="603" cy="326" r="1.5"/><circle cx="655" cy="362" r="1"/><circle cx="461" cy="387" r="1"/><circle cx="700" cy="391" r="1.5"/><circle cx="735" cy="329" r="1"/><circle cx="806" cy="305" r="1"/><circle cx="900" cy="381" r="1.5"/><circle cx="1017" cy="296" r="1"/><circle cx="1100" cy="376" r="1.5"/>
                </g>
              </svg>
              <span className="surgery-frontier__annotation surgery-frontier__annotation--tool">Instrument trajectory</span>
              <span className="surgery-frontier__annotation surgery-frontier__annotation--contact">Tool–tissue interaction</span>
              <span className="surgery-frontier__annotation surgery-frontier__annotation--depth">Subsurface structure</span>
              <span className="surgery-frontier__annotation surgery-frontier__annotation--sound">Auditory representation</span>
            </div>
            <p className="surgery-frontier__bridge">From tool–tissue dynamics to sound.</p>
            <div className="surgery-frontier__capabilities">
              {surgeryCapabilities.map((item, index) => (
                <article key={item.name}>
                  <span>0{index + 1}</span>
                  <h3>{item.name}</h3>
                  <div><strong>{item.focus}</strong><p>{item.detail}</p></div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section
          id="evidence"
          className="section scientific-foundation palette-c"
          aria-labelledby="scientific-foundation-title"
        >
          <Container>
            <SectionLabel>Scientific foundation</SectionLabel>
            <div className="scientific-foundation__heading">
              <h2 id="scientific-foundation-title">
                Built through research.
                <br />
                <em>Protected through invention.</em>
              </h2>
              <p>
                An academic research ecosystem and a portfolio of published
                patent applications form two foundations for SoniXense.
              </p>
            </div>
            <div className="scientific-foundation__anchors">
              <article className="scientific-foundation__anchor scientific-foundation__anchor--research">
                <span className="scientific-foundation__kicker">DFG-funded research project</span>
                <h3>SYNERGIA</h3>
                <p className="scientific-foundation__subtitle">Multisensory Integration in High-Intensity Environments — Bridging AI Analysis and Human Perception</p>
                <div className="scientific-foundation__research-field" aria-hidden="true">
                  <span>Imaging / sensing</span><span>Computational models</span><span>Spatial audio</span>
                  <i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
                <p className="scientific-foundation__description">An interdisciplinary project investigating sonification, spatial audio, AI and human perception in demanding surgical environments.</p>
                <p className="scientific-foundation__metadata">Academic research ecosystem · TUM / CAMP · TU Dresden</p>
                <a href="https://synergia.camp.cit.tum.de/" target="_blank" rel="noopener noreferrer">Explore Synergia ↗</a>
              </article>
              <article className="scientific-foundation__anchor scientific-foundation__anchor--ip">
                <span className="scientific-foundation__kicker">Patents / protected technology</span>
                <h3>DATA-TO-SOUND</h3>
                <p className="scientific-foundation__subtitle">Interactive feedback from data and interaction to auditory information.</p>
                <div className="scientific-foundation__ip-field" aria-hidden="true">
                  <div className="scientific-foundation__ip-data"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                  <span className="scientific-foundation__ip-transform">Interaction<br />+ sound model</span>
                  <svg viewBox="0 0 180 110" preserveAspectRatio="none"><path d="M0 55 C20 55 21 22 39 22 S57 89 73 89 S90 36 106 36 S125 71 139 71 S158 49 180 49"/><path d="M0 55 C19 55 22 37 39 37 S57 73 73 73 S90 44 106 44 S125 63 139 63 S158 53 180 53"/><path d="M0 55 C21 55 23 47 39 47 S57 63 73 63 S90 51 106 51 S125 58 139 58 S158 55 180 55"/></svg>
                  <span className="scientific-foundation__ip-number">EP4535160A1</span>
                </div>
                <p className="scientific-foundation__description">A published application describes sound output generated from interaction with a multidimensional data set through a sound model.</p>
                <p className="scientific-foundation__metadata">Published European patent application · EP4535160A1</p>
                <a href="https://patents.google.com/patent/EP4535160A1/en" target="_blank" rel="noopener noreferrer">Explore the application ↗</a>
              </article>
            </div>
            <div className="scientific-foundation__support">
              <div><span>Peer-reviewed science</span><p>MICCAI · IPMI · IEEE · Scientific Reports · Medical Image Analysis</p></div>
              <div><span>Recognition</span><p>3× Sonification Award winner · MICCAI Best Paper finalist</p></div>
            </div>
          </Container>
        </section>

        <section
          id="artscience"
          className="section artscience-home palette-b"
          aria-labelledby="artscience-title"
        >
          <ShapeComposition variant="circle-intersection" intensity="high" />
          <Container>
            <div className="artscience-home__grid">
              <div>
                <SectionLabel>From science to experience</SectionLabel>
                <h2 id="artscience-title">
                  Where technology
                  <br />
                  becomes <em>ArtScience.</em>
                </h2>
                <p>
                  The same technologies that make complex systems perceptible
                  can create entirely new forms of human experience.
                </p>
                <Link href="/artscience" className="artscience-home__link">
                  Explore SoniXense ArtScience →
                </Link>
                <div className="artscience-home__domains">
                  <span>Medicine</span>
                  <span>Robotics</span>
                  <span>XR</span>
                  <span>Human–AI Interaction</span>
                  <span>ArtScience</span>
                </div>
              </div>
              <VideoFacade
                provider="vimeo"
                videoId="329952640"
                title="SoniXense ArtScience film"
              />
            </div>
          </Container>
        </section>

        <section
          id="team"
          className="section team palette-c"
          aria-labelledby="team-title"
        >
          <ShapeComposition variant="edge-arch" intensity="low" />
          <Container>
            <SectionLabel>Co-founders</SectionLabel>
            <div className="section-heading">
              <h2 id="team-title">
                Technology, medicine,
                <br />
                science, and art.
              </h2>
              <p>
                A multidisciplinary founding team building one perceptual
                technology platform.
              </p>
            </div>
            <div className="team__grid">
              {people.map((person, index) => (
                <FounderCard key={person.id} person={person} index={index} />
              ))}
            </div>
          </Container>
        </section>

        <section
          id="company"
          className="section foundation palette-c"
          aria-labelledby="foundation-title"
        >
          <ShapeComposition variant="signal-layers" intensity="low" />
          <Container>
            <SectionLabel>Company · Science · IP</SectionLabel>
            <div className="foundation__heading">
              <h2 id="foundation-title">
                Built on science.
                <br />
                <em>Protected by IP.</em>
              </h2>
              <p>
                SoniXense is a spin-off in formation emerging from the
                DFG-funded Synergia project and research at TUM CAMP.
              </p>
            </div>
            <div className="foundation__grid">
              <article className="foundation__origin">
                <span>Origin</span>
                <h3>Research became technology.</h3>
                <p>
                  Peer-reviewed research, international scientific
                  collaboration, and years of work across sonification, medical
                  imaging, and computer-assisted procedures.
                </p>
                <div>
                  {researchEcosystem.map((group) => (
                    <p key={group.category}>
                      <small>{group.category}</small>
                      {group.names.join(" · ")}
                    </p>
                  ))}
                </div>
              </article>
              <article className="foundation__ip">
                <span>Protected technology</span>
                <h3>{patentPortfolio.heading}</h3>
                <p>{patentPortfolio.body}</p>
                <div className="foundation__ip-families">
                  {ipFamilies.map((family) => (
                    <div key={family.name}>
                      <h4>{family.name}</h4>
                      <small>{family.kind}</small>
                    </div>
                  ))}
                </div>
              </article>
              <article className="foundation__evidence">
                <span>Research progression</span>
                <div className="foundation__timeline">
                  {selectedPublications.map((item) => (
                    <div key={`${item.venue}-${item.year}`}>
                      <strong>{item.year}</strong>
                      <h3>{item.venue}</h3>
                      <p>{item.relevance}</p>
                    </div>
                  ))}
                </div>
                <p className="foundation__award">
                  3× Sonification Award winner
                </p>
              </article>
            </div>
            <div className="foundation__links">
              <a
                href="https://synergia.camp.cit.tum.de/project/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Synergia project ↗
              </a>
              <a
                href="https://www.cs.cit.tum.de/camp/start/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CAMP at TUM ↗
              </a>
            </div>
          </Container>
        </section>

        <section
          id="integration"
          className="section integration-home palette-c"
          aria-labelledby="integration-title"
        >
          <ShapeComposition variant="overlap" intensity="medium" />
          <Container>
            <SectionLabel>Integration</SectionLabel>
            <div className="integration-home__grid">
              <div>
                <h2 id="integration-title">Built for integration.</h2>
                <p>
                  SoniXense is designed as a software intelligence layer for
                  existing imaging, sensing, navigation, robotic, and XR
                  systems.
                </p>
              </div>
              <div>
                <div className="integration-home__systems">
                  {integrationSystems.map((system) => (
                    <span key={system}>{system}</span>
                  ))}
                </div>
                <div className="integration-home__layer">
                  <small>Software intelligence layer</small>
                  <strong>SoniXense auditory intelligence</strong>
                </div>
                <p className="integration-home__result">
                  <span>↓</span>
                  Human perception
                </p>
                <p>Bring auditory intelligence into your system.</p>
                <ButtonLink href="mailto:contact@sonixense.com" secondary>
                  Talk to us
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="contact"
          className="section closing-cta palette-c"
          aria-labelledby="closing-title"
        >
          <ShapeComposition variant="nested-portal" intensity="high" />
          <Container>
            <SectionLabel>Build with SoniXense</SectionLabel>
            <h2 id="closing-title">Hear beyond vision.</h2>
            <p>Bring auditory intelligence into your system.</p>
            <ButtonLink href="mailto:contact@sonixense.com">
              Talk to us →
            </ButtonLink>
          </Container>
        </section>
        <section
          className="institutions ecosystem"
          aria-labelledby="ecosystem-title"
        >
          <Container>
            <h2 id="ecosystem-title">
              Research origins · funding · scientific community
            </h2>
            <div className="ecosystem__logos">
              {associations.map((item) => (
                <a
                  className={`ecosystem__logo ecosystem__logo--${item.id}`}
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <span className="ecosystem__mark">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={item.width}
                      height={item.height}
                      sizes="(max-width: 640px) 42vw, 220px"
                    />
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
