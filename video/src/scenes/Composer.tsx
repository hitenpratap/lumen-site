import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, Typewriter, useEnter} from '../kit';
import {C, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.5, 0, 0.2, 1);

const WARM =
	'Hi Marco, thanks for invoice #1042. I will send the EUR 2,400 transfer on Friday at 10:00 and attach the confirmation. Thanks again, Alex';
const CRISP = 'Marco, invoice #1042 received. EUR 2,400 goes out Friday at 10:00, confirmation attached. Alex';

const INTENTS = ['Confirm Friday transfer', 'Ask for more time', 'Hand it to Neha'];
const TONES = ['Warm', 'Crisp', 'Formal'];
const SWITCH = 168;

const Draft: React.FC = () => {
	const frame = useCurrentFrame();
	const warmOut = interpolate(frame, [SWITCH - 6, SWITCH + 4], [1, 0], clamp);
	const crisp = frame >= SWITCH + 4;
	return (
		<div style={{fontSize: 32, lineHeight: 1.45, color: C.text, minHeight: 140}}>
			{!crisp ? (
				<div style={{opacity: warmOut}}>
					<Typewriter text={WARM} delay={84} cps={62} />
				</div>
			) : (
				<Typewriter text={CRISP} delay={SWITCH + 4} cps={80} />
			)}
		</div>
	);
};

const Check: React.FC<{readonly icon: 'clock' | 'globe' | 'alert'; readonly text: string; readonly delay: number}> = ({
	icon,
	text,
	delay,
}) => (
	<Rise delay={delay} y={16} blur={6}>
		<div style={{display: 'flex', gap: 18, alignItems: 'flex-start'}}>
			<Icon name={icon} size={32} color={C.amber} style={{flexShrink: 0, marginTop: 3}} />
			<div style={{fontSize: 28, lineHeight: 1.3, color: C.text}}>{text}</div>
		</div>
	</Rise>
);

export const Composer: React.FC = () => {
	const frame = useCurrentFrame();
	const pick = interpolate(frame, [64, 76], [0, 1], clamp);
	const tone = interpolate(frame, [SWITCH, SWITCH + 14], [0, 1], {...clamp, easing: ease});
	const att = useEnter(250, 26);
	return (
		<Scene chapter={['06', 'AI composer']} glowAt="40% 60%">
			<AbsoluteFill style={{padding: '100px 96px 0'}}>
				<Rise delay={8}>
					<Kicker>AI composer</Kicker>
				</Rise>
				<Rise delay={14} style={{marginTop: 14}}>
					<Headline size={88}>Say what you mean. Roost drafts it.</Headline>
				</Rise>
			</AbsoluteFill>

			<Rise delay={22} style={{position: 'absolute', left: 96, top: 290, width: 1130}}>
				<div style={{...glass(), padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 22}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: C.muted}}>
						<Icon name="mail" size={28} color={C.muted} />
						Reply to <b style={{color: C.white}}>Marco Bianchi</b> · Invoice #1042 for October
					</div>
					<div style={{display: 'flex', gap: 14}}>
						{INTENTS.map((t, i) => {
							const chosen = i === 0;
							const on = chosen ? pick : 0;
							return (
								<Rise key={t} delay={34 + i * 8} y={12} blur={4} dur={18}>
									<span
										style={{
											display: 'inline-block',
											padding: '10px 22px',
											borderRadius: 999,
											fontSize: 26,
											fontWeight: 600,
											whiteSpace: 'nowrap',
											background: on ? C.violet : 'rgba(255,255,255,.05)',
											border: `1.5px solid ${on ? C.violetSoft : C.line2}`,
											color: C.white,
											opacity: chosen ? 1 : 1 - 0.55 * pick,
											scale: String(chosen ? 1 + 0.05 * Math.sin(pick * Math.PI) : 1),
											boxShadow: on ? '0 0 30px rgba(91,61,245,.6)' : undefined,
										}}
									>
										{t}
									</span>
								</Rise>
							);
						})}
					</div>
					<div
						style={{
							background: 'rgba(255,255,255,.04)',
							border: `1.5px solid ${C.line}`,
							borderRadius: 16,
							padding: '22px 26px',
							minHeight: 150,
						}}
					>
						{frame >= 80 ? <Draft /> : <div style={{fontSize: 28, color: C.dim}}>Pick what you want to say...</div>}
					</div>
					<Rise delay={110} y={14} blur={4}>
						<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
							<span style={{fontFamily: mono, fontSize: 22, color: C.muted, letterSpacing: '0.1em'}}>TONE</span>
							<div style={{position: 'relative', display: 'flex', borderRadius: 999, background: 'rgba(255,255,255,.05)', border: `1.5px solid ${C.line2}`}}>
								<div
									style={{
										position: 'absolute',
										top: 0,
										bottom: 0,
										left: 0,
										width: 140,
										borderRadius: 999,
										background: C.violet,
										translate: `${tone * 140}px 0`,
									}}
								/>
								{TONES.map((t) => (
									<div key={t} style={{position: 'relative', width: 140, textAlign: 'center', padding: '10px 0', fontSize: 26, fontWeight: 600, color: C.white}}>
										{t}
									</div>
								))}
							</div>
						</div>
					</Rise>
				</div>
			</Rise>

			<div style={{position: 'absolute', left: 1266, top: 290, width: 558, display: 'flex', flexDirection: 'column', gap: 20}}>
				<Rise delay={120}>
					<div style={{...glass('rgba(47,180,99,.4)'), padding: '24px 28px'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, color: C.white}}>
							<Icon name="fingerprint" size={34} color={C.greenSoft} /> Sound like me
						</div>
						<div style={{fontSize: 26, color: C.body, margin: '10px 0 14px', lineHeight: 1.3}}>
							Your style, learned from your sent mail.
						</div>
						<Pill tone="green" size={22}>
							Stored on this computer
						</Pill>
					</div>
				</Rise>
				<Rise delay={196}>
					<div style={{...glass('rgba(255,181,71,.4)'), padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18}}>
						<div style={{fontFamily: mono, fontSize: 22, color: C.amber, letterSpacing: '0.1em'}}>BEFORE YOU SEND</div>
						<Check icon="alert" text="You mention an attachment but none is attached" delay={206} />
						<Check icon="clock" text="You promised a time. Set a reminder?" delay={222} />
						<Check icon="globe" text="Recipient's time zone" delay={238} />
					</div>
				</Rise>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 96,
					top: 842,
					width: 1728,
					boxSizing: 'border-box',
					opacity: att,
					translate: `0 ${(1 - att) * 30}px`,
					...glass('rgba(169,150,255,.4)'),
					padding: '16px 30px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: C.violetPale}}>
					<Icon name="sparkle" size={32} color={C.violetSoft} />
					Drafted by Claude with your own key · private numbers masked
				</div>
				<span
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						padding: '12px 28px',
						borderRadius: 999,
						background: 'rgba(47,180,99,.14)',
						border: '1.5px solid rgba(47,180,99,.6)',
						color: C.greenPale,
						fontSize: 28,
						fontWeight: 600,
					}}
				>
					<Icon name="laptop" size={28} color={C.greenSoft} /> Redo with Ollama, fully local
				</span>
			</div>
		</Scene>
	);
};
