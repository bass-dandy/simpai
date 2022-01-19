import {deserialize} from 'dbpf-transform';
import {derived, writable} from 'svelte/store';

type Package = {
	name: string;
	files: any[];
};

// tracks the index of the currently selected .package file in packagesStore
export const activePackageIndex = writable(0);

// tracks all open .package files
const packagesStore = writable<Package[]>([]);

export const packages = {
	subscribe: packagesStore.subscribe,

	async addPackage(file: File): Promise<void> {
		const newPackage = {
			name: file.name,
			files: deserialize(await file.arrayBuffer()),
		};
		packagesStore.update((store) => {
			activePackageIndex.set(store.length);
			return [...store, newPackage];
		});
	},

	removePackage(index: number): void {
		packagesStore.update((store) => [
			...store.slice(0, index),
			...store.slice(index + 1),
		]);
		activePackageIndex.update((currentIndex) =>
			index <= currentIndex
				? Math.max(currentIndex - 1, 0)
				: currentIndex
		);
	},
};

// for conveniently accessing the currently selected package
export const activePackage = derived([
	packagesStore,
	activePackageIndex,
], ([$packages, $activePackageIndex]) => $packages[$activePackageIndex]);

// tracks the index of the currently selected resource in activePackage.files (-1 means none selected)
export const activeResourceIndex = writable(-1);

// for conveniently accessing the currently selected resource in the currently selected package
export const activeResource = derived([
	activePackage,
	activeResourceIndex,
], ([$activePackage, $activeResourceIndex]) => {
	return $activeResourceIndex >= 0
		? $activePackage?.files[$activeResourceIndex]
		: undefined;
});
