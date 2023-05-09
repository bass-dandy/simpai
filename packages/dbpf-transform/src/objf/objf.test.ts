import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './objf.js';

const functions = [
  { guard: 0, action: 4096 },
  { guard: 0, action: 8193 },
  { guard: 0, action: 8302 },
];

for (let i = 0; i < 52; i++) {
  functions.push({ guard: 0, action: 0 });
}

const fileData = {
  filename: '',
  header: [0, 0, 1329744486],
  functions,
};

const filePath = path.join(__dirname, 'fixtures/valid.objf');

describe('OBJF', () => {
  it('can deserialize OBJF files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize OBJF files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
