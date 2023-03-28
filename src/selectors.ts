import type {PackagesStore, Resource} from './types';

function isDirty(resource?: Resource): boolean {
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

			return activeResourceId
				? this.activePackage()?.resources[activeResourceId]
				: undefined;
		},

		openResourceIds() {
			const resources = this.activePackage()?.resources;

			return resources
				? Object.keys(resources).filter((key) => resources[key]?.isOpen)
				: [];
		},

		resourceById(resourceId: string) {
			return this.activePackage()?.resources[resourceId];
		},

		isDirty(resourceId?: string) {
			const tgt = resourceId ?? this.activeResourceId();
			return tgt ? isDirty(this.resourceById(tgt)) : false;
		},

		isPackageDirty(packageId?: string) {
			const pkg = store.packages[packageId ?? store.activePackageId];
			return Object.values(pkg?.resources ?? {}).some(isDirty);
		},
	};
}
