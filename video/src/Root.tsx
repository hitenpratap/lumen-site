import {AbsoluteFill, Composition, Folder} from 'remotion';
import {FilmFinish} from './kit';
import {RoostExplainer} from './RoostExplainer';
import {SCENES, TOTAL} from './timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="RoostExplainer"
			component={RoostExplainer}
			durationInFrames={TOTAL}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{grain: 0.06}}
		/>
		{/* Each scene on its own, for previewing and still checks. */}
		<Folder name="Scenes">
			{SCENES.map((s) => (
				<Composition
					key={s.id}
					id={s.id}
					component={() => (
						<AbsoluteFill>
							<s.component />
							<FilmFinish />
						</AbsoluteFill>
					)}
					durationInFrames={s.duration}
					fps={30}
					width={1920}
					height={1080}
				/>
			))}
		</Folder>
	</>
);
