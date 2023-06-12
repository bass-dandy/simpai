import type {
  BconContent,
  BhavContent,
  GlobContent,
  NrefContent,
  ObjdContent,
  ObjfContent,
  TprpContent,
  TrcnContent,
  TtabContent,
  StrContent,
} from 'dbpf-transform';
import type { DeepReadonly } from 'ts-essentials';

export const languages = [
  'English (US)',
  'English (UK)',
  'French',
  'German',
  'Italian',
  'Spanish',
  'Dutch',
  'Danish',
  'Swedish',
  'Norwegian',
  'Finnish',
  'Hebrew',
  'Russian',
  'Portuguese',
  'Japanese',
  'Polish',
  'Traditional Chinese',
  'Simplified Chinese',
  'Thai',
  'Korean',
  'Czech',
] as const;

export const objdKeys: (keyof ObjdContent['data'])[] = [
  'version',
  'initialStackSize',
  'defaultWallAdjacentFlags',
  'defaultPlacementFlags',
  'defaultWallPlacementFlags',
  'defaultAllowedHeightFlags',
  'ttabId',
  'interactionGroup',
  'objectType',
  'multiTileMasterId',
  'multiTileSubIndex',
  'useDefaultPlacementFlags',
  'lookAtScore',
  'guid',
  'isUnlockable',
  'catalogUseFlags',
  'price',
  'strId',
  'slotId',
  'diagonalSelectorGuid',
  'gridSelectorGuid',
  'objectOwnership',
  'ignoreGlobalSimInCAS',
  'cannotMoveOutWith',
  'hauntable',
  'proxyGuid',
  'slotGroup',
  'aspirationFlags',
  'memoryNiceOrBad',
  'isSalePriceDifferent',
  'initialSaleDepreciation',
  'dailySaleDepreciation',
  'isSelfDepreciating',
  'depreciationLimit',
  'roomSortFlags',
  'functionSortFlags',
  'ctssId',
  'isGlobalSimObject',
  'tooltipNameType',
  'templateVersion',
  'nicenessMultiplier',
  'noDuplicateOnPlacement',
  'wantCategory',
  'noNewNameFromTemplate',
  'objectVersion',
  'defaultThumbnailId',
  'motiveEffectsId',
  'jobObjectGuid',
  'catalogPopupId',
  'ignoreCurrentModelIndexInIcons',
  'levelOffset',
  'hasShadow',
  'attributeCount',
  'objectArrayCount',
  '_hole0',
  'frontDirection',
  '_hole1',
  'multiTileLeadObject',
  'expansionFlag',
  '_numDynamicSpritesTS1',
  'chairEntryFlags',
  'tileWidth',
  'inhibitSuitCopying',
  'buildModeType',
  'originalGuid',
  'objectModelGuid',
  'buildModeSubSort',
  '_thumbnailGraphicTS1',
  '_shadowFlagsTS1',
  'footprintMask',
  '_hole2',
  '_shadowBrightnessTS1',
  '_hole3',
  '_wallStyleSpriteIdTS1',
  'hungerRating',
  'comfortRating',
  'hygieneRating',
  'bladderRating',
  'energyRating',
  'funRating',
  'roomRating',
  'skillFlags',
  'numTypeAttributes',
  'miscFlags',
  '_typeAttrGuidTS1',
  'functionSubSort',
  'downtownSort',
  'keepBuying',
  'vacationSort',
  'resetLotAction',
  '3dObjectType',
  'communitySort',
  'dreamFlags',
];

const defaultStrData: StrContent = {
  filename: '',
  formatCode: 3,
  stringSets: [
    {
      languageId: 1,
      value: '',
      description: '',
    },
  ],
};

export const defaultFileData: DeepReadonly<{
  BCON: BconContent;
  BHAV: BhavContent;
  GLOB: GlobContent;
  NREF: NrefContent;
  OBJD: ObjdContent;
  OBJF: ObjfContent;
  TPRP: TprpContent;
  TRCN: TrcnContent;
  TTAB: TtabContent;
  STR: StrContent;
  CTSS: StrContent;
  TTAS: StrContent;
  TGA: ArrayBuffer;
  JFIF: ArrayBuffer;
}> = {
  BCON: {
    filename: '',
    flag: false,
    items: [0],
  },
  BHAV: {
    filename: '',
    format: 0x8000,
    type: 0,
    argCount: 0,
    localCount: 0,
    headerFlag: 0,
    treeVersion: 1,
    instructions: [{
      opcode: 0,
      gotoOnTrue: 0xFE,
      gotoOnFalse: 0xFF,
      nodeVersion: undefined,
      operands: [0, 0, 0, 0, 0, 0, 0, 0],
    }],
  },
  GLOB: {
    filename: '',
    semiglobal: '',
  },
  NREF: {
    filename: '',
  },
  OBJD: {
    filename: '',
    data: objdKeys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<keyof ObjdContent['data'], number>),
  },
  OBJF: {
    filename: '',
    header: [0, 0, 0],
    functions: Array.from(Array(55)).map(() => ({
      action: 0,
      guard: 0,
    })),
  },
  TPRP: {
    filename: '',
    header: [0, 0, 0],
    params: [{
      label: '',
      pdata: 0,
    }],
    locals: [''],
  },
  TRCN: {
    filename: '',
    version: 0,
    items: [{
      used: 0,
      constId: 0,
      constName: '',
      desc: '',
      value: 0,
      minValue: 0,
      maxValue: 0,
    }] as const,
  },
  TTAB: {
    filename: '',
    format: 0,
    items: [{
      action: 0,
      guard: 0,
      flags: 0,
      flags2: 0,
      strIndex: 0,
      attenuationCode: 0,
      attenuationValue: 0,
      autonomy: 0,
      joinIndex: 0,
      uiDisplayType: 0,
      facialAnimation: 0,
      memoryIterMult: 0,
      objectType: 0,
      modelTableId: 0,
      humanGroups: {
        groups: [{
          items: [],
        }],
      },
      animalGroups: null,
    }],
  },
  STR: defaultStrData,
  CTSS: defaultStrData,
  TTAS: defaultStrData,
  TGA: new ArrayBuffer(0),
  JFIF: new ArrayBuffer(0),
} as const;
