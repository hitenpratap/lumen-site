// Original score for the Lumen film, synthesised from scratch: no samples, nothing to license.
// Cue points come from src/timeline.ts, so re-run this after changing scene durations:
//   bun scripts/music.ts && bunx remotion ffmpeg -y -i out/music.wav -c:a aac -b:a 192k public/music.m4a
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const SR = 44100;
const FPS = 30;

// ---- timeline ---------------------------------------------------------------------------------
const src = readFileSync(new URL('../src/timeline.ts', import.meta.url), 'utf8');
const TRANSITION = Number(/TRANSITION = (\d+)/.exec(src)![1]);
const scenes = [...src.matchAll(/id: '(\w+)'.*?duration: (\d+), enter: '(\w+)'/g)].map((m) => ({
	id: m[1],
	duration: Number(m[2]),
	enter: m[3],
}));
const start: Record<string, number> = {};
const cuts: {t: number; kind: string}[] = [];
let frame = 0;
for (const s of scenes) {
	if (s.enter === 'zoom') frame -= TRANSITION;
	start[s.id] = frame / FPS;
	if (s.enter === 'zoom') cuts.push({t: (frame + TRANSITION / 2) / FPS, kind: 'zoom'});
	if (s.enter === 'leak') cuts.push({t: frame / FPS, kind: 'leak'});
	frame += s.duration;
}
const END = frame / FPS;
if (scenes.length !== 16) throw new Error(`expected 16 scenes in timeline.ts, found ${scenes.length}`);

// ---- buffers ----------------------------------------------------------------------------------
const N = Math.ceil((END + 0.5) * SR);
const dryL = new Float32Array(N);
const dryR = new Float32Array(N);
const send = new Float32Array(N); // mono reverb send

// Equal-power pan gains for pan in [-1, 1].
const gains = (pan: number) => [Math.cos((pan + 1) * Math.PI * 0.25), Math.sin((pan + 1) * Math.PI * 0.25)];
const put = (i: number, v: number, g: number[], rev: number) => {
	if (i < 0 || i >= N) return;
	dryL[i] += v * g[0];
	dryR[i] += v * g[1];
	send[i] += v * rev;
};
const CENTRE = gains(0);

let seed = 7;
const rnd = () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// ---- instruments ------------------------------------------------------------------------------
const TABLE = 4096;
const table = (harmonics: number, roll: number) => {
	const t = new Float32Array(TABLE + 1);
	let peak = 0;
	for (let i = 0; i <= TABLE; i++) {
		let s = 0;
		for (let h = 1; h <= harmonics; h++) s += (Math.sin((2 * Math.PI * h * i) / TABLE) / h) * Math.exp(-h / roll);
		t[i] = s;
		peak = Math.max(peak, Math.abs(s));
	}
	for (let i = 0; i <= TABLE; i++) t[i] /= peak;
	return t;
};
const DARK = table(8, 2.5);
const BRIGHT = table(18, 7);

/** Warm detuned pad: notes held from t0 to t1, then released. */
const pad = (notes: number[], t0: number, t1: number, o: {amp?: number; attack?: number; release?: number; bright?: number} = {}) => {
	const {amp = 0.05, attack = 1.6, release = 2.2, bright = 0.35} = o;
	const i0 = Math.floor(t0 * SR);
	const i1 = Math.min(N, Math.floor((t1 + release) * SR));
	const hold = t1 - t0;
	for (const m of notes) {
		for (const [cents, pan] of [
			[-7, -0.7],
			[0, 0],
			[7, 0.7],
		]) {
			const inc = (hz(m) * 2 ** (cents / 1200)) / SR;
			const g = gains(pan);
			let ph = rnd();
			const lfo = 0.12 + rnd() * 0.1;
			for (let i = i0; i < i1; i++) {
				const t = (i - i0) / SR;
				const env = smooth(t / attack) * (t < hold ? 1 : 1 - smooth((t - hold) / release));
				ph += inc;
				ph -= Math.floor(ph);
				const x = ph * TABLE;
				const k = x | 0;
				const f = x - k;
				const d = DARK[k] + (DARK[k + 1] - DARK[k]) * f;
				const b = BRIGHT[k] + (BRIGHT[k + 1] - BRIGHT[k]) * f;
				const wob = 1 + 0.15 * Math.sin(2 * Math.PI * lfo * t + pan);
				put(i, (d + (b - d) * bright) * env * wob * amp, g, 0.4);
			}
		}
	}
};

/** Soft bell/kalimba pluck. */
const pluck = (t0: number, m: number, o: {amp?: number; pan?: number; decay?: number; rev?: number} = {}) => {
	const {amp = 0.1, pan = 0, decay = 1.4, rev = 0.5} = o;
	const f = hz(m);
	const parts = [
		[1, 1, 1],
		[2, 0.35, 0.55],
		[3, 0.14, 0.35],
		[4.2, 0.05, 0.2],
	];
	const i0 = Math.floor(t0 * SR);
	const len = Math.floor(decay * 4 * SR);
	const g = gains(pan);
	const w = parts.map(([mul]) => (2 * Math.PI * f * mul) / SR);
	const e = parts.map(([, a]) => a);
	const r = parts.map(([, , d]) => Math.exp(-1 / (SR * decay * d)));
	let att = 1;
	for (let j = 0; j < len; j++) {
		let v = 0;
		for (let p = 0; p < 4; p++) {
			v += e[p] * Math.sin(w[p] * j);
			e[p] *= r[p];
		}
		att *= 0.9932; // ~3 ms attack
		put(i0 + j, v * amp * (1 - att), g, rev);
	}
};

/** Sub bass: root sine plus a little octave, legato-friendly envelope. */
const sub = (m: number, t0: number, t1: number, amp = 0.16) => {
	const i0 = Math.floor(t0 * SR);
	const i1 = Math.min(N, Math.floor((t1 + 0.6) * SR));
	const f = hz(m);
	for (let i = i0; i < i1; i++) {
		const t = (i - i0) / SR;
		const env = smooth(t / 0.5) * (t < t1 - t0 ? 1 : 1 - smooth((t - (t1 - t0)) / 0.6));
		put(i, (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) * env * amp, CENTRE, 0.05);
	}
};

const kick = (t0: number, amp = 0.3) => {
	const i0 = Math.floor(t0 * SR);
	let ph = 0;
	for (let j = 0; j < 0.5 * SR; j++) {
		const t = j / SR;
		ph += (2 * Math.PI * (42 + 70 * Math.exp(-t * 28))) / SR;
		put(i0 + j, Math.sin(ph) * Math.exp(-t * 9) * (1 - Math.exp(-t * 400)) * amp, CENTRE, 0.04);
	}
};

const shaker = (t0: number, amp = 0.04, pan = 0) => {
	const i0 = Math.floor(t0 * SR);
	const g = gains(pan);
	let px = 0;
	let y = 0;
	for (let j = 0; j < 0.12 * SR; j++) {
		const t = j / SR;
		const x = rnd() * 2 - 1;
		y = 0.58 * (y + x - px); // one-pole high-pass, ~5 kHz
		px = x;
		put(i0 + j, y * Math.exp(-t * 45) * (1 - Math.exp(-t * 900)) * amp, g, 0.15);
	}
};

/** Filtered-noise sweep. Peak loudness at tc; centre frequency goes lo→hi→lo. */
const whoosh = (tc: number, dur: number, amp: number, lo = 300, hi = 3500) => {
	const i0 = Math.floor((tc - dur / 2) * SR);
	let low = 0;
	let band = 0;
	for (let j = 0; j < dur * SR; j++) {
		const p = j / (dur * SR);
		const shape = Math.sin(Math.PI * p);
		const fc = lo * (hi / lo) ** shape;
		const f = 2 * Math.sin((Math.PI * fc) / SR);
		const x = rnd() * 2 - 1;
		low += f * band;
		const high = x - low - 0.9 * band;
		band += f * high;
		put(i0 + j, band * shape * shape * amp, gains(-0.8 + 1.6 * p), 0.5);
	}
};

/** Rising noise + pitched sweep that stops dead at t1 (where the hit lands). */
const riser = (t0: number, t1: number, amp = 0.12) => {
	const i0 = Math.floor(t0 * SR);
	const len = Math.floor((t1 - t0) * SR);
	let low = 0;
	let band = 0;
	let ph = 0;
	for (let j = 0; j < len; j++) {
		const p = j / len;
		const fc = 200 * 30 ** p;
		const f = 2 * Math.sin((Math.PI * Math.min(fc, 9000)) / SR);
		const x = rnd() * 2 - 1;
		low += f * band;
		const high = x - low - 0.7 * band;
		band += f * high;
		ph += (2 * Math.PI * 110 * 4 ** p) / SR;
		const tail = Math.min(1, (len - j) / (0.02 * SR));
		put(i0 + j, (band + 0.15 * Math.sin(ph)) * p * p * tail * amp, CENTRE, 0.35);
	}
};

const boom = (t0: number, amp = 0.5) => {
	const i0 = Math.floor(t0 * SR);
	let ph = 0;
	let lp = 0;
	for (let j = 0; j < 3.5 * SR; j++) {
		const t = j / SR;
		ph += (2 * Math.PI * (30 + 70 * Math.exp(-t * 6))) / SR;
		lp += 0.05 * (rnd() * 2 - 1 - lp);
		const v = Math.sin(ph) * Math.exp(-t * 1.6) + lp * 1.5 * Math.exp(-t * 5);
		put(i0 + j, v * (1 - Math.exp(-t * 300)) * amp, CENTRE, 0.5);
	}
};

const shimmer = (t0: number, notes: number[], amp = 0.07) =>
	notes.forEach((m, k) => pluck(t0 + k * 0.07, m, {amp, pan: k % 2 ? 0.5 : -0.5, decay: 2.4, rev: 0.8}));

// ---- harmony ----------------------------------------------------------------------------------
type Chord = {root: number; pad: number[]; arp: number[]};
const CH: Record<string, Chord> = {
	D: {root: 38, pad: [50, 57, 61, 64, 66], arp: [62, 69, 73, 76, 78, 76, 73, 69]},
	Bm: {root: 35, pad: [47, 54, 57, 61, 62], arp: [59, 66, 69, 73, 74, 73, 69, 66]},
	G: {root: 31, pad: [43, 50, 54, 57, 59], arp: [55, 62, 66, 69, 71, 69, 66, 62]},
	A: {root: 33, pad: [45, 52, 57, 59, 64], arp: [57, 64, 69, 71, 76, 71, 69, 64]},
};
// Melody fragments per chord: [beat, midi].
const MELODY: Record<string, [number, number][]> = {
	D: [
		[0, 78],
		[1, 76],
		[2, 74],
		[3.5, 69],
	],
	A: [
		[0, 76],
		[1.5, 73],
		[3, 69],
		[6, 71],
	],
	Bm: [
		[0, 74],
		[1, 73],
		[2, 71],
		[3.5, 66],
	],
	G: [
		[0, 71],
		[1, 74],
		[2.5, 78],
		[5, 76],
	],
};

const BEAT = 60 / 96;
const CHORD_LEN = 8 * BEAT; // two bars

type Section = {
	t0: number;
	t1: number;
	prog: string[];
	padAmp: number;
	bright: number;
	arp: 'eighth' | 'quarter';
	arpAmp: number;
	kickFrom?: number;
	kickAmp?: number;
	shakerFrom?: number;
	melody?: boolean;
};

const section = (s: Section) => {
	for (let c = 0; s.t0 + c * CHORD_LEN < s.t1; c++) {
		const name = s.prog[c % s.prog.length];
		const ch = CH[name];
		const c0 = s.t0 + c * CHORD_LEN;
		const c1 = Math.min(c0 + CHORD_LEN, s.t1);
		pad(ch.pad, c0, c1, {amp: s.padAmp, bright: s.bright, attack: c === 0 ? 0.8 : 1.4});
		sub(ch.root + 12, c0, c1);
		for (let k = 0; k < 16; k++) {
			const t = c0 + k * (BEAT / 2);
			if (t >= s.t1) break;
			if (s.arp === 'quarter' && k % 2) continue;
			const fadeIn = smooth((t - s.t0) / 3);
			const vel = (k % 4 === 0 ? 1 : 0.72) * (0.9 + rnd() * 0.2);
			pluck(t, ch.arp[k % 8] + (k >= 8 && k % 8 === 4 ? 12 : 0), {amp: s.arpAmp * vel * fadeIn, pan: k % 2 ? 0.35 : -0.35});
		}
		for (let b = 0; b < 8; b++) {
			const t = c0 + b * BEAT;
			if (t >= s.t1) break;
			if (s.kickFrom !== undefined && t >= s.kickFrom - 0.01 && b % 2 === 0) kick(t, s.kickAmp ?? 0.3);
			if (s.shakerFrom !== undefined && t >= s.shakerFrom - 0.01) {
				shaker(t + BEAT / 2, 0.045, 0.4);
				shaker(t, 0.02, -0.4);
			}
		}
		if (s.melody && Math.floor(c / s.prog.length) % 2 === 1) {
			for (const [beat, m] of MELODY[name]) {
				const t = c0 + beat * BEAT;
				if (t < s.t1 - 0.3) pluck(t, m, {amp: 0.13, pan: 0.1, decay: 2.2, rev: 0.55});
			}
		}
	}
};

// ---- the cue sheet ----------------------------------------------------------------------------
const tTitle = start.Title + 10 / FPS; // the mark lands
const tClose = start.Close;

// Cold open: "someone else's cloud" (unsettled), then "on your computer" (warm), riser into the title.
pad([38, 45], 0.1, 4.4, {amp: 0.07, attack: 2.5, bright: 0.1});
pad(CH.Bm.pad, 0.3, 4.4, {amp: 0.035, attack: 2.5, bright: 0.15});
sub(35 + 12, 0.5, 4.4, 0.1);
[
	[0.7, 71],
	[1.7, 78],
	[2.7, 74],
	[3.5, 73],
].forEach(([t, m]) => pluck(t, m, {amp: 0.08, pan: 0.3, decay: 2, rev: 0.8}));
whoosh(4.1, 1.0, 0.1);
pad(CH.G.pad, 4.5, tTitle, {amp: 0.045, attack: 1.2, bright: 0.3});
sub(31 + 12, 4.5, tTitle, 0.12);
[
	[4.9, 74],
	[5.4, 78],
	[5.9, 81],
	[6.4, 83],
].forEach(([t, m]) => pluck(t, m, {amp: 0.08, pan: -0.2, decay: 1.8, rev: 0.7}));
riser(5.6, tTitle, 0.14);

// Title: the mark lands.
boom(tTitle, 0.55);
shimmer(tTitle, [74, 78, 81, 85, 86, 90]);
pad(CH.D.pad, tTitle, start.LocalOnly, {amp: 0.06, attack: 0.08, release: 2.5, bright: 0.7});
pad([86, 90], tTitle + 0.2, start.LocalOnly - 0.5, {amp: 0.012, attack: 2, bright: 0.2});
sub(38 + 12, tTitle, start.LocalOnly, 0.14);
pluck(start.Title + 34 / FPS, 81, {amp: 0.07, decay: 2.5, rev: 0.8});

// Local only → bring any AI → which AI does what: a calm pulse that builds.
section({
	t0: start.LocalOnly,
	t1: start.MorningBrief,
	prog: ['D', 'Bm', 'G', 'A'],
	padAmp: 0.04,
	bright: 0.35,
	arp: 'eighth',
	arpAmp: 0.075,
	kickFrom: start.BringYourOwnAI,
	kickAmp: 0.22,
	shakerFrom: start.AiRouting,
});

// The feature tour: fuller, brighter, a melody on alternate passes.
section({
	t0: start.MorningBrief,
	t1: start.WhatLeaves,
	prog: ['D', 'A', 'Bm', 'G'],
	padAmp: 0.042,
	bright: 0.5,
	arp: 'eighth',
	arpAmp: 0.08,
	kickFrom: start.MorningBrief,
	kickAmp: 0.3,
	shakerFrom: start.MorningBrief,
	melody: true,
});

// What leaves your computer: strip back, darker, let the facts land.
section({
	t0: start.WhatLeaves,
	t1: start.Updates,
	prog: ['Bm', 'G', 'D', 'A'],
	padAmp: 0.045,
	bright: 0.2,
	arp: 'quarter',
	arpAmp: 0.07,
});
pad([38], start.WhatLeaves, start.Updates, {amp: 0.05, attack: 2, bright: 0.05});

// Updates: lift back up.
section({
	t0: start.Updates,
	t1: tClose,
	prog: ['G', 'A', 'D'],
	padAmp: 0.04,
	bright: 0.45,
	arp: 'eighth',
	arpAmp: 0.075,
	kickFrom: start.Updates + 4 * BEAT,
	kickAmp: 0.24,
	shakerFrom: start.Updates,
});

// Close: one chord per line ("Your mail." / "Your computer." / "Your AI."), swell, final hit on the logo.
const lines = [10, 46, 82].map((f) => tClose + f / FPS);
const tLogo = tClose + 150 / FPS;
(['D', 'Bm', 'G'] as const).forEach((name, k) => {
	const t = lines[k];
	CH[name].pad.slice(1).forEach((m, j) => pluck(t + j * 0.025, m + 12, {amp: 0.06, pan: j % 2 ? 0.4 : -0.4, decay: 2, rev: 0.7}));
	pad(CH[name].pad, t, k < 2 ? lines[k + 1] : tLogo - 1.1, {amp: 0.045, attack: 0.3, release: 1.2, bright: 0.45});
	sub(CH[name].root + 12, t, k < 2 ? lines[k + 1] : tLogo - 1.1, 0.13);
});
pad(CH.A.pad, tLogo - 1.4, tLogo, {amp: 0.04, attack: 1, release: 0.4, bright: 0.5});
riser(tLogo - 1.6, tLogo, 0.12);
boom(tLogo, 0.5);
shimmer(tLogo, [74, 78, 81, 85, 86, 90, 93]);
pad(CH.D.pad, tLogo, END, {amp: 0.06, attack: 0.08, release: 2, bright: 0.65});
sub(38 + 12, tLogo, END, 0.14);

// Transition sounds: a soft whoosh on every zoom cut, a bigger one under each light leak.
for (const c of cuts) {
	if (c.kind === 'leak') whoosh(c.t, 1.6, 0.16, 200, 5000);
	else if (Math.abs(c.t - tTitle) > 0.5 && c.t < tClose) whoosh(c.t, 0.8, 0.07, 400, 4000);
}

// ---- reverb (Freeverb) ------------------------------------------------------------------------
const reverb = (input: Float32Array, spread: number, room = 0.86, damp = 0.4) => {
	const fb = room * 0.28 + 0.7;
	const d = damp * 0.4;
	const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => ({b: new Float32Array(n + spread), i: 0, s: 0}));
	const aps = [556, 441, 341, 225].map((n) => ({b: new Float32Array(n + spread), i: 0}));
	const out = new Float32Array(N);
	for (let k = 0; k < N; k++) {
		const x = input[k] * 0.015;
		let acc = 0;
		for (const c of combs) {
			const y = c.b[c.i];
			c.s = y * (1 - d) + c.s * d;
			c.b[c.i] = x + c.s * fb;
			if (++c.i >= c.b.length) c.i = 0;
			acc += y;
		}
		for (const a of aps) {
			const bo = a.b[a.i];
			a.b[a.i] = acc + bo * 0.5;
			if (++a.i >= a.b.length) a.i = 0;
			acc = bo - acc;
		}
		out[k] = acc;
	}
	return out;
};
const wetL = reverb(send, 0);
const wetR = reverb(send, 23);

// ---- master -----------------------------------------------------------------------------------
const L = new Float32Array(N);
const R = new Float32Array(N);
let hpL = 0;
let hpR = 0;
let pl = 0;
let pr = 0;
const hpA = 1 / (1 + (2 * Math.PI * 25) / SR); // remove DC and sub-25 Hz rumble
for (let i = 0; i < N; i++) {
	const xl = dryL[i] + wetL[i] * 3;
	const xr = dryR[i] + wetR[i] * 3;
	hpL = hpA * (hpL + xl - pl);
	hpR = hpA * (hpR + xr - pr);
	pl = xl;
	pr = xr;
	const t = i / SR;
	const fade = smooth(t / 0.3) * (1 - smooth((t - (END - 2)) / 2));
	L[i] = Math.tanh(hpL * 1.3) * fade;
	R[i] = Math.tanh(hpR * 1.3) * fade;
}
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.89 / peak;

// Self-check: no NaNs, and print loudness per section so levels can be reviewed without listening.
const rms = (a: number, b: number) => {
	let s = 0;
	const i0 = Math.floor(a * SR);
	const i1 = Math.min(N, Math.floor(b * SR));
	for (let i = i0; i < i1; i++) s += (L[i] * gain) ** 2 + (R[i] * gain) ** 2;
	return (10 * Math.log10(s / (2 * (i1 - i0)) + 1e-12)).toFixed(1);
};
if (!Number.isFinite(gain)) throw new Error('mix contains NaN/Infinity');
console.log(`length ${END.toFixed(2)} s, peak before normalise ${peak.toFixed(3)}`);
for (const [name, a, b] of [
	['cold open', 0, tTitle],
	['title', tTitle, start.LocalOnly],
	['local + AI', start.LocalOnly, start.MorningBrief],
	['feature tour', start.MorningBrief, start.WhatLeaves],
	['what leaves', start.WhatLeaves, start.Updates],
	['updates', start.Updates, tClose],
	['close', tClose, END],
] as const)
	console.log(`${name.padEnd(13)} ${a.toFixed(1).padStart(6)}–${b.toFixed(1).padEnd(6)} RMS ${rms(a, b)} dBFS`);

// ---- write 16-bit WAV ---------------------------------------------------------------------------
const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(36 + N * 4, 4);
pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
	pcm.writeInt16LE(Math.round(L[i] * gain * 32767), 44 + i * 4);
	pcm.writeInt16LE(Math.round(R[i] * gain * 32767), 46 + i * 4);
}
mkdirSync(new URL('../out', import.meta.url), {recursive: true});
writeFileSync(new URL('../out/music.wav', import.meta.url), pcm);
console.log('wrote out/music.wav');
