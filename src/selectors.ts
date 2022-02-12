import type {PackagesStore, Package, Resource} from './types';

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
			const resource = this.resourceById(resourceId ?? this.activeResourceId());
			return resource?.contentChanges !== undefined || resource?.metaChanges !== undefined;
		},
	};
}
