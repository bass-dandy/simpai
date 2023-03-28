<script lang="ts">
	import type {GlobContent} from 'dbpf-transform/dist/types/types';
	import produce from 'immer';
	import Box from '../box.svelte';

	export let content: GlobContent;
	export let onChange: (newContent: GlobContent) => void;

	const handleInput = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.semiglobal = (e.target as HTMLInputElement).value;
		})
	);
</script>

<div>
	<Box secondary>
		<label for="semiglobal-input">Semi global</label>
		<input
			id="semiglobal-input"
			type="text"
			value={content.semiglobal}
			on:input={handleInput}
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
