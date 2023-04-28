import type { BhavFile } from 'dbpf-transform';

import { formatHex } from '../util';
import { packages } from '../stores';
import { select } from '../selectors';

import globals from './globals.json';
import primitives from './primitives.json';

type SimpleJSON = Record<string, string | undefined>;

export function getBhavName(opcode: number) {
  const key = formatHex(opcode, 4);

  if (opcode <= 0x00FF) {
    return (primitives as SimpleJSON)[key] ?? '<unknown primitive>';
  }

  if (opcode <= 0x0FFF) {
    return (globals as SimpleJSON)[key] ?? '<unknown global>';
  }

  if (opcode <= 0x1FFF) {
    let filename = '';

    const unsubscribe = packages.subscribe((store) => {
      const bhavId = select(store).resourceIdByTypeAndInstanceId('BHAV', opcode);
      const bhav = select(store).resourceById<BhavFile>(bhavId);
      filename = bhav?.content.filename ?? '';
    });

    unsubscribe();
    return filename;
  }

  if (opcode <= 0x2FFF) {
    return '<unknown semi-global>';
  }

  return '<unknown>';
}

export { globals, primitives };
