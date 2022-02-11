<script>
	import Box from '../box.svelte';

	export let resource;
	export let onChange;
</script>

<div>
	<Box secondary>
		<label for="semiglobal-input">Semi global</label>
		<input
			id="semiglobal-input"
			type="text"
			value={resource.changes?.semiglobal ?? resource.content.semiglobal}
			on:input={(e) => onChange({ semiglobal: e.target.value })}
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
