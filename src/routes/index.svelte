<script>
	import DropZone from '../components/drop-zone.svelte';
	import '../global.css';
	
	let file;

	$: console.log(file);
</script>

<h1>Sims 2 DBPF Package Editor</h1>
{#if !file}
<div class="modal">
	<DropZone bind:file />
</div>
{/if}

<style>
	h1 {
		font-size: 3rem;
		font-family: "sims-llhp";
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
