import path from 'path';
import { serialize } from './glob.js';

describe('GLOB', () => {
  it('can serialize GLOB files', async () => {
    const serializedFile = serialize({
      filename: 'semi global file',
      semiglobal: 'JobDataGlobals',
    });

    await expect(serializedFile).toMatchFile(path.join(__dirname, 'fixtures/valid.glob'));
  });
});
