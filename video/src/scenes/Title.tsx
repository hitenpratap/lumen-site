import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Headline, Kicker, LumenMark, Rise, Scene, Sub} from '../kit';
import {C, display} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Anamorphic lens flare that sweeps across the mark as it lands.
const Flare: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [18, 44, 90], [0, 1, 0], clamp);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 368,
					height: 6,
					background: `linear-gradient(90deg, transparent, rgba(169,150,255,${0.9 * p}) 35%, rgba(255,255,255,${p}) 50%, rgba(169,150,255,${0.9 * p}) 65%, transparent)`,
					filter: 'blur(3px)',
					scale: `${0.2 + p} 1`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 960 - 260,
					top: 370 - 260,
					width: 520,
					height: 520,
					borderRadius: '50%',
					background: `radial-gradient(closest-side, rgba(169,150,255,${0.45 * p}), transparent)`,
				}}
			/>
		</>
	);
};

export const Title: React.FC = () => (
	<Scene grid glow="rgba(91,61,245,.45)" glowAt="50% 40%" push={0.05}>
		<Flare />
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 270, gap: 34, textAlign: 'center'}}>
			<LumenMark size={200} delay={10} />
			<Rise delay={34} blur={24}>
				<Headline size={176} style={{fontFamily: display, letterSpacing: '-0.05em'}}>
					Lumen
				</Headline>
			</Rise>
			<Rise delay={58}>
				<Sub size={52} style={{color: C.text}}>
					Email that feels <span style={{color: C.violetSoft}}>calm</span>, not urgent.
				</Sub>
			</Rise>
			<Rise delay={84}>
				<Kicker color={C.muted} style={{display: 'flex', gap: 18}}>
					<span>Mac</span>
					<span style={{color: C.faint}}>/</span>
					<span>Windows</span>
					<span style={{color: C.faint}}>/</span>
					<span>Linux</span>
				</Kicker>
			</Rise>
		</AbsoluteFill>
	</Scene>
);
