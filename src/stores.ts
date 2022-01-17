import {deserialize} from 'dbpf-transform';
import {derived, writable} from 'svelte/store';

// tracks all open .package files
const packagesStore = writable([]);

export const packages = {
	subscribe: packagesStore.subscribe,

	async addPackage(file: File): Promise<void> {
		const newPackage = {
			name: file.name,
			files: deserialize(await file.arrayBuffer()),
		};
		packagesStore.update((store) => [...store, newPackage]);
	},

	removePackage(index: number): void {
		packagesStore.update((store) => [
			...store.slice(0, index),
			...store.slice(index + 1),
		]);
	},
};

// tracks the index of the currently selected .package file in packagesStore
const activePackageIndexStore = writable(0);

// for conveniently accessing the currently selected package
const activePackageStore = derived([
	packagesStore,
	activePackageIndexStore,
], ([$packages, $activePackageIndex]) => $packages[$activePackageIndex]);

export const activePackage = {
	subscribe: activePackageStore.subscribe,
	set: activePackageIndexStore.set,
	update: activePackageIndexStore.update,
};

// tracks the index of the currently selected resource in activePackage.files (-1 means none selected)
const activeResourceIndexStore = writable(-1);

// for conveniently accessing the currently selected resource in the currently selected package
const activeResourceStore = derived([
	activePackage,
	activeResourceIndexStore,
], ([$activePackage, $activeResourceIndex]) => $activePackage?.files[$activeResourceIndex]);

export const activeResource = {
	subscribe: activeResourceStore.subscribe,
	set: activeResourceIndexStore.set,
	update: activeResourceIndexStore.update,
};
