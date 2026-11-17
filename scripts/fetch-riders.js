// Fetches the newest videos of every channel in public/content/riders.json from YouTube's
// public RSS feeds (no API key) and writes public/data/riders.json for georiders.html.
// Run by `npm run build` and by the local server's refresh. A channel whose feed fails
// keeps its videos from the previous run.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIST = path.join(ROOT, 'public', 'content', 'riders.json');
export const RIDERS_FILE = path.join(ROOT, 'public', 'data', 'riders.json');
const PER_CHANNEL = 3;

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

async function feed(id) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, e]) => ({
      id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1],
      title: decode(e.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
      published: e.match(/<published>([^<]+)<\/published>/)?.[1],
    }))
    .filter((v) => v.id && v.published);
}

export async function fetchRiders({ log = console.log } = {}) {
  const { channels } = JSON.parse(await fs.readFile(LIST, 'utf8'));
  let previous = {};
  try {
    previous = JSON.parse(await fs.readFile(RIDERS_FILE, 'utf8')).channels ?? {};
  } catch {}

  const out = {};
  let failed = 0;
  for (const c of channels) {
    try {
      const videos = await feed(c.id);
      out[c.id] = { videos: videos.slice(0, PER_CHANNEL), latest: videos[0]?.published ?? null };
    } catch (e) {
      failed++;
      if (previous[c.id]) out[c.id] = previous[c.id];
      log(`  ! ${c.name}: ${e.message}${previous[c.id] ? ' (kept previous videos)' : ''}`);
    }
  }
  await fs.mkdir(path.dirname(RIDERS_FILE), { recursive: true });
  await fs.writeFile(RIDERS_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), channels: out }));
  log(`Riders: ${channels.length - failed}/${channels.length} channel feeds updated`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchRiders().catch((e) => {
    // never fail the site build over YouTube feeds; the page shows channels without videos
    console.error('Riders feed update failed:', e.message);
  });
}
