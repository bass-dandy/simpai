<script lang="ts">
	import { getContext } from 'svelte';

	import GearIcon from '$svg/gear-solid.svg?component';

	import { displayMode, type DisplayModeContext } from '../types';
	import Button from './shared/button.svelte';
	import Modal from './shared/modal.svelte';

	const { getDisplayMode, setDisplayMode } = getContext<DisplayModeContext>('display_mode');

	let isOpen = false;
	let currentDisplayMode = getDisplayMode();

	let buttonRef: Button;
	let selectRef: HTMLSelectElement;

	const onClose = (opts?: { reset: boolean }) => {
		if (opts?.reset) {
			currentDisplayMode = getDisplayMode();
		} else {
			setDisplayMode(currentDisplayMode);
		}
		isOpen = false;
		buttonRef.focus();
	};

	const handleDisplaySelect = (e: Event) => {
		currentDisplayMode = (e.target as HTMLSelectElement).value as displayMode;
	};

	$: selectRef?.focus();
</script>

<Button
	variant="skeuomorphic"
	size={25}
	style="padding: 1px;"
	onClick={() => { isOpen = true; }}
	tooltip="Settings"
	aria-label="open settings menu"
	bind:this={buttonRef}
>
	<GearIcon height={20} />
</Button>

<Modal
	title="Settings"
	onClose={() => onClose({ reset: true })}
	onSubmit={onClose}
	{isOpen}
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
</Modal>

<style>
	.modal-content {
		display: block;
		padding-bottom: 15px;
	}
	select {
		margin-left: 15px;
	}
</style>
