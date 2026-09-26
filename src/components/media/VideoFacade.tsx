"use client";

import { useState } from "react";

export default function VideoFacade({ provider, videoId, title, poster: suppliedPoster }: { provider: "youtube" | "vimeo" | "local"; videoId: string; title: string; poster?: string }) {
  const [active, setActive] = useState(false);
  const src = provider === "youtube" ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  const poster = suppliedPoster ?? (provider === "youtube" ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined);
  return <div className="video-facade">
    {active && provider === "local" ? <video src={videoId} poster={poster} controls autoPlay playsInline preload="metadata" aria-label={title} /> : active ? <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen /> : <button type="button" onClick={() => setActive(true)} aria-label={`Play ${title}`}>
      {poster ? <span className="video-facade__poster" style={{ backgroundImage: `url(${poster})` }} /> : <span className="video-facade__poster video-facade__poster--field" />}
      <span className="video-facade__play" aria-hidden="true">▶</span><span className="video-facade__label">Play film</span>
    </button>}
  </div>;
}
