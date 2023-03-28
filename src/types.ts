import type {SimsFile, SimsFileContent, SimsFileMeta} from 'dbpf-transform/dist/types/types';

export type Resource = SimsFile & {
	contentChanges?: SimsFileContent;
	metaChanges?: SimsFileMeta;
	isOpen?: boolean;
};

export type Package = {
	filename: string;
	activeResourceId: string;
	resources: Record<string, Resource>;
};

export type PackagesStore = {
	activePackageId: string;
	packages: Record<string, Package>;
};
