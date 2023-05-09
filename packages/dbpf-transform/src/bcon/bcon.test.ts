import path from 'path';
import fs from 'fs/promises';
import { deserialize, serialize } from './bcon.js';

const fileData = {
  filename: 'Tuning - Daily Wages',
  flag: false,
  items: [0, 197, 302, 428, 505, 610, 736, 886, 1026, 1532, 2342],
};

const filePath = path.join(__dirname, 'fixtures/valid.bcon');

describe('BCON', () => {
  it('can deserialize BCON files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize BCON files', async () => {
    const serializedFile = serialize(fileData);
    return await expect(serializedFile).toMatchFile(filePath);
  });
});
