import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type { ObjdContent } from '../types.js';

// TODO: split data[] into something more meaningful
export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);

  const objd: ObjdContent = {
    filename: reader.readFileName(),
    type: buf.byteLength >= 0x54 ? reader.seekTo(0x52).readUint16() : 0,
    guid: buf.byteLength >= 0x60 ? reader.seekTo(0x5c).readUint32() : 0,
    proxyGuid: buf.byteLength >= 0x7e ? reader.seekTo(0x7a).readUint32() : 0,
    originalGuid: buf.byteLength >= 0xd0 ? reader.seekTo(0xcc).readUint32() : 0,
    data: [],
  };

  reader.seekTo(64);
  objd.data = reader.readUint8Array(buf.byteLength - 64);

  return objd;
}

export function serialize(data: ObjdContent) {
  const writer = new BufferWriter();
  const encoder = new TextEncoder();

  const encodedFilename = encoder.encode(data.filename);
  writer.writeBuffer(encodedFilename);
  writer.writeNulls(64 - encodedFilename.byteLength);

  writer.writeUint8Array(data.data);

  return writer.buffer;
}
