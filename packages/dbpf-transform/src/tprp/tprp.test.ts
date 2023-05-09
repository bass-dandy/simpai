import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './tprp.js';

const fileData = {
  filename: 'Interaction - New Archetypical Character - labels',
  header: [
    1414550096,
    78,
    0,
  ],
  params: [
    { label: 'age', pdata: 1 },
  ],
  locals: [
    'age',
    'gender',
    'skin',
    'species',
    'person',
    'tombstone',
    'neighbor',
    'npcType',
  ],
};

const filePath = path.join(__dirname, 'fixtures/valid.tprp');

describe('TPRP', () => {
  it('can deserialize TPRP files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize TPRP files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
