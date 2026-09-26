import Image from "next/image";
import { awardsForFounder } from "@/content/awards";
import VideoFacade from "@/components/media/VideoFacade";

export default function FounderAwards({ founderId }: { founderId: string }) {
  const awards = awardsForFounder(founderId);
  if (!awards.length) return null;
  return <section id="recognition" className="profile-awards" aria-label="Awards and recognition">
    <p className="profile-kicker">03 / Selected awards & recognition</p>
    <div className="profile-awards__grid">{awards.map((award) => {
      const image = <Image src={award.media.src} alt={award.media.alt} fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectFit: award.media.fit ?? "cover" }} />;
      return <article className="profile-award" key={award.id} data-award={award.id}>
        {award.video ? <VideoFacade provider={award.video.provider ?? "local"} videoId={award.video.src} title={award.project ?? award.award} poster={award.media.src} />
          : <a className={`profile-media recognition-media recognition-media--${award.media.fit ?? "cover"}`} href={award.publicationUrl ?? award.awardUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${award.project ?? award.award}`}>{image}</a>}
        <div className="recognition-copy"><p className="recognition-year">{award.year} / {award.award}</p>
          <h3>{award.project ?? award.award}</h3><p>{award.description}</p>
          <div className="recognition-links">
            {award.publicationUrl && <a href={award.publicationUrl} target="_blank" rel="noopener noreferrer">Read publication ↗</a>}
            {award.awardUrl && <a href={award.awardUrl} target="_blank" rel="noopener noreferrer">Award details ↗</a>}
            {award.videoUrl && <a href={award.videoUrl} target="_blank" rel="noopener noreferrer">Watch Lumen video ↗</a>}
          </div>
          {award.credit && <a className="recognition-credit" href={award.credit.href} target="_blank" rel="noopener noreferrer">{award.credit.label}</a>}
        </div>
      </article>;
    })}</div>
  </section>;
}
