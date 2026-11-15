import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {glass, Headline, Icon, Kicker, Rise, Scene, Sub, useEnter} from '../kit';
import {C, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

type Chip = readonly [string, string, string]; // label, bg, text
const CH: Record<string, Chip> = {
	Priority: ['Priority', '#FFE8DF', '#9A2F0B'],
	People: ['People', '#E3ECFF', '#1D46C8'],
	Updates: ['Updates', '#DDF3F5', '#0B5E69'],
	Finance: ['Finance', '#FFF1CC', '#7A4F00'],
	Promotions: ['Promotions', '#F3E6FB', '#7A2A99'],
	Social: ['Social', '#E3F5EA', '#17633A'],
	Forums: ['Forums', '#E9EAEF', '#474D5E'],
	Codes: ['Codes', '#EEEAFE', '#4B2FE0'],
};

const STACKS = ['Priority', 'People', 'Updates', 'Finance', 'Promotions', 'Social', 'Forums', 'Codes'];
const STACK_Y0 = 300;
const STACK_GAP = 78;
const stackY = (name: string) => STACK_Y0 + STACKS.indexOf(name) * STACK_GAP;

const MAILS: readonly (readonly [string, string, string])[] = [
	['Marco Bianchi', 'Invoice #1042 for October', 'Priority'],
	['Mom', 'Are you flying in on the 20th?', 'People'],
	['Brightbank', 'Your October statement is ready', 'Finance'],
	['Northwind Cloud', 'Your weekly usage summary', 'Updates'],
	['Bloom & Co', 'Autumn sale: 40% off today', 'Promotions'],
	['LinkedIn', 'Sofia Reyes viewed your profile', 'Social'],
	['Rust Users Forum', 'New reply in "async traits"', 'Forums'],
	['GitHub', 'Your sign-in code is 482913', 'Codes'],
	['Priya Shah', 'Q4 roadmap review: can we move?', 'Priority'],
	['Oakridge Dental', 'Reminder: appointment Monday', 'People'],
];

const CHIP_FS = 24;
const ChipEl: React.FC<{readonly c: Chip; readonly scale?: number}> = ({c, scale = 1}) => (
	<span
		style={{
			padding: '6px 16px',
			borderRadius: 999,
			background: c[1],
			color: c[2],
			fontSize: CHIP_FS,
			fontWeight: 600,
			whiteSpace: 'nowrap',
			scale: String(scale),
			display: 'inline-block',
		}}
	>
		{c[0]}
	</span>
);

const START = 30;
const STEP = 17;

// A flying row: enters from the left, gets its chip, then shrinks into its stack.
const Row: React.FC<{readonly i: number}> = ({i}) => {
	const frame = useCurrentFrame();
	const [from, subj, stack] = MAILS[i];
	const t0 = START + i * STEP;
	const enter = interpolate(frame, [t0, t0 + 18], [0, 1], {...clamp, easing: ease});
	const chip = interpolate(frame, [t0 + 20, t0 + 30], [0, 1], {...clamp, easing: ease});
	const slide = interpolate(frame, [t0 + 40, t0 + 68], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
	if (frame < t0 || slide >= 1) return null;
	const y0 = 340 + (i % 4) * 100;
	const ty = stackY(stack);
	const x = interpolate(enter, [0, 1], [-300, 0]) + slide * 700;
	const y = y0 + (ty - y0) * slide;
	return (
		<div
			style={{
				position: 'absolute',
				left: 96,
				top: y,
				width: 760,
				translate: `${x}px 0`,
				opacity: enter * (1 - slide * 0.9),
				scale: String(1 - slide * 0.2),
				...glass(),
				borderRadius: 18,
				padding: '16px 22px',
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				boxSizing: 'border-box',
			}}
		>
			<div style={{flex: 1, minWidth: 0}}>
				<div style={{fontSize: 26, fontWeight: 700, color: C.white}}>{from}</div>
				<div style={{fontSize: 24, color: C.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
					{subj}
				</div>
			</div>
			<div style={{opacity: chip, scale: String(0.7 + 0.3 * chip)}}>
				<ChipEl c={CH[stack]} />
			</div>
		</div>
	);
};

const StackRow: React.FC<{readonly name: string}> = ({name}) => {
	const frame = useCurrentFrame();
	const k = STACKS.indexOf(name);
	const p = useEnter(20 + k * 4, 24);
	// count of mails landed in this stack so far
	const n = MAILS.filter((m, i) => m[2] === name && frame >= START + i * STEP + 62).length;
	const lastLand = Math.max(0, ...MAILS.map((m, i) => (m[2] === name ? START + i * STEP + 62 : 0)));
	const pulse = interpolate(frame, [lastLand, lastLand + 14], [1, 0], clamp) * (n > 0 ? 1 : 0);
	const c = CH[name];
	return (
		<div
			style={{
				position: 'absolute',
				left: 1000,
				top: stackY(name),
				width: 760,
				height: 70,
				boxSizing: 'border-box',
				opacity: p,
				translate: `${(1 - p) * 60}px 0`,
				...glass(pulse > 0 ? c[1] : C.line2),
				borderRadius: 18,
				padding: '0 24px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				boxShadow: `0 20px 50px rgba(0,0,0,.4), 0 0 ${40 * pulse}px ${c[1]}`,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<span style={{width: 16, height: 16, borderRadius: 5, background: c[1]}} />
				<span style={{fontSize: 30, fontWeight: 600, color: C.white}}>{name}</span>
			</div>
			<span style={{fontFamily: mono, fontSize: 28, color: n ? C.white : C.faint}}>{n}</span>
		</div>
	);
};

export const SmartStacks: React.FC = () => {
	const frame = useCurrentFrame();
	// stage 2: feed + stacks fade, bundle + closing line take over
	const out = interpolate(frame, [212, 236], [1, 0], clamp);
	const fadeStage: React.CSSProperties = {opacity: out, filter: `blur(${(1 - out) * 10}px)`};
	return (
		<Scene chapter={['04', 'Smart Stacks']} glowAt="50% 55%">
			<AbsoluteFill style={{padding: '100px 96px 0'}}>
				<Rise delay={8}>
					<Kicker>Smart Stacks</Kicker>
				</Rise>
				<Rise delay={14} style={{marginTop: 14}}>
					<Headline size={90}>Every email, sorted on arrival.</Headline>
				</Rise>
			</AbsoluteFill>

			<AbsoluteFill style={fadeStage}>
				{STACKS.map((s) => (
					<StackRow key={s} name={s} />
				))}
				{MAILS.map((_, i) => (
					<Row key={i} i={i} />
				))}
				<Rise delay={40} style={{position: 'absolute', left: 96, top: 252}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<Icon name="cpu" size={34} color={C.greenSoft} />
						<Sub size={32}>A small model on this computer. No AI setup needed.</Sub>
					</div>
				</Rise>
			</AbsoluteFill>

			<Bundle />
		</Scene>
	);
};

const Bundle: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [226, 256], [0, 1], {...clamp, easing: ease});
	if (p <= 0) return null;
	const cl = (d: number) => interpolate(frame, [d, d + 26], [0, 1], {...clamp, easing: ease});
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 96,
					top: 380,
					width: 1100,
					opacity: p,
					translate: `0 ${(1 - p) * 40}px`,
					...glass('rgba(169,150,255,.45)'),
					padding: '30px 36px',
					display: 'flex',
					alignItems: 'center',
					gap: 28,
					boxSizing: 'border-box',
				}}
			>
				<div
					style={{
						width: 84,
						height: 84,
						borderRadius: 22,
						background: '#F3E6FB',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name="package" size={46} color="#7A2A99" />
				</div>
				<div>
					<div style={{fontSize: 40, fontWeight: 700, color: C.white}}>Deliveries · 5 emails</div>
					<div style={{fontSize: 32, color: C.body, marginTop: 4}}>headphones arrive today 6–8 PM</div>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 96,
					top: 600,
					width: 1300,
					opacity: cl(262),
					translate: `0 ${(1 - cl(262)) * 30}px`,
				}}
			>
				<div style={{fontFamily: mono, fontSize: 24, color: C.greenSoft, letterSpacing: '0.12em', marginBottom: 18}}>
					LEARNS FROM YOU
				</div>
				<Headline size={64} style={{lineHeight: 1.1}}>
					Move a thread once and Roost learns.
				</Headline>
				<Sub size={34} style={{marginTop: 20}}>
					On this computer, never written to your mail server.
				</Sub>
			</div>
		</AbsoluteFill>
	);
};
