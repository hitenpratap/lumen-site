import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {glass, Headline, Icon, Kicker, Rise, Scene, Sub, useEnter} from '../kit';
import {C, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BOX = {x: 210, y: 400, w: 1500, h: 470};

// The "green line": a boundary that draws itself around everything that stays on the computer.
const Boundary: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [40, 100], [0, 1], clamp);
	const pulse = interpolate(frame, [300, 340], [0, 1], clamp);
	const perim = 2 * (BOX.w + BOX.h);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<rect
				x={BOX.x}
				y={BOX.y}
				width={BOX.w}
				height={BOX.h}
				rx={32}
				fill={`rgba(47,180,99,${0.06 * draw})`}
				stroke={C.green}
				strokeWidth={3}
				strokeDasharray={`${perim * draw} ${perim}`}
				style={{filter: `drop-shadow(0 0 ${18 + 30 * Math.sin(pulse * Math.PI)}px rgba(47,180,99,.7))`}}
			/>
		</svg>
	);
};

const Tile: React.FC<{readonly icon: IconName; readonly title: string; readonly note: string; readonly delay: number}> = ({
	icon,
	title,
	note,
	delay,
}) => (
	<Rise delay={delay} y={-60} blur={10} scaleFrom={0.9}>
		<div
			style={{
				...glass('rgba(47,180,99,.35)'),
				background: 'rgba(10,11,16,.7)',
				width: 440,
				height: 168,
				boxSizing: 'border-box',
				padding: '26px 30px',
				display: 'flex',
				alignItems: 'center',
				gap: 24,
			}}
		>
			<div
				style={{
					width: 72,
					height: 72,
					borderRadius: 18,
					background: 'rgba(47,180,99,.14)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Icon name={icon} size={38} color={C.greenSoft} />
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<div style={{fontSize: 32, fontWeight: 700, color: C.white, lineHeight: 1.15}}>{title}</div>
				<div style={{fontSize: 24, color: C.muted}}>{note}</div>
			</div>
		</div>
	</Rise>
);

export const LocalOnly: React.FC = () => {
	const label = useEnter(70, 24);
	return (
		<Scene chapter={['01', 'Local only']} glow="rgba(47,180,99,.22)" glowAt="50% 65%">
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 120, gap: 22, textAlign: 'center'}}>
				<Rise delay={6}>
					<Kicker color={C.greenSoft}>Local only</Kicker>
				</Rise>
				<Rise delay={16}>
					<Headline size={92}>Your mail never touches our servers.</Headline>
				</Rise>
			</AbsoluteFill>
			<Boundary />
			<div
				style={{
					position: 'absolute',
					left: BOX.x + 40,
					top: BOX.y - 22,
					padding: '6px 18px',
					background: C.bg,
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					fontFamily: mono,
					fontSize: 24,
					letterSpacing: '0.12em',
					color: C.greenSoft,
					opacity: label,
				}}
			>
				<Icon name="lock" size={26} color={C.greenSoft} />
				YOUR COMPUTER
			</div>
			<div
				style={{
					position: 'absolute',
					left: BOX.x,
					top: BOX.y,
					width: BOX.w,
					height: BOX.h,
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 440px)',
					gap: 28,
					justifyContent: 'center',
					alignContent: 'center',
				}}
			>
				<Tile icon="mail" title="Emails and attachments" note="stored on disk" delay={96} />
				<Tile icon="search" title="Search index" note="built locally" delay={112} />
				<Tile icon="sparkle" title="AI summaries and drafts" note="saved next to your mail" delay={128} />
				<Tile icon="book" title="Rules and writing style" note="learned on this computer" delay={144} />
				<Tile icon="key" title="Passwords and API keys" note="in the system keychain" delay={160} />
				<Tile icon="clock" title="Sign-in codes" note="deleted after 24 hours" delay={176} />
			</div>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120}}>
				<Rise delay={250}>
					<Sub size={34} style={{display: 'flex', alignItems: 'center', gap: 36, color: C.body}}>
						<span style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<Icon name="wifiOff" size={32} color={C.greenSoft} /> Works offline
						</span>
						<span style={{color: C.faint}}>·</span>
						<span style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<Icon name="shieldCheck" size={32} color={C.greenSoft} /> Protected by your disk encryption
						</span>
					</Sub>
				</Rise>
			</AbsoluteFill>
		</Scene>
	);
};
