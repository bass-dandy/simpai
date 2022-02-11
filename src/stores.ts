import {deserialize} from 'dbpf-transform';
import produce from 'immer';
import {derived, writable} from 'svelte/store';
import {v4 as uuid} from 'uuid';

import type {SimsFile} from 'dbpf-transform/dist/esm/types';

function getActiveTabIdAfterClose(tabIdToClose: string, tabIds: string[]): string {
	const newTabIds = tabIds.filter((tabId) => tabId !== tabIdToClose);

	return newTabIds[
		Math.min(tabIds.indexOf(tabIdToClose), newTabIds.length - 1)
	] ?? '';
}

// tracks all open .package files
const packagesStore = writable<{
	activePackageId: string;
	packages: Record<string, {
		filename: string;
		activeResourceId: string;
		resources: Record<string, SimsFile & {
			isOpen?: boolean;
			changes?: any;
		}>;
	}>;
}>({
	activePackageId: '',
	packages: {},
});

export const packages = {
	subscribe: packagesStore.subscribe,

	async addPackage(file: File): Promise<void> {
		// key files in package by uuid
		const keyedFiles = deserialize(await file.arrayBuffer())
			.reduce((acc: Record<string, SimsFile>, file) => {
				acc[uuid()] = file;
				return acc;
			}, {});

		const packageId = uuid();

		packagesStore.update((store) => (
			produce(store, (draft) => {
				draft.packages[packageId] = {
					filename: file.name,
					resources: keyedFiles,
					activeResourceId: '',
				};
				draft.activePackageId = packageId;
			})
		));
	},

	removePackage(idToRemove: string): void {
		if (!window.confirm('Close this package? You\'ll lose all changes.')) {
			return;
		}
		packagesStore.update((store) => (
			produce(store, (draft) => {
				if (idToRemove === store.activePackageId) {
					draft.activePackageId = getActiveTabIdAfterClose(idToRemove, Object.keys(store.packages))
				}
				delete draft.packages[idToRemove];
			})
		));
	},

	setActivePackage(packageId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				draft.activePackageId = packageId;
			})
		));
	},

	openResource(resourceId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				draft.packages[store.activePackageId].resources[resourceId].isOpen = true;
				draft.packages[store.activePackageId].activeResourceId = resourceId;
			})
		));
	},

	closeResource(resourceIdToClose: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {resources, activeResourceId} = store.packages[store.activePackageId];

				if (resources[resourceIdToClose].changes && !window.confirm('Close this resource? You\'ll lose all unsaved changes.')) {
					return;
				}

				const resourceIds = Object
					.keys(resources)
					.filter((resourceId) => resources[resourceId].isOpen);

				if (resourceIdToClose === activeResourceId) {
					draft.packages[store.activePackageId].activeResourceId =
						getActiveTabIdAfterClose(resourceIdToClose, resourceIds);
				}
				draft.packages[store.activePackageId].resources[resourceIdToClose].isOpen = false;
				delete draft.packages[store.activePackageId].resources[resourceIdToClose].changes;
			})
		));
	},

	editActiveResource(changes: any): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {activeResourceId} = store.packages[store.activePackageId];
				draft.packages[store.activePackageId].resources[activeResourceId].changes = changes;
			})
		));
	},

	resetActiveResource(): void {
		if (!window.confirm('Undo all unsaved changes to this resource? This cannot be undone.')) {
			return;
		}
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {activeResourceId} = store.packages[store.activePackageId];
				delete draft.packages[store.activePackageId].resources[activeResourceId].changes;
			})
		));
	},

	saveActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {resources, activeResourceId} = store.packages[store.activePackageId];
				draft.packages[store.activePackageId].resources[activeResourceId].content = resources[activeResourceId].changes;
				delete draft.packages[store.activePackageId].resources[activeResourceId].changes;
			})
		));
	},

	copyActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {resources, activeResourceId} = store.packages[store.activePackageId];
				const resourceToCopy = resources[activeResourceId];
				const newId = uuid();

				draft.packages[store.activePackageId].resources[newId] = {...resourceToCopy};
				draft.packages[store.activePackageId].activeResourceId = newId;
			})
		));
	},

	deleteActiveResource(): void {
		if (!window.confirm('Remove this resource from the package file? This cannot be undone.')) {
			return;
		}
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {resources, activeResourceId} = store.packages[store.activePackageId];

				const resourceIds = Object
					.keys(resources)
					.filter((resourceId) => resources[resourceId].isOpen);

				draft.packages[store.activePackageId].activeResourceId =
					getActiveTabIdAfterClose(activeResourceId, resourceIds);

				delete draft.packages[store.activePackageId].resources[activeResourceId];
			})
		));
	},

	setActiveResource(resourceId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				draft.packages[store.activePackageId].activeResourceId = resourceId;
			})
		));
	},
};

export const activePackage = derived(packagesStore, ($packages) => {
	return $packages.packages[$packages.activePackageId];
});

export const activeResource = derived(packagesStore, ($packages) => {
	const pkg = $packages.packages[$packages.activePackageId];
	return pkg?.resources[pkg.activeResourceId];
});
