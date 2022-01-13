<script>
	import {getFileType} from 'dbpf-transform';
	import DropZone from '../components/drop-zone.svelte';
	import FileList from '../components/file-list.svelte';
	import * as fileViewers from '../components/file-viewers';
	import '../global.css';
	
	let unpackedFiles;
	let selectedFile;
</script>

{#if !unpackedFiles}
<div class="modal">
	<DropZone bind:unpackedFiles />
</div>
{:else}
	<div class="layout">
		<div class="left">
			<FileList files={unpackedFiles} bind:selectedFile />
		</div>
		<div class="right">
			<svelte:component
				this={fileViewers[
					getFileType(selectedFile?.meta.typeId ?? '')
				]}
				file={selectedFile}
			/>
		</div>
	</div>
{/if}

<style>
	h1 {
		font-size: 3rem;
		font-family: "sims-llhp";
		-webkit-text-stroke: 1px var(--color-accent);
		-webkit-text-fill-color: white;
	}

	.layout {
		display: flex;
		height: 100vh;
		padding: 30px;
		box-sizing: border-box;
	}

	.right {
		flex: 1;
		margin-left: 30px;
	}

	.modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
