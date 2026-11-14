import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, Sub, useEnter} from '../kit';
import {C, display, mono, ui} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A beat of the scene: fades in at `from`, out at `to`.
const Phase: React.FC<{readonly from: number; readonly to: number; readonly children: ReactNode}> = ({from, to, children}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [from, from + 10, to - 12, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	const out = interpolate(frame, [to - 12, to], [0, 1], clamp);
	return (
		<AbsoluteFill style={{opacity: o, filter: out ? `blur(${out * 10}px)` : undefined, scale: String(1 + out * 0.02)}}>
			{children}
		</AbsoluteFill>
	);
};

const Title: React.FC<{readonly kicker: string; readonly delay: number; readonly children: ReactNode}> = ({kicker, delay, children}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center'}}>
		<Rise delay={delay}>
			<Kicker>{kicker}</Kicker>
		</Rise>
		<Rise delay={delay + 8} style={{marginTop: 14}}>
			<Headline size={92}>{children}</Headline>
		</Rise>
	</div>
);

const Btn: React.FC<{readonly primary?: boolean; readonly press?: number; readonly children: ReactNode}> = ({primary, press = 0, children}) => (
	<div
		style={{
			padding: '20px 44px',
			borderRadius: 18,
			fontFamily: ui,
			fontWeight: 700,
			fontSize: 32,
			background: primary ? C.violet : 'rgba(255,255,255,.06)',
			border: `1.5px solid ${primary ? C.violetSoft : C.line2}`,
			color: primary ? '#fff' : C.body,
			boxShadow: primary ? `0 0 ${50 * press}px rgba(91,61,245,${0.8 * press})` : undefined,
			scale: String(1 - 0.04 * Math.sin(press * Math.PI)),
		}}
	>
		{children}
	</div>
);

// Beat 1: the update card with its signature check.
const UpdateCard: React.FC = () => {
	const frame = useCurrentFrame();
	const key = useEnter(34, 16);
	const trav = interpolate(frame, [48, 74], [0, 1], clamp);
	const ok = useEnter(76, 18);
	const press = interpolate(frame, [96, 112], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: 530, top: 330, width: 860}}>
			<Rise delay={18} y={80} blur={16} dur={34}>
				<div style={{...glass(C.violetSoft + '88'), padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 32}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
						<div style={{width: 92, height: 92, borderRadius: 24, background: 'rgba(91,61,245,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Icon name="download" size={48} color={C.violetPale} />
						</div>
						<div style={{fontFamily: display, fontWeight: 800, fontSize: 56, color: C.white, letterSpacing: '-0.03em'}}>
							Lumen 1.1 is ready
						</div>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '22px 28px', borderRadius: 20, background: 'rgba(255,255,255,.04)', border: `1.5px solid ${C.line}`}}>
						<div style={{opacity: key, display: 'flex', alignItems: 'center', gap: 14, fontFamily: ui, fontSize: 28, color: C.body}}>
							<Icon name="key" size={36} color={C.violetSoft} />
							Lumen's key
						</div>
						<div style={{flex: 1, height: 4, borderRadius: 2, background: C.line2, position: 'relative'}}>
							<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${trav * 100}%`, background: C.green, borderRadius: 2}} />
							<div style={{position: 'absolute', top: -7, left: `calc(${trav * 100}% - 9px)`, width: 18, height: 18, borderRadius: 9, background: C.greenPale, opacity: key * (1 - ok), boxShadow: '0 0 18px rgba(47,180,99,.9)'}} />
						</div>
						<div style={{opacity: ok, scale: String(0.7 + 0.3 * ok)}}>
							<Pill tone="green" size={28}>
								<Icon name="shieldCheck" size={32} color={C.greenPale} />
								Signed
							</Pill>
						</div>
					</div>
					<Rise delay={82} y={20} blur={6}>
						<div style={{display: 'flex', gap: 20}}>
							<Btn primary press={press}>Install now</Btn>
							<Btn>Later</Btn>
						</div>
					</Rise>
				</div>
			</Rise>
		</div>
	);
};

const Toggle: React.FC<{readonly on: boolean}> = ({on}) => (
	<div style={{width: 96, height: 52, borderRadius: 26, background: on ? C.green : C.faint, position: 'relative', flex: 'none'}}>
		<div style={{position: 'absolute', top: 6, left: on ? 50 : 6, width: 40, height: 40, borderRadius: 20, background: '#fff'}} />
	</div>
);

const Choice: React.FC<{
	readonly icon: IconName;
	readonly title: string;
	readonly on: boolean;
	readonly pill: ReactNode;
	readonly note?: string;
	readonly delay: number;
}> = ({icon, title, on, pill, note, delay}) => (
	<Rise delay={delay} y={50} blur={12} style={{width: 800}}>
		<div style={{...glass(on ? 'rgba(47,180,99,.5)' : C.line2), padding: '34px 40px', height: 270, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
				<Icon name={icon} size={44} color={on ? C.greenSoft : C.muted} />
				<div style={{flex: 1, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.1}}>{title}</div>
				<Toggle on={on} />
			</div>
			<div>{pill}</div>
			{note ? <Sub size={32}>{note}</Sub> : null}
		</div>
	</Rise>
);

// Beat 2: notification choices and the feed check.
const Choices: React.FC = () => {
	const frame = useCurrentFrame();
	const ticks = [0, 1, 2, 3, 4];
	return (
		<>
			<div style={{position: 'absolute', left: 128, top: 320, display: 'flex', gap: 80}}>
				<Choice icon="shieldCheck" title="Security patches and updates" on pill={<Pill tone="green" size={28}><Icon name="lock" size={28} color={C.greenPale} />Always on</Pill>} delay={128} />
				<Choice icon="bell" title="Product news and offers" on={false} pill={<Pill tone="grey" size={28}>Off unless you opt in</Pill>} note="At most twice a month." delay={144} />
			</div>
			<div style={{position: 'absolute', left: 128, right: 128, top: 650}}>
				<Rise delay={170} y={30}>
					<div style={{position: 'relative', height: 70}}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 34, height: 3, background: C.line2}} />
						{ticks.map((i) => {
							const t0 = 180 + i * 9;
							const p = interpolate(frame, [t0, t0 + 10], [0, 1], clamp);
							const ring = interpolate(frame, [t0, t0 + 24], [0, 1], clamp);
							return (
								<div key={i} style={{position: 'absolute', left: `${8 + i * 21}%`, top: 34}}>
									<div style={{position: 'absolute', left: -9 - 26 * ring, top: -9 - 26 * ring, width: 18 + 52 * ring, height: 18 + 52 * ring, borderRadius: '50%', border: `2px solid ${C.violetSoft}`, opacity: p * (1 - ring)}} />
									<div style={{position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: p > 0 ? C.violetSoft : C.faint}} />
								</div>
							);
						})}
					</div>
				</Rise>
				<Rise delay={186} y={30}>
					<Sub size={36} style={{display: 'flex', alignItems: 'center', gap: 18, color: C.text, justifyContent: 'center', textAlign: 'center', marginTop: 12}}>
						<Icon name="refresh" size={38} color={C.violetSoft} />
						The app checks a small JSON feed every few hours. No always-open connection.
					</Sub>
				</Rise>
			</div>
		</>
	);
};

const ROWS: {t: string; dest: string; what: string; owner: string; tone: 'grey' | 'green' | 'violet' | 'amber'}[] = [
	{t: '09:41:07', dest: 'imap.gmail.com', what: 'new mail', owner: 'Your provider', tone: 'grey'},
	{t: '09:41:12', dest: 'localhost:11434', what: 'summary request', owner: 'Local model', tone: 'green'},
	{t: '09:41:30', dest: 'Lumen server', what: 'update check (app version, OS)', owner: 'Lumen', tone: 'violet'},
	{t: '09:41:31', dest: 'github.com', what: 'Lumen 1.1 download', owner: 'Lumen', tone: 'violet'},
	{t: '09:41:44', dest: 'google-analytics.com', what: '3 anonymous events', owner: 'Google', tone: 'amber'},
];

// Beat 3: the network activity log.
const Log: React.FC = () => (
	<div style={{position: 'absolute', left: 160, top: 300, width: 1600}}>
		<Rise delay={238} y={50} blur={12} dur={30}>
			<div style={{...glass(C.line2), padding: '26px 40px 18px'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: mono, fontSize: 24, letterSpacing: '0.12em', color: C.greenSoft, paddingBottom: 18, borderBottom: `1.5px solid ${C.line}`}}>
					<Icon name="activity" size={30} color={C.greenSoft} />
					NETWORK ACTIVITY
					<span style={{marginLeft: 'auto', color: C.dim, fontSize: 22}}>TIME · DESTINATION · WHAT IT CARRIED · WHOSE</span>
				</div>
				{ROWS.map((r, i) => (
					<Rise key={r.dest} delay={252 + i * 14} y={26} blur={6} dur={18}>
						<div style={{display: 'flex', alignItems: 'center', height: 96, borderBottom: i < ROWS.length - 1 ? `1px solid ${C.line}` : 'none'}}>
							<div style={{width: 170, fontFamily: mono, fontSize: 24, color: C.dim}}>{r.t}</div>
							<div style={{width: 430, fontFamily: mono, fontSize: 28, color: C.white}}>{r.dest}</div>
							<div style={{flex: 1, fontFamily: ui, fontSize: 30, color: C.text}}>{r.what}</div>
							<Pill tone={r.tone} size={24}>{r.owner}</Pill>
						</div>
					</Rise>
				))}
			</div>
		</Rise>
	</div>
);

export const Updates: React.FC = () => (
	<Scene chapter={['12', 'Updates']} glow="rgba(91,61,245,.34)" glowAt="50% 55%">
		<Phase from={0} to={122}>
			<Title kicker="Updates" delay={6}>Updates arrive over the air.</Title>
			<UpdateCard />
			<div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
				<Rise delay={90}>
					<Sub size={36} style={{color: C.text}}>Signed. Installed when you choose.</Sub>
				</Rise>
			</div>
		</Phase>
		<Phase from={114} to={236}>
			<Title kicker="Notifications" delay={118}>You choose what reaches you.</Title>
			<Choices />
		</Phase>
		<Phase from={228} to={400}>
			<Title kicker="Transparency" delay={230}>Every connection is on the record.</Title>
			<Log />
		</Phase>
	</Scene>
);
