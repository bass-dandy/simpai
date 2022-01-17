<script>
	import Box from '../box.svelte';
	export let resource;
</script>

<Box>
	<Box secondary>
		<label for="semiglobal-input">Semi global</label>
		<input
			id="semiglobal-input"
			type="text"
			value={resource.content.semiglobal}
		/>
	</Box>
</Box>

<style>
	#semiglobal-input {
		width: 100%;
	}
</style>
