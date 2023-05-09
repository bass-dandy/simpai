import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './glob.js';

const fileData = {
  filename: 'semi global file',
  semiglobal: 'JobDataGlobals',
};

const filePath = path.join(__dirname, 'fixtures/valid.glob');

describe('GLOB', () => {
  it('can deserialize GLOB files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize GLOB files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
