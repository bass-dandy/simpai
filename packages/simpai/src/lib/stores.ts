import { browser } from '$app/environment';
import { decode, encode } from 'base64-arraybuffer';
import {
  deserialize,
  deserializeFile,
  getFileType,
  serialize,
  serializeFile,
  TYPE_ID,
  type SimsFile,
  type SimsFileMeta,
  type SimsFileContent,
} from 'dbpf-transform';
import produce from 'immer';
import { derived, get, writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

import type { PackagesStore } from '../types';
import { defaultFileData } from './consts';
import { select } from './selectors';
import { debounce, downloadBuffer } from './util';

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

function getActiveTabIdAfterClose(tabIdToClose: string, tabIds: string[]) {
  const newTabIds = tabIds.filter((tabId) => tabId !== tabIdToClose);

  return newTabIds[Math.min(tabIds.indexOf(tabIdToClose), newTabIds.length - 1)] ?? '';
}

const packagesStore = writable<PackagesStore>(hydrateFromLocalStorage());

packagesStore.subscribe(saveToLocalStorage);

export const packages = {
  subscribe: packagesStore.subscribe,

  addEmptyPackage(filename: string) {
    const packageId = uuid();

    packagesStore.update((store) =>
      produce(store, (draft) => {
        draft.packages[packageId] = {
          filename,
          resources: {},
          activeResourceId: '',
        };
        draft.activePackageId = packageId;
      })
    );
  },

  async addPackage(file: File) {
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

  removePackage(idToRemove: string) {
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

  setActivePackage(packageId: string) {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        draft.activePackageId = packageId;
      })
    );
  },

  downloadActivePackage() {
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
    downloadBuffer(data, activePkg.filename);
  },

  openResource(resourceId: string) {
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

  closeResource(resourceIdToClose: string) {
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

  editActiveResource(contentChanges: SimsFileContent) {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();
        if (activeResource) activeResource.contentChanges = contentChanges;
      })
    );
  },

  editActiveResourceMeta(metaChanges: SimsFileMeta) {
    packagesStore.update((store) =>
      produce(store, (draft) => {
        const activeResource = select(draft).activeResource();
        if (activeResource) activeResource.metaChanges = metaChanges;
      })
    );
  },

  resetActiveResource() {
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

  saveActiveResource() {
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

  copyActiveResource() {
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

  deleteActiveResource() {
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

  exportActiveResource() {
    const store = get(packagesStore);
    const resourceToExport = select(store).activeResource();

    if (resourceToExport) {
      if (
        (resourceToExport.metaChanges || resourceToExport.contentChanges)
        && window.confirm('Would you like to save changes before exporting?')
      ) {
        this.saveActiveResource();
      }

      const data = serializeFile(resourceToExport);

      const filename = !(resourceToExport.content instanceof ArrayBuffer)
        ? resourceToExport.content.filename
        : 'resource';

      downloadBuffer(data, `${filename}.${getFileType(resourceToExport.meta.typeId).toLowerCase()}`);
    }
  },

  async importResource(file: File) {
    const buf = await file.arrayBuffer();
    const fileType = file.name.split('.').pop()?.toUpperCase() as keyof typeof TYPE_ID;

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
            content: deserializeFile(TYPE_ID[fileType], buf),
            isOpen: true,
          };
          activePkg.activeResourceId = newResourceId;
        }
      })
    );
  },

  createNewResource(fileType: keyof typeof defaultFileData) {
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

  createLinkedResource(fileType: keyof typeof defaultFileData, content?: SimsFileContent) {
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

  setActiveResource(resourceId: string) {
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
