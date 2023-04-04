/**
 * OBJF file format:
 *
 * - 64 byte filename
 * - 12 byte header; last 4 bytes should equal OBJF type id (0x4f424a66)
 * - 4 byte function count
 *
 * rest is <function count> (should always be 55?) functions
 * - 2 byte guardian BHAV
 * - 2 byte action BHAV
 */
import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type {ObjfContent} from '../types.js';

export function deserialize(buf: ArrayBuffer) {
	const reader = new BufferReader(buf);

	const objf: ObjfContent = {
		filename: reader.readFileName(),
		header: reader.readUint32Array(3),
		count: reader.readUint32(),
		functions: [],
	};

	for(let i = 0; i < objf.count; i++) {
		objf.functions.push({
			guard: reader.readUint16(),
			action: reader.readUint16(),
		});
	}

	return objf;
};

export function serialize(data: ObjfContent) {
	const writer = new BufferWriter();
	const encoder = new TextEncoder();

	const encodedFilename = encoder.encode(data.filename);
	writer.writeBuffer(encodedFilename);
	writer.writeNulls(64 - encodedFilename.byteLength);

	writer.writeUint32Array(data.header);

	writer.writeUint32(data.count);

	for(let i = 0; i < data.count; i++) {
		writer.writeUint16(data.functions[i].guard);
		writer.writeUint16(data.functions[i].action);
	}

	return writer.buffer;
}
