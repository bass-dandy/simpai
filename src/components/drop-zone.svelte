<script lang="ts">
	import Button from './button.svelte';
	import {packages} from '../stores';

	let fileInput: HTMLInputElement; // hidden file input ref
</script>

<div>
	<div
		class="drop-zone"
		on:dragover|preventDefault
		on:drop|preventDefault={async (e) => {
			const file = e
				?.dataTransfer
				?.items?.[0]
				?.getAsFile();

			if (file) await packages.addPackage(file);
		}}
	>
		<input
			type="file"
			accept=".package"
			bind:this={fileInput}
			on:change={async () => {
				const file = fileInput.files?.[0];
				if (file) await packages.addPackage(file);
			}}
		/>
		Drag .package file here or
		<Button
			variant="link"
			style="font-size: 1.2rem;"
			onClick={() => fileInput.click()}
		>
			browse files
		</Button>
	</div>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 400px;
		margin: 5px 15px;
	}
	input[type="file"] {
		display: none;
	}
	.drop-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 200px;
		background-color: var(--color-input);
		border: 2px dashed var(--color-accent);
		border-radius: 15px;
	}
</style>
