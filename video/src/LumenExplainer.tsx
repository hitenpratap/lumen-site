import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {AbsoluteFill} from 'remotion';
import {FilmFinish, LightLeak} from './kit';
import {zoomBlur} from './kit/transitions';
import {C} from './theme';
import {LEAK, SCENES, TRANSITION} from './timeline';

export type ExplainerProps = {readonly grain: number};

export const LumenExplainer: React.FC<ExplainerProps> = ({grain}) => (
	<AbsoluteFill style={{background: C.bg}}>
		<TransitionSeries>
			{SCENES.flatMap((s, i) => [
				s.enter === 'zoom' ? (
					<TransitionSeries.Transition
						key={`t${s.id}`}
						presentation={zoomBlur()}
						timing={linearTiming({durationInFrames: TRANSITION})}
					/>
				) : null,
				s.enter === 'leak' ? (
					<TransitionSeries.Overlay key={`o${s.id}`} durationInFrames={LEAK}>
						<LightLeak seed={i} />
					</TransitionSeries.Overlay>
				) : null,
				<TransitionSeries.Sequence key={s.id} name={s.id} durationInFrames={s.duration}>
					<s.component />
				</TransitionSeries.Sequence>,
			]).filter(Boolean)}
		</TransitionSeries>
		<FilmFinish grain={grain} />
	</AbsoluteFill>
);
