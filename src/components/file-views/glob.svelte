<script>
	import Box from '../box.svelte';
	export let resource;
</script>

<div>
	<Box secondary>
		<label for="semiglobal-input">Semi global</label>
		<input
			id="semiglobal-input"
			type="text"
			value={resource.content.semiglobal}
		/>
	</Box>
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
	}
	#semiglobal-input {
		width: 100%;
	}
</style>
