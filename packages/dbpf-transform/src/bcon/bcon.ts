/**
 * BCON (behavior constants) file format:
 *
 * 66 byte header
 * - 64 byte file name
 * - 1 bit flag
 * - 15 bit item count
 *
 * rest of file is <item count> 2 byte items (might be signed in some contexts, eg motive deltas)
 */
import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type { BconContent } from '../types.js';

export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);

  const bcon: BconContent = {
    filename: reader.readFileName(),
    flag: false,
    items: [],
  };

  const flagAndCount = reader.readUint16();
  bcon.flag = (flagAndCount & 0b1000000000000000) !== 0;
  const count = flagAndCount & 0b0111111111111111;

  for (let i = 0; i < count; i++) {
    bcon.items.push(reader.readUint16());
  }

  return bcon;
}

export function serialize(data: BconContent) {
  const writer = new BufferWriter();
  const encoder = new TextEncoder();

  const encodedFilename = encoder.encode(data.filename);
  writer.writeBuffer(encodedFilename);
  writer.writeNulls(64 - encodedFilename.byteLength);

  let flagAndCount = data.items.length;

  if (data.flag) {
    flagAndCount |= 0b1000000000000000;
  }

  writer.writeUint16(flagAndCount);
  writer.writeUint16Array(data.items);

  return writer.buffer;
}
