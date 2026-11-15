import type {ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {IconName} from '../kit';
import {glass, Headline, Icon, Kicker, Pill, Rise, Scene, Typewriter, useEnter} from '../kit';
import {C, mono} from '../theme';

const Card: React.FC<{
	readonly icon: IconName;
	readonly title: string;
	readonly note: string;
	readonly delay: number;
	readonly children: ReactNode;
}> = ({icon, title, note, delay, children}) => (
	<Rise delay={delay} y={40} scaleFrom={0.95}>
		<div style={{...glass(), height: 282, padding: '26px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
			<div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
				<div style={{width: 60, height: 60, borderRadius: 16, background: 'rgba(91,61,245,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
					<Icon name={icon} size={32} color={C.violetPale} />
				</div>
				<div style={{fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1.1}}>{title}</div>
			</div>
			<div style={{fontSize: 26, color: C.body, marginTop: 16, lineHeight: 1.3}}>{note}</div>
			<div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>{children}</div>
		</div>
	</Rise>
);

const Dot: React.FC<{readonly color: string; readonly label: string; readonly delay: number}> = ({color, label, delay}) => (
	<Rise delay={delay} y={8} blur={4} scaleFrom={0.8}>
		<span style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 24, color: C.text}}>
			<span style={{width: 18, height: 18, borderRadius: 9, background: color}} />
			{label}
		</span>
	</Rise>
);

export const MoreFeatures: React.FC = () => {
	const frame = useCurrentFrame();
	const sent = frame >= 250;
	const translated = frame >= 235;
	const mem = useEnter(190, 50);
	return (
		<Scene chapter={['10', 'And more']} glowAt="50% 70%">
			<AbsoluteFill style={{paddingLeft: 96, paddingTop: 100}}>
				<Rise delay={6}>
					<Kicker>And more</Kicker>
				</Rise>
				<Rise delay={12}>
					<Headline size={84} style={{marginTop: 14, width: 1500}}>
						And everything else you'd expect, done calmly.
					</Headline>
				</Rise>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 96, top: 360, width: 1728, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
				<Card icon="inbox" title="Unified inbox" note="Gmail, Outlook, iCloud, Yahoo and any IMAP host." delay={34}>
					<Dot color="#FF8A4C" label="Personal" delay={60} />
					<Dot color="#4C8DFF" label="Work" delay={70} />
					<Dot color="#3DD68C" label="Family" delay={80} />
				</Card>
				<Card icon="book" title="Rules in plain words" note="Teach Roost what you want." delay={56}>
					<div style={{fontFamily: mono, fontSize: 22, color: C.violetPale, lineHeight: 1.4}}>
						<Typewriter text="Never send emails from my lawyer to a cloud AI." delay={84} cps={24} />
					</div>
				</Card>
				<Card icon="languages" title="Translate in place" note="Read it in your language, right in the message." delay={78}>
					<Pill tone={translated ? 'grey' : 'violet'} size={24}>
						{translated ? 'See original' : 'Translate to English'}
					</Pill>
					<span style={{fontSize: 24, color: C.text}}>{translated ? 'Hello Alex' : 'Ciao Alex'}</span>
				</Card>
				<Card icon="bell" title="Notifications that respect you" note="Quiet hours. Hide sender and subject." delay={100}>
					<Pill tone="grey" size={22}>Quiet hours</Pill>
					<Pill tone="grey" size={22}>Sender hidden</Pill>
				</Card>
				<Card icon="wifiOff" title="Works offline" note="The outbox sends when you're back online." delay={122}>
					<Pill tone={sent ? 'green' : 'amber'} size={24}>
						{sent ? 'Sent' : '1 in outbox'}
					</Pill>
				</Card>
				<Card icon="cpu" title="Light Rust core" note="Fast and easy on memory." delay={144}>
					<div style={{width: '100%', display: 'flex', alignItems: 'center', gap: 14}}>
						<span style={{fontFamily: mono, fontSize: 22, color: C.dim}}>MEMORY</span>
						<div style={{flex: 1, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.1)'}}>
							<div style={{width: `${22 * mem}%`, height: '100%', borderRadius: 6, background: C.green}} />
						</div>
					</div>
				</Card>
			</div>
		</Scene>
	);
};
