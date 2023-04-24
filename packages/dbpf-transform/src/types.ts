import { keyToWordLength } from './objd/consts.js';
import { TYPE_ID } from './consts.js';

export type BconContent = {
  filename: string;
  flag: boolean;
  items: number[];
};

export type BhavInstruction = {
  opcode: number;
  gotoOnTrue: number;
  gotoOnFalse: number;
  nodeVersion?: number;
  cacheFlags?: number;
  operands: number[];
};

export type BhavContent = {
  filename: string;
  format: number;
  type: number;
  argCount: number;
  localCount: number;
  headerFlag: number;
  treeVersion: number;
  instructions: BhavInstruction[];
};

export type GlobContent = {
  filename: string;
  semiglobal: string;
};

export type ObjdContent = {
  filename: string;
  data: {
    [key in keyof typeof keyToWordLength]: number;
  };
};

export type ObjfContent = {
  filename: string;
  header: number[];
  functions: {
    guard: number;
    action: number;
  }[];
};

export type StrContent = {
  filename: string;
  formatCode: number;
  stringSets: {
    languageId: number;
    value: string;
    description: string;
  }[];
};

export type TtabMotiveTable = {
  groups: {
    items: {
      min: number;
      delta: number;
      type: number;
    }[];
  }[];
};

export type TtabContent = {
  filename: string;
  format: number;
  items: {
    action: number;
    guard: number;
    flags: number;
    flags2: number;
    strIndex: number;
    attenuationCode: number;
    attenuationValue: number;
    autonomy: number;
    joinIndex: number;
    uiDisplayType: number;
    facialAnimation: number;
    memoryIterMult: number;
    objectType: number;
    modelTableId: number;
    humanGroups: TtabMotiveTable;
    animalGroups: TtabMotiveTable | null;
  }[];
};

export type TprpContent = {
  filename: string;
  header: number[];
  params: {
    label: string;
    pdata: number;
  }[];
  locals: string[];
};

export type TrcnContent = {
  filename: string;
  version: number,
  items: {
    used: number;
    constId: number;
    constName: string;
    desc: string;
    value: number;
    minValue: number;
    maxValue: number;
  }[];
};

export type NrefContent = {
  filename: string;
};

export type SimsFileMeta = {
  typeId: string;
  groupId: number;
  instanceId: number;
  instanceId2?: number;
  location: number;
  size: number;
  compressed?: boolean;
};

export type SimsFileContent =
  | BconContent
  | BhavContent
  | GlobContent
  | NrefContent
  | ObjdContent
  | ObjfContent
  | StrContent
  | TtabContent
  | TprpContent
  | TrcnContent
  | ArrayBuffer;

export type SimsFile = {
  meta: SimsFileMeta;
  content: SimsFileContent;
};

export type BconFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.BCON };
  content: BconContent;
};

export function isBconFile(file: SimsFile): file is BconFile {
  return file.meta.typeId === TYPE_ID.BCON;
}

export type BhavFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.BHAV };
  content: BhavContent;
};

export function isBhavFile(file: SimsFile): file is BhavFile {
  return file.meta.typeId === TYPE_ID.BHAV;
}

export type GlobFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.GLOB };
  content: GlobContent;
};

export function isGlobFile(file: SimsFile): file is GlobFile {
  return file.meta.typeId === TYPE_ID.GLOB;
}

export type NrefFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.NREF };
  content: NrefContent;
};

export function isNrefFile(file: SimsFile): file is NrefFile {
  return file.meta.typeId === TYPE_ID.NREF;
}

export type ObjdFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.OBJD };
  content: ObjdContent;
};

export function isObjdFile(file: SimsFile): file is ObjdFile {
  return file.meta.typeId === TYPE_ID.OBJD;
}

export type ObjfFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.OBJF };
  content: ObjfContent;
};

export function isObjfFile(file: SimsFile): file is ObjfFile {
  return file.meta.typeId === TYPE_ID.OBJF;
}

export type StrFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.STR | typeof TYPE_ID.CTSS };
  content: StrContent;
};

export function isStrFile(file: SimsFile): file is StrFile {
  return (
    file.meta.typeId === TYPE_ID.STR ||
    file.meta.typeId === TYPE_ID.CTSS ||
    file.meta.typeId === TYPE_ID.TTAS
  );
}

export type TtabFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.TTAB };
  content: TtabContent;
};

export function isTtabFile(file: SimsFile): file is TtabFile {
  return file.meta.typeId === TYPE_ID.TTAB;
}

export type TprpFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.TPRP };
  content: TprpContent;
};

export function isTprpFile(file: SimsFile): file is TprpFile {
  return file.meta.typeId === TYPE_ID.TPRP;
}

export type TrcnFile = SimsFile & {
  meta: SimsFileMeta & { typeId: typeof TYPE_ID.TRCN };
  content: TrcnContent;
};

export function isTrcnFile(file: SimsFile): file is TrcnFile {
  return file.meta.typeId === TYPE_ID.TRCN;
}
