import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Count, glass, Headline, Icon, Kicker, Pill, Rise, Scene, Typewriter, useEnter} from '../kit';
import {C, mono, ui} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const QUESTION = 'How much has Marco invoiced me this year?';

const FilterChip: React.FC<{readonly text: string; readonly delay: number}> = ({text, delay}) => (
	<Rise delay={delay} y={14} blur={6} scaleFrom={0.9}>
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 12,
				padding: '10px 18px 10px 22px',
				borderRadius: 999,
				background: 'rgba(91,61,245,.18)',
				border: `1.5px solid rgba(169,150,255,.55)`,
				fontFamily: mono,
				fontSize: 26,
				color: C.violetPale,
			}}
		>
			{text}
			<Icon name="x" size={22} color={C.violetSoft} />
		</div>
	</Rise>
);

const MONTHS = 'JFMAMJJASON'.split('');
const VALUES: Record<number, number> = {2: 1800, 5: 2400, 8: 3000, 10: 2400};

const Chart: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 170}}>
			{MONTHS.map((m, i) => {
				const v = VALUES[i] ?? 0;
				const p = interpolate(frame, [124 + i * 3, 150 + i * 3], [0, 1], {
					...clamp,
					easing: Easing.out(Easing.cubic),
				});
				return (
					<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
						<div
							style={{
								width: 34,
								height: Math.max(6, (v / 3000) * 130 * p),
								borderRadius: 8,
								background: v ? `linear-gradient(${C.violetSoft}, ${C.violet})` : 'rgba(255,255,255,.08)',
							}}
						/>
						<div style={{fontFamily: mono, fontSize: 22, color: C.dim}}>{m}</div>
					</div>
				);
			})}
		</div>
	);
};

const Cite: React.FC<{readonly n: number; readonly text: string; readonly delay: number}> = ({n, text, delay}) => (
	<Rise delay={delay} y={14} blur={6}>
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '10px 14px',
				borderRadius: 14,
				background: 'rgba(255,255,255,.05)',
				border: `1.5px solid ${C.line2}`,
				fontSize: 24,
				color: C.body,
				whiteSpace: 'nowrap',
			}}
		>
			<span style={{fontFamily: mono, color: C.violetSoft}}>[{n}]</span>
			<Icon name="mail" size={24} color={C.muted} />
			{text}
		</div>
	</Rise>
);

export const Search: React.FC = () => {
	const frame = useCurrentFrame();
	const bar = useEnter(12, 24);
	const glowPulse = interpolate(frame, [24, 70], [0.2, 0.7], clamp);
	return (
		<Scene chapter={['07', 'Search']} glowAt="40% 55%">
			<AbsoluteFill style={{paddingLeft: 96, paddingTop: 100}}>
				<Rise delay={6}>
					<Kicker>Search</Kicker>
				</Rise>
				<Rise delay={12}>
					<Headline size={96} style={{marginTop: 14}}>
						Search that answers.
					</Headline>
				</Rise>
			</AbsoluteFill>

			{/* search bar */}
			<div
				style={{
					position: 'absolute',
					left: 96,
					top: 300,
					width: 1120,
					padding: '22px 28px',
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					...glass(`rgba(169,150,255,${glowPulse})`),
					opacity: bar,
					translate: `0 ${(1 - bar) * 30}px`,
					fontSize: 34,
					color: C.white,
					boxSizing: 'border-box',
				}}
			>
				<Icon name="search" size={36} color={C.violetSoft} />
				<Typewriter text={QUESTION} delay={26} cps={30} />
			</div>

			{/* parsed filters */}
			<div style={{position: 'absolute', left: 96, top: 400, display: 'flex', gap: 16, alignItems: 'center'}}>
				<Rise delay={72} y={10} blur={4}>
					<span style={{fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', color: C.dim}}>FILTERS</span>
				</Rise>
				<FilterChip text="from:marco" delay={76} />
				<FilterChip text="subject:invoice" delay={86} />
				<FilterChip text="after:2026/01/01" delay={96} />
			</div>

			{/* answer card */}
			<div style={{position: 'absolute', left: 96, top: 480, width: 1120}}>
				<Rise delay={106} y={40} scaleFrom={0.97}>
					<div style={{...glass('rgba(169,150,255,.4)'), padding: '28px 34px', boxSizing: 'border-box'}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
							<div>
								<Pill tone="violet" size={22}>
									<Icon name="sparkle" size={22} color={C.violetPale} /> Answer
								</Pill>
								<div
									style={{
										fontFamily: ui,
										fontWeight: 700,
										fontSize: 72,
										color: C.white,
										marginTop: 18,
										letterSpacing: '-0.03em',
									}}
								>
									EUR {(() => {
										const n = Math.round(interpolate(frame, [116, 150], [0, 9600], {...clamp, easing: Easing.out(Easing.cubic)}));
										return n.toLocaleString('en-US');
									})()}
								</div>
								<div style={{fontSize: 30, color: C.body, marginTop: 6}}>
									across <Count to={4} delay={116} dur={30} /> invoices{' '}
									<span style={{fontFamily: mono, color: C.violetSoft, fontSize: 26}}>[1][2][3][4]</span>
								</div>
							</div>
							<Chart />
						</div>
						<div style={{display: 'flex', gap: 12, marginTop: 26, flexWrap: 'nowrap'}}>
							<Cite n={1} text="#1018 · Mar" delay={160} />
							<Cite n={2} text="#1027 · Jun" delay={170} />
							<Cite n={3} text="#1035 · Sep" delay={180} />
							<Cite n={4} text="#1042 · Nov" delay={190} />
						</div>
					</div>
				</Rise>
				<div style={{display: 'flex', gap: 14, marginTop: 20}}>
					<Rise delay={204} y={14} blur={6}>
						<Pill tone="grey" size={26}>
							<Icon name="arrowRight" size={24} color={C.muted} /> Which one is unpaid?
						</Pill>
					</Rise>
					<Rise delay={214} y={14} blur={6}>
						<Pill tone="grey" size={26}>
							<Icon name="arrowRight" size={24} color={C.muted} /> Show #1042
						</Pill>
					</Rise>
				</div>
			</div>

			{/* operators side note */}
			<div style={{position: 'absolute', left: 1280, top: 300, width: 544}}>
				<Rise delay={160} y={30}>
					<div style={{...glass(), padding: '30px 32px', boxSizing: 'border-box'}}>
						<div style={{fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1.2}}>
							Gmail-style operators work too
						</div>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24}}>
							{['from:', 'has:attachment', 'is:unread', 'after:', 'newer_than:7d', 'subject:'].map((o, i) => (
								<Rise key={o} delay={176 + i * 8} y={10} blur={4}>
									<span
										style={{
											fontFamily: mono,
											fontSize: 24,
											padding: '8px 16px',
											borderRadius: 12,
											background: 'rgba(255,255,255,.06)',
											border: `1.5px solid ${C.line2}`,
											color: C.violetPale,
										}}
									>
										{o}
									</span>
								</Rise>
							))}
						</div>
					</div>
				</Rise>
				<Rise delay={248} y={24} style={{marginTop: 24}}>
					<div
						style={{
							...glass('rgba(47,180,99,.5)'),
							padding: '24px 30px',
							boxSizing: 'border-box',
							display: 'flex',
							gap: 18,
							alignItems: 'center',
						}}
					>
						<Icon name="shieldCheck" size={44} color={C.greenSoft} />
						<div style={{fontSize: 30, lineHeight: 1.3, color: C.greenPale}}>
							Without AI, everything but the answer still works.
						</div>
					</div>
				</Rise>
			</div>
		</Scene>
	);
};
