import { getFileType, type SimsFile } from 'dbpf-transform';
import type { SvelteComponent } from 'svelte';

import BCON from './bcon.svelte';
import GLOB from './glob.svelte';
import NREF from './nref.svelte';
import OBJD from './objd.svelte';
import OBJF from './objf.svelte';
import STR from './str.svelte';
import TGA from './tga.svelte';
import TRCN from './trcn.svelte';
import UNK from './unk.svelte';

export const views = {
  BCON,
  CTSS: STR,
  GLOB,
  JFIF: TGA,
  NREF,
  OBJD,
  OBJF,
  STR,
  TGA,
  TRCN,
  TTAS: STR,
};

export function getViewForFileType(resource: SimsFile): typeof SvelteComponent | undefined {
  if (!resource) return;
  return views[getFileType(resource.meta.typeId) as keyof typeof views] ?? UNK;
}
