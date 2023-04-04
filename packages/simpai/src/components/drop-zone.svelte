<script lang="ts">
	import {packages} from '../stores';
	import Button from './button.svelte';
	import Plumbob from './plumbob.svelte';

	let fileInput: HTMLInputElement; // hidden file input ref
</script>

<div class="wrapper">
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
		<Plumbob size={50} />
		<span class="text">
			Drag .package file here or
		</span>
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
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 400px;
		margin: 5px 15px;
	}
	.drop-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 30px 0;
		background-color: var(--color-input);
		border: 2px dashed var(--color-accent);
		border-radius: 15px;
	}
	input[type="file"] {
		display: none;
	}
	.text {
		margin-top: 10px;
	}
</style>
