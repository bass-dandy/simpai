<script lang="ts">
	import type {ObjfContent} from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import BhavSelect from '$components/shared/bhav-select.svelte';

	export let content: ObjfContent;
	export let onChange: (newContent: ObjfContent) => void;

	const FNS = [
		'init',
		'main',
		'load',
		'cleanup',
		'queue skipped',
		'allow intersection',
		'wall adjacency changed',
		'room changed',
		'dynamic multi-tile update',
		'placement',
		'pickup',
		'user placement',
		'user pickup',
		'level info request',
		'serving surface',
		'portal',
		'gardening',
		'wash hands',
		'prep',
		'cook',
		'surface',
		'dispose',
		'food',
		'pickup from slot',
		'wash dish',
		'eating surface',
		'sit',
		'stand',
		'clean',
		'repair',
		'ui event',
		'Restock',
		'Wash Clothes',
		'start live mode',
		'stop live mode',
		'link objects',
		'message handler',
		'pre route',
		'post route',
		'goal check',
		'reaction handler',
		'along route callback',
		'awareness',
		'reset',
		'look at target',
		'walk over',
		'utility state change',
		'set model by type',
		'get model type',
		'delete',
		'user delete',
		'just moved in',
		'prevent place in slot',
		'global awareness',
		'object updated by design mode',
	];

	const getInputHandler = (key: 'action' | 'guard', i: number) => (value: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.functions[i];
			if (tgt) tgt[key] = value as number;
		})
	);
</script>

<div class="objf-view">
	<Box
		secondary
		style={{ width: '100%', height: '100%', overflow: 'auto', 'padding-top': '0' }}
	>
		<table>
			<thead>
				<th>Function</th>
				<th>Action BHAV</th>
				<th>Guardian BHAV</th>
			</thead>
			<tbody>
			{#each content.functions as fn, i}
				<tr>
					<td>{FNS[i]}</td>
					<td>
						<BhavSelect
							value={fn.action}
							onChange={getInputHandler('action', i)}
							style="width: 100%"
						/>
					</td>
					<td>
						<BhavSelect
							value={fn.guard}
							onChange={getInputHandler('guard', i)}
							style="width: 100%"
						/>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	</Box>
</div>

<style>
	.objf-view {
		height: 100%;
	}
	table {
		width: 100%;
		position: relative;
		border-spacing: 0;
	}
	thead th {
		text-align: left;
		padding-bottom: 10px;
	}
	th {
		position: sticky;
		top: 0;
		padding-top: var(--spacing-md);
		background-color: var(--color-fg);
		border-bottom: 1px solid var(--color-accent);
	}
	th, td {
		font-size: 1rem;
	}
	td {
		padding-top: 10px;
	}
	td:not(:last-child) {
		padding-right: 10px;
	}
</style>
