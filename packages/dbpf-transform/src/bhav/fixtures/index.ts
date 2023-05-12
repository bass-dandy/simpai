const errorTgtShort = 0xFD;
const trueTgtShort = 0xFE;
// const falseTgtShort = 0xFF;

const errorTgtLong = 0xFFFC;
const trueTgtLong = 0xFFFD;
// const falseTgtLong = 0xFFFE;

export const testData = [
  {
    filename: 'Interaction - Choose Family',
    format: 0x8002,
    type: 0,
    argCount: 1,
    localCount: 0,
    headerFlag: 4,
    treeVersion: 1,
    instructions: [
      {
        opcode: 2,
        gotoOnTrue: trueTgtShort,
        gotoOnFalse: errorTgtShort,
        nodeVersion: undefined,
        operands: [5, 0, 0, 0, 0, 5, 1, 9],
        cacheFlags: undefined,
      },
    ],
  },
  {
    filename: 'Function - Main',
    format: 0x8006,
    type: 0,
    argCount: 0,
    localCount: 0,
    headerFlag: 0,
    treeVersion: 0xFFFF8006,
    instructions: [
      {
        opcode: 0x2004,
        gotoOnTrue: 0,
        gotoOnFalse: errorTgtShort,
        nodeVersion: 0,
        operands: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0, 0, 0, 0, 0],
        cacheFlags: undefined,
      },
    ],
  },
  {
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
        gotoOnFalse: errorTgtLong,
        nodeVersion: 1,
        operands: [255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        opcode: 2,
        gotoOnTrue: trueTgtLong,
        gotoOnFalse: errorTgtLong,
        nodeVersion: 0,
        operands: [0, 0, 6, 95, 0, 9, 2, 26, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
];
