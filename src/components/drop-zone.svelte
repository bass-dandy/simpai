<script>
	import Box from './box.svelte';
	import {packages} from '../stores';

	let fileInput; // hidden file input ref
</script>

<Box
	style={{
		display: 'flex',
		'flex-direction': 'column',
		'align-items': 'center',
		width: '400px',
	}}
>
	<div
		class="drop-zone"
		on:dragover|preventDefault
		on:drop|preventDefault={async (e) => {
			const file = e
				.dataTransfer
				.items[0]
				.getAsFile();

			await packages.addPackage(file);
		}}
	>
		<input
			type="file"
			accept=".package"
			bind:this={fileInput}
			on:change={async () => {
				await packages.addPackage(fileInput.files?.[0]);
			}}
		/>
		Drag .package file here or <a on:click={fileInput.click()}>browse files</a>
	</div>
</Box>

<style>
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
		background-color: var(--color-fg);
		border: 2px dashed var(--color-accent);
		border-radius: 15px;
	}
</style>
