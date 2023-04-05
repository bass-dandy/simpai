/**
 * NREF file format: just a utf-8 filename!
 */
import type { NrefContent } from '../types.js';

export function deserialize(buf: ArrayBuffer) {
  return {
    filename: new TextDecoder().decode(buf),
  };
}

export function serialize(data: NrefContent) {
  return new TextEncoder().encode(data.filename);
}
