import fs from 'fs/promises';
import path from 'path';

import { deserialize, serialize } from './ttab.js';

const filePath = path.join(__dirname, 'fixtures/valid.ttab');

const sitMotiveTable = {
  items: [
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0x23, delta: 0x0A, type: 4 },
  ],
};

const bounceMotiveTable = {
  items: [
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0xA, delta: 0x23, type: 3 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 0 },
    { min: 0, delta: 0, type: 7 },
  ],
};

const fileData = {
  filename: 'untitled tree table',
  format: 76,
  items: [
    {
      action: 0x2002,
      guard: 0x2007,
      flags: 8304,
      flags2: 14336,
      strIndex: 5,
      attenuationCode: 0x3,
      attenuationValue: 19507992,
      autonomy: 0x32,
      joinIndex: 0xFFFFFFFF,
      uiDisplayType: 0,
      facialAnimation: 3,
      memoryIterMult: 1056964608,
      objectType: 0,
      modelTableId: 1,
      humanGroups: {
        groups: [
          { ...sitMotiveTable },
          { ...sitMotiveTable },
          { ...sitMotiveTable },
          { ...sitMotiveTable },
          { ...sitMotiveTable },
          { ...sitMotiveTable },
          { ...sitMotiveTable },
        ],
      },
      animalGroups: null,
    },
    {
      action: 0x1003,
      guard: 0x1004,
      flags: 3073,
      flags2: 0,
      strIndex: 0,
      attenuationCode: 0x3,
      attenuationValue: 0,
      autonomy: 0x32,
      joinIndex: 0xFFFFFFFF,
      uiDisplayType: 0,
      facialAnimation: 2,
      memoryIterMult: 1056964608,
      objectType: 0,
      modelTableId: 1,
      humanGroups: {
        groups: [
          {
            items: [
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0, delta: 0, type: 0 },
              { min: 0x19, delta: 0x14, type: 1 },
            ],
          },
          { ...bounceMotiveTable },
          { ...bounceMotiveTable },
          { ...bounceMotiveTable },
          { ...bounceMotiveTable },
          { ...bounceMotiveTable },
          { ...bounceMotiveTable },
        ],
      },
      animalGroups: null,
    }
  ],
};

describe('TTAB', () => {
  it('can deserialize TTAB files with version = 76', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize TTAB files with version = 76', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
