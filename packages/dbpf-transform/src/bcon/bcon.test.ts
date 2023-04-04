import path from 'path';
import {serialize} from './bcon.js';

describe('BCON', () => {
	it('can serialize BCON files', async () => {
		const serializedFile = serialize({
			filename: 'Tuning - Daily Wages',
			flag: false,
			itemCount: 11,
			items: [0, 197, 302, 428, 505, 610, 736, 886, 1026, 1532, 2342],
		});

		return await expect(serializedFile).toMatchFile(
			path.join(__dirname, 'fixtures/valid.bcon')
		);
	});
});
