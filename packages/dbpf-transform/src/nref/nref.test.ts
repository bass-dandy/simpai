import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './nref.js';

const fileData = { filename: 'JobData_Science' };

const filePath = path.join(__dirname, 'fixtures/valid.nref');

describe('NREF', () => {
  it('can deserialize NREF files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize NREF files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
