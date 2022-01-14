<script>
	import Box from '../box.svelte';
	import {formatHex} from '../../util';
	export let file;

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
		'Start Live Mode',
		'Stop Live Mode',
		'Link Objects',
		'Message Handler',
		'Pre Route',
		'Post Route',
		'Goal Check',
		'Reaction Handler',
		'Along Route Callback',
		'awareness',
		'reset',
		'lookatTarget',
		'Walk Over',
		'Utility State Change',
		'Set Model by Type',
		'Get Model Type',
		'delete',
		'user delete',
		'Just Moved In',
		'prevent place in slot',
		'Global Awareness',
		'Object Updated by Design Mode',
	];
</script>

<Box>
	<Box secondary>
		<table>
			<thead>
				<td>Function</td>
				<td>Action</td>
				<td>Guardian</td>
			</thead>
			<tbody>
			{#each file.content.functions as fn, i}
				<tr>
					<td>{FNS[i]}</td>
					<td>{fn.action ? formatHex(fn.action, 4) : '---'}</td>
					<td>{fn.guardian ? formatHex(fn.guardian, 4) : '---'}</td>
				</tr>
			{/each}
			</tbody>
		</table>
	</Box>
</Box>

<style>
	table {
		width: 100%;
	}

	td {
		padding: 5px;
		font-size: 1rem;
	}

	tr td {
		background-color: var(--color-input);
	}
</style>
