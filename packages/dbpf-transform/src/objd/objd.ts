import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type { ObjdContent } from '../types.js';
import { keyToWordLength } from './consts.js';

type ObjdProperty = keyof typeof keyToWordLength;

export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);

  const objd: ObjdContent = {
    filename: reader.readFileName(),
    data: {} as ObjdContent['data'],
  };

  Object.entries(keyToWordLength).forEach(([key, wordLength]) => {
    if (wordLength === 1) {
      objd.data[key as ObjdProperty] = reader.readUint16();
    } else if (wordLength === 2) {
      objd.data[key as ObjdProperty] = reader.readUint32();
    }
  });

  reader.readBuffer(12);
  const filename2 = reader.readCountedString();

  if (objd.filename !== filename2) {
    console.error(
      `OBJD malformed: start filename (${objd.filename}) does not match end filename (${filename2})`
    );
  }

  return objd;
}

export function serialize(objd: ObjdContent) {
  const writer = new BufferWriter();
  const encoder = new TextEncoder();

  const encodedFilename = encoder.encode(objd.filename);
  writer.writeBuffer(encodedFilename);
  writer.writeNulls(64 - encodedFilename.byteLength);

  Object.entries(keyToWordLength).forEach(([key, wordLength]) => {
    if (wordLength === 1) {
      writer.writeUint16(objd.data[key as ObjdProperty]);
    } else if (wordLength === 2) {
      writer.writeUint32(objd.data[key as ObjdProperty]);
    }
  });

  writer.writeNulls(12);
  writer.writeString(objd.filename, { counted: true });

  return writer.buffer;
}
