<script lang="ts">
	import polycrc from 'polycrc';
	import type {GlobContent} from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';

	import { semiglobals } from './consts';

	export let content: GlobContent;
	export let onChange: (newContent: GlobContent) => void;

	$: group = polycrc.crc24(content.semiglobal.toLowerCase()).toString(16);

	const handleChange = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.semiglobal = (e.target as HTMLOptionElement).value;
		})
	);
</script>

<Box
	secondary
	style={{
		height: '100%',
		overflow: 'auto',
		display: 'flex',
		gap: 'var(--spacing-md)',
		'align-items': 'center',
	}}
>
	<label>
		Semi global
		<select
			class="semiglobal-select"
			value={content.semiglobal}
			on:change={handleChange}
		>
			{#each semiglobals as semiglobal}
				<option value={semiglobal}>
					{semiglobal}
				</option>
			{/each}
		</select>
	</label>
	<label>
		Group ID
		<input
			type="text"
			class="group"
			value={`0x7F${group.toString().toUpperCase()}`}
			readonly
		/>
	</label>
</Box>

<style>
	label:first-child {
		flex: 1;
	}
	.semiglobal-select {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.group {
		display: block;
		box-shadow: none;
		background: transparent;
	}
</style>
