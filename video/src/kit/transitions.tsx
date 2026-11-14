import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill} from 'remotion';

type NoProps = Record<string, never>;

// Cinematic cut: the old shot pushes past the lens and defocuses while the new one settles into focus.
const ZoomBlur: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
}) => {
	const entering = presentationDirection === 'entering';
	return (
		<AbsoluteFill
			style={{
				opacity: entering ? p : 1,
				scale: String(entering ? 0.94 + 0.06 * p : 1 + 0.12 * p),
				filter: `blur(${(entering ? 1 - p : p) * 18}px)`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const zoomBlur = (): TransitionPresentation<NoProps> => ({component: ZoomBlur, props: {}});
