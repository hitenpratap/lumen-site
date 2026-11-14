# Lumen film

The explainer video on the landing page (`../media/lumen-film.mp4`), made with [Remotion](https://www.remotion.dev).

- `src/timeline.ts` — scene order, durations and how each scene is entered (zoom-blur or light leak)
- `src/scenes/` — one file per scene
- `src/kit/` — shared pieces: backdrop, text entrances, screenshot window, spotlight, film grain, icons
- `scripts/music.ts` — the score, synthesised from scratch (no samples, nothing to license) with its cues taken from `src/timeline.ts`; writes `out/music.wav`
- `public/music.m4a` — the encoded score used by the film
- `public/shots` — a symlink to the site's `../shots/` (the app screenshots)

```sh
bun install
bun run dev                         # Remotion Studio: preview and scrub every scene
bun scripts/music.ts && bunx remotion ffmpeg -y -i out/music.wav -c:a aac -b:a 192k -f mp4 public/music.m4a   # after timing changes
bunx remotion render LumenExplainer ../media/lumen-film.mp4 --crf=22
bunx remotion still LumenExplainer ../media/lumen-film-poster.jpg --frame=330 --image-format=jpeg
```

Facts in the film come from the app's docs (`docs/product.md`, `docs/ai.md`, `docs/privacy-and-data.md` in the app repo). Update the film when those change.

Remotion is free for individuals and teams of up to 3; larger companies need a [company licence](https://www.remotion.dev/docs/license).
