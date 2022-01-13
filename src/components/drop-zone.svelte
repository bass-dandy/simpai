<script>
	import {fly} from 'svelte/transition';
	import {deserialize} from 'dbpf-transform';
	import Box from './box.svelte';

	export let unpackedFiles = null;

	let fileInput; // hidden file input ref
	let stagedFile;
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
			stagedFile = await e
				.dataTransfer
				.items[0]
				.getAsFile();
		}}
	>
		<input
			type="file"
			accept=".package"
			bind:this={fileInput}
			on:change={() => stagedFile = fileInput.files?.[0]}
		/>
		{#if stagedFile}
			{stagedFile.name}
		{:else}
			Drag .package file here or <a on:click={fileInput.click()}>browse files</a>
		{/if}
	</div>
	<div class="controls" class:hidden={!stagedFile}>
		<button
			aria-label="clear file selection"
			on:click={() => {
				stagedFile = null;
				fileInput.value = null;
			}}
		>
			✗
		</button>
		<button
			aria-label="confirm file selection"
			on:click={async () => {
				unpackedFiles = deserialize(
					await stagedFile.arrayBuffer()
				);
			}}
		>
			✓
		</button>
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

	.hidden {
		visibility: hidden;
	}

	.controls {
		display: flex;
		margin-top: 15px;
	}

	.controls > button {
		margin: 0 5px;
		display: inline-flex;
		align-items: center;
		padding: 5px 15px;
		border: 2px solid var(--color-accent);
		border-radius: 5px;
		background-color: var(--color-btn);
	}
</style>
