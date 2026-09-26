import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import MovementTag from "@/components/ui/MovementTag";
import VideoFacade from "@/components/media/VideoFacade";

const territories = [
  { name: "Ophthalmic surgery", focus: "Microscale tissue interaction", detail: "iOCT · imaging · tool tracking" },
  { name: "Cardiovascular intervention", focus: "Catheter–tissue interaction", detail: "Imaging · navigation · procedural state" },
  { name: "Robotic / minimally invasive surgery", focus: "Tool–tissue dynamics", detail: "Robotic state · interaction sensing · imaging" },
  { name: "Spine surgery", focus: "Spatial navigation", detail: "Trajectory · proximity · critical anatomy" },
] as const;

const translation = [
  ["Surgical phenomenon", "Contact, deformation, force and tension, trajectory, proximity to anatomy."],
  ["Measurement / model", "Imaging, tracking and sensing feed models of the interaction and of what lies beneath the surface."],
  ["Auditory representation", "Model state becomes a continuous auditory scene the surgeon can listen to."],
  ["Interaction", "The surgeon acts, tissue and model respond, and the sound changes with them."],
] as const;

const lineage = ["Matter", "Sound", "Resonance", "Physical systems", "Interaction", "Emergence"] as const;

export default function SurgerySection() {
  return (
    <section id="surgery" className="chapter chapter--surgery" aria-labelledby="surgery-title">
      <Container>
        <SectionLabel>04 — First frontier: Surgery</SectionLabel>
        <div className="surgery-frontier__heading">
          <h2 id="surgery-title">Making surgical interaction audible.</h2>
          <p>
            In surgery, what matters happens where the eyes cannot follow: contact, deformation, force, trajectory and
            the anatomy just beneath the tool. SoniXense makes that evolving interaction audible in real time.
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
          {territories.map((item, index) => (
            <article key={item.name}>
              <span>0{index + 1}</span>
              <h3>{item.name}</h3>
              <div><strong>{item.focus}</strong><p>{item.detail}</p></div>
            </article>
          ))}
        </div>

        <div className="movement" id="science-to-experience">
          <MovementTag index="04A">From science to experience</MovementTag>
          <div className="movement__head">
            <h3>How a surgical phenomenon becomes <em>something you can hear.</em></h3>
          </div>
          <ol className="translation">
            {translation.map(([name, text], i) => (
              <li key={name}><span>0{i + 1}</span><strong>{name}</strong><p>{text}</p></li>
            ))}
          </ol>
        </div>

        <div className="movement artscience" id="artscience">
          <MovementTag index="04B">ArtScience</MovementTag>
          <div className="artscience__panel">
            <div className="artscience__copy">
              <h3>Surgery is the first frontier. <em>The language is older.</em></h3>
              <p>
                SoniXense listens to physical systems the way an ArtScience practice does — through matter, resonance
                and emergence. That lineage, led by Navid Navab, is where the way we hear complex systems began.
              </p>
              <ul className="artscience__lineage">{lineage.map((t) => <li key={t}>{t}</li>)}</ul>
              <Link href="/artscience" className="artscience__link">Explore SoniXense ArtScience →</Link>
            </div>
            <VideoFacade provider="vimeo" videoId="329952640" poster="/images/artscience/329952640.jpg" title="SoniXense ArtScience film" />
          </div>
        </div>
      </Container>
    </section>
  );
}
