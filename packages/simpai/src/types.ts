import type { SimsFile } from 'dbpf-transform';

export type Resource<T extends SimsFile = SimsFile> = SimsFile & {
  content: T['content'];
  meta: T['meta'];
  contentChanges?: T['content'];
  metaChanges?: T['meta'];
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
