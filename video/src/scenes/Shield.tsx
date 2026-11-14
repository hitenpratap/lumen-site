import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {AppShot, Focus, glass, Headline, Icon, Kicker, Pill, Rise, Scene} from '../kit';
import {C} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Fades a spotlight in at `a` and out at `b`, so one spotlight hands off to the next. */
const Spot: React.FC<{readonly a: number; readonly b: number; readonly children: React.ReactNode}> = ({a, b, children}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [b - 14, b], [1, 0], clamp);
	return frame >= a - 1 && frame <= b ? <div style={{position: 'absolute', inset: 0, opacity: o}}>{children}</div> : null;
};

const Reason: React.FC<{readonly n: number; readonly title: string; readonly note: string; readonly delay: number}> = ({
	n,
	title,
	note,
	delay,
}) => (
	<Rise delay={delay} x={-40} y={0} blur={8}>
		<div style={{...glass('rgba(240,98,98,.4)'), padding: '18px 24px', display: 'flex', gap: 20, alignItems: 'center'}}>
			<div
				style={{
					width: 46,
					height: 46,
					flex: 'none',
					borderRadius: 23,
					background: 'rgba(240,98,98,.18)',
					color: '#FFC2C2',
					fontWeight: 700,
					fontSize: 26,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{n}
			</div>
			<div>
				<div style={{fontSize: 30, fontWeight: 700, color: C.white, lineHeight: 1.15}}>{title}</div>
				<div style={{fontSize: 24, color: C.muted, marginTop: 4}}>{note}</div>
			</div>
		</div>
	</Rise>
);

export const Shield: React.FC = () => {
	const icon = (name: IconName, color: string) => <Icon name={name} size={28} color={color} />;
	return (
		<Scene chapter={['08', 'Shield']} glow="rgba(240,98,98,.25)" glowAt="60% 60%">
			<AbsoluteFill style={{paddingLeft: 96, paddingTop: 100}}>
				<Rise delay={6}>
					<Kicker color={C.redSoft}>Shield</Kicker>
				</Rise>
				<Rise delay={12}>
					<Headline size={92} style={{marginTop: 14}}>
						Phishing held back, with reasons.
					</Headline>
				</Rise>
			</AbsoluteFill>

			<div style={{position: 'absolute', left: 700, top: 330}}>
				<AppShot
					src="shots/shield.jpg"
					width={1130}
					delay={20}
					move={260}
					tiltFrom={20}
					tiltTo={3}
					zoomFrom={1}
					zoomTo={1.1}
					focusX={50}
					focusY={45}
				>
					<Spot a={56} b={122}>
						<Focus x={18.1} y={23.2} w={80.2} h={5.9} delay={56} color={C.redSoft} />
					</Spot>
					<Spot a={118} b={206}>
						<Focus x={19.5} y={44.2} w={77.4} h={25.6} delay={118} color={C.redSoft} />
					</Spot>
					<Spot a={196} b={300}>
						<Focus x={19.5} y={36.4} w={21.2} h={6.4} delay={196} color={C.greenSoft} dim={0.5} />
					</Spot>
				</AppShot>
			</div>

			<div style={{position: 'absolute', left: 96, top: 330, width: 560, display: 'flex', flexDirection: 'column', gap: 16}}>
				<Reason n={1} title="Lookalike sender" note="Not the real brightbank" delay={110} />
				<Reason n={2} title="Link text vs real destination" note="Shows one site, opens another" delay={128} />
				<Reason n={3} title="Failed SPF / DKIM" note="The sender could not be verified" delay={146} />
				<Reason n={4} title="Pressure tactics, no history" note="Urgent wording, no past mail" delay={164} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 700,
					top: 820,
					width: 1130,
					display: 'flex',
					flexDirection: 'column',
					gap: 18,
				}}
			>
				<Rise delay={200} y={20}>
					<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
						<Pill tone="green" size={26} style={{background: "#0F1A14"}}>
							{icon('shieldCheck', C.greenSoft)} Safe preview: links and images disabled
						</Pill>
					</div>
				</Rise>
				<Rise delay={216} y={20}>
					<div style={{display: 'flex', gap: 14}}>
						<Pill tone="red" size={26} style={{background: "#2A1517"}}>{icon('trash', '#FFC2C2')} Delete and block</Pill>
						<Pill tone="grey" size={26} style={{background: "#161823"}}>{icon('alert', C.muted)} Report</Pill>
						<Pill tone="grey" size={26} style={{background: "#161823"}}>{icon('check', C.muted)} Release</Pill>
					</div>
				</Rise>
			</div>

			<Rise delay={238} y={24} style={{position: 'absolute', left: 96, top: 850, width: 560}}>
				<div style={{...glass('rgba(47,180,99,.55)'), padding: '20px 26px', display: 'flex', gap: 16, alignItems: 'center'}}>
					<Icon name="laptop" size={40} color={C.greenSoft} />
					<div style={{fontSize: 28, lineHeight: 1.25, color: C.greenPale, fontWeight: 600}}>
						Every check ran on this computer. No AI needed.
					</div>
				</div>
			</Rise>
		</Scene>
	);
};
