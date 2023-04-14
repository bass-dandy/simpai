import type { ObjdContent } from 'dbpf-transform';

// ordered by bit offset
export const roomSortFlags = [
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Living room',
  'Outside',
  'Dining room',
  'Misc.',
  'Study',
  'Kids',
] as const;

// ordered by bit offset
export const functionSortFlags = [
  'Seating',
  'Surfaces',
  'Appliances',
  'Electronics',
  'Plumbing',
  'Decorative',
  'General',
  'Lights',
  'Hobbies',
  'Aspiration',
  'Career',
] as const;

// arrays ordered by bit offset; null = unused/unknown; empty array = no subsort
export const functionSubSort: Record<
  typeof functionSortFlags[number],
  readonly (string | null)[]
> = {
  Seating: [
    'Dining room',
    'Living room',
    'Sofas',
    'Beds',
    'Recreation',
    null,
    null,
    'Misc.',
  ],
  Surfaces: [
    'Counter',
    'Table',
    'End table',
    'Desk',
    'Coffee table',
    'Shelf',
    null,
    'Misc.',
  ],
  Appliances: [
    'Cooking',
    'Refrigerator',
    'Small',
    'Large',
    null,
    null,
    null,
    'Misc.',
  ],
  Electronics: [
    'Entertainment',
    'TV & computer',
    'Audio',
    'Small',
    null,
    null,
    null,
    'Misc.',
  ],
  Plumbing: [
    'Toilet',
    'Shower',
    'Sink',
    'Hot tub',
    null,
    null,
    null,
    'Misc.',
  ],
  Decorative: [
    'Wall',
    'Sculpture',
    'Rug',
    'Plant',
    'Mirror',
    'Curtain',
    null,
    'Misc.',
  ],
  General: [
    null,
    'Dresser',
    null,
    'Party',
    'Child',
    'Car',
    'Pets',
    'Misc.',
  ],
  Lights: [
    'Table lamp',
    'Floor lamp',
    'Wall lamp',
    'Ceiling lamp',
    'Outdoor',
    null,
    null,
    'Misc.',
  ],
  Hobbies: [
    'Creativity',
    'Knowledge',
    'Excercise',
    'Recreation',
    null,
    null,
    null,
    'Misc.',
  ],
  Aspiration: [],
  Career: [],
} as const;

// ordered by bit offset
export const skillFlags = [
  'Cleaning',
  'Cooking',
  'Mechanical',
  'Logic',
  'Body',
  'Creativity',
  'Charisma',
  'School study',
] as const;

// ordered by value, null = unused/unknown
export const objectTypes = [
  'Unknown',
  null,
  'Person',
  null,
  'Normal',
  'Architectural support',
  null,
  'Sim type',
  'Door',
  'Window',
  'Stairs',
  'Modular stairs',
  'Modular stairs portal',
  'Vehicle',
  'Outfit',
  'Memory',
  'Template',
  null,
  null,
  'Tiles',
] as const;

type ObjdProperty = keyof ObjdContent['data'];

export const rawDataGroups = {
  'OBJD File': [
    'version',
  ] as ObjdProperty[],
  'Catalog price': [
    'price',
    'isSalePriceDifferent', // salePrice?
    'initialSaleDepreciation',
    'dailySaleDepreciation',
    'isSelfDepreciating',
    'depreciationLimit',
  ] as ObjdProperty[],
  'Catalog sort': [
    'catalogUseFlags',
    'roomSortFlags',
    'functionSortFlags',
    'expansionFlag',
    'buildModeType',
    'buildModeSubSort',
    'functionSubSort',
    'downtownSort',
    'vacationSort',
    'communitySort',
  ] as ObjdProperty[],
  'Catalog ratings': [
    'hungerRating',
    'comfortRating',
    'hygieneRating',
    'bladderRating',
    'energyRating',
    'funRating',
    'roomRating',
    'skillFlags',
    // scratchRating
    // chewRating
  ] as ObjdProperty[],
  'User placement': [
    'defaultWallAdjacentFlags',
    'defaultPlacementFlags',
    'defaultWallPlacementFlags',
    'defaultAllowedHeightFlags',
    'useDefaultPlacementFlags',
    'noDuplicateOnPlacement',
    'keepBuying',
  ] as ObjdProperty[],
  'Mesh and graphics': [
    'multiTileMasterId',
    'multiTileSubIndex',
    'levelOffset',
    'hasShadow', //shadowType?
    'frontDirection',
    'multiTileLeadObject',
    'chairEntryFlags',
    'tileWidth',
    'footprintMask',
    // extendFootprint
    // objectSize (qty per shelf)
    '3dObjectType',
  ] as ObjdProperty[],
  'Resource cross-refs': [
    'ttabId',
    'interactionGroup',
    'strId',
    'slotId',
    'slotGroup',
    'ctssId',
    'defaultThumbnailId',
    'motiveEffectsId',
    'catalogPopupId',
    // defaultGraphic
  ] as ObjdProperty[],
  'GUIDs': [
    'guid',
    'diagonalSelectorGuid',
    'gridSelectorGuid',
    'proxyGuid',
    'jobObjectGuid',
    'originalGuid',
  ] as ObjdProperty[],
  'Data space': [
    'initialStackSize',
    'attributeCount',
    'objectArrayCount',
    'numTypeAttributes',
  ] as ObjdProperty[],
  'Memories & wants': [
    'aspirationFlags',
    'memoryNiceOrBad',
    'wantCategory',
  ] as ObjdProperty[],
  'Miscellaneous': [
    'objectType',
    'lookAtScore',
    'isUnlockable',
    'objectOwnership',
    'ignoreGlobalSimInCAS',
    'cannotMoveOutWith',
    'hauntable',
    'isGlobalSimObject',
    'tooltipNameType',
    'templateVersion',
    'nicenessMultiplier',
    'noNewNameFromTemplate',
    'objectVersion',
    'ignoreCurrentModelIndexInIcons',
    // forSaleFlags
    'inhibitSuitCopying',
    // not sure anymore
    // selectorCategory
    // selectorSubcategory
    'miscFlags',
    'resetLotAction',
    'dreamFlags',
    // thumbnailFlags
    // requirements
  ] as ObjdProperty[],
} as const;
