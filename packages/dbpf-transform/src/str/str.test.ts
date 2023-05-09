import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './str.js';

const fileData = {
  filename: 'Attribute Labels',
  formatCode: 65533,
  stringSets: [
    {
      languageId: 1,
      value: 'Job Type',
      description: 'The Sims 2 - Needs Translation - Batch15',
    },
    {
      languageId: 1,
      value: 'Availability',
      description: 'The Sims 2 - Needs Translation - Batch15',
    },
  ],
};

const filePath = path.join(__dirname, 'fixtures/valid.str');

describe('STR#', () => {
  it('can deserialize STR# files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize STR# files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
