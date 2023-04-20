import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type { TtabContent, TtabMotiveTable } from '../types.js';

function readFloat(reader: BufferReader) {
  return Float32Array.of(reader.readUint32())[0] ?? 0;
}

function readMotiveTable(
  format: number,
  motiveCounts: number[] | null,
  type: 'human' | 'animal',
  reader: BufferReader
) {
  const groupCount = motiveCounts === null ? reader.readUint32() : motiveCounts.length;

  const table: TtabMotiveTable = { groups: [] };

  // add groups (eg adult, child, etc) to table
  for (let i = 0; i < groupCount ; i++) {
    const motiveCount = format < 84 ? (motiveCounts?.[i] ?? 0) : reader.readUint32();

    const group: TtabMotiveTable['groups'][number] = { items: [] };

    // add items (eg energy, scratch/chew, etc) to group
    for (let j = 0; j < motiveCount; j++) {
      if (type === 'human') {
        group.items.push({
          min: reader.readUint16(),
          delta: reader.readUint16(),
          type: reader.readUint16(),
        });
      } else {
        const itemLength = reader.readUint32();

        for (let k = 0; k < itemLength; k++) {
          // TODO: this is incorrect
          group.items.push({
            min: reader.readUint16(),
            delta: reader.readUint16(),
            type: reader.readUint16(),
          });
        }
      }
    }
    table.groups.push(group);
  }
  return table;
}

export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);

  const ttab: TtabContent = {
    filename: reader.readFileName(),
    format: 0,
    items: [],
  };

  reader.readUint32()
  ttab.format = reader.readUint32();
  reader.readUint32();

  const itemCount = reader.readUint16();

  for (let i = 0; i < itemCount; i++) {
    const action = reader.readUint16();
    const guard = reader.readUint16();
    let motiveCounts: number[] | null = null;

    if (ttab.format < 68) {
      motiveCounts = [reader.readUint32()];
    } else if (ttab.format < 84) {
      motiveCounts = [0, 0, 0, 0, 0, 0, 0].map(() => reader.readUint32());
    }

    ttab.items.push({
      action,
      guard,
      flags: reader.readUint16(),
      flags2: reader.readUint16(),
      strIndex: reader.readUint32(),
      attenuationCode: reader.readUint32(),
      attenuationValue: readFloat(reader),
      autonomy: reader.readUint32(),
      joinIndex: reader.readUint32(),
      uiDisplayType: ttab.format > 69 ? reader.readUint16() : 0,
      facialAnimation: ttab.format > 74 ? reader.readUint32() : 0,
      memoryIterMult: ttab.format > 76 ? readFloat(reader) : 0,
      objectType: ttab.format > 76 ? reader.readUint32() : 0,
      modelTableId: ttab.format > 70 ? reader.readUint32() : 0,
      humanGroups: readMotiveTable(ttab.format, motiveCounts, 'human', reader),
      animalGroups: ttab.format > 84 ? readMotiveTable(ttab.format, motiveCounts, 'animal', reader) : null,
    });
  }
  return ttab;
}

function writeMotiveTable(
  format: number,
  table: TtabMotiveTable,
  tableType: 'human' | 'animal',
  writer: BufferWriter
) {
  if (format >= 84) writer.writeUint32(table.groups.length);

  table.groups.forEach((group) => {
    if (format >= 85) writer.writeUint32(group.items.length);

    group.items.forEach((item) => {
      if (tableType === 'human') {
        writer.writeUint16(item.min);
        writer.writeUint16(item.delta);
        writer.writeUint16(item.type);
      } else {
        // TODO: update when animal tables are parsed correctly
      }
    });
  });
}

export function serialize(data: TtabContent) {
  const writer = new BufferWriter();
  const encoder = new TextEncoder();

  const encodedFilename = encoder.encode(data.filename);
  writer.writeBuffer(encodedFilename);
  writer.writeNulls(64 - encodedFilename.byteLength);

  writer.writeUint32(-1);
  writer.writeUint32(data.format);
  writer.writeUint32(0);
  writer.writeUint16(data.items.length);

  data.items.forEach((item) => {
    writer.writeUint16(item.action);
    writer.writeUint16(item.guard);

    if (data.format < 84) {
      item.humanGroups.groups.forEach((group) => {
        writer.writeUint32(group.items.length);
      });
    }

    writer.writeUint16(item.flags);
    writer.writeUint16(item.flags2);
    writer.writeUint32(item.strIndex);
    writer.writeUint32(item.attenuationCode);
    writer.writeUint32(item.attenuationValue);
    writer.writeUint32(item.autonomy);
    writer.writeUint32(item.joinIndex);

    if (data.format > 69) writer.writeUint16(item.uiDisplayType);
    if (data.format > 74) writer.writeUint32(item.facialAnimation);
    if (data.format > 76) {
      writer.writeUint32(item.memoryIterMult);
      writer.writeUint32(item.objectType);
    }
    if (data.format > 70) writer.writeUint32(item.modelTableId);

    writeMotiveTable(data.format, item.humanGroups, 'human', writer);

    if (data.format > 84 && item.animalGroups) {
      writeMotiveTable(data.format, item.animalGroups, 'animal', writer);
    }
  });
  return writer.buffer;
}
