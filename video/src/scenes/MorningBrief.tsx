import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AppShot, Count, glass, Headline, Icon, Kicker, Rise, Scene, useEnter} from '../kit';
import {C, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Percent boxes on today.jpg
const SUMMARY = {x: 20.3, y: 30.8, w: 51.8, h: 28.4};
const SORTED = {x: 73.4, y: 30.8, w: 22.4, h: 28.4};

// Spotlight that glides from the summary card to the sorted card.
const MovingFocus: React.FC = () => {
	const frame = useCurrentFrame();
	const show = useEnter(70, 22);
	const hide = interpolate(frame, [262, 284], [1, 0], clamp);
	const m = interpolate(frame, [150, 182], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const L = (k: 'x' | 'y' | 'w' | 'h') => SUMMARY[k] + (SORTED[k] - SUMMARY[k]) * m;
	const p = show * hide;
	return (
		<div
			style={{
				position: 'absolute',
				left: `${L('x')}%`,
				top: `${L('y')}%`,
				width: `${L('w')}%`,
				height: `${L('h')}%`,
				borderRadius: 14,
				border: `3px solid ${C.violetSoft}`,
				boxShadow: `0 0 0 4000px rgba(6,7,12,${0.62 * p}), 0 0 40px ${C.violetSoft}`,
				opacity: p,
			}}
		/>
	);
};

const Item: React.FC<{readonly t: string; readonly delay: number}> = ({t, delay}) => (
	<Rise delay={delay} y={14} blur={6} dur={20}>
		<div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 27, color: C.text, fontWeight: 500}}>
			<Icon name="check" size={26} color={C.violetSoft} />
			{t}
		</div>
	</Rise>
);

export const MorningBrief: React.FC = () => (
	<Scene chapter={['03', 'Morning brief']} glowAt="70% 60%">
		<AbsoluteFill style={{padding: '100px 96px 0'}}>
			<Rise delay={8}>
				<Kicker>Morning brief</Kicker>
			</Rise>
			<Rise delay={14} style={{marginTop: 16}}>
				<Headline size={96}>Your morning in 60 seconds.</Headline>
			</Rise>
		</AbsoluteFill>

		<div style={{position: 'absolute', left: 96, top: 300, width: 660, display: 'flex', flexDirection: 'column', gap: 20}}>
			<Rise delay={36}>
				<div style={{...glass(), padding: '24px 32px'}}>
					<div style={{fontFamily: mono, fontSize: 22, color: C.violetSoft, letterSpacing: '0.1em'}}>OVERNIGHT</div>
					<div style={{fontSize: 40, fontWeight: 700, color: C.white, marginTop: 8, lineHeight: 1.15}}>
						<Count to={21} delay={40} /> emails. Only <span style={{color: C.violetSoft}}>6</span> need you.
					</div>
				</div>
			</Rise>
			<Rise delay={96}>
				<div style={{...glass('rgba(47,180,99,.4)'), padding: '22px 32px', display: 'flex', gap: 20, alignItems: 'center'}}>
					<Icon name="laptop" size={44} color={C.greenSoft} />
					<div style={{fontSize: 30, lineHeight: 1.3, color: C.text}}>
						Written by Ollama on this computer <span style={{color: C.greenSoft}}>· nothing uploaded</span>
					</div>
				</div>
			</Rise>
			<Rise delay={170}>
				<div style={{...glass(), padding: '22px 32px', display: 'flex', flexDirection: 'column', gap: 12}}>
					<div style={{fontFamily: mono, fontSize: 22, color: C.muted, letterSpacing: '0.1em'}}>THE BRIEF HOLDS</div>
					<Item t="Needs you today" delay={182} />
					<Item t="Today, pulled from your mail" delay={194} />
					<Item t="Latest code" delay={206} />
					<Item t="Handled while you slept" delay={218} />
					<Item t="Tidy up" delay={230} />
				</div>
			</Rise>
		</div>

		<div style={{position: 'absolute', left: 800, top: 300}}>
			<AppShot
				src="shots/today.jpg"
				width={1060}
				delay={20}
				move={260}
				tiltFrom={22}
				tiltTo={3}
				yawFrom={0}
				yawTo={-5}
				zoomFrom={1}
				zoomTo={1.1}
				focusX={50}
				focusY={30}
			>
				<MovingFocus />
			</AppShot>
		</div>
	</Scene>
);
