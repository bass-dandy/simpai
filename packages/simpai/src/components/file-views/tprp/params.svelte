<script lang="ts">
	import type { TprpContent } from 'dbpf-transform';
	import produce from 'immer';

	import CloseButton from '$components/shared/close-button.svelte';
	import Checkbox from '$components/shared/checkbox.svelte';
	import Table from '$components/shared/table.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { formatHex, without } from '$lib/util';

	export let content: TprpContent;
	export let onChange: (newContent: TprpContent) => void;

	const remove = (i: number) => onChange(
		produce(content, (draft) => {
			draft.params = without(draft.params, i);
		})
	);

	const handleLabelChange = (val: string | number, i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.params[i];
			if (tgt) tgt.label = val as string;
		})
	);

	const togglePdata = (i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.params[i];
			if (tgt) tgt.pdata = (tgt.pdata ? 0 : 1);
		})
	);
</script>

{#if content.params.length > 0}
	<div class="table-wrap">
		<Table
			columns={['', 'Index', 'Label', 'pData']}
			columnConfig={{
				Label: { stretch: true },
				Index: { hideTitle: true },
			}}
			rows={content.params.map((param, i) => ({
				'': {
					component: CloseButton,
					props: {
						onClick: () => remove(i),
						'aria-label': `remove param ${i}`,
					},
				},
				Index: `(${formatHex(i, 4)})`,
				Label: {
					component: TextInput,
					props: {
						value: param.label,
						onChange: (val) => handleLabelChange(val, i),
						style: 'width: 100%',
					},
				},
				pData: {
					component: Checkbox,
					props: {
						checked: param.pdata > 0,
						onClick: () => togglePdata(i),
					},
				},
			}))}
		/>
	</div>
{:else}
	<div class="empty">
		Params empty! Nothing to see here.
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
