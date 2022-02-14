import type {PackagesStore, Package, Resource} from './types';

function isDirty(resource: Resource): boolean {
	return resource?.contentChanges !== undefined || resource?.metaChanges !== undefined;
}

export function select(store: PackagesStore) {
	return {
		activePackage(): Package {
			return store.packages[store.activePackageId];
		},

		activeResourceId(): string {
			return this.activePackage().activeResourceId;
		},

		activeResource(): Resource {
			return this.activePackage()?.resources[this.activeResourceId()];
		},

		openResourceIds(): string[] {
			const {resources} = this.activePackage();

			return Object
				.keys(resources)
				.filter((key) => resources[key].isOpen);
		},

		resourceById(resourceId: string): Resource {
			return this.activePackage()?.resources[resourceId];
		},

		isDirty(resourceId: string): boolean {
			return isDirty(
				this.resourceById(resourceId ?? this.activeResourceId())
			);
		},

		isPackageDirty(packageId?: string): boolean {
			const pkg = store.packages[packageId ?? store.activePackageId];
			return Object.values(pkg.resources).some(isDirty);
		},
	};
}
