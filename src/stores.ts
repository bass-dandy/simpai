import {deserialize} from 'dbpf-transform';
import {derived, writable} from 'svelte/store';
import {without} from './util';

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
		openResourceIndexesStore.update((store) => [...store, []]);
	},

	removePackage(index: number): void {
		packagesStore.update((store) => without(store, index));

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

const openResourceIndexesStore = writable<number[][]>([]);

// the open resources of the active package
const openResourcesStore = derived([
	activePackage,
	activePackageIndex,
	openResourceIndexesStore,
], ([$activePackage, $activePackageIndex, $openResourceIndexes]) => {
	return $openResourceIndexes[$activePackageIndex]?.map((resourceIndex) =>
		$activePackage?.files[resourceIndex]
	) || [];
});

export const openResources = {
	subscribe: openResourcesStore.subscribe,

	openResource(i: number): void {
		// outer update is a no-op so we can use the packageIndex
		activePackageIndex.update((packageIndex) => {
			// append the resource index to the open resources in the active package (or do nothing if it's already open)
			openResourceIndexesStore.update((openResourceIndexes) => {
				if (openResourceIndexes[packageIndex].includes(i)) {
					return openResourceIndexes;
				}
				const newVal = [...openResourceIndexes];
				newVal[packageIndex] = [...newVal[packageIndex], i];
				return newVal;
			});
			// set the newly opened resource as active for the active package
			activeResourceIndexesStore.update((activeResourceIndexes) => {
				const newVal = [...activeResourceIndexes];
				newVal[packageIndex] = i;
				return newVal;
			});
			return packageIndex;
		});
	},

	closeResource(i: number): void {
		// another no-op so we can use the packageIndex
		activePackageIndex.update((packageIndex) => {
			let newActiveIndex = 0;

			// remove resource index from the active package's array
			openResourceIndexesStore.update((openResourceIndexes) => {
				const newVal = [...openResourceIndexes];
				newVal[packageIndex] = newVal[packageIndex].filter((index) => index !== i);
				newActiveIndex = Math.min(newVal[packageIndex].length - 1, i);
				return newVal;
			});
			// set new active resource
			activeResourceIndexesStore.update((activeResourceIndexes) => {
				const newVal = [...activeResourceIndexes];
				newVal[packageIndex] = newActiveIndex;
				return newVal;
			});
			return packageIndex;
		});
	},
};

const activeResourceIndexesStore = writable<number[]>([]);

const activeResourceIndexStore = derived([
	activePackageIndex,
	activeResourceIndexesStore,
], ([$activePackageIndex, $activeResourceIndexes]) => $activeResourceIndexes[$activePackageIndex]) || [];

export const activeResourceIndex = {
	subscribe: activeResourceIndexStore.subscribe,

	set(i: number): void {
		// another no-op so we can use the packageIndex
		activePackageIndex.update((packageIndex) => {
			activeResourceIndexesStore.update((activeResourceIndexes) => {
				const newVal = [...activeResourceIndexes];
				newVal[packageIndex] = i;
				return newVal;
			});
			return packageIndex;
		});
	},
};

export const activeResource = derived([
	activePackage,
	activeResourceIndexStore,
], ([$activePackage, $activeResourceIndex]) => $activePackage?.files[$activeResourceIndex]);
