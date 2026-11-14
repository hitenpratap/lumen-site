import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, Sub, Typewriter, useEnter} from '../kit';
import {C, display, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Provider: React.FC<{
	readonly letter: string;
	readonly name: string;
	readonly note: string;
	readonly tone: 'green' | 'violet';
	readonly delay: number;
	readonly star?: boolean;
	readonly span?: boolean;
}> = ({letter, name, note, tone, delay, star, span}) => {
	const frame = useCurrentFrame();
	const g = tone === 'green';
	const hl = star ? interpolate(frame, [130, 160], [0, 1], clamp) : 0;
	return (
		<Rise delay={delay} y={30} blur={10} style={{gridColumn: span ? 'span 2' : undefined}}>
			<div
				style={{
					...glass(g ? `rgba(47,180,99,${0.35 + 0.5 * hl})` : 'rgba(169,150,255,.35)'),
					boxShadow: `0 30px 80px rgba(0,0,0,.5), 0 0 ${50 * hl}px rgba(47,180,99,.45)`,
					height: 104,
					boxSizing: 'border-box',
					padding: '0 26px',
					display: 'flex',
					alignItems: 'center',
					gap: 22,
				}}
			>
				<div
					style={{
						width: 60,
						height: 60,
						borderRadius: 16,
						flex: 'none',
						background: g ? 'rgba(47,180,99,.18)' : 'rgba(91,61,245,.22)',
						color: g ? C.greenPale : C.violetPale,
						fontFamily: display,
						fontWeight: 800,
						fontSize: 34,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{letter}
				</div>
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{fontSize: 32, fontWeight: 700, color: C.white, lineHeight: 1.15}}>{name}</div>
					<div style={{fontSize: 24, color: C.muted, marginTop: 2}}>{note}</div>
				</div>
				{star ? <Pill tone="green" size={22}>Free, private</Pill> : null}
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
	const out = interpolate(frame, [236, 262], [0, 1], clamp);
	const inn = useEnter(262, 26);
	const subA = 1 - out;
	return (
		<Scene chapter={['02', 'Bring your own AI']} glow="rgba(91,61,245,.34)" glowAt="50% 70%">
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 100, gap: 20, textAlign: 'center'}}>
				<Rise delay={6}>
					<Kicker>Bring your own AI</Kicker>
				</Rise>
				<Rise delay={14}>
					<Headline size={96}>Your AI. Your choice.</Headline>
				</Rise>
				<div style={{position: 'relative', height: 50, width: 1500}}>
					<Rise delay={28} style={{position: 'absolute', inset: 0, opacity: subA}}>
						<Sub size={38}>Lumen ships no model and never sees a prompt.</Sub>
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
					top: 396,
					display: 'flex',
					gap: 72,
					opacity: 1 - out,
					translate: `0 ${-out * 40}px`,
					filter: `blur(${out * 12}px)`,
				}}
			>
				<div style={{width: 760}}>
					<GroupLabel color={C.greenSoft} icon="laptop" delay={44}>On your computer</GroupLabel>
					<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
						<Provider letter="O" name="Ollama" note="The default suggestion" tone="green" delay={54} star />
						<Provider letter="L" name="LM Studio" note="Runs on this machine" tone="green" delay={66} />
						<Provider letter="A" name="Any compatible server" note="vLLM, a home GPU box" tone="green" delay={78} />
					</div>
				</div>
				<div style={{flex: 1}}>
					<GroupLabel color={C.violetSoft} icon="key" delay={90}>Your own key</GroupLabel>
					<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
						<Provider letter="A" name="Anthropic" note="Claude" tone="violet" delay={98} />
						<Provider letter="O" name="OpenAI" note="Your key" tone="violet" delay={108} />
						<Provider letter="G" name="Google Gemini" note="Your key" tone="violet" delay={118} />
						<Provider letter="R" name="OpenRouter" note="Your key" tone="violet" delay={128} />
						<Provider letter="G" name="Groq" note="Your key" tone="violet" delay={138} span />
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 96, right: 96, top: 800, opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
				<Rise delay={170} y={24}>
					<div style={{...glass(C.line2), height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontSize: 32}}>
						<Pill tone="grey" size={24}>No AI</Pill>
						<span style={{color: C.body}}>Shield, rules and keyword search still work.</span>
					</div>
				</Rise>
			</div>

			{/* Beat 3: one client */}
			<div style={{position: 'absolute', left: 192, right: 192, top: 420, opacity: inn, translate: `0 ${(1 - inn) * 40}px`}}>
				<div style={{...glass('rgba(169,150,255,.4)'), padding: '40px 52px', boxShadow: '0 30px 100px rgba(91,61,245,.3)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', color: C.violetSoft, textTransform: 'uppercase', marginBottom: 26}}>
						<Icon name="sparkle" size={26} color={C.violetSoft} />
						One OpenAI-compatible client
					</div>
					<div style={{fontFamily: mono, fontSize: 34, color: C.text, lineHeight: 1.7, whiteSpace: 'nowrap'}}>
						<Typewriter text="base_url http://localhost:11434/v1 · model llama3.1:8b" delay={278} cps={34} caret={frame < 345} />
					</div>
					<div style={{fontFamily: mono, fontSize: 34, color: C.muted, lineHeight: 1.7, opacity: interpolate(frame, [345, 360], [0, 1], clamp)}}>
						api_key <span style={{color: C.greenSoft}}>••••••••••••</span>
					</div>
				</div>
				<div style={{marginTop: 44, textAlign: 'center'}}>
					<Rise delay={330} y={20}>
						<Sub size={36} style={{color: C.text, fontWeight: 600}}>Keys live in your system keychain.</Sub>
					</Rise>
					<div style={{display: 'flex', justifyContent: 'center', gap: 22, marginTop: 28}}>
						<Keychain name="macOS Keychain" delay={346} />
						<Keychain name="Windows Credential Manager" delay={358} />
						<Keychain name="Linux Secret Service" delay={370} />
					</div>
				</div>
			</div>
		</Scene>
	);
};
