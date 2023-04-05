import path from 'path';
import { serialize } from './objf.js';

describe('OBJF', () => {
  it('can serialize OBJF files', async () => {
    const functions = [
      { guard: 0, action: 4096 },
      { guard: 0, action: 8193 },
      { guard: 0, action: 8302 },
    ];

    for (let i = 0; i < 52; i++) {
      functions.push({ guard: 0, action: 0 });
    }

    const serializedFile = serialize({
      filename: '',
      header: [0, 0, 1329744486],
      count: 55,
      functions,
    });

    await expect(serializedFile).toMatchFile(path.join(__dirname, 'fixtures/valid.objf'));
  });
});
