import {loadFont as loadDisplay} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadUi} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// Same fonts and colours as the landing page (lumen-site/index.html).
export const display = loadDisplay('normal', {
	weights: ['500', '700', '800'],
	subsets: ['latin'],
}).fontFamily;
export const ui = loadUi('normal', {
	weights: ['400', '500', '600', '700'],
	subsets: ['latin'],
}).fontFamily;
export const mono = loadMono('normal', {
	weights: ['500'],
	subsets: ['latin'],
}).fontFamily;

export const C = {
	bg: '#0A0B10',
	bg2: '#0D0E14',
	panel: '#12141C',
	line: '#23273A',
	line2: '#2E3342',
	white: '#FFFFFF',
	text: '#E7E8EE',
	body: '#B4B9C9',
	muted: '#9AA0B4',
	dim: '#8A90A4',
	faint: '#3A3F52',
	violet: '#5B3DF5',
	violetSoft: '#A996FF',
	violetPale: '#C7BBFF',
	green: '#2FB463',
	greenSoft: '#6FD69A',
	greenPale: '#B9F0CF',
	red: '#F06262',
	redSoft: '#FF8A8A',
	amber: '#FFB547',
	orange: '#FF9F2E',
} as const;

// Bezier used for every entrance: fast start, long soft landing.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
