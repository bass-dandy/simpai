<script>
	import {getFileType} from 'dbpf-transform';
	import DropZone from '../components/drop-zone.svelte';
	import FileList from '../components/file-list.svelte';
	import Plumbob from '../components/plumbob.svelte';
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
			<div class="logo">
				<Plumbob size={60} />
				<h1>Sims 2 Package Editor</h1>
			</div>
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
	.layout {
		display: flex;
		height: 100vh;
		padding: 30px;
	}
	.left {
		display: flex;
		flex-direction: column;
	}
	.right {
		flex: 1;
		margin-left: 30px;
	}
	.logo {
		display: flex;
		align-items: center;
		margin: 0 0 10px;
	}
	.logo h1 {
		margin: 0 0 0 10px;
		font-family: "sims-llhp";
		font-size: 3rem;
		color: var(--color-white);;
		-webkit-text-stroke: 1px var(--color-accent);
		-webkit-text-fill-color: white;
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
