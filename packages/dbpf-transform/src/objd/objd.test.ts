import fs from 'fs/promises';
import path from 'path';
import { deserialize, serialize } from './objd.js';

const fileData = {
  filename: 'JobData - Adult - Science',
  data: {
    version: 140,
    initialStackSize: 4,
    defaultWallAdjacentFlags: 128,
    defaultPlacementFlags: 1,
    defaultWallPlacementFlags: 0,
    defaultAllowedHeightFlags: 0,
    ttabId: 1,
    interactionGroup: 0,
    objectType: 7,
    multiTileMasterId: 0,
    multiTileSubIndex: 0,
    useDefaultPlacementFlags: 0,
    lookAtScore: 129,
    guid: 211690070,
    isUnlockable: 0,
    catalogUseFlags: 0,
    price: 0,
    strId: 0,
    slotId: 0,
    diagonalSelectorGuid: 65536,
    gridSelectorGuid: 0,
    objectOwnership: 0,
    ignoreGlobalSimInCAS: 1,
    cannotMoveOutWith: 0,
    hauntable: 0,
    proxyGuid: 211729735,
    slotGroup: 0,
    aspirationFlags: 0,
    memoryNiceOrBad: 0,
    isSalePriceDifferent: 0,
    initialSaleDepreciation: 0,
    dailySaleDepreciation: 0,
    isSelfDepreciating: 0,
    depreciationLimit: 0,
    roomSortFlags: 0,
    functionSortFlags: 0,
    ctssId: 2000,
    isGlobalSimObject: 1,
    tooltipNameType: 0,
    templateVersion: 0,
    nicenessMultiplier: 100,
    noDuplicateOnPlacement: 0,
    wantCategory: 0,
    noNewNameFromTemplate: 0,
    objectVersion: 0,
    defaultThumbnailId: 0,
    motiveEffectsId: 0,
    jobObjectGuid: 0,
    catalogPopupId: 0,
    ignoreCurrentModelIndexInIcons: 0,
    levelOffset: 0,
    hasShadow: 0,
    attributeCount: 0,
    objectArrayCount: 0,
    _hole0: 0,
    frontDirection: 0,
    _hole1: 0,
    multiTileLeadObject: 0,
    expansionFlag: 1,
    _numDynamicSpritesTS1: 0,
    chairEntryFlags: 0,
    tileWidth: 0,
    inhibitSuitCopying: 0,
    buildModeType: 0,
    originalGuid: 1285469901,
    objectModelGuid: 0,
    buildModeSubSort: 0,
    _thumbnailGraphicTS1: 32,
    _shadowFlagsTS1: 0,
    footprintMask: 0,
    _hole2: 0,
    _shadowBrightnessTS1: 0,
    _hole3: 0,
    _wallStyleSpriteIdTS1: 0,
    hungerRating: 0,
    comfortRating: 0,
    hygieneRating: 0,
    bladderRating: 0,
    energyRating: 0,
    funRating: 0,
    roomRating: 0,
    skillFlags: 0,
    numTypeAttributes: 0,
    miscFlags: 0,
    _typeAttrGuidTS1: 0,
    functionSubSort: 0,
    downtownSort: 0,
    keepBuying: 0,
    vacationSort: 0,
    resetLotAction: 0,
    '3dObjectType': 0,
    communitySort: 0,
    dreamFlags: 0,
  },
};

const filePath = path.join(__dirname, 'fixtures/valid.objd');

describe('OBJD', () => {
  it('can deserialize OBJD files', async () => {
    const buf = (await fs.readFile(filePath)).buffer;
    expect(deserialize(buf)).toEqual(fileData);
  });

  it('can serialize OBJD files', async () => {
    const serializedFile = serialize(fileData);
    await expect(serializedFile).toMatchFile(filePath);
  });
});
