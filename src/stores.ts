import {deserialize, serialize} from 'dbpf-transform';
import produce from 'immer';
import {derived, get, writable} from 'svelte/store';
import {v4 as uuid} from 'uuid';

import type {SimsFile, SimsFileMeta, SimsFileContent} from 'dbpf-transform/dist/types/types';

import {select} from './selectors';
import type {PackagesStore} from './types';

function getActiveTabIdAfterClose(tabIdToClose: string, tabIds: string[]): string {
	const newTabIds = tabIds.filter((tabId) => tabId !== tabIdToClose);

	return newTabIds[
		Math.min(tabIds.indexOf(tabIdToClose), newTabIds.length - 1)
	] ?? '';
}

const packagesStore = writable<PackagesStore>({
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
					draft.activePackageId = getActiveTabIdAfterClose(
						idToRemove,
						Object.keys(store.packages)
					);
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

	downloadActivePackage(): void {
		const store = get(packagesStore);
		if (select(store).isPackageDirty() && !window.confirm('This package contains resources with unsaved changes. Download anyway?')) {
			return;
		}
		const activePkg = select(store).activePackage();

		const data = serialize(
			Object.values(activePkg.resources)
		);
		const blob = new Blob([new Uint8Array(data)], { type: 'octet/stream' }),
		url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = activePkg.filename;;
		a.click();

		window.URL.revokeObjectURL(url);
	},

	openResource(resourceId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				select(draft).resourceById(resourceId).isOpen = true;
				select(draft).activePackage().activeResourceId = resourceId;
			})
		));
	},

	closeResource(resourceIdToClose: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {activeResourceId} = select(store).activePackage();

				if (select(store).isDirty(resourceIdToClose) && !window.confirm('Close this resource? You\'ll lose all unsaved changes.')) {
					return;
				}

				const resourceIds = select(store).openResourceIds();

				if (resourceIdToClose === activeResourceId) {
					select(draft).activePackage().activeResourceId =
						getActiveTabIdAfterClose(resourceIdToClose, resourceIds);
				}
				const resourceToClose = select(draft).resourceById(resourceIdToClose);

				resourceToClose.isOpen = false;
				delete resourceToClose.contentChanges;
				delete resourceToClose.metaChanges;
			})
		));
	},

	editActiveResource(contentChanges: SimsFileContent): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				select(draft).activeResource().contentChanges = contentChanges;
			})
		));
	},

	editActiveResourceMeta(metaChanges: SimsFileMeta): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				select(draft).activeResource().metaChanges = metaChanges;
			})
		));
	},

	resetActiveResource(): void {
		if (!window.confirm('Undo all unsaved changes to this resource? This cannot be undone.')) {
			return;
		}
		packagesStore.update((store) => (
			produce(store, (draft) => {
				delete select(draft).activeResource().contentChanges;
				delete select(draft).activeResource().metaChanges;
			})
		));
	},

	saveActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const activeResource = select(draft).activeResource();

				if (activeResource.contentChanges !== undefined) {
					activeResource.content = activeResource.contentChanges;
					delete activeResource.contentChanges;
				}
				if (activeResource.metaChanges !== undefined) {
					activeResource.meta = activeResource.metaChanges as SimsFileMeta;
					delete activeResource.metaChanges;
				}
			})
		));
	},

	copyActiveResource(): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const resourceToCopy = select(store).activeResource();
				const newId = uuid();

				select(draft).activePackage().resources[newId] = {...resourceToCopy};
				select(draft).activePackage().activeResourceId = newId;
			})
		));
	},

	deleteActiveResource(): void {
		if (!window.confirm('Remove this resource from the package file? This cannot be undone.')) {
			return;
		}
		packagesStore.update((store) => (
			produce(store, (draft) => {
				const {activeResourceId} = store.packages[store.activePackageId];
				const resourceIds = select(store).openResourceIds();

				draft.packages[store.activePackageId].activeResourceId =
					getActiveTabIdAfterClose(activeResourceId, resourceIds);

				delete draft.packages[store.activePackageId].resources[activeResourceId];
			})
		));
	},

	setActiveResource(resourceId: string): void {
		packagesStore.update((store) => (
			produce(store, (draft) => {
				select(draft).activePackage().activeResourceId = resourceId;
			})
		));
	},
};

export const activePackage = derived(packagesStore, ($packages) => {
	return select($packages).activePackage();
});

export const activeResource = derived(packagesStore, ($packages) => {
	return select($packages).activeResource();
});
