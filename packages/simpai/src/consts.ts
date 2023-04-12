import type {
  TYPE_ID,
  BconContent,
  GlobContent,
  NrefContent,
  ObjfContent,
  TrcnContent,
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

export const defaultFileName: Partial<Record<keyof typeof TYPE_ID, string>> = {
  TGA: '[image file]',
  NREF: '[name reference]',
  BCON: '[behavior constant]',
  BHAV: '[behavior function]',
  CTSS: '[catalogue description]',
  GLOB: '[global data]',
  OBJD: '[object data]',
  OBJF: '[object functions]',
  STR: '[text lists]',
};

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
  GLOB: GlobContent;
  NREF: NrefContent;
  OBJF: ObjfContent;
  TRCN: TrcnContent;
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
  GLOB: {
    filename: '',
    semiglobal: '',
  },
  NREF: {
    filename: '',
  },
  OBJF: {
    filename: '',
    header: [0, 0, 0],
    functions: Array.from(Array(55)).map(() => ({
      action: 0,
      guard: 0,
    })),
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
  STR: defaultStrData,
  CTSS: defaultStrData,
  TTAS: defaultStrData,
  TGA: new ArrayBuffer(0),
  JFIF: new ArrayBuffer(0),
} as const;
