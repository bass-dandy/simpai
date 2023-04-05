import type { TYPE_ID, SimsFileContent } from 'dbpf-transform';

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

const defaultStrData = {
  filename: '',
  stringSets: [
    {
      languageId: 1,
      value: '',
      description: '',
    },
  ],
};

export const defaultFileData: Partial<Record<keyof typeof TYPE_ID, SimsFileContent>> = {
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
    functions: Array.from(Array(55)).map(() => ({
      action: 0,
      guard: 0,
    })),
  },
  TGA: new ArrayBuffer(0),
  JFIF: new ArrayBuffer(0),
  STR: defaultStrData,
  CTSS: defaultStrData,
  TTAS: defaultStrData,
};
