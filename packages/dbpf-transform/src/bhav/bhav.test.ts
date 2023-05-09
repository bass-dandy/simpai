import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './bhav.js';

const fileData = {
  filename: 'Init',
  format: 0x8007,
  type: 0,
  argCount: 0,
  localCount: 0,
  headerFlag: 0,
  treeVersion: 4294934536,
  instructions: [
    {
      opcode: 8192,
      gotoOnTrue: 1,
      gotoOnFalse: 65532,
      nodeVersion: 1,
      operands: [255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      opcode: 2,
      gotoOnTrue: 65533,
      gotoOnFalse: 65532,
      nodeVersion: 0,
      operands: [0, 0, 6, 95, 0, 9, 2, 26, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
};

const filePath = path.join(__dirname, 'fixtures/valid.bhav');

describe('BHAV', () => {
  it('can deserialize BHAV files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize BHAV files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
