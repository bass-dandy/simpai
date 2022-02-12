<script>
	import Box from '../box.svelte';

	export let content;
	export let onChange;
</script>

<div>
	<Box secondary>
		<label for="nref-input">Value</label>
		<input
			id="nref-input"
			type="text"
			value={content}
			on:input={(e) => onChange(e.target.value)}
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
