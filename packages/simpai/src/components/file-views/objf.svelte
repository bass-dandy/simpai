<script lang="ts">
	import type {ObjfContent} from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import TextInput from '$components/shared/text-input.svelte';

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

	const getInputHandler = (key: 'action' | 'guard', i: number) => (value: number | string) => onChange(
		produce(content, (draft) => {
			const tgt = draft.functions[i];
			if (tgt) tgt[key] = value as number;
		})
	);
</script>

<div>
	<Box secondary>
		<table>
			<thead>
				<td>Function</td>
				<td>Action BHAV</td>
				<td>Guardian BHAV</td>
			</thead>
			<tbody>
			{#each content.functions as fn, i}
				<tr>
					<td>{FNS[i]}</td>
					<td>
						<TextInput
							variant="hex"
							maxLength={4}
							value={fn.action}
							onChange={getInputHandler('action', i)}
							style="width: 100%"
						/>
					</td>
					<td>
						<TextInput
							variant="hex"
							maxLength={4}
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
	div {
		height: 100%;
		overflow: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	thead {
		border-bottom: 1px solid var(--color-accent);
	}
	thead td {
		padding-bottom: 10px;
	}
	td {
		padding-top: 10px;
		font-size: 1rem;
	}
	td:not(:last-child) {
		padding-right: 10px;
	}
</style>
