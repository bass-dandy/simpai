<script lang="ts">
	import type {ObjdContent} from 'dbpf-transform';
	import produce from 'immer';
	import { formatHex } from '../../../util';
	import TextInput from '../../text-input.svelte';
	import { rawDataGroups } from './consts';

	export let content: ObjdContent;
	export let onChange: (newContent: ObjdContent) => void;

	const dwordKeys: {
		[property in keyof ObjdContent['data']]+?: boolean;
	} = {
		version: true,
		guid: true,
		diagonalSelectorGuid: true,
		gridSelectorGuid: true,
		proxyGuid: true,
		jobObjectGuid: true,
		originalGuid: true,
		objectModelGuid: true,
	};
</script>

<div class="raw-data-wrapper">
	<table>
		<tbody>
			{#each Object.entries(rawDataGroups) as [groupName, keys]}
				<tr>
					<th colspan={2}>
						{groupName}
					</th>
				</tr>
				{#each keys as key}
					<tr>
						<td >
							{key}
						</td>
						<td>
							<TextInput
								value={formatHex(content.data[key], dwordKeys[key] ? 8 : 4)}
								onChange={(val) => onChange(
									produce(content, (draft) => {
										draft.data[key] = parseInt(val, 16);
									})
								)}
							/>
						</td>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.raw-data-wrapper {
		height: 100%;
		overflow: auto;
	}
	table {
		position: relative;
		width: 100%;
		font-size: 1rem;
		border-spacing: 0;
	}
	th, td {
		padding: 10px;
	}
	th {
		position: sticky;
		top: 0;
		text-align: left;
		border: 1px solid var(--color-accent);
		background-color: var(--color-fg);
	}
	td:first-child {
		width: 100%;
	}
</style>
