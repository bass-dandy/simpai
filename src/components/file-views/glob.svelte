<script lang="ts">
	import type {GlobContent} from 'dbpf-transform/dist/esm/types';
	import produce from 'immer';
	import Box from '../box.svelte';

	export let content: GlobContent;
	export let onChange: () => void;
</script>

<div>
	<Box secondary>
		<label for="semiglobal-input">Semi global</label>
		<input
			id="semiglobal-input"
			type="text"
			value={content.semiglobal}
			on:input={(e) => onChange(
				produce(content, (draft) => { draft.semiglobal = e.target.value; })
			)}
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
