<script lang="ts">
	import { TYPE_ID } from 'dbpf-transform';

	import { packages } from '$lib/stores';
	import PlusIcon from '$svg/plus.svg?component';

	import Button from './shared/button.svelte';
	import DropZone from './shared/drop-zone.svelte';
	import Modal from './shared/modal.svelte';
	import { views } from './file-views';

	type ViewKey = keyof typeof views;

	const tabs = ['Add', 'Import'] as const;

	let newResourceType = Object.keys(views)[0] as ViewKey;

	let isOpen = false;
	let activeTab: typeof tabs[number] = tabs[0];
	let buttonRef: Button;
	let selectRef: HTMLSelectElement;

	const handleTypeSelect = (e: Event) => {
		newResourceType = (e.target as HTMLSelectElement).value as ViewKey;
	};

	const onClose = () => {
		isOpen = false;
		newResourceType = Object.keys(views)[0] as ViewKey;
		buttonRef.focus();
	};

	$: selectRef?.focus();
</script>

<Button
	variant="skeuomorphic"
	size={25}
	style="padding: 1px;"
	onClick={() => ( isOpen = true )}
	tooltip="Add resource"
	aria-label="add resource"
	bind:this={buttonRef}
>
	<PlusIcon height={20} />
</Button>

<Modal
	title="Add new resource"
	isOpen={isOpen}
	onClose={onClose}
	onSubmit={() => {
		packages.createNewResource(newResourceType);
		onClose();
	}}
>
	<div class="modal-content">
		<ul class="tabs">
			{#each tabs as tab}
				<li>
					<button
						on:click={() => { activeTab = tab; }}
						class:active={activeTab === tab}
					>
						{tab}
					</button>
				</li>
			{/each}
		</ul>
		<div class="tab-panel">
			{#if activeTab === 'Add'}
				<label>
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
			{/if}
			{#if activeTab === 'Import'}
				<DropZone
					onDrop={(file) => {
						packages.importResource(file);
						onClose();
					}}
					accept={Object.keys(TYPE_ID).map((id) => {
						return `.${id.toLowerCase()}`
					})}
				>
					Drag file here or
				</DropZone>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.modal-content {
		padding-bottom: var(--spacing-md);
	}
	select {
		margin-left: var(--spacing-md);
	}
	.tabs {
		display: flex;
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	.tabs li {
		flex: 1;
	}
	.tabs button {
		width: 100%;
		padding: var(--spacing-sm);
		border: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: transparent;
	}
	.tabs button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
	.tabs button.active {
		background: var(--color-fg);
		border: 1px solid var(--color-border);
	}
	.tab-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 400px;
		min-height: 150px;
	}
</style>
