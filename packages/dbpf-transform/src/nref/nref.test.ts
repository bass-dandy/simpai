import path from 'path';
import {serialize} from './nref.js';

describe('NREF', () => {
	it('can serialize NREF files', async () => {
		const serializedFile = serialize({
			filename: 'JobData_Science',
		});

		await expect(serializedFile).toMatchFile(
			path.join(__dirname, 'fixtures/valid.nref')
		);
	});
});
