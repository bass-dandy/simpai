import * as qfs from 'qfs-compression';
import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import { TYPE_ID, getFileType } from '../consts.js';
import {
  isBconFile,
  isBhavFile,
  isGlobFile,
  isObjdFile,
  isObjfFile,
  isStrFile,
  isTprpFile,
  isTrcnFile,
  isTtabFile,
  isNrefFile,
} from '../types.js';
import type { SimsFile, SimsFileMeta } from '../types.js';

import * as BCON from '../bcon/index.js';
import * as BHAV from '../bhav/index.js';
import * as GLOB from '../glob/index.js';
import * as NREF from '../nref/index.js';
import * as OBJD from '../objd/index.js';
import * as OBJF from '../objf/index.js';
import * as STR from '../str/index.js';
import * as TTAB from '../ttab/index.js';
import * as TPRP from '../tprp/index.js';
import * as TRCN from '../trcn/index.js';

function deserializeFile(typeId: string, buffer: ArrayBuffer) {
  switch (typeId) {
    case TYPE_ID.BCON:
      return BCON.deserialize(buffer);
    case TYPE_ID.BHAV:
      return BHAV.deserialize(buffer);
    case TYPE_ID.GLOB:
      return GLOB.deserialize(buffer);
    case TYPE_ID.NREF:
      return NREF.deserialize(buffer);
    case TYPE_ID.OBJD:
      return OBJD.deserialize(buffer);
    case TYPE_ID.OBJF:
      return OBJF.deserialize(buffer);
    case TYPE_ID.TTAB:
      return TTAB.deserialize(buffer);
    case TYPE_ID.TPRP:
      return TPRP.deserialize(buffer);
    case TYPE_ID.TRCN:
      return TRCN.deserialize(buffer);
    case TYPE_ID.STR:
    case TYPE_ID.CTSS:
    case TYPE_ID.TTAS:
      return STR.deserialize(buffer);
    default:
      console.log(`No handler for file with typeId ${typeId} (${getFileType(typeId)})`);
      return buffer;
  }
}

export function deserialize(buf: ArrayBuffer) {
  const reader = new BufferReader(buf);
  const decoder = new TextDecoder();

  // begin header
  if (decoder.decode(reader.readBuffer(4)) !== 'DBPF') {
    throw new Error('Not a DBPF file!');
  }

  const versionMajor = reader.readUint32();
  const versionMinor = reader.readUint32();

  if (versionMajor !== 1 || versionMinor > 1) {
    throw new Error(`Expected version 1.0 or 1.1 but got ${versionMajor}.${versionMinor}`);
  }

  // skip to index entry count since everything in between is unused
  reader.seekTo(32);
  const indexVersionMajor = reader.readUint32();
  const indexEntryCount = reader.readUint32();
  const indexOffset = reader.readUint32();
  reader.seekTo(60);
  const indexVersionMinor = versionMinor === 1 ? reader.readUint32() : 0;

  if (indexVersionMajor !== 7 || indexVersionMinor > 2) {
    throw new Error(
      `Expected index version 7.1 or 7.2 but got ${indexVersionMajor}.${indexVersionMinor}`
    );
  }
  // end header (ignore the remaining bytes of the header as they're unused)

  // parse index table
  reader.seekTo(indexOffset);
  const indexedFiles: SimsFileMeta[] = [];

  for (let i = 0; i < indexEntryCount; i++) {
    indexedFiles.push({
      typeId: reader.readUint32().toString(16),
      groupId: reader.readUint32(),
      instanceId: reader.readUint32(),
      instanceId2: indexVersionMinor === 2 ? reader.readUint32() : undefined,
      location: reader.readUint32(),
      size: reader.readUint32(),
      compressed: false,
    });
  }

  // check for DIR record and mark compressed files
  indexedFiles.forEach((meta) => {
    if (meta.typeId === TYPE_ID.DIR) {
      const dirEntryCount = meta.size / (indexVersionMinor === 2 ? 20 : 16);
      let matchCount = 0;

      console.log(`DIR found with ${dirEntryCount} entries`);

      for (let i = 0; i < dirEntryCount; i++) {
        reader.seekTo(meta.location);
        const typeId = reader.readUint32().toString(16);
        const groupId = reader.readUint32();
        const instanceId = reader.readUint32();
        const instanceId2 = indexVersionMinor === 2 ? reader.readUint32() : undefined;

        const match = indexedFiles.find((file) => {
          return (
            file.typeId === typeId &&
            file.groupId === groupId &&
            file.instanceId === instanceId &&
            file.instanceId2 === instanceId2
          );
        });

        if (match) {
          match.compressed = true;
          matchCount++;
        }
      }

      console.log(`found ${matchCount} matching resources out of ${dirEntryCount} DIR entries`);
    }
  });

  const files: SimsFile[] = [];

  // deserialize files
  indexedFiles.forEach((meta) => {
    if (meta.typeId === TYPE_ID.DIR) return;

    reader.seekTo(meta.location);
    const buffer = reader.readBuffer(meta.size);

    if (meta.compressed) {
      console.log(`decompressing and deserializing ${getFileType(meta.typeId)}`);
    } else {
      console.log(`deserializing ${getFileType(meta.typeId)}`);
    }

    const content = deserializeFile(
      meta.typeId,
      meta.compressed ? qfs.decompress(new Uint8Array(buffer).slice(4)).buffer : buffer
    );

    files.push({ meta, content });
  });

  return files;
}

export function serialize(files: SimsFile[]) {
  const writer = new BufferWriter();

  // write file header
  writer.writeString('DBPF'); // identifier
  writer.writeUint32(1); // major version
  writer.writeUint32(1); // minor version
  writer.writeNulls(20); // 12 unknown bytes, skip date modified + created
  writer.writeUint32(7); // index major version
  writer.writeUint32(files.length); // index entry count
  writer.writeUint32(0); // we'll need to come back later to write the index offset
  writer.writeUint32(files.length * 24); // index table size
  writer.writeNulls(12); // skip hole count, offset, and size
  writer.writeUint32(2); // index minor version
  writer.writeNulls(32); // rest of header is blank / reserved for future versions

  // write files and track meta for index table
  const indexTable: SimsFileMeta[] = [];

  files.forEach((file) => {
    let serializedFile = new ArrayBuffer(0);

    if (isBconFile(file)) {
      serializedFile = BCON.serialize(file.content);
    } else if (isBhavFile(file)) {
      serializedFile = BHAV.serialize(file.content);
    } else if (isGlobFile(file)) {
      serializedFile = GLOB.serialize(file.content);
    } else if (isNrefFile(file)) {
      serializedFile = NREF.serialize(file.content);
    } else if (isObjdFile(file)) {
      serializedFile = OBJD.serialize(file.content);
    } else if (isObjfFile(file)) {
      serializedFile = OBJF.serialize(file.content);
    } else if (isStrFile(file)) {
      serializedFile = STR.serialize(file.content);
    } else if (isTtabFile(file)) {
      serializedFile = TTAB.serialize(file.content);
    } else if (isTprpFile(file)) {
      serializedFile = TPRP.serialize(file.content);
    } else if (isTrcnFile(file)) {
      serializedFile = TRCN.serialize(file.content);
    } else {
      serializedFile = file.content as ArrayBuffer;
    }

    indexTable.push({
      ...file.meta,
      location: writer.buffer.byteLength,
      size: serializedFile.byteLength,
    });

    writer.writeBuffer(serializedFile);
  });

  // write index table
  const indexOffset = writer.buffer.byteLength;

  indexTable.forEach((meta) => {
    writer.writeUint32(parseInt(meta.typeId, 16));
    writer.writeUint32(meta.groupId);
    writer.writeUint32(meta.instanceId);
    if (meta.instanceId2 !== undefined) writer.writeUint32(meta.instanceId2);
    writer.writeUint32(meta.location);
    writer.writeUint32(meta.size);
  });

  // lastly, go back to the header and write the index offset
  const view = new DataView(writer.buffer);
  view.setUint32(40, indexOffset, true);

  return view.buffer;
}
