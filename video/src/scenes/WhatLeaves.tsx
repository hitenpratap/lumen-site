import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {Headline, Icon, Kicker, Pill, Rise, Scene, Sub, useEnter} from '../kit';
import {C, display, mono, ui} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Hub (left) and destination cards (right).
const HUB = {x: 96, y: 560, w: 504, h: 380};
const ANCHOR = {x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2};
const CARD_X = 920;
const CARD_W = 904;
const BLUE = '#7FB2FF';

type Dest = {
	readonly top: number;
	readonly h: number;
	readonly delay: number;
	readonly color: string;
	readonly dash: string;
};
const DESTS: readonly Dest[] = [
	{top: 96, h: 120, delay: 80, color: C.body, dash: '10 12'},
	{top: 226, h: 120, delay: 140, color: BLUE, dash: '4 14'},
	{top: 356, h: 296, delay: 200, color: C.violetSoft, dash: '10 12'},
	{top: 662, h: 165, delay: 360, color: C.amber, dash: '10 12'},
	{top: 837, h: 100, delay: 420, color: C.body, dash: '10 12'},
];
const REFUSE = 292;

const bez = (d: Dest, t: number) => {
	const x0 = ANCHOR.x, y0 = ANCHOR.y, x3 = CARD_X, y3 = d.top + d.h / 2;
	const x1 = 760, x2 = 760;
	const u = 1 - t;
	return {
		x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
		y: u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y3 + t * t * t * y3,
	};
};
const pathD = (d: Dest) => {
	const y3 = d.top + d.h / 2;
	return `M${ANCHOR.x} ${ANCHOR.y} C760 ${ANCHOR.y}, 760 ${y3}, ${CARD_X} ${y3}`;
};
const lenOf = (d: Dest) => {
	let l = 0;
	let p = bez(d, 0);
	for (let i = 1; i <= 40; i++) {
		const q = bez(d, i / 40);
		l += Math.hypot(q.x - p.x, q.y - p.y);
		p = q;
	}
	return l;
};

const Lines: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{DESTS.map((d, i) => {
				const L = lenOf(d);
				const p = interpolate(frame, [d.delay - 6, d.delay + 30], [0, 1], clamp);
				const t0 = d.delay + 34;
				return (
					<g key={i}>
						<mask id={`m${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
							<path d={pathD(d)} stroke="#fff" strokeWidth={12} fill="none" strokeDasharray={`${p * L} ${L + 20}`} />
						</mask>
						<path
							d={pathD(d)}
							fill="none"
							stroke={d.color}
							strokeWidth={3}
							strokeLinecap="round"
							strokeDasharray={d.dash}
							strokeDashoffset={-frame * 0.9}
							mask={`url(#m${i})`}
							opacity={0.9}
						/>
						{frame > t0
							? [0, 1].map((k) => {
									const t = (((frame - t0) / (i === 1 ? 110 : 80) + k / 2) % 1 + 1) % 1;
									const o = Math.min(1, t * 8, (1 - t) * 8) * (i === 1 && k === 1 ? 0 : 1);
									const q = bez(d, t);
									return (
										<g key={k} opacity={o}>
											<circle cx={q.x} cy={q.y} r={15} fill={d.color} opacity={0.22} />
											<circle cx={q.x} cy={q.y} r={6.5} fill={d.color} />
										</g>
									);
								})
							: null}
						{i === 2
							? [0, 1, 2].map((k) => {
									const s = REFUSE + 6 + k * 18;
									const p2 = interpolate(frame, [s, s + 44], [0, 1], clamp);
									if (p2 <= 0 || p2 >= 1) return null;
									const pos = p2 < 0.5 ? p2 * 2 * 0.9 : (1 - p2) * 2 * 0.9;
									const q = bez(d, pos);
									const hit = p2 > 0.44 && p2 < 0.62;
									return (
										<g key={k} opacity={p2 > 0.9 ? (1 - p2) * 10 : 1}>
											<circle cx={q.x} cy={q.y} r={15} fill={C.red} opacity={0.25} />
											<circle cx={q.x} cy={q.y} r={7} fill={C.red} />
											{hit ? (
												<g stroke={C.redSoft} strokeWidth={4} strokeLinecap="round">
													<path d={`M${q.x + 14} ${q.y - 14}l22 -14M${q.x + 18} ${q.y}l28 0M${q.x + 14} ${q.y + 14}l22 14`} />
												</g>
											) : null}
										</g>
									);
								})
							: null}
					</g>
				);
			})}
		</svg>
	);
};

const Card: React.FC<{
	readonly d: Dest;
	readonly icon: IconName;
	readonly title: string;
	readonly tag?: ReactNode;
	readonly dashed?: boolean;
	readonly children: ReactNode;
}> = ({d, icon, title, tag, dashed, children}) => (
	<div style={{position: 'absolute', left: CARD_X, top: d.top, width: CARD_W}}>
		<Rise delay={d.delay} x={50} y={0} blur={10}>
			<div
				style={{
					background: 'rgba(18,20,28,.92)',
					border: `1.5px ${dashed ? 'dashed' : 'solid'} ${d.color}88`,
					borderRadius: 22,
					boxShadow: '0 20px 60px rgba(0,0,0,.5)',
					boxSizing: 'border-box',
					height: d.h,
					padding: '10px 26px',
					display: 'flex',
					gap: 22,
					alignItems: d.h > 200 ? 'flex-start' : 'center',
				}}
			>
				<div
					style={{
						flex: 'none',
						width: 58,
						height: 58,
						marginTop: d.h > 200 ? 6 : 0,
						borderRadius: 16,
						background: `${d.color}22`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name={icon} size={32} color={d.color} />
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
						<div style={{fontFamily: display, fontWeight: 700, fontSize: 36, color: C.white, letterSpacing: '-0.02em'}}>
							{title}
						</div>
						{tag}
					</div>
					{children}
				</div>
			</div>
		</Rise>
	</div>
);

const Desc: React.FC<{readonly children: ReactNode; readonly color?: string}> = ({children, color = C.body}) => (
	<div style={{fontFamily: ui, fontSize: 24, lineHeight: 1.25, color}}>{children}</div>
);

const Server: React.FC = () => {
	const d = DESTS[2];
	const fields = ['Name', 'Email', 'Country', 'OS and app version', 'Notification choices', 'A device ID'];
	const refused = ['No password', 'No email content', 'No AI prompts'];
	const note = useEnter(REFUSE + 60, 20);
	return (
		<Card d={d} icon="server" title="Roost's server" tag={<Pill tone="violet" size={22}>Only this</Pill>}>
			<Desc>For signed updates, security patches and notices.</Desc>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6}}>
				{fields.map((f, i) => (
					<Rise key={f} delay={d.delay + 26 + i * 6} y={10} blur={4} dur={16}>
						<Pill tone="violet" size={22}>
							<Icon name="check" size={20} color={C.violetPale} />
							{f}
						</Pill>
					</Rise>
				))}
			</div>
			<div style={{display: 'flex', gap: 10, marginTop: 8}}>
				{refused.map((f, i) => (
					<Rise key={f} delay={REFUSE + 28 + i * 18} y={0} blur={0} scaleFrom={1.35} dur={14}>
						<Pill tone="red" size={22}>
							<Icon name="x" size={20} color="#FFC2C2" />
							{f}
						</Pill>
					</Rise>
				))}
			</div>
			<div style={{fontFamily: ui, fontSize: 24, color: C.redSoft, opacity: note, marginTop: 2}}>
				The server rejects any other field.
			</div>
		</Card>
	);
};

const Hub: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [26, 74], [0, 1], clamp);
	const label = useEnter(50, 22);
	const perim = 2 * (HUB.w + HUB.h);
	const rows: [IconName, string][] = [
		['mail', 'Your mail'],
		['sparkle', 'AI on this computer'],
		['shieldCheck', 'Shield'],
	];
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect
					x={HUB.x}
					y={HUB.y}
					width={HUB.w}
					height={HUB.h}
					rx={32}
					fill={`rgba(47,180,99,${0.07 * draw})`}
					stroke={C.green}
					strokeWidth={3}
					strokeDasharray={`${perim * draw} ${perim}`}
					style={{filter: 'drop-shadow(0 0 20px rgba(47,180,99,.6))'}}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: HUB.x + 32,
					top: HUB.y - 22,
					padding: '4px 16px',
					background: C.bg,
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					fontFamily: mono,
					fontSize: 24,
					letterSpacing: '0.12em',
					color: C.greenSoft,
					opacity: label,
				}}
			>
				<Icon name="lock" size={26} color={C.greenSoft} />
				YOUR COMPUTER
			</div>
			<div style={{position: 'absolute', left: HUB.x + 32, top: HUB.y + 54, width: HUB.w - 64}}>
				{rows.map(([ic, t], i) => (
					<Rise key={t} delay={44 + i * 10} y={-30} blur={8}>
						<div
							style={{
								height: 84,
								marginBottom: 14,
								boxSizing: 'border-box',
								padding: '0 22px',
								borderRadius: 20,
								background: 'rgba(10,11,16,.7)',
								border: '1.5px solid rgba(47,180,99,.35)',
								display: 'flex',
								alignItems: 'center',
								gap: 20,
								fontFamily: ui,
								fontWeight: 700,
								fontSize: 30,
								color: C.white,
							}}
						>
							<Icon name={ic} size={34} color={C.greenSoft} />
							{t}
						</div>
					</Rise>
				))}
			</div>
		</>
	);
};

export const WhatLeaves: React.FC = () => {
	const frame = useCurrentFrame();
	const headOut = interpolate(frame, [440, 458], [1, 0], clamp);
	const capIn = useEnter(462, 26);
	return (
		<Scene chapter={['11', 'What leaves your computer']} glow="rgba(91,61,245,.3)" glowAt="70% 50%">
			<AbsoluteFill>
				<div style={{position: 'absolute', left: 96, top: 100, width: 600, opacity: headOut}}>
					<Rise delay={8}>
						<Kicker color={C.greenSoft}>The full list</Kicker>
					</Rise>
					<Rise delay={14} style={{marginTop: 14}}>
						<Headline size={84}>Everything that leaves your computer.</Headline>
					</Rise>
				</div>
				<div
					style={{
						position: 'absolute',
						left: 96,
						top: 130,
						width: 560,
						opacity: capIn,
						translate: `0 ${(1 - capIn) * 24}px`,
					}}
				>
					<Pill tone="green" size={24} style={{marginBottom: 22}}>
						<Icon name="activity" size={26} color={C.greenPale} />
						Network activity log
					</Pill>
					<Sub size={42} style={{color: C.text, fontWeight: 500}}>
						Every connection is listed in the app's network activity log.
					</Sub>
				</div>
				<Hub />
				<Lines />
				<Card
					d={DESTS[0]}
					icon="mail"
					title="Your mail providers"
					tag={<Pill tone="grey" size={22}>Always, directly</Pill>}
				>
					<Desc>Gmail, Outlook, iCloud, Yahoo, any IMAP. Your own mail, directly over IMAP and SMTP.</Desc>
				</Card>
				<Card
					d={DESTS[1]}
					icon="sparkle"
					title="Your AI provider"
					dashed
					tag={<Pill tone="violet" size={22} style={{color: '#CFE1FF', borderColor: '#7FB2FF88'}}>Only if you choose</Pill>}
				>
					<Desc>
						Only if you choose a cloud key. Only the text a feature needs, private numbers masked, under your own account.
					</Desc>
				</Card>
				<Server />
				<Card
					d={DESTS[3]}
					icon="chart"
					title="Google Analytics"
					tag={<Pill tone="amber" size={22}>Opt-in in EU/EEA, UK, CH</Pill>}
				>
					<Desc>
						Anonymous counts: which features are used, app version, OS. Never email content, addresses, subjects, contacts,
						search terms or prompts. Turn it off any time.
					</Desc>
				</Card>
				<Card
					d={DESTS[4]}
					icon="download"
					title="Update downloads (GitHub Releases)"
				>
					<Desc>A normal download of the signed update file.</Desc>
				</Card>
			</AbsoluteFill>
		</Scene>
	);
};
