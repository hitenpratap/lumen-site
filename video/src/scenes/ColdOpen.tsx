import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Headline, Icon, Letterbox, Rise, Scene, Sub, useEnter} from '../kit';
import {C} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Envelopes stream up into someone else's cloud, then fall back down into your own computer.
const Envelopes: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			{new Array(16).fill(0).map((_, i) => {
				const spread = (random(`s${i}`) - 0.5) * 1300;
				const up = interpolate(frame, [i * 5, i * 5 + 70], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1)});
				const down = interpolate(frame, [138 + i * 3, 138 + i * 3 + 50], [0, 1], {
					...clamp,
					easing: Easing.bezier(0.5, 0, 0.3, 1),
				});
				const x = down > 0 ? 960 + spread * 0.12 * (1 - down) : 960 + spread * (1 - up);
				const y = down > 0 ? 690 + (860 - 690) * down : 1100 - (1100 - 250) * up;
				const visible = down > 0 ? 1 - down * 0.9 : up < 0.9 ? up * 1.2 : 1 - (up - 0.9) * 8;
				return (
					<div
						key={i}
						style={{position: 'absolute', left: x - 22, top: y - 22, opacity: Math.max(0, visible) * 0.6}}
					>
						<Icon name="mail" size={44} color={down > 0 ? C.greenSoft : C.violetPale} stroke={1.6} />
					</div>
				);
			})}
		</>
	);
};

export const ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();
	const cloudIn = useEnter(10, 40);
	const swap = interpolate(frame, [112, 132], [0, 1], clamp);
	const laptopIn = useEnter(150, 30);
	return (
		<Scene grid={false} glow="rgba(91,61,245,.22)" glowAt="50% 25%" push={0.06}>
			{/* someone else's cloud */}
			<div
				style={{
					position: 'absolute',
					left: 960 - 130,
					top: 120,
					opacity: cloudIn * (1 - swap) * 0.55,
					filter: `blur(${swap * 20}px)`,
					scale: String(1 + swap * 0.3),
				}}
			>
				<Icon name="cloud" size={260} color={C.dim} stroke={1} />
			</div>
			{/* your computer */}
			<div
				style={{
					position: 'absolute',
					left: 960 - 110,
					top: 770,
					opacity: laptopIn,
					filter: `drop-shadow(0 0 40px rgba(47,180,99,${0.6 * laptopIn}))`,
				}}
			>
				<Icon name="laptop" size={220} color={C.greenSoft} stroke={1.1} />
			</div>
			<Envelopes />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 22}}>
				<div style={{opacity: 1 - swap, filter: `blur(${swap * 16}px)`, display: 'flex', flexDirection: 'column', gap: 22}}>
					<Rise delay={14}>
						<Sub size={44} style={{color: C.muted}}>
							AI for your inbox usually means
						</Sub>
					</Rise>
					<Rise delay={30}>
						<Headline size={104}>sending it to someone else’s cloud.</Headline>
					</Rise>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 22}}>
				<Rise delay={140}>
					<Sub size={44} style={{color: C.muted}}>
						Lumen keeps it
					</Sub>
				</Rise>
				<Rise delay={154}>
					<Headline size={120}>
						on <span style={{color: C.greenSoft}}>your</span> computer.
					</Headline>
				</Rise>
			</AbsoluteFill>
			<Letterbox open={1 - interpolate(frame, [200, 240], [0, 1], clamp)} />
		</Scene>
	);
};
