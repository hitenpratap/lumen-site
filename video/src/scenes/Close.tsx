import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Headline, Kicker, Letterbox, RoostMark, Rise, Scene, Sub} from '../kit';
import {C, display} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const T = 150; // logo beat starts

const Flare: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [T + 6, T + 32, T + 76], [0, 1, 0], clamp);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 357,
					height: 6,
					background: `linear-gradient(90deg, transparent, rgba(169,150,255,${0.9 * p}) 35%, rgba(255,255,255,${p}) 50%, rgba(169,150,255,${0.9 * p}) 65%, transparent)`,
					filter: 'blur(3px)',
					scale: `${0.2 + p} 1`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 700,
					top: 100,
					width: 520,
					height: 520,
					borderRadius: '50%',
					background: `radial-gradient(closest-side, rgba(169,150,255,${0.45 * p}), transparent)`,
				}}
			/>
		</>
	);
};

const Line: React.FC<{readonly delay: number; readonly word: string; readonly color?: string; readonly tail?: string}> = ({delay, word, color, tail = '.'}) => (
	<Rise delay={delay} blur={26} y={50} dur={30}>
		<Headline size={150}>
			Your <span style={{color}}>{word}</span>
			{tail}
		</Headline>
	</Rise>
);

export const Close: React.FC = () => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [T - 22, T], [0, 1], clamp);
	const bars = interpolate(frame, [212, 250], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
	const black = interpolate(frame, [238, 269], [0, 1], clamp);
	return (
		<Scene glow="rgba(91,61,245,.42)" glowAt="50% 42%" push={0.05}>
			{frame < T ? (
				<AbsoluteFill
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						gap: 16,
						textAlign: 'center',
						opacity: 1 - out,
						filter: `blur(${out * 18}px)`,
						scale: String(1 + out * 0.05),
					}}
				>
					<Line delay={10} word="mail" />
					<Line delay={46} word="computer" color={C.greenSoft} />
					<Line delay={82} word="AI" color={C.violetSoft} />
				</AbsoluteFill>
			) : null}
			<Flare />
			{frame >= T - 4 ? (
				<AbsoluteFill style={{alignItems: 'center', paddingTop: 230, gap: 28, textAlign: 'center'}}>
					<RoostMark size={200} delay={T + 2} />
					<Rise delay={T + 20} blur={24}>
						<Headline size={176} style={{fontFamily: display, letterSpacing: '-0.05em'}}>
							Roost
						</Headline>
					</Rise>
					<Rise delay={T + 40}>
						<Sub size={52} style={{color: C.text}}>
							Coming to <span style={{color: C.violetSoft}}>Mac, Windows and Linux.</span>
						</Sub>
					</Rise>
					<Rise delay={T + 58}>
						<Kicker color={C.muted} style={{fontSize: 24}}>
							Gmail, Outlook, iCloud, Yahoo and any IMAP host.
						</Kicker>
					</Rise>
				</AbsoluteFill>
			) : null}
			<Letterbox open={bars} h={170} />
			<AbsoluteFill style={{background: '#000', opacity: black}} />
		</Scene>
	);
};
