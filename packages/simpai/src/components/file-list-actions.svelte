<script lang="ts">
	import {packages} from '$lib/stores';

	import PlusIcon from '$svg/plus.svg?component';
	import DownloadIcon from '$svg/file-arrow-down.svg?component';
	import GearIcon from '$svg/gear-solid.svg?component';
	import CheckIcon from '$svg/check.svg?component';
	import XIcon from '$svg/x.svg?component';

	import Button from './shared/button.svelte';
	import Modal from './shared/modal.svelte';
	import {views} from './file-views';

	export let search = '';

	const displayStorageKey = 'display_mode'

	enum displayMode {
		light = 'light',
		dark = 'dark',
		highContrast = 'high-contrast',
	};

	const getDisplayMode = () => {
		return localStorage.getItem(displayStorageKey)
			|| (window.matchMedia('(prefers-color-scheme: dark)').matches ? displayMode.dark : displayMode.light);
	};

	type ViewKey = keyof typeof views;

	let isNewResourceModalOpen = false;
	let isSettingsModalOpen = false;

	let selectRef: HTMLSelectElement;
	let toggleNewResourceModalRef: Button;
	let toggleSettingsModalRef: Button;

	let newResourceType = Object.keys(views)[0] as ViewKey;
	let currentDisplayMode = getDisplayMode();

	const onNewResourceModalClose = () => {
		isNewResourceModalOpen = false;
		newResourceType = Object.keys(views)[0] as ViewKey;
		toggleNewResourceModalRef.focus();
	};

	const onSettingsModalClose = (opts?: { reset: boolean }) => {
		if (opts?.reset) {
			currentDisplayMode = getDisplayMode();
		} else {
			const root = document.querySelector(':root');

			root?.classList.remove(displayMode.light);
			root?.classList.remove(displayMode.dark);
			root?.classList.remove(displayMode.highContrast);

			root?.classList.add(currentDisplayMode);
			localStorage.setItem(displayStorageKey, currentDisplayMode);
		}
		isSettingsModalOpen = false;
		toggleSettingsModalRef.focus();
	};

	const handleTypeSelect = (e: Event) => {
		newResourceType = (e.target as HTMLSelectElement).value as ViewKey;
	};

	const handleDisplaySelect = (e: Event) => {
		currentDisplayMode = (e.target as HTMLSelectElement).value as displayMode;
	};

	$: selectRef?.focus();
</script>

<div>
	<label for="file-search" class="search-label">
		Search
	</label>
	<div class="actions">
		<input
			id="file-search"
			type="text"
			placeholder="File name, file type, group ID, or instance ID"
			bind:value={search}
		/>
		<Button
			variant="skeuomorphic"
			size={25}
			style="padding: 1px;"
			onClick={() => packages.downloadActivePackage()}
			tooltip="Download package"
			aria-label="download package"
		>
			<DownloadIcon height={20} />
		</Button>
		<Button
			variant="skeuomorphic"
			size={25}
			style="padding: 1px;"
			onClick={() => { isNewResourceModalOpen = true; }}
			tooltip="Add resource"
			aria-label="add resource"
			bind:this={toggleNewResourceModalRef}
		>
			<PlusIcon height={20} />
		</Button>
		<Button
			variant="skeuomorphic"
			size={25}
			style="padding: 1px;"
			onClick={() => { isSettingsModalOpen = true; }}
			tooltip="Settings"
			aria-label="open settings menu"
			bind:this={toggleSettingsModalRef}
		>
			<GearIcon height={20} />
		</Button>
	</div>
</div>

<Modal
	title="Add new resource"
	isOpen={isNewResourceModalOpen}
	onClose={onNewResourceModalClose}
>
	<label class="modal-content">
		Type:
		<select
			value={newResourceType}
			on:input={handleTypeSelect}
			bind:this={selectRef}
		>
		{#each Object.keys(views) as fileType (fileType)}
			<option value={fileType}>{fileType}</option>
		{/each}
		</select>
	</label>
	<div class="modal-controls">
		<Button
			variant="skeuomorphic"
			size={25}
			onClick={onNewResourceModalClose}
			aria-label="cancel"
			style="margin-right: 5px;"
		>
			<XIcon height={20} />
		</Button>
		<Button
			variant="skeuomorphic"
			size={25}
			onClick={() => {
				packages.createNewResource(newResourceType);
				onNewResourceModalClose();
			}}
			aria-label="submit"
		>
			<CheckIcon height={20} />
		</Button>
	</div>
</Modal>

<Modal
	title="Settings"
	isOpen={isSettingsModalOpen}
	onClose={() => onSettingsModalClose({ reset: true })}
>
	<label class="modal-content">
		Display mode:
		<select
			value={currentDisplayMode}
			on:input={handleDisplaySelect}
			bind:this={selectRef}
		>
			<option value={displayMode.light}>
				Light
			</option>
			<option value={displayMode.dark}>
				Dark
			</option>
			<option value={displayMode.highContrast}>
				High Contrast
			</option>
		</select>
	</label>
	<div class="modal-controls">
		<Button
			variant="skeuomorphic"
			size={25}
			onClick={() => onSettingsModalClose({ reset: true })}
			aria-label="cancel"
			style="margin-right: 5px;"
		>
			<XIcon height={20} />
		</Button>
		<Button
			variant="skeuomorphic"
			size={25}
			onClick={onSettingsModalClose}
			aria-label="submit"
		>
			<CheckIcon height={20} />
		</Button>
	</div>
</Modal>

<style>
	.search-label, .actions {
		margin: 0 15px;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
	#file-search {
		flex: 1;
	}
	select {
		margin-left: 15px;
	}
	.modal-content {
		display: block;
		padding-bottom: 15px;
	}
	.modal-controls {
		display: flex;
		position: absolute;
		right: 15px;
		top: 100%;
		transform: translateY(-50%);
	}
</style>
