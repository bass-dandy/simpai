<script>
	import Box from '../box.svelte';

	export let resource;
</script>

<Box>
	<Box secondary>
		<label for="nref-input">Value</label>
		<input
			id="nref-input"
			type="text"
			value={resource.content}
		/>
	</Box>
</Box>

<style>
	#nref-input {
		width: 100%;
	}
</style>
