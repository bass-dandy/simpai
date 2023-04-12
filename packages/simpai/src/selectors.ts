import { TYPE_ID, type SimsFile } from 'dbpf-transform';
import type { PackagesStore, Resource } from './types';

function isDirty<T extends SimsFile>(resource?: Resource<T>): boolean {
  return resource?.contentChanges !== undefined || resource?.metaChanges !== undefined;
}

export function select(store: PackagesStore) {
  return {
    activePackage() {
      return store.packages[store.activePackageId];
    },

    activeResourceId() {
      return this.activePackage()?.activeResourceId;
    },

    activeResource() {
      const activeResourceId = this.activeResourceId();

      return activeResourceId ? this.activePackage()?.resources[activeResourceId] : undefined;
    },

    openResourceIds() {
      const resources = this.activePackage()?.resources;

      return resources ? Object.keys(resources).filter((key) => resources[key]?.isOpen) : [];
    },

    resourceById<T extends SimsFile>(resourceId?: string): Resource<T> | undefined {
      return resourceId ? this.activePackage()?.resources[resourceId] : undefined;
    },

    isDirty(resourceId?: string) {
      const tgt = resourceId ?? this.activeResourceId();
      return tgt ? isDirty(this.resourceById(tgt)) : false;
    },

    isPackageDirty(packageId?: string) {
      const pkg = store.packages[packageId ?? store.activePackageId];
      return Object.values(pkg?.resources ?? {}).some(isDirty);
    },

    linkedResourceId(fileType: keyof typeof TYPE_ID) {
      const activePackage = select(store).activePackage();
      const activeResource = select(store).activeResource();

      return Object.entries(activePackage?.resources ?? {})
        .find(([, resource]) =>
          resource.meta.typeId === TYPE_ID[fileType]
            && resource.meta.instanceId === activeResource?.meta.instanceId
            && resource.meta.instanceId2 === activeResource?.meta.instanceId2
        )?.[0];
    },
  };
}
