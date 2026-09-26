# Google X pitch animations

- `/pitch/perception-gap`: 98.5 seconds. The original reveal is followed by at least 90 seconds of moving waves and particles in the completed composition, then a 0.75-second final hold.
- `/pitch/sonixense-technology`: 90 seconds at 60fps, fully established from the beginning, with continuous motion and a blended loop join.

Perception Gap plays once; Technology loops. They share the website's seeded machine-field renderer and use identical 1920×1080 source coordinates. The technology pitch includes the secondary five-stage pipeline, with shared top guides for its numbers, titles and descriptions. Pitch routes use larger diagram type and run independently of scrolling, intersection, mouse input and reduced-motion settings. The website still respects reduced motion.

## Same grammar, different system state

Section 02 and Video 1 retain the restrained field. Section 03 layers 98 additional desktop paths (70 on mobile) over that same grammar, with modality-specific continuous, segmented and sampled structures. Independently seeded particles accelerate toward the core; their arrivals compress and excite its internal contours. Output trajectory count stays unchanged, with slow independent carrier speeds.

Video 2 begins with the approved complete rich composition. The entire website field uses unbounded time: input, internal contours, outputs and pipeline emphasis have independent continuous phases, without a global loop reset. Reduced motion shows a static rich state.

## Perception and sonic events

INFORMATION-RICH SOUND, PERCEPTUAL AUDIO CUES and SPATIAL SOUND converge on an acoustic resonance field, then reach the separate cognition network after a 0.55-second delay. Each arriving carrier triggers a seeded, causal impulse response: 2–3 wavefronts for a small event or 4–6 for a stronger event, launched 33–57 ms apart with local deformation and smooth damping. Particle trajectories and cognition retain their previous motion. Reception follows actual carrier phases. Sparse wave packets, rings and dot patterns briefly resolve from output particles; one in five SOUND passages is a tiny note-like glyph (about 6.7% across all output carriers). The input remains entirely abstract.

Output particles fade to zero individually before recycling. Intake/reception envelopes use smooth periodic functions with matching values and slopes at phase boundaries. Only Perception Gap holds its ending; Technology keeps moving.

## Exact frame rendering

Append `?frame=60` to render frame 60 at 30fps without autoplay. After `[data-ready="true"]` exists, dispatch `new CustomEvent('pitch:seek', { detail: seconds })` on `window` to synchronously draw any frame. Wait for fonts and images before capture. Perception Gap clamps at its final hold; Technology wraps at 90 seconds. The exporter seeks in seconds at each route’s output frame rate.

## MP4 export

Start the website with `npm run dev` (or production `npm run start`). With Chrome, ffmpeg and `puppeteer-core` installed, run:

```sh
node scripts/export-pitch.mjs
# Regenerate only the technology video, preserving Video 1:
node scripts/export-pitch.mjs sonixense-technology
```

Optional environment variables:

- `PUPPETEER_MODULE`: module name or absolute path to an existing puppeteer-core installation.
- `CHROME_PATH`: Chrome executable (defaults to the macOS application).
- `PITCH_ORIGIN`: site origin (defaults to `http://127.0.0.1:3000`).

Outputs in `exports/google-x/`: two MP4s and final-frame PNGs. Encoding: 1920×1080, 30fps for Perception Gap / 60fps for Technology, H.264, CRF 16, yuv420p, fast-start, no audio. Frames are sought individually and streamed to ffmpeg; export speed cannot alter animation timing. The existing repository ignore rule excludes generated exports from Git.

## Validation

Desktop and mobile website compositions and pitch sequence frames were visually inspected. Both pitch routes were checked for repeatable frame seeking, pixel-identical end holds, and identical source-label coordinates. The restrained renderer was compared against its pre-refinement version at eight desktop/mobile time samples and remained pixel-identical. The rich state was separately verified as deterministic. Video 1 retains its restrained design; its duration is now extended as described above. Production webpack build and TypeScript pass; lint has only existing warnings in `Main.tsx`.

Continuity refinement: recorded 49 seconds of Section 03 and 34 seconds of Section 02 in `exports/review/`. Frame-difference checks at the former 15.5, 31 and 46.5 second reset boundaries stayed within ordinary motion levels. Tests covered 66 individual recycle events with zero-visible resets; musical events represented 7.6% of the sampled passages.

## Native slide composition preview

The technology route now uses a dedicated canonical 1920×1080 layout, exact website headline and introductory paragraph, projected-slide typography, and a fully established first frame. Website layout is unchanged. The composition preview is `exports/google-x/sonixense-technology-preview.png`. Pipeline rows share common top guides and the lowest text remains over 60px from the frame edge.

The user approved this composition before the 90-second export.

## Approved 90-second speaking version

The approved native slide composition now stays fully established for 90 seconds at 60fps. No headline, pipeline, or diagram build-in; no frozen end hold. Technology uses deterministic time starting at the approved 20-second simulation state. During the final two seconds, two forward-moving render continuations blend with a smooth envelope back into the first frame for repeat playback. This is a composited loop join, not a change to website particle clocks. The website and Perception Gap timeline remain unchanged.

Export with `node scripts/export-pitch.mjs sonixense-technology` (set `PUPPETEER_MODULE` if needed). Output is silent H.264 MP4, 1920×1080, constant 60fps, 90 seconds, CRF 16, yuv420p, fast-start metadata.
