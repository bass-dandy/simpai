<script lang="ts">
	import Button from './button.svelte';

	export let onDrop: (file: File) => void;
	export let accept: string[] | string;
	export let style: string = '';

	let fileInput: HTMLInputElement; // hidden file input ref
</script>

<div
	class="drop-zone"
	on:dragover|preventDefault
	on:drop|preventDefault={async (e) => {
		const file = e
			?.dataTransfer
			?.items?.[0]
			?.getAsFile();

		if (file) onDrop(file);
	}}
	{style}
>
	<input
		type="file"
		accept={typeof accept === 'string' ? accept : accept.join(',')}
		bind:this={fileInput}
		on:change={async () => {
			const file = fileInput.files?.[0];
			if (file) onDrop(file);
		}}
	/>

	<slot />

	<Button
		variant="link"
		style="font-size: 1.2rem;"
		onClick={() => fileInput.click()}
	>
		browse files
	</Button>
</div>

<style>
	.drop-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 400px;
		padding: 30px 0;
		background-color: var(--color-input);
		border: 2px dashed var(--color-border);
		border-radius: 15px;
	}
	input[type="file"] {
		display: none;
	}
</style>
