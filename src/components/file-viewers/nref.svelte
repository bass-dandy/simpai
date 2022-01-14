<script>
	import Box from '../box.svelte';

	export let file;
</script>

<Box>
	<input type="text" value={file.content} />
</Box>

<style>
	input[type="text"] {
		width: 100%;
		box-sizing: border-box;
	}
</style>
