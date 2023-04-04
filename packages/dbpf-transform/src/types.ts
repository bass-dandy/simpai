import {TYPE_ID} from './consts.js';

export type BconContent = {
	filename: string;
	flag: boolean;
	itemCount: number;
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
	count: number;
	type: number;
	argc: number;
	locals: number;
	headerFlag: number;
	treeVersion: number;
	instructions: BhavInstruction[];
};

export type GlobContent = {
	filename: string;
	length: number;
	semiglobal: string;
};

export type ObjdContent = {
	filename: string;
	type: number;
	guid: number;
	proxyGuid: number;
	originalGuid: number;
	data: number[];
};

export type ObjfContent = {
	filename: string;
	header: number[];
	count: number;
	functions: {
		guard: number;
		action: number;
	}[];
};

export type StrContent = {
	filename: string;
	formatCode: number;
	stringSetCount: number;
	stringSets: {
		languageId: number;
		value: string;
		description: string;
	}[];
};

export type TtabMotiveTable = {
	groups: {
		items: (
			number | { values: number[] }
		)[];
	}[];
};

export type TtabContent = {
	filename: string;
	header: number[];
	items: {
		action: number;
		guard: number;
		counts?: number[];
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
	trailer: number[];
};

export type TrcnContent = {
	filename: string;
	header: number[];
	itemCount: number;
	items: {
		used: number;
		id: number;
		name: string;
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
	content?: SimsFileContent;
};

export type BconFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.BCON; };
	content: BconContent;
};

export function isBconFile(file: SimsFile): file is BconFile {
	return file.meta.typeId === TYPE_ID.BCON;
}

export type BhavFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.BHAV; };
	content: BhavContent;
};

export function isBhavFile(file: SimsFile): file is BhavFile {
	return file.meta.typeId === TYPE_ID.BHAV;
}

export type GlobFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.GLOB; };
	content: GlobContent;
};

export function isGlobFile(file: SimsFile): file is GlobFile {
	return file.meta.typeId === TYPE_ID.GLOB;
}

export type NrefFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.NREF; };
	content: NrefContent;
};

export function isNrefFile(file: SimsFile): file is NrefFile {
	return file.meta.typeId === TYPE_ID.NREF;
}

export type ObjdFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.OBJD; };
	content: ObjdContent;
};

export function isObjdFile(file: SimsFile): file is ObjdFile {
	return file.meta.typeId === TYPE_ID.OBJD;
}

export type ObjfFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.OBJF; };
	content: ObjfContent;
};

export function isObjfFile(file: SimsFile): file is ObjfFile {
	return file.meta.typeId === TYPE_ID.OBJF;
}

export type StrFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.STR | typeof TYPE_ID.CTSS; };
	content: StrContent;
};

export function isStrFile(file: SimsFile): file is StrFile {
	return file.meta.typeId === TYPE_ID.STR
		|| file.meta.typeId === TYPE_ID.CTSS
		|| file.meta.typeId === TYPE_ID.TTAS;
}

export type TtabFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.TTAB; };
	content: TtabContent;
};

export function isTtabFile(file: SimsFile): file is TtabFile {
	return file.meta.typeId === TYPE_ID.TTAB;
}

export type TprpFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.TPRP; };
	content: TprpContent;
};

export function isTprpFile(file: SimsFile): file is TprpFile {
	return file.meta.typeId === TYPE_ID.TPRP;
}

export type TrcnFile = SimsFile & {
	meta: SimsFileMeta & { typeId: typeof TYPE_ID.TRCN; };
	content: TrcnContent;
};


export function isTrcnFile(file: SimsFile): file is TrcnFile {
	return file.meta.typeId === TYPE_ID.TRCN;
}

export type BinFile = SimsFile & { content: ArrayBuffer; };

export function isBinFile(file: SimsFile): file is BinFile {
	Object.values(TYPE_ID).forEach((typeId) => {
		if (file.meta.typeId === typeId) {
			return false;
		}
	});
	return true;
}
