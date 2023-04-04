const fs = require('fs/promises');

expect.extend({
	async toMatchFile(r: ArrayBuffer, path: string) {
		const matchFile = await fs.readFile(path);
		const e = matchFile.buffer;

		if (r.byteLength !== e.byteLength) {
			return {
				pass: false,
				message: () =>
					`lengths do not match\n\nexpected: ${e.byteLength}\nreceived: ${r.byteLength}`,
			};
		}

		const viewE = new Uint8Array(e);
		const viewR = new Uint8Array(r);

		for (let i = 0; i < e.byteLength; i++) {
			if (viewE[i] !== viewR[i]) {
				return {
					pass: false,
					message: () => `buffers do not match at offset ${i}`,
				};
			}
		}

		return {
			pass: true,
			message: () => 'buffers match',
		};
	}
});
