import {deserialize} from 'dbpf-transform';
import produce from 'immer';
import {derived, writable} from 'svelte/store';
import {v4 as uuid} from 'uuid';

import type {SimsFile} from 'dbpf-transform/dist/esm/types';

// tracks all open .package files
const packagesStore = writable<{
	activePackageId: string;
	packages: Record<string, {
		filename: string;
		activeResourceId: string;
		resources: Record<string, SimsFile & { isOpen?: boolean }>;
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
		packagesStore.update((store) => (
			produce(store, (draft) => {
				// if closing the currently active package, activate the package to the left (if it exists)
				if (idToRemove === store.activePackageId) {
					const packageIds = Object.keys(store);

					draft.activePackageId = packageIds[
						Math.max(packageIds.indexOf(idToRemove) - 1, 0)
					] ?? '';
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

	closeResource(resourceId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				draft.packages[store.activePackageId].resources[resourceId].isOpen = false;
			})
		));
	},

	copyActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const activePkg = store.packages[store.activePackageId];
				const resourceToCopy = activePkg.resources[activePkg.activeResourceId];
				const newId = uuid();

				draft.packages[store.activePackageId].resources[newId] = {...resourceToCopy};
				draft.packages[store.activePackageId].activeResourceId = newId;
			})
		));
	},

	deleteActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const activePkg = store.packages[store.activePackageId];

				const resourceIds = Object
					.keys(activePkg.resources)
					.filter((resourceId) => activePkg.resources[resourceId].isOpen);

				// activate resource to the left (if one exists)
				draft.packages[store.activePackageId].activeResourceId =
					resourceIds.filter((resourceId) => resourceId !== activePkg.activeResourceId)[
						Math.max(resourceIds.indexOf(activePkg.activeResourceId) - 1, 0)
					] ?? '';

				delete draft.packages[store.activePackageId].resources[activePkg.activeResourceId];
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
