export const TYPE_ID = {
	// file types with handlers
	BCON: '42434f4e',
	BHAV: '42484156',
	CTSS: '43545353',
	DIR:  'e86b1eef',
	GLOB: '474c4f42',
	NREF: '4e524546',
	OBJD: '4f424a44',
	OBJF: '4f424a66',
	STR:  '53545223',
	TPRP: '54505250',
	TRCN: '5452434e',
	TTAB: '54544142',
	TTAS: '54544173',
	VERS: 'ebfee342',

	// file types without handlers
	'2ARY':  '6b943b43',
	'3ARY':  '2a51171b',
	'5DS':   'ac06a676',
	'5EL':   '6a97042f',
	'5LF':   'ac06a66f',
	'5SC':   '25232b11',
	ANIM:    'fb00791e',
	BMP:     '424d505f',
	CATS:    '43415453',
	CIGE:    '43494745',
	CINE:    '4d51f042',
	CREG:    'cdb467b8',
	CRES:    'e519c933',
	DGRP:    '44475250',
	FACE:    '46414345',
	FAMI:    '46414d49',
	FAMh:    '46414d68',
	FAMt:    '8c870743',
	FCNS:    '46434e53',
	FPL:     'ab4ba572',
	FWAV:    '46574156',
	FX:      'ea5118b0',
	GMDC:    'ac4f8687',
	GMND:    '7ba3838c',
	HOUS:    '484f5553',
	INI:     '2026960b',
	JFIF:    '8c3ce95a',
	LGHT1:   'c9c81b9b',
	LGHT2:   'c9c81ba3',
	LGHT3:   'c9c81ba9',
	LGHT4:   'c9c81bad',
	LIFO:    'ed534136',
	LTXT:    '0bf999e7',
	LXNR:    'cccef852',
	MATSHAD: 'cd7fe87a',
	MP3:     '2026960b',
	MOBJT:   '6f626a74',
	NGBH:    '4e474248',
	NHTG:    'abcb5da4',
	NHTR:    'abd0dc63',
	NID:     'ac8a7a2e',
	NMAP:    '4e6d6150',
	OBJT:    'fa1c39f7',
	OBJM:    '4f626a4d',
	PALT:    '50414c54',
	PDAT:    'aace2efb',
	PERS:    '50455253',
	PMAP:    '8cc0a14b',
	PNG:     '856ddbac',
	POOL:    '0c900fdb',
	POSI:    '504f5349',
	PTBP:    '50544250',
	SFX:     '8db5e4c2',
	SHPE:    'fc6eb1f7',
	SIMI:    '53494d49',
	SKIN:    'ac506764',
	SLOT:    '534c4f54',
	SMAP:    'cac4fc40',
	SPR2:    '53505232',
	SPX1:    '2026960b',
	SREL:    'cc364c2a',
	STXR:    'ace46235',
	SWAF:    'cd95548e',
	TATT:    '54415454',
	TGA:     '856ddbac',
	TMAP:    '4b58975b',
	TREE:    '54524545',
	TRKS:    '0b9eb87e',
	TSSG:    'ba353ce1',
	TXMT:    '49596978',
	TXTR:    '1c4a276c',
	UI:      '00000000',
	VERT:    'cb4387a1',
	WFR:     'cd95548e',
	WGRA:    '0a284d0b',
	WLL:     '8a84d7b0',
	WRLD:    '49ff7d76',
	XA:      '2026960b',
	XMTO:    '584d544f',
	XOBJ:    '584f424a',
} as const;

type FileType = keyof typeof TYPE_ID;

const TYPE_ID_INVERTED = Object
	.entries(TYPE_ID)
	.reduce((acc: Record<string, FileType>, [type, id]) => {
		acc[id] = type as FileType;
		return acc;
	}, {});

// expose function instead of const so we can normalize the provided typeId
export function getFileType(typeId: string | number): FileType | 'UNK' {
	const normalizedId = typeof typeId === 'number'
		? typeId.toString(16)
		: typeId.toLowerCase();

	return TYPE_ID_INVERTED[normalizedId] ?? 'UNK';
}
