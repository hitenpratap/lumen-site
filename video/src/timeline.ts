import {AiRouting} from './scenes/AiRouting';
import {BringYourOwnAI} from './scenes/BringYourOwnAI';
import {CatchMeUp} from './scenes/CatchMeUp';
import {Close} from './scenes/Close';
import {Codes} from './scenes/Codes';
import {ColdOpen} from './scenes/ColdOpen';
import {Composer} from './scenes/Composer';
import {LocalOnly} from './scenes/LocalOnly';
import {MoreFeatures} from './scenes/MoreFeatures';
import {MorningBrief} from './scenes/MorningBrief';
import {Search} from './scenes/Search';
import {Shield} from './scenes/Shield';
import {SmartStacks} from './scenes/SmartStacks';
import {Title} from './scenes/Title';
import {Updates} from './scenes/Updates';
import {WhatLeaves} from './scenes/WhatLeaves';

// How a scene is entered from the one before it.
// 'zoom' = zoom-blur crossfade (overlaps TRANSITION frames), 'leak' = hard cut under a light leak (no overlap).
export type Enter = 'none' | 'zoom' | 'leak';

export const TRANSITION = 20;
export const LEAK = 44;

// Shared by the full video and the per-scene compositions so durations stay in one place.
export const SCENES: ReadonlyArray<{id: string; component: React.FC; duration: number; enter: Enter}> = [
	{id: 'ColdOpen', component: ColdOpen, duration: 240, enter: 'none'},
	{id: 'Title', component: Title, duration: 210, enter: 'zoom'},
	{id: 'LocalOnly', component: LocalOnly, duration: 450, enter: 'leak'},
	{id: 'BringYourOwnAI', component: BringYourOwnAI, duration: 420, enter: 'zoom'},
	{id: 'AiRouting', component: AiRouting, duration: 450, enter: 'zoom'},
	{id: 'MorningBrief', component: MorningBrief, duration: 300, enter: 'leak'},
	{id: 'SmartStacks', component: SmartStacks, duration: 330, enter: 'zoom'},
	{id: 'CatchMeUp', component: CatchMeUp, duration: 270, enter: 'zoom'},
	{id: 'Composer', component: Composer, duration: 330, enter: 'zoom'},
	{id: 'Search', component: Search, duration: 330, enter: 'zoom'},
	{id: 'Shield', component: Shield, duration: 300, enter: 'zoom'},
	{id: 'Codes', component: Codes, duration: 300, enter: 'zoom'},
	{id: 'MoreFeatures', component: MoreFeatures, duration: 330, enter: 'zoom'},
	{id: 'WhatLeaves', component: WhatLeaves, duration: 540, enter: 'leak'},
	{id: 'Updates', component: Updates, duration: 360, enter: 'zoom'},
	{id: 'Close', component: Close, duration: 270, enter: 'zoom'},
];

export const TOTAL = SCENES.reduce((t, s) => t + s.duration - (s.enter === 'zoom' ? TRANSITION : 0), 0);
