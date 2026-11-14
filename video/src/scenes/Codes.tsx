import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AppShot, Focus, glass, Headline, Icon, Kicker, Pill, Rise, Scene, Sub, useEnter} from '../kit';
import {C, mono, ui} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Part: React.FC<{readonly a: number; readonly b: number; readonly children: ReactNode}> = ({a, b, children}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [a - 14, a, b - 16, b], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Ring: React.FC<{readonly p: number}> = ({p}) => {
	const r = 62;
	const circ = 2 * Math.PI * r;
	return (
		<svg width={150} height={150} viewBox="0 0 150 150">
			<circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
			<circle
				cx="75"
				cy="75"
				r={r}
				fill="none"
				stroke={C.violetSoft}
				strokeWidth="10"
				strokeLinecap="round"
				strokeDasharray={`${circ * (1 - p)} ${circ}`}
				style={{rotate: '-90deg', transformOrigin: '75px 75px'}}
			/>
		</svg>
	);
};

const Node: React.FC<{readonly x: number; readonly label: string; readonly time: string; readonly on: number}> = ({x, label, time, on}) => (
	<div style={{position: 'absolute', left: x, top: 0, width: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div
			style={{
				width: 28,
				height: 28,
				borderRadius: 14,
				background: on > 0.5 ? C.violetSoft : C.panel,
				border: `3px solid ${C.violetSoft}`,
				boxShadow: on > 0.5 ? `0 0 24px ${C.violet}` : 'none',
			}}
		/>
		<div style={{marginTop: 14, fontSize: 26, fontWeight: 600, color: C.white, whiteSpace: 'nowrap'}}>{label}</div>
		<div style={{fontFamily: mono, fontSize: 22, color: C.muted, whiteSpace: 'nowrap', marginTop: 4}}>{time}</div>
	</div>
);

const PartA: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [50, 110], [0, 1], clamp); // demo: sped-up 10 minutes
	const secs = Math.round(600 * (1 - t));
	const hidden = t >= 1;
	const line = interpolate(frame, [50, 130], [0, 1], clamp);
	return (
		<>
			<AbsoluteFill style={{paddingLeft: 96, paddingTop: 100}}>
				<Rise delay={6}>
					<Kicker>Code vault</Kicker>
				</Rise>
				<Rise delay={12}>
					<Headline size={88} style={{marginTop: 14, width: 1600}}>
						Sign-in codes that clean up after themselves.
					</Headline>
				</Rise>
			</AbsoluteFill>

			<div style={{position: 'absolute', left: 96, top: 440, width: 800}}>
				<Rise delay={30}>
					<div style={{...glass(), padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 30}}>
						<div style={{position: 'relative', width: 150, height: 150}}>
							<Ring p={t} />
							<div
								style={{
									position: 'absolute',
									inset: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontFamily: mono,
									fontSize: 34,
									color: C.white,
								}}
							>
								{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
							</div>
						</div>
						<div>
							<div style={{fontSize: 32, fontWeight: 700, color: C.white}}>Brightbank</div>
							<div style={{fontFamily: mono, fontSize: 40, letterSpacing: '0.2em', color: hidden ? C.faint : C.body, marginTop: 8}}>
								{hidden ? '--- ---' : '●●● ●●●'}
							</div>
							<div style={{marginTop: 12}}>
								<Pill tone={hidden ? 'grey' : 'violet'} size={22}>
									{hidden ? 'Hidden from this screen' : 'Active now'}
								</Pill>
							</div>
						</div>
					</div>
				</Rise>

				<Rise delay={60} y={24}>
					<div style={{position: 'relative', height: 130, marginTop: 56, marginLeft: 40, width: 700}}>
						<div style={{position: 'absolute', left: 0, top: 12, width: 640, height: 4, background: C.faint, borderRadius: 2}} />
						<div style={{position: 'absolute', left: 0, top: 12, width: 640 * line, height: 4, background: C.violetSoft, borderRadius: 2}} />
						<Node x={20} label="Arrives" time="7:23 PM" on={1} />
						<Node x={310} label="Hidden after 10 min" time="7:33 PM" on={line > 0.4 ? 1 : 0} />
						<Node x={640} label="Deleted after 24 h" time="next day" on={line > 0.98 ? 1 : 0} />
					</div>
				</Rise>

				<div style={{display: 'flex', gap: 14, marginTop: 24}}>
					<Rise delay={110} y={14} blur={6}>
						<Pill tone="grey" size={24}><Icon name="search" size={24} color={C.muted} /> Never in search</Pill>
					</Rise>
					<Rise delay={120} y={14} blur={6}>
						<Pill tone="grey" size={24}><Icon name="bell" size={24} color={C.muted} /> Never on the lock screen</Pill>
					</Rise>
				</div>
			</div>

			<div style={{position: 'absolute', left: 980, top: 460}}>
				<AppShot src="shots/codes.jpg" width={860} delay={20} move={200} tiltFrom={18} tiltTo={3} zoomFrom={1} zoomTo={1.25} focusX={45} focusY={62}>
					<Focus x={18.1} y={47.9} w={26.8} h={29} delay={60} dim={0.45} />
				</AppShot>
			</div>
		</>
	);
};

const PartB: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [208, 238], [0, 1], clamp);
	const unlocked = frame >= 240;
	const blur = interpolate(frame, [236, 252], [14, 0], clamp);
	const badge = useEnter(184, 20);
	const body = (txt: ReactNode) => <div style={{fontSize: 28, color: '#3A3F52', lineHeight: 1.5}}>{txt}</div>;
	return (
		<>
			<AbsoluteFill style={{paddingLeft: 96, paddingTop: 300, width: 860, boxSizing: 'border-box'}}>
				<Rise delay={166}>
					<Kicker color={C.greenSoft}>Sensitive info lock</Kicker>
				</Rise>
				<Rise delay={172}>
					<Headline size={92} style={{marginTop: 14}}>
						Locked until you say so.
					</Headline>
				</Rise>
				<Rise delay={182} style={{marginTop: 30}}>
					<Sub size={34}>
						Emails with card, PAN, passport or bank numbers can be locked behind your system password or fingerprint.
					</Sub>
				</Rise>
			</AbsoluteFill>

			<div style={{position: 'absolute', left: 1030, top: 330, width: 790}}>
				<Rise delay={170} y={40} scaleFrom={0.96}>
					<div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#F7F7FB', boxShadow: '0 40px 100px rgba(0,0,0,.6)'}}>
						<div style={{padding: '28px 34px', fontFamily: ui}}>
							<div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
								<div style={{width: 56, height: 56, borderRadius: 28, background: '#E3DEFF', color: C.violet, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>M</div>
								<div>
									<div style={{fontSize: 30, fontWeight: 700, color: '#12141C'}}>Bank details for invoice #1042</div>
									<div style={{fontSize: 24, color: '#6B7085'}}>Marco Bianchi</div>
								</div>
							</div>
							<div style={{filter: `blur(${blur}px)`, marginTop: 26}}>
								{body('Hi Alex, please pay EUR 2,400 by 15 November.')}
								{body('IBAN: IT60 X054 2811 1010 0000 0123 456')}
								{body('Card on file: 4111 1111 1111 1111')}
							</div>
						</div>
						{!unlocked || frame < 252 ? (
							<div
								style={{
									position: 'absolute',
									inset: 0,
									top: 110,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 16,
									opacity: badge * (1 - interpolate(frame, [240, 252], [0, 1], clamp)),
								}}
							>
								<div style={{position: 'relative', width: 110, height: 110, borderRadius: 55, background: C.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${20 + 40 * scan}px rgba(91,61,245,.7)`}}>
									<Icon name={scan > 0.05 ? 'fingerprint' : 'lock'} size={56} color="#fff" />
								</div>
								<Pill tone="violet" size={24} style={{background: '#fff'}}>
									<span style={{color: C.violet}}>Locked: card and bank numbers</span>
								</Pill>
							</div>
						) : null}
					</div>
				</Rise>
				<div style={{marginTop: 26, height: 60}}>
					{unlocked ? (
						<Rise delay={240} y={14} blur={6}>
							<Pill tone="green" size={28}><Icon name="check" size={28} color={C.greenSoft} /> Unlocked with your fingerprint</Pill>
						</Rise>
					) : null}
				</div>
			</div>
		</>
	);
};

export const Codes: React.FC = () => (
	<Scene chapter={['09', 'Codes and locks']} glowAt="55% 60%">
		<Part a={0} b={162}>
			<PartA />
		</Part>
		<Part a={166} b={300}>
			<PartB />
		</Part>
	</Scene>
);
