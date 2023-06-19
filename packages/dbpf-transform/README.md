# dbpf-transform

Browser-friendly TypeScript library for serializing and deserializing DBPF package files used by The Sims 2*

*This may or may not work for DBPF files used by other EA games from that era, I've only tested The Sims 2!

[Note: this package is experimental. Minor version upgrades denote breaking changes.]

## Usage

```ts
// it's not necessary to import the type here, this is just for demonstration
import { deserialize, serialize, type SimsFile } from 'dbpf-transform';

const inputPackageFile: ArrayBuffer = <an ArrayBuffer representing a .package file>;

const resources: SimsFile[] = deserialize(inputPackageFile);

const outputPackageFile: ArrayBuffer = serialize(resources);
```

## Supported resource types

The output `SimsFile` array is an array of various types of deserialized DBPF resources of the form:

```ts
type SimsFile = {
	meta: {
		typeId: string;
		groupId: number;
		instanceId: number;
		instanceId2?: number; // undefined for DBPF version 1.1, defined for DBPF version 1.2
		location: number;
		size: number;
		isCompressed?: boolean;
	},
	content: <variable>
}
```

If there is no handler defined for a resource type, `content` will be an `ArrayBuffer` containing the original serialized resource data.

If there is a handler defined, the type of `content` will vary by resource type.

Currently supported resource types:
- [BCON](#bcon)
- [BHAV](#bhav)
- [GLOB](#glob)
- [NREF](#nref)
- [OBJD](#objd)
- [OBJF](#objf)
- [STR](#str)
- [TPRP](#tprp)
- [TRCN](#trcn)
- [TTAB](#ttab)

### BCON
```ts
type BconContent = {
	filename: string;
	flag: boolean;
	items: number[];
}
```

### BHAV
```ts
type BhavContent = {
	filename: string;
	format: number;
	type: number;
	argCount: number;
	localCount: number;
	headerFlag: number;
	treeVersion: number;
	cacheFlags?: number;
	instructions: {
		opcode: number;
		gotoOnTrue: number;
		gotoOnFalse: number;
		nodeVersion?: number;
		operands: number[];
	}[];
}
```

### GLOB
```ts
type GlobContent = {
	filename: string;
	semiglobal: string;
}
```

### NREF
```ts
type NrefContent = {
	filename: string;
}
```

### OBJD
```ts
type ObjdContent = {
	filename: string;
	data: // see src/objd/consts.ts
}
```

### OBJF
```ts
type ObjfContent = {
	filename: string;
	header: number[];
	functions: {
		guard: number;
		action: number;
	}[];
}
```

### STR
```ts
type StrContent = {
	filename: string;
	formatCode: number;
	stringSets: {
		languageId: number;
		value: string;
		description: string;
	}[];
}
```

### TPRP
```ts
type TprpContent = {
	filename: string;
	header: number[];
	params: {
		label: string;
		pdata: number;
	}[];
	locals: string[];
};
```

### TRCN
```ts
type TrcnContent = {
	filename: string;
	version: number;
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
```

### TTAB
```ts
type HumanMotiveTable = {
	groups: {
		items: {
			min: number;
			delta: number;
			type: number;
		}[];
	}[];
}

type AnimalMotiveTable = {
	groups: {
		items: ({
			min: number;
			delta: number;
			type: number;
		}[])[];
	}[];
};

type TtabContent = {
	filename: string;
	format: number;
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
		humanGroups: HumanMotiveTable;
		animalGroups: AnimalMotiveTable | null;
	}[];
}
```

More information about each resource type can be found at [modthesims](https://modthesims.info/wiki.php?title=List_of_Formats_by_Name)

## Exported types

This package exports each resource content type, along with their associated type guards and some other useful types. To see all exported types, [check out the types file](https://github.com/bass-dandy/dbpf-transform/blob/main/src/types.ts)!
