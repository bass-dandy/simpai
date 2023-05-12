import fs from 'fs/promises';
import path from 'path';

import { deserialize, serialize } from './bhav.js';
import { testData } from './fixtures/index.js';

const getFixturePath = (format: number) =>
  path.join(__dirname, `fixtures/0x${format.toString(16)}.bhav`);

describe('BHAV', () => {
  it.each(testData)('can deserialize BHAV files with format = $format', async (data) => {
    const buf = (
      await fs.readFile(
        getFixturePath(data.format)
      )
    ).buffer;

    expect(deserialize(buf)).toEqual(data);
  });

  it.each(testData)('can serialize BHAV files with format = $format', async (data) => {
    const serializedFile = serialize(data);

    await expect(serializedFile).toMatchFile(
      getFixturePath(data.format)
    );
  });
});
