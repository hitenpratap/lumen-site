import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, useEnter} from '../kit';
import {C, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const COLS = '600px 560px 1fr';

const ROWS: {f: string; u: string; cloud?: boolean; host?: string}[] = [
	{f: 'Labels, spam, phishing, codes', u: 'Built into Roost'},
	{f: 'Search index', u: 'nomic-embed-text · Ollama'},
	{f: 'Summaries and morning brief', u: 'llama3.1:8b · Ollama'},
	{f: 'Draft replies', u: 'Claude · your key', cloud: true},
	{f: 'Ask-anything answers', u: 'GPT · your OpenAI key', cloud: true, host: 'api.openai.com'},
];

const Row: React.FC<{readonly r: (typeof ROWS)[number]; readonly delay: number}> = ({r, delay}) => (
	<Rise delay={delay} y={22} blur={8}>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: COLS,
				alignItems: 'center',
				height: 86,
				padding: '0 36px',
				borderTop: `1.5px solid ${C.line}`,
				background: r.cloud ? 'rgba(91,61,245,.10)' : undefined,
				fontSize: 30,
			}}
		>
			<div style={{color: C.white, fontWeight: 600}}>{r.f}</div>
			<div style={{fontFamily: mono, fontSize: 26, color: r.cloud ? C.violetPale : C.body}}>{r.u}</div>
			<div>
				{r.cloud ? (
					<Pill tone="violet" size={24}>{r.host ?? 'api.anthropic.com'}, your account</Pill>
				) : (
					<Pill tone="green" size={24}>This computer</Pill>
				)}
			</div>
		</div>
	</Rise>
);

const HEAD = {fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.dim} as const;

// Private numbers turn into placeholders: digits churn for a moment, then settle.
const Masked: React.FC<{readonly orig: string; readonly ph: string; readonly at: number}> = ({orig, ph, at}) => {
	const frame = useCurrentFrame();
	if (frame < at) return <span style={{color: C.white}}>{orig}</span>;
	if (frame >= at + 22) {
		return (
			<span style={{color: C.violetPale, background: 'rgba(91,61,245,.25)', borderRadius: 10, padding: '2px 12px'}}>{ph}</span>
		);
	}
	const s = orig
		.split('')
		.map((ch, i) => (/[0-9A-Z]/.test(ch) ? '0123456789#%$@'[Math.floor(random(`${at}-${i}-${frame}`) * 14)] : ch))
		.join('');
	return <span style={{color: C.violetSoft}}>{s}</span>;
};

const SAFE: {icon: IconName; text: string}[] = [
	{icon: 'lock', text: 'Keep an account local only'},
	{icon: 'eye', text: 'Ask me every time, preview what is sent'},
	{icon: 'shield', text: 'Rules can block senders from cloud AI'},
	{icon: 'activity', text: 'Every cloud request is in the network activity log'},
];

export const AiRouting: React.FC = () => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [212, 240], [0, 1], clamp);
	const inn = useEnter(238, 26);
	const lbl = useEnter(300, 22);
	return (
		<Scene chapter={['02', 'Bring your own AI']} glow="rgba(91,61,245,.3)" glowAt="50% 70%">
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 100, gap: 22, textAlign: 'center'}}>
				<Rise delay={6}>
					<Kicker style={{opacity: 1 - out}}>Which AI does what</Kicker>
					<Kicker style={{position: 'absolute', left: 0, right: 0, top: 0, opacity: inn}}>Your cloud key</Kicker>
				</Rise>
				<div style={{position: 'relative', height: 96, width: 1728}}>
					<Rise delay={14} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
						<Headline size={92}>Pick the AI for each job.</Headline>
					</Rise>
					<div style={{position: 'absolute', inset: 0, opacity: inn, translate: `0 ${(1 - inn) * 20}px`}}>
						<Headline size={92}>When a feature uses your cloud key</Headline>
					</div>
				</div>
			</AbsoluteFill>

			{/* Beat 1: table */}
			<div
				style={{
					position: 'absolute',
					left: 96,
					top: 330,
					width: 1728,
					opacity: 1 - out,
					scale: String(1 - out * 0.04),
					filter: `blur(${out * 12}px)`,
				}}
			>
				<Rise delay={30} y={24}>
					<div style={{...glass(C.line2), overflow: 'hidden'}}>
						<div style={{display: 'grid', gridTemplateColumns: COLS, height: 64, alignItems: 'center', padding: '0 36px', ...HEAD}}>
							<div>Feature</div>
							<div>Uses</div>
							<div>Where your email text goes</div>
						</div>
						{ROWS.map((r, i) => (
							<Row key={r.f} r={r} delay={46 + i * 22} />
						))}
					</div>
				</Rise>
				<Rise delay={46 + ROWS.length * 22 + 6} y={16} blur={6} style={{textAlign: 'center', marginTop: 28, fontSize: 32, color: C.body}}>
					Mix local and cloud, per feature. Any OpenAI-compatible provider.
				</Rise>
			</div>

			{/* Beat 2: masking and safeguards */}
			<div style={{position: 'absolute', left: 96, right: 96, top: 280, opacity: inn}}>
				<div style={{...glass('rgba(169,150,255,.4)'), padding: '34px 30px', textAlign: 'center', fontFamily: mono, fontSize: 38, color: C.body, whiteSpace: 'nowrap', boxShadow: '0 30px 100px rgba(91,61,245,.28)'}}>
					Card <Masked orig="4111 1111 1111 1111" ph="[CARD-1]" at={280} /> · passport{' '}
					<Masked orig="K4829173" ph="[PASSPORT-1]" at={296} /> · acct{' '}
					<Masked orig="0012 3456 7890" ph="[ACCOUNT-1]" at={312} />
				</div>
				<div style={{marginTop: 24, textAlign: 'center', display: 'flex', justifyContent: 'center', opacity: lbl, translate: `0 ${(1 - lbl) * 14}px`}}>
					<Pill tone="violet" size={30}>
						<Icon name="shieldCheck" size={32} color={C.violetPale} />
						Private numbers masked before anything is sent
					</Pill>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 44}}>
					{SAFE.map((s, i) => (
						<Rise key={s.text} delay={326 + i * 14} y={24} blur={8}>
							<div style={{...glass(C.line2), height: 104, padding: '0 30px', display: 'flex', alignItems: 'center', gap: 22, fontSize: 28, fontWeight: 600, color: C.text, lineHeight: 1.25}}>
								<div style={{width: 56, height: 56, borderRadius: 14, flex: 'none', background: 'rgba(47,180,99,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Icon name={s.icon} size={30} color={C.greenSoft} />
								</div>
								{s.text}
							</div>
						</Rise>
					))}
				</div>
				<Rise delay={384} y={24} style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
					<Pill tone="violet" size={28}>
						<Icon name="sparkle" size={30} color={C.violetPale} />
						Drafted by Claude with your own key · private numbers masked
					</Pill>
				</Rise>
			</div>
		</Scene>
	);
};
