import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, Sub, useEnter} from '../kit';
import {C, display, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Provider: React.FC<{
	readonly letter: string;
	readonly name: string;
	readonly note: string;
	readonly tone: 'green' | 'violet';
	readonly delay: number;
}> = ({letter, name, note, tone, delay}) => {
	const g = tone === 'green';
	return (
		<Rise delay={delay} y={30} blur={10}>
			<div
				style={{
					...glass(g ? 'rgba(47,180,99,.35)' : 'rgba(169,150,255,.35)'),
					height: 92,
					boxSizing: 'border-box',
					padding: '0 24px',
					display: 'flex',
					alignItems: 'center',
					gap: 20,
				}}
			>
				<div
					style={{
						width: 56,
						height: 56,
						borderRadius: 16,
						flex: 'none',
						background: g ? 'rgba(47,180,99,.18)' : 'rgba(91,61,245,.22)',
						color: g ? C.greenPale : C.violetPale,
						fontFamily: display,
						fontWeight: 800,
						fontSize: 32,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{letter}
				</div>
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{fontSize: 30, fontWeight: 700, color: C.white, lineHeight: 1.15, whiteSpace: 'nowrap'}}>{name}</div>
					<div style={{fontSize: 22, color: C.muted, marginTop: 2, whiteSpace: 'nowrap'}}>{note}</div>
				</div>
			</div>
		</Rise>
	);
};

const CONFIGS = [
	{at: 268, name: 'Ollama', url: 'http://localhost:11434/v1', model: 'llama3.1:8b', pill: 'This computer', tone: 'green'},
	{at: 302, name: 'OpenAI', url: 'https://api.openai.com/v1', model: 'gpt-4o-mini', pill: 'Your key', tone: 'violet'},
	{at: 336, name: 'Anthropic (Claude)', url: 'https://api.anthropic.com/v1/', model: 'claude-sonnet-4-5', pill: 'Your key', tone: 'violet'},
	{at: 370, name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/', model: 'gemini-2.5-flash', pill: 'Your key', tone: 'violet'},
	{at: 404, name: 'Custom', url: 'https://your-server.example/v1', model: 'any model', pill: 'Any OpenAI-compatible API', tone: 'violet'},
] as const;

const ConfigCard: React.FC = () => {
	const frame = useCurrentFrame();
	const cur = [...CONFIGS].reverse().find((c) => frame >= c.at) ?? CONFIGS[0];
	const p = interpolate(frame - cur.at, [0, 12], [0, 1], clamp);
	return (
		<div style={{opacity: p, translate: `0 ${(1 - p) * 18}px`, filter: `blur(${(1 - p) * 6}px)`}}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64}}>
				<div style={{fontSize: 46, fontWeight: 700, color: C.white}}>{cur.name}</div>
				<Pill tone={cur.tone} size={26}>{cur.pill}</Pill>
			</div>
			<div style={{fontFamily: mono, fontSize: 32, color: C.text, lineHeight: 1.7, whiteSpace: 'nowrap', marginTop: 10}}>
				<span style={{color: C.dim}}>base_url </span>{cur.url}
			</div>
			<div style={{fontFamily: mono, fontSize: 32, color: C.text, lineHeight: 1.7, whiteSpace: 'nowrap'}}>
				<span style={{color: C.dim}}>model    </span>{cur.model}
			</div>
			<div style={{fontFamily: mono, fontSize: 32, color: C.muted, lineHeight: 1.7, whiteSpace: 'nowrap'}}>
				<span style={{color: C.dim}}>api_key  </span>
				<span style={{color: C.greenSoft}}>••••••••••••</span>
			</div>
		</div>
	);
};

const AnyCard: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = interpolate(frame, [164, 184], [0, 1], clamp);
	const pulse = 0.5 + 0.5 * Math.sin(Math.max(0, frame - 184) / 9);
	const glow = hl * (0.55 + 0.45 * pulse);
	return (
		<Rise delay={150} y={30} blur={10}>
			<div
				style={{
					...glass('rgba(169,150,255,.4)'),
					border: `2.5px dashed rgba(169,150,255,${0.5 + 0.4 * hl})`,
					boxShadow: `0 30px 80px rgba(0,0,0,.5), 0 0 ${70 * glow}px rgba(120,95,255,${0.55 * glow})`,
					height: 84,
					boxSizing: 'border-box',
					padding: '0 30px',
					display: 'flex',
					alignItems: 'center',
					gap: 24,
				}}
			>
				<div style={{fontSize: 46, fontWeight: 300, color: C.violetPale, width: 56, textAlign: 'center', flex: 'none'}}>+</div>
				<div style={{fontSize: 34, fontWeight: 700, color: C.white, whiteSpace: 'nowrap'}}>Any OpenAI-compatible API</div>
				<div style={{fontSize: 26, color: C.muted, marginLeft: 'auto', whiteSpace: 'nowrap'}}>Just a URL, a key and a model</div>
			</div>
		</Rise>
	);
};

const GroupLabel: React.FC<{readonly color: string; readonly icon: 'laptop' | 'key'; readonly delay: number; readonly children: string}> = ({
	color,
	icon,
	delay,
	children,
}) => (
	<Rise delay={delay} y={16} blur={6} style={{marginBottom: 18}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: mono, fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color}}>
			<Icon name={icon} size={28} color={color} />
			{children}
		</div>
	</Rise>
);

const Keychain: React.FC<{readonly name: string; readonly delay: number}> = ({name, delay}) => (
	<Rise delay={delay} y={24} blur={8}>
		<div style={{...glass('rgba(47,180,99,.35)'), borderRadius: 18, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 600, color: C.text}}>
			<Icon name="lock" size={30} color={C.greenSoft} />
			{name}
		</div>
	</Rise>
);

export const BringYourOwnAI: React.FC = () => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [236, 260], [0, 1], clamp);
	const inn = useEnter(258, 26);
	const subA = 1 - out;
	return (
		<Scene chapter={['02', 'Bring your own AI']} glow="rgba(91,61,245,.34)" glowAt="50% 70%">
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 100, gap: 20, textAlign: 'center'}}>
				<Rise delay={8}>
					<Kicker>Bring your own AI</Kicker>
				</Rise>
				<Rise delay={14}>
					<Headline size={96}>Bring any AI.</Headline>
				</Rise>
				<div style={{position: 'relative', height: 50, width: 1700}}>
					<Rise delay={26} style={{position: 'absolute', inset: 0, opacity: subA}}>
						<Sub size={36}>If it speaks the OpenAI API, Roost can use it. On your computer or in the cloud.</Sub>
					</Rise>
					<div style={{position: 'absolute', inset: 0, opacity: inn, translate: `0 ${(1 - inn) * 16}px`}}>
						<Sub size={38}>A provider is just a URL, a key and a model.</Sub>
					</div>
				</div>
			</AbsoluteFill>

			{/* Beat 2: providers */}
			<div
				style={{
					position: 'absolute',
					left: 96,
					right: 96,
					top: 372,
					opacity: 1 - out,
					translate: `0 ${-out * 40}px`,
					filter: `blur(${out * 12}px)`,
				}}
			>
				<div style={{display: 'flex', gap: 56}}>
					<div style={{width: 640}}>
						<GroupLabel color={C.greenSoft} icon="laptop" delay={44}>On your computer</GroupLabel>
						<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
							<Provider letter="O" name="Ollama" note="Local or cloud models" tone="green" delay={54} />
							<Provider letter="L" name="LM Studio" note="Runs on this machine" tone="green" delay={64} />
							<Provider letter="V" name="vLLM / home server" note="Your own GPU box" tone="green" delay={74} />
						</div>
					</div>
					<div style={{flex: 1}}>
						<GroupLabel color={C.violetSoft} icon="key" delay={90}>In the cloud, with your own key</GroupLabel>
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
							<Provider letter="O" name="OpenAI" note="GPT models" tone="violet" delay={98} />
							<Provider letter="A" name="Anthropic" note="Claude" tone="violet" delay={106} />
							<Provider letter="G" name="Google Gemini" note="Gemini models" tone="violet" delay={114} />
							<Provider letter="O" name="Ollama Cloud" note="Hosted by Ollama" tone="violet" delay={122} />
							<Provider letter="R" name="OpenRouter" note="Many models, one key" tone="violet" delay={130} />
							<Provider letter="G" name="Groq" note="Fast hosted models" tone="violet" delay={138} />
						</div>
					</div>
				</div>
				<div style={{marginTop: 20}}>
					<AnyCard />
				</div>
				<Rise delay={176} y={24} style={{marginTop: 16}}>
					<div style={{...glass(C.line2), height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontSize: 30}}>
						<Pill tone="grey" size={24}>No AI</Pill>
						<span style={{color: C.body}}>Shield, rules and keyword search still work.</span>
					</div>
				</Rise>
			</div>

			{/* Beat 3: one client */}
			<div style={{position: 'absolute', left: 192, right: 192, top: 372, opacity: inn, translate: `0 ${(1 - inn) * 40}px`}}>
				<div style={{...glass('rgba(169,150,255,.4)'), padding: '30px 52px 26px', boxShadow: '0 30px 100px rgba(91,61,245,.3)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', color: C.violetSoft, textTransform: 'uppercase', marginBottom: 14}}>
						<Icon name="sparkle" size={26} color={C.violetSoft} />
						One OpenAI-compatible client
					</div>
					<ConfigCard />
				</div>
				<div style={{marginTop: 30, textAlign: 'center'}}>
					<Rise delay={310} y={20}>
						<Sub size={34} style={{color: C.text, fontWeight: 600}}>Keys live in your system keychain.</Sub>
					</Rise>
					<div style={{display: 'flex', justifyContent: 'center', gap: 22, marginTop: 22}}>
						<Keychain name="macOS Keychain" delay={322} />
						<Keychain name="Windows Credential Manager" delay={334} />
						<Keychain name="Linux Secret Service" delay={346} />
					</div>
				</div>
			</div>
		</Scene>
	);
};
