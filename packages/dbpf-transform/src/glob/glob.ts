/**
 * GLOB file structure:
 *
 * - 64 byte filename
 * - 1 byte length
 * - <length> byte string
 */
import BufferReader from '../buffer-reader.js';
import BufferWriter from '../buffer-writer.js';
import type {GlobContent} from '../types.js';

export function deserialize(buf: ArrayBuffer) {
	const reader = new BufferReader(buf);

	const glob: GlobContent = {
		filename: reader.readFileName(),
		length: reader.readUint8(),
		semiglobal: '',
	};

	glob.semiglobal = new TextDecoder().decode(
		reader.readBuffer(glob.length)
	);

	return glob;
};

export function serialize(data: GlobContent) {
	const writer = new BufferWriter();
	const encoder = new TextEncoder();

	const encodedFilename = encoder.encode(data.filename);
	writer.writeBuffer(encodedFilename);
	writer.writeNulls(64 - encodedFilename.byteLength);

	writer.writeUint8(data.length);

	writer.writeBuffer(encoder.encode(data.semiglobal).buffer);

	return writer.buffer;
};
