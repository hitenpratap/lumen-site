import {lightLeak} from '@remotion/effects/light-leak';
import type {CSSProperties, ReactNode} from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	random,
	Solid,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, display, EASE_OUT, mono, ui} from '../theme';

export {Icon} from './Icon';
export type {IconName} from './Icon';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.bezier(...EASE_OUT);

/** 0→1 progress of an entrance that starts at `delay` and lasts `dur` frames. */
export const useEnter = (delay = 0, dur = 24) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [delay, delay + dur], [0, 1], {...clamp, easing: easeOut});
};

/** Fades, lifts and un-blurs its children in, like a focus pull. */
export const Rise: React.FC<{
	readonly delay?: number;
	readonly dur?: number;
	readonly y?: number;
	readonly x?: number;
	readonly blur?: number;
	readonly scaleFrom?: number;
	readonly style?: CSSProperties;
	readonly children: ReactNode;
}> = ({delay = 0, dur = 26, y = 34, x = 0, blur = 14, scaleFrom = 1, style, children}) => {
	const p = useEnter(delay, dur);
	return (
		<div
			style={{
				opacity: p,
				translate: `${(1 - p) * x}px ${(1 - p) * y}px`,
				scale: String(scaleFrom + (1 - scaleFrom) * p),
				filter: blur ? `blur(${(1 - p) * blur}px)` : undefined,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/** Mono, uppercase, letter-spaced label above a headline. */
export const Kicker: React.FC<{readonly color?: string; readonly style?: CSSProperties; readonly children: ReactNode}> = ({
	color = C.violetSoft,
	style,
	children,
}) => (
	<div style={{fontFamily: mono, fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', color, ...style}}>
		{children}
	</div>
);

export const Headline: React.FC<{readonly size?: number; readonly style?: CSSProperties; readonly children: ReactNode}> = ({
	size = 112,
	style,
	children,
}) => (
	<div
		style={{
			fontFamily: display,
			fontWeight: 800,
			fontSize: size,
			lineHeight: 1,
			letterSpacing: '-0.04em',
			color: C.white,
			textWrap: 'balance',
			...style,
		}}
	>
		{children}
	</div>
);

export const Sub: React.FC<{readonly size?: number; readonly style?: CSSProperties; readonly children: ReactNode}> = ({
	size = 40,
	style,
	children,
}) => (
	<div style={{fontFamily: ui, fontSize: size, lineHeight: 1.35, color: C.body, textWrap: 'pretty', ...style}}>
		{children}
	</div>
);

/** Frosted dark card used for chips, panels and callouts. */
export const glass = (border: string = C.line2): CSSProperties => ({
	background: 'rgba(18,20,28,.86)',
	border: `1.5px solid ${border}`,
	borderRadius: 24,
	boxShadow: '0 30px 80px rgba(0,0,0,.5)',
	backdropFilter: 'blur(14px)',
});

/** Small rounded badge, e.g. "This computer" or "Your key". */
export const Pill: React.FC<{
	readonly tone?: 'green' | 'violet' | 'red' | 'grey' | 'amber';
	readonly size?: number;
	readonly style?: CSSProperties;
	readonly children: ReactNode;
}> = ({tone = 'green', size = 24, style, children}) => {
	const t = {
		green: ['rgba(47,180,99,.14)', 'rgba(47,180,99,.55)', C.greenPale],
		violet: ['rgba(91,61,245,.16)', 'rgba(169,150,255,.5)', C.violetPale],
		red: ['rgba(240,98,98,.14)', 'rgba(240,98,98,.5)', '#FFC2C2'],
		amber: ['rgba(255,181,71,.14)', 'rgba(255,181,71,.5)', '#FFD89A'],
		grey: ['rgba(255,255,255,.05)', C.line2, C.body],
	}[tone];
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 10,
				padding: `${size * 0.32}px ${size * 0.7}px`,
				borderRadius: 999,
				background: t[0],
				border: `1.5px solid ${t[1]}`,
				color: t[2],
				fontFamily: ui,
				fontWeight: 600,
				fontSize: size,
				whiteSpace: 'nowrap',
				...style,
			}}
		>
			{children}
		</span>
	);
};

/** Reveals `text` character by character from `delay`, `cps` characters per second. */
export const Typewriter: React.FC<{
	readonly text: string;
	readonly delay?: number;
	readonly cps?: number;
	readonly caret?: boolean;
	readonly style?: CSSProperties;
}> = ({text, delay = 0, cps = 32, caret = true, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n = Math.floor(interpolate(frame, [delay, delay + (text.length / cps) * fps], [0, text.length], clamp));
	const blink = Math.floor(frame / 15) % 2 === 0;
	return (
		<span style={style}>
			{text.slice(0, n)}
			{caret && frame >= delay ? (
				<span style={{opacity: n < text.length || blink ? 1 : 0, color: C.violetSoft}}>▍</span>
			) : null}
		</span>
	);
};

/** Counts from `from` to `to` between `delay` and `delay + dur`. */
export const Count: React.FC<{readonly from?: number; readonly to: number; readonly delay?: number; readonly dur?: number}> = ({
	from = 0,
	to,
	delay = 0,
	dur = 30,
}) => {
	const frame = useCurrentFrame();
	return <>{Math.round(interpolate(frame, [delay, delay + dur], [from, to], {...clamp, easing: easeOut}))}</>;
};

/** The Lumen mark: violet tile, white ring that draws itself, centre dot, orange spark. */
export const LumenMark: React.FC<{readonly size?: number; readonly delay?: number; readonly style?: CSSProperties}> = ({
	size = 160,
	delay = 0,
	style,
}) => {
	const tile = useEnter(delay, 22);
	const ring = useEnter(delay + 8, 34);
	const dot = useEnter(delay + 26, 18);
	const spark = useEnter(delay + 36, 16);
	const circ = 2 * Math.PI * 24;
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', ...style}}>
			<rect
				x="4"
				y="4"
				width="92"
				height="92"
				rx="24"
				fill={C.violet}
				style={{opacity: tile, scale: String(0.7 + 0.3 * tile), transformOrigin: '50px 50px'}}
			/>
			<circle
				cx="50"
				cy="52"
				r="24"
				fill="none"
				stroke="#fff"
				strokeWidth="9"
				strokeLinecap="round"
				strokeDasharray={`${circ * 0.83 * ring} ${circ}`}
				style={{rotate: '-25deg', transformOrigin: '50px 52px'}}
			/>
			<circle cx="50" cy="52" r={9 * dot} fill="#fff" />
			<circle cx="67.5" cy="31" r={6.5 * spark} fill={C.orange} />
		</svg>
	);
};

/** Dark stage: faint grid, breathing glow and slow dust. */
export const Backdrop: React.FC<{
	readonly glow?: string;
	readonly glowAt?: string;
	readonly grid?: boolean;
	readonly dust?: boolean;
}> = ({glow = 'rgba(91,61,245,.38)', glowAt = '50% 60%', grid = true, dust = true}) => {
	const frame = useCurrentFrame();
	const breathe = 1 + Math.sin(frame / 38) * 0.05;
	return (
		<AbsoluteFill style={{background: C.bg}}>
			{grid ? (
				<AbsoluteFill
					style={{
						backgroundImage:
							'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
						backgroundSize: '80px 80px',
						backgroundPosition: `0px ${-frame * 0.25}px`,
						maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%,#000 30%,transparent 100%)',
					}}
				/>
			) : null}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 55% 50% at ${glowAt}, ${glow}, transparent 70%)`,
					scale: String(breathe),
					opacity: 0.85 + Math.sin(frame / 38) * 0.15,
				}}
			/>
			{dust
				? new Array(38).fill(0).map((_, i) => {
						const depth = random(`d${i}`);
						const x = random(`x${i}`) * 1920;
						const y = (random(`y${i}`) * 1180 - frame * (0.15 + depth * 0.5)) % 1180;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: x + Math.sin(frame / 50 + i) * 12,
									top: y < 0 ? y + 1180 : y,
									width: 2 + depth * 5,
									height: 2 + depth * 5,
									borderRadius: '50%',
									background: i % 5 === 0 ? C.violetPale : '#fff',
									opacity: 0.08 + depth * 0.22,
									filter: `blur(${(1 - depth) * 2.5}px)`,
								}}
							/>
						);
					})
				: null}
		</AbsoluteFill>
	);
};

/** Bottom-left chapter marker: "03 — Bring your own AI". */
export const Chapter: React.FC<{readonly n: string; readonly label: string}> = ({n, label}) => {
	const p = useEnter(8, 30);
	return (
		<div
			style={{
				position: 'absolute',
				left: 96,
				bottom: 64,
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				fontFamily: mono,
				fontSize: 20,
				letterSpacing: '0.16em',
				textTransform: 'uppercase',
				color: C.dim,
				opacity: p,
			}}
		>
			<span style={{color: C.violetSoft}}>{n}</span>
			<span style={{width: 60 * p, height: 1.5, background: C.faint}} />
			<span>{label}</span>
		</div>
	);
};

/**
 * Full-frame scene: backdrop, a slow camera push-in over the whole scene, and an optional chapter marker.
 * Children are laid out inside an AbsoluteFill.
 */
export const Scene: React.FC<{
	readonly chapter?: readonly [string, string];
	readonly glow?: string;
	readonly glowAt?: string;
	readonly grid?: boolean;
	readonly push?: number;
	readonly style?: CSSProperties;
	readonly children: ReactNode;
}> = ({chapter, glow, glowAt, grid, push = 0.04, style, children}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden', fontFamily: ui, color: C.text}}>
			<Backdrop glow={glow} glowAt={glowAt} grid={grid} />
			<AbsoluteFill style={{scale: String(interpolate(frame, [0, durationInFrames], [1, 1 + push])), ...style}}>
				{children}
			</AbsoluteFill>
			{chapter ? <Chapter n={chapter[0]} label={chapter[1]} /> : null}
		</AbsoluteFill>
	);
};

/**
 * A real Lumen screenshot (public/shots/*.jpg, 2400×1550) in a floating app window.
 * The window tilts in with perspective, then the camera eases from `zoomFrom` to `zoomTo`
 * around (`focusX`%, `focusY`%) of the screenshot over `move` frames.
 * Children render on top of the screenshot in the same zoomed space (use % positions).
 */
export const AppShot: React.FC<{
	readonly src: string;
	readonly width?: number;
	readonly delay?: number;
	readonly move?: number;
	readonly tiltFrom?: number;
	readonly tiltTo?: number;
	readonly yawFrom?: number;
	readonly yawTo?: number;
	readonly zoomFrom?: number;
	readonly zoomTo?: number;
	readonly focusX?: number;
	readonly focusY?: number;
	readonly style?: CSSProperties;
	readonly children?: ReactNode;
}> = ({
	src,
	width = 1500,
	delay = 0,
	move = 240,
	tiltFrom = 24,
	tiltTo = 4,
	yawFrom = 0,
	yawTo = 0,
	zoomFrom = 1,
	zoomTo = 1.06,
	focusX = 50,
	focusY = 40,
	style,
	children,
}) => {
	const frame = useCurrentFrame();
	const enter = useEnter(delay, 40);
	const cam = interpolate(frame, [delay, delay + move], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.45, 0, 0.2, 1),
	});
	return (
		<div style={{perspective: 2400, width, ...style}}>
			<div
				style={{
					position: 'relative',
					borderRadius: 22,
					overflow: 'hidden',
					border: '1.5px solid rgba(255,255,255,.14)',
					boxShadow: '0 -10px 140px rgba(91,61,245,.35), 0 60px 140px rgba(0,0,0,.7)',
					opacity: enter,
					translate: `0px ${(1 - enter) * 120}px`,
					rotate: `x ${tiltFrom + (tiltTo - tiltFrom) * cam}deg`,
					transform: `rotateY(${yawFrom + (yawTo - yawFrom) * cam}deg)`,
					transformOrigin: '50% 0%',
				}}
			>
				<div
					style={{
						position: 'relative',
						scale: String(zoomFrom + (zoomTo - zoomFrom) * cam),
						transformOrigin: `${focusX}% ${focusY}%`,
					}}
				>
					<Img src={staticFile(src)} style={{display: 'block', width: '100%', height: 'auto'}} />
					{children}
				</div>
			</div>
		</div>
	);
};

/**
 * Spotlight on a region of an AppShot (percent coordinates of the screenshot):
 * dims the rest and draws a glowing outline. Place it as a child of <AppShot>.
 */
export const Focus: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly w: number;
	readonly h: number;
	readonly delay?: number;
	readonly color?: string;
	readonly dim?: number;
}> = ({x, y, w, h, delay = 0, color = C.violetSoft, dim = 0.62}) => {
	const p = useEnter(delay, 22);
	return (
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				width: `${w}%`,
				height: `${h}%`,
				borderRadius: 14,
				border: `3px solid ${color}`,
				boxShadow: `0 0 0 4000px rgba(6,7,12,${dim * p}), 0 0 40px ${color}`,
				opacity: p,
				scale: String(1.06 - 0.06 * p),
			}}
		/>
	);
};

/** Thin black bars top and bottom that slide in/out (open = 0..1). */
export const Letterbox: React.FC<{readonly open: number; readonly h?: number}> = ({open, h = 120}) => (
	<>
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h * open, background: '#000'}} />
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h * open, background: '#000'}} />
	</>
);

/** Global finish: lens vignette and a fine animated film grain. */
export const FilmFinish: React.FC<{readonly grain?: number}> = ({grain = 0.06}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(0,0,0,.6) 100%)'}}
			/>
			{grain > 0 ? (
				<AbsoluteFill style={{opacity: grain, mixBlendMode: 'overlay'}}>
					<svg width="1920" height="1080">
						<filter id="grain">
							<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 9} stitchTiles="stitch" />
							<feColorMatrix type="saturate" values="0" />
						</filter>
						<rect width="1920" height="1080" filter="url(#grain)" />
					</svg>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};

/** Light leak played over a cut (use inside <TransitionSeries.Overlay>). */
export const LightLeak: React.FC<{readonly seed?: number; readonly hueShift?: number}> = ({seed = 0, hueShift = 0}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, width, height} = useVideoConfig();
	return (
		<Solid
			width={width}
			height={height}
			style={{opacity: 0.7}}
			effects={[
				lightLeak({
					seed,
					hueShift,
					progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp),
				}),
			]}
		/>
	);
};
