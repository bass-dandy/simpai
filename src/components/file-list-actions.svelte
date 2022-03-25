<script lang="ts">
	import {packages} from '../stores';
	import Button from './button.svelte';
	import Modal from './modal.svelte';
	import {views} from './file-views';

	import PlusIcon from '../svg/plus.svg';
	import DownloadIcon from '../svg/file-arrow-down.svg';
	import CheckIcon from '../svg/check.svg';
	import XIcon from '../svg/x.svg';

	export let search = '';

	let isModalOpen = false;
	let newResourceType = Object.keys(views)[0];
	let selectRef;
	let toggleModalRef;

	const onModalClose = () => {
		isModalOpen = false;
		newResourceType = Object.keys(views)[0];
		toggleModalRef.focus();
	};

	$: {
		selectRef?.focus();
	}
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
			style="margin: 0 5px; padding: 1px;"
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
			onClick={() => { isModalOpen = true; }}
			tooltip="Add resource"
			aria-label="add resource"
			bind:this={toggleModalRef}
		>
			<PlusIcon height={20} />
		</Button>
	</div>
	<Modal
		title="Add new resource"
		isOpen={isModalOpen}
		onClose={onModalClose}
	>
		<label class="modal-content">
			Type:
			<select
				value={newResourceType}
				on:input={(e) => {
					newResourceType = e.target.value;
				}}
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
				onClick={onModalClose}
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
					onModalClose();
				}}
				aria-label="submit"
			>
				<CheckIcon height={20} />
			</Button>
		</div>
	</Modal>
</div>

<style>
	.search-label, .actions {
		margin: 0 15px;
	}
	.actions {
		display: flex;
		align-items: center;
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
