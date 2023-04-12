import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type { TrcnContent } from '../types.js';

export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);
  const decoder = new TextDecoder();

  const trcn: TrcnContent = {
    filename: reader.readFileName(),
    version: 0,
    items: [],
  };

  // read header
  reader.readUint32();
  trcn.version = reader.readUint32();
  reader.readUint32();

  const itemCount = reader.readUint32();

  while (trcn.items.length < itemCount) {
    trcn.items.push({
      used: reader.readUint32(),
      constId: reader.readUint32(),
      constName: decoder.decode(reader.readBuffer(reader.readUint8())),
      desc: trcn.version > 83 ? decoder.decode(reader.readBuffer(reader.readUint8())) : '',
      value: trcn.version > 83 ? reader.readUint8() : reader.readUint16(),
      minValue: reader.readUint16(),
      maxValue: reader.readUint16(),
    });
  }

  return trcn;
}

export function serialize(data: TrcnContent) {
  const writer = new BufferWriter();
  const encoder = new TextEncoder();

  const encodedFilename = encoder.encode(data.filename);
  writer.writeBuffer(encodedFilename);
  writer.writeNulls(64 - encodedFilename.byteLength);

  writer.writeUint32Array(data.header);
  writer.writeUint32(data.itemCount);

  data.items.forEach((item) => {
    writer.writeUint32(item.used);
    writer.writeUint32(item.constId);
    writer.writeUint8(item.constName.length);
    writer.writeString(item.constName);

    if (data.header[1] > 83) {
      writer.writeUint8(item.desc.length);
      writer.writeString(item.desc);
      writer.writeUint8(item.value);
    } else {
      writer.writeUint16(item.value);
    }
    writer.writeUint16(item.minValue);
    writer.writeUint16(item.maxValue);
  });

  return writer.buffer;
}
