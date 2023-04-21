<script lang="ts">
	import type { TprpContent } from 'dbpf-transform';
	import produce from 'immer';

	import CloseButton from '$components/shared/close-button.svelte';
	import Table from '$components/shared/table.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { formatHex, without } from '$lib/util';

	export let content: TprpContent;
	export let onChange: (newContent: TprpContent) => void;

	const remove = (i: number) => onChange(
		produce(content, (draft) => {
			draft.locals = without(draft.locals, i);
		})
	);

	const handleChange = (val: string | number, i: number) => onChange(
		produce(content, (draft) => {
			draft.locals[i] = val as string;
		})
	);
</script>

{#if content.locals.length > 0}
	<div class="table-wrap">
		<Table
			columns={['', 'Index', 'Label']}
			columnConfig={{
				Label: { stretch: true },
			}}
			rows={content.locals.map((local, i) => ({
				'': {
					component: CloseButton,
					props: {
						onClick: () => remove(i),
						'aria-label': `remove local ${i}`,
					},
				},
				Index: formatHex(i, 4),
				Label: {
					component: TextInput,
					props: {
						value: local,
						onChange: (val) => handleChange(val, i),
						style: 'width: 100%',
					},
				},
			}))}
		/>
	</div>
{:else}
	<div class="empty">
		Locals empty! Nothing to see here.
	</div>
{/if}

<style>
	.table-wrap {
		padding: 0 var(--spacing-md);
	}
	.empty {
		padding: var(--spacing-md);
	}
</style>
