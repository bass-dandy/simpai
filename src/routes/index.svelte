<script>
	import {getFileType} from 'dbpf-transform';
	import DropZone from '../components/drop-zone.svelte';
	import FileList from '../components/file-list.svelte';
	import * as fileViewers from '../components/file-viewers';
	import Plumbob from '../components/plumbob.svelte';
	import {activePackage, activeResource} from '../stores';
	import '../global.css';
</script>

<div class="layout">
	<div class="left">
		<div class="logo">
			<Plumbob size={60} />
			<h1>SimPE Online</h1>
		</div>
		{#if !$activePackage}
			<DropZone />
		{:else}
			<FileList />
		{/if}
	</div>
	<div class="right">
		<svelte:component
			this={fileViewers[
				getFileType($activeResource?.meta.typeId ?? '')
			]}
			resource={$activeResource}
		/>
	</div>
</div>

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
</style>
