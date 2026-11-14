import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {AppShot, glass, Headline, Icon, Kicker, Rise, Scene, useEnter} from '../kit';
import {C} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Percent boxes on read.jpg, switched at frame t.
const BOXES = [
	{t: 44, x: 16.3, y: 31.6, w: 30.2, h: 68},
	{t: 108, x: 48.6, y: 42.2, w: 49.6, h: 48.2},
	{t: 168, x: 49.2, y: 79.3, w: 29, h: 8.2},
	{t: 214, x: 48.6, y: 42.2, w: 49.6, h: 48.2},
] as const;

const MovingFocus: React.FC = () => {
	const frame = useCurrentFrame();
	const show = useEnter(BOXES[0].t, 22);
	let b: {x: number; y: number; w: number; h: number} = BOXES[0];
	for (let k = 1; k < BOXES.length; k++) {
		const m = interpolate(frame, [BOXES[k].t, BOXES[k].t + 26], [0, 1], {
			...clamp,
			easing: Easing.bezier(0.5, 0, 0.2, 1),
		});
		const a = BOXES[k - 1];
		const n = BOXES[k];
		if (m > 0) b = {x: a.x + (n.x - a.x) * m, y: a.y + (n.y - a.y) * m, w: a.w + (n.w - a.w) * m, h: a.h + (n.h - a.h) * m};
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: `${b.x}%`,
				top: `${b.y}%`,
				width: `${b.w}%`,
				height: `${b.h}%`,
				borderRadius: 14,
				border: `3px solid ${C.violetSoft}`,
				boxShadow: `0 0 0 4000px rgba(6,7,12,${0.6 * show}), 0 0 40px ${C.violetSoft}`,
				opacity: show,
			}}
		/>
	);
};

const Call: React.FC<{readonly icon: IconName; readonly text: string; readonly delay: number}> = ({icon, text, delay}) => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [delay, delay + 12, delay + 60], [0, 1, 0.35], clamp);
	return (
		<Rise delay={delay}>
			<div
				style={{
					...glass(`rgba(169,150,255,${0.25 + 0.45 * glow})`),
					padding: '20px 28px',
					display: 'flex',
					alignItems: 'center',
					gap: 22,
				}}
			>
				<div
					style={{
						width: 64,
						height: 64,
						flexShrink: 0,
						borderRadius: 18,
						background: 'rgba(91,61,245,.18)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name={icon} size={34} color={C.violetSoft} />
				</div>
				<div style={{fontSize: 32, fontWeight: 600, color: C.white, lineHeight: 1.2}}>{text}</div>
			</div>
		</Rise>
	);
};

export const CatchMeUp: React.FC = () => (
	<Scene chapter={['05', 'Reading']} glowAt="72% 60%">
		<div style={{position: 'absolute', left: 96, top: 100, width: 720}}>
			<Rise delay={8}>
				<Kicker>Reading</Kicker>
			</Rise>
			<Rise delay={14} style={{marginTop: 16}}>
				<Headline size={88}>
					Catch me up
					<br />
					on any thread.
				</Headline>
			</Rise>
		</div>
		<div style={{position: 'absolute', left: 96, top: 400, width: 680, display: 'flex', flexDirection: 'column', gap: 20}}>
			<Call icon="sparkle" text="One-line AI summary on every row" delay={44} />
			<Call icon="check" text="To-dos and actions pulled from the thread" delay={108} />
			<Call icon="pen" text="One-tap replies in your voice" delay={168} />
			<Call icon="languages" text="Translate to English, in place" delay={214} />
		</div>
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 840, top: 250}}>
				<AppShot
					src="shots/read.jpg"
					width={1050}
					delay={16}
					move={250}
					tiltFrom={22}
					tiltTo={3}
					yawFrom={0}
					yawTo={5}
					zoomFrom={1}
					zoomTo={1.08}
					focusX={60}
					focusY={50}
				>
					<MovingFocus />
				</AppShot>
			</div>
		</AbsoluteFill>
	</Scene>
);
