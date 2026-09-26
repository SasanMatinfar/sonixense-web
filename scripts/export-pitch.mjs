/* Requires Chrome, ffmpeg and puppeteer-core (PUPPETEER_MODULE may point to an existing install).
 * Start the site first. Captures exact frames, never wall-clock screen recording. */
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
const puppeteer = createRequire(import.meta.url)(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const videos = [['perception-gap', 98.5, 30], ['sonixense-technology', 90, 60]];
const selected = process.argv[2];
if (selected && !videos.some(([route]) => route === selected)) throw new Error('Unknown pitch route: ' + selected);
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    page.on('pageerror', error => { throw error; });
    const out = path.resolve('exports/google-x');
    await mkdir(out, { recursive: true });
    for (const [route, duration, fps] of videos.filter(([route]) => !selected || route === selected)) {
      await page.goto(`${process.env.PITCH_ORIGIN || 'http://127.0.0.1:3000'}/pitch/${route}?frame=0`, {waitUntil:'networkidle0'});
      await page.waitForSelector('[data-ready="true"]');
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
      // Dev-only Next indicator must never appear in the slide asset.
      await page.addStyleTag({content:'nextjs-portal { display: none !important; }'});
      const encoder = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,`${route}.mp4`)], {stdio:['pipe','inherit','inherit']});
      const finished = once(encoder, 'close');
      for (let frame = 0; frame < duration * fps; frame++) {
        await page.evaluate(t => window.dispatchEvent(new CustomEvent('pitch:seek', {detail:t})), frame / fps);
        const png = await page.screenshot({type:'png', optimizeForSpeed:true});
        if (frame % 300 === 0) console.log(`${route}: frame ${frame}/${duration * fps}`);
        if (!encoder.stdin.write(png)) await once(encoder.stdin,'drain');
        if (frame === Math.floor(duration * fps) - 1) await writeFile(path.join(out,`${route}-final.png`), png);
      }
      encoder.stdin.end();
      const [code] = await finished;
      if (code !== 0) throw new Error(`ffmpeg failed: ${code}`);
      console.log(`Exported ${route}: 1920×1080, ${fps}fps, ${duration}s`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
