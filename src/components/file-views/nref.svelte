<script>
	import Box from '../box.svelte';

	export let resource;
</script>

<div>
	<Box secondary>
		<label for="nref-input">Value</label>
		<input
			id="nref-input"
			type="text"
			value={resource.content}
		/>
	</Box>
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
	}
	#nref-input {
		width: 100%;
	}
</style>
