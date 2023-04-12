import { browser } from '$app/environment';
import { decode, encode } from 'base64-arraybuffer';
import {
  deserialize,
  TYPE_ID,
  serialize,
  type SimsFile,
  type SimsFileMeta,
  type SimsFileContent,
} from 'dbpf-transform';
import produce from 'immer';
import { derived, get, writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

import { defaultFileData } from './consts';
import { select } from './selectors';
import type { PackagesStore } from './types';
import { debounce } from './util';

const localStorageKey = 'editorState';
const base64Prefix = 'base64:';

const saveToLocalStorage = debounce((state: PackagesStore) => {
  if (!browser) return;

  // ArrayBuffers are not stringable, so convert them to Base64
  const json = JSON.stringify(state, (_, value) => {
    return value instanceof ArrayBuffer ? `${base64Prefix}${encode(value)}` : value;
  });

  localStorage.setItem(localStorageKey, json);
}, 1000);

function hydrateFromLocalStorage() {
  const defaultState = { activePackageId: '', packages: {} };

  const savedStateRaw = browser ? localStorage.getItem(localStorageKey) : null;

  if (!savedStateRaw) return defaultState;

  return JSON.parse(savedStateRaw, (_, value) =>
    typeof value === 'string' && value.startsWith(base64Prefix)
      ? decode(value.slice(base64Prefix.length))
      : value
  );
}

function getActiveTabIdAfterClose(tabIdToClose: string, tabIds: string[]): string {
  const newTabIds = tabIds.filter((tabId) => tabId !== tabIdToClose);

  return newTabIds[Math.min(tabIds.indexOf(tabIdToClose), newTabIds.length - 1)] ?? '';
}

const packagesStore = writable<PackagesStore>(hydrateFromLocalStorage());

packagesStore.subscribe(saveToLocalStorage);

export const packages = {
  subscribe: packagesStore.subscribe,

  async addPackage(file: File): Promise<void> {
    // key files in package by uuid
    const keyedFiles = deserialize(await file.arrayBuffer()).reduce(
      (acc: Record<string, SimsFile>, file) => {
        acc[uuid()] = file;
        return acc;
      },
      {}
    );

    const packageId = uuid();

    packagesStore.update((store) =>
      produce(store, (draft) => {
        draft.packages[packageId] = {
          filename: file.name,
          resources: keyedFiles,
          activeResourceId: '',
        };
        draft.activePackageId = packageId;
      })
    );
  },

  removePackage(idToRemove: string): void {
    if (!window.confirm("Close this package? You'll lose all changes.")) {
      return;
    }
    packagesStore.update((store) =>
      produce(store, (draft) => {
        if (idToRemove === store.activePackageId) {
          draft.activePackageId = getActiveTabIdAfterClose(idToRemove, Object.keys(store.packages));
        }
        delete draft.packages[idToRemove];
      })
    );
  },

  setActivePackage(packageId: string): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        draft.activePackageId = packageId;
      })
    );
  },

  downloadActivePackage(): void {
    const store = get(packagesStore);
    if (
      select(store).isPackageDirty() &&
      !window.confirm('This package contains resources with unsaved changes. Download anyway?')
    ) {
      return;
    }
    const activePkg = select(store).activePackage();

    if (!activePkg) return console.error('Failed to find active package, unable to download');

    const data = serialize(Object.values(activePkg.resources));
    const blob = new Blob([new Uint8Array(data)], { type: 'octet/stream' }),
      url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = activePkg.filename;
    a.click();

    window.URL.revokeObjectURL(url);
  },

  openResource(resourceId: string): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const resource = select(draft).resourceById(resourceId);

        if (resource) {
          resource.isOpen = true;
          const activePackage = select(draft).activePackage();

          if (activePackage) {
            activePackage.activeResourceId = resourceId;
          }
        }
      })
    );
  },

  closeResource(resourceIdToClose: string): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResourceId = select(store).activePackage()?.activeResourceId;

        if (
          select(store).isDirty(resourceIdToClose) &&
          !window.confirm("Close this resource? You'll lose all unsaved changes.")
        ) {
          return;
        }

        const resourceIds = select(store).openResourceIds();

        if (resourceIdToClose === activeResourceId) {
          const activePkg = select(draft).activePackage();
          if (activePkg)
            activePkg.activeResourceId = getActiveTabIdAfterClose(resourceIdToClose, resourceIds);
        }
        const resourceToClose = select(draft).resourceById(resourceIdToClose);

        if (resourceToClose) {
          resourceToClose.isOpen = false;
          delete resourceToClose.contentChanges;
          delete resourceToClose.metaChanges;
        }
      })
    );
  },

  editActiveResource(contentChanges: SimsFileContent): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();
        if (activeResource) activeResource.contentChanges = contentChanges;
      })
    );
  },

  editActiveResourceMeta(metaChanges: SimsFileMeta): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();
        if (activeResource) activeResource.metaChanges = metaChanges;
      })
    );
  },

  resetActiveResource(): void {
    if (!window.confirm('Undo all unsaved changes to this resource? This cannot be undone.')) {
      return;
    }
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();
        if (activeResource) {
          delete activeResource.contentChanges;
          delete activeResource.metaChanges;
        }
      })
    );
  },

  saveActiveResource(): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();

        if (activeResource?.contentChanges !== undefined) {
          activeResource.content = activeResource.contentChanges;
          delete activeResource.contentChanges;
        }
        if (activeResource?.metaChanges !== undefined) {
          activeResource.meta = activeResource.metaChanges as SimsFileMeta;
          delete activeResource.metaChanges;
        }
      })
    );
  },

  copyActiveResource(): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activePackage = select(draft).activePackage();
        const resourceToCopy = select(store).activeResource();

        if (activePackage && resourceToCopy) {
          const newId = uuid();
          activePackage.resources[newId] = { ...resourceToCopy };
          activePackage.activeResourceId = newId;
        }
      })
    );
  },

  deleteActiveResource(): void {
    if (!window.confirm('Remove this resource from the package file? This cannot be undone.')) {
      return;
    }
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activePackage = select(draft).activePackage();
        const activeResourceId = select(draft).activeResourceId();

        if (activePackage && activeResourceId) {
          const resourceIds = select(draft).openResourceIds();
          activePackage.activeResourceId = getActiveTabIdAfterClose(activeResourceId, resourceIds);
          delete activePackage.resources[activeResourceId];
        }
      })
    );
  },

  createNewResource(fileType: keyof typeof TYPE_ID): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activePkg = select(draft).activePackage();
        const newResourceId = uuid();

        if (activePkg) {
          activePkg.resources[newResourceId] = {
            meta: {
              typeId: TYPE_ID[fileType],
              groupId: 0,
              instanceId: 0,
              instanceId2: 0,
              location: 0,
              size: 0,
            },
            content: defaultFileData[fileType],
            isOpen: true,
          };
          activePkg.activeResourceId = newResourceId;
        }
      })
    );
  },

  createLinkedResource(fileType: keyof typeof TYPE_ID, content?: SimsFileContent) {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activePkg = select(draft).activePackage();
        const activeResource = select(draft).activeResource();
        const newResourceId = uuid();

        if (activePkg && activeResource) {
          activePkg.resources[newResourceId] = {
            meta: {
              ...activeResource.meta,
              typeId: TYPE_ID[fileType],
            },
            content: content ?? defaultFileData[fileType],
          };
        }
      })
    );
  },

  setActiveResource(resourceId: string): void {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activePkg = select(draft).activePackage();
        if (activePkg) activePkg.activeResourceId = resourceId;
      })
    );
  },
};

export const activePackage = derived(packagesStore, ($packages) => {
  return select($packages).activePackage();
});

export const activeResource = derived(packagesStore, ($packages) => {
  return select($packages).activeResource();
});
