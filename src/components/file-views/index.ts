import {getFileType} from 'dbpf-transform';
import type {SvelteComponent} from 'svelte';

import BCON from './bcon.svelte';
import GLOB from './glob.svelte';
import NREF from './nref.svelte';
import OBJF from './objf.svelte';
import STR from './str.svelte';
import TGA from './tga.svelte';
import UNK from './unk.svelte';

const views = {
	BCON,
	CTSS: STR,
	GLOB,
	JFIF: TGA,
	NREF,
	OBJF,
	STR,
	TGA,
	TTAS: STR,
};

export function getViewForFileType(resource): typeof SvelteComponent {
	if (!resource) return;
	return views[
		getFileType(resource.meta.typeId)
	] ?? UNK;
}
