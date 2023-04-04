import fs from 'fs/promises';
import path from 'path';
import {deserialize, serialize} from './dbpf.js';

describe('DBPF', () => {
	// I wouldn't call this a great test, but whatever!
	it('can deserialize and serialize a DBPF package file', async () => {
		const inPackage = await fs.readFile(
			path.join(__dirname, 'fixtures/valid.package')
		);

		const outPackage = serialize(
			deserialize(inPackage.buffer)
		);

		expect(inPackage.buffer.byteLength).toBe(outPackage.byteLength);

		const inBytes = new Uint8Array(inPackage.buffer);
		const outBytes = new Uint8Array(outPackage);

		expect(inBytes).toEqual(outBytes);
	});
});
