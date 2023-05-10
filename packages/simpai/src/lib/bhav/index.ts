import type { BhavFile, TprpFile } from 'dbpf-transform';

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

export function getBhavLabels(opcode?: number) {
  let args: string[] = [];
  let locals: string[] = [];

  if (opcode && opcode >= 0x1000 && opcode <= 0x1FFF) {
    const unsubscribe = packages.subscribe((store) => {
      const bhavId = select(store).resourceIdByTypeAndInstanceId('BHAV', opcode);
      const bhav = select(store).resourceById<BhavFile>(bhavId);

      const tprpId = select(store).resourceIdByTypeAndInstanceId('TPRP', opcode);
      const tprp = select(store).resourceById<TprpFile>(tprpId);

      if (bhav && tprp) {
        args = tprp.content.params.map((param) => param.label).slice(0, bhav.content.argCount);
        locals = tprp.content.locals.slice(0, bhav.content.localCount);

        while (args.length < bhav.content.argCount) {
          args.push('');
        }
        while (locals.length < bhav.content.localCount) {
          locals.push('');
        }
      }
    });

    unsubscribe();
  }

  return { args, locals };
}

export { globals, primitives };
