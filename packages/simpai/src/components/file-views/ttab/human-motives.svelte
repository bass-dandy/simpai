<script lang="ts">
	import type { TtabContent } from 'dbpf-transform';
	import produce from 'immer';

	import Subsection from '$components/shared/subsection.svelte';
	import TextInput from '$components/shared/text-input.svelte';

	import { simTypes, motives } from './consts';

	export let content: TtabContent;
	export let onChange: (newContent: TtabContent) => void;
	export let index: number;

	// ordered by index
	const tables = [
		'Adult',
		'Child',
		'Toddler',
		'Teen',
		'Elder',
		'Cat',
		'Dog',
	];

	$: motiveGroups = content.items[index]?.humanGroups.groups ?? [];

	const handleChange = (
		key: 'min' | 'delta' | 'type',
		value: number | string,
		groupIndex: number,
		motiveIndex: number
	) => onChange(
		produce(content, (draft) => {
			const groups = draft.items[index]?.humanGroups.groups ?? [];

			while (groupIndex >= groups.length) {
				groups.push({ items: [] });
			}

			const group = groups[groupIndex];

			if (group) {
				while ( motiveIndex >= group.items.length) {
					group.items.push({
						min: 0,
						delta: 0,
						type: 0,
					});
				}
				const motive = group.items[motiveIndex];

				if (motive) motive[key] = value as number;
			}
		})
	);
</script>

<div class="motive-tables">
	{#each tables as title, groupIndex}
		<Subsection {title} headingLevel="h4">
			<table>
				<thead>
					<th />
					<th>Min.</th>
					<th>Delta</th>
					<th>Type</th>
				</thead>
				<tbody>
					{#each motives as motive, motiveIndex}
						<tr>
							<td>{motive}</td>
							<td>
								<TextInput
									variant="hex"
									maxLength={4}
									value={motiveGroups?.[groupIndex]?.items?.[motiveIndex]?.min ?? 0}
									onChange={(val) => handleChange('min', val, groupIndex, motiveIndex)}
									style="width: 100%; min-width: 75px;"
								/>
							</td>
							<td>
								<TextInput
									variant="hex"
									maxLength={4}
									value={motiveGroups?.[groupIndex]?.items?.[motiveIndex]?.delta ?? 0}
									onChange={(val) => handleChange('delta', val, groupIndex, motiveIndex)}
									style="width: 100%; min-width: 75px;"
								/>
							</td>
							<td>
								<select
									value={motiveGroups?.[groupIndex]?.items?.[motiveIndex]?.type ?? 0}
									on:change={(e) => {
										handleChange('type', parseInt(e.currentTarget.value), groupIndex, motiveIndex);
									}}
								>
									{#each simTypes as simType, i}
										<option value={i}>
											{simType}
										</option>
									{/each}
								</select>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Subsection>
	{/each}
</div>

<style>
	.motive-tables {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th, td {
		padding: 5px;
		font-size: 1rem;
	}
	th {
		text-align: left;
	}
	select {
		width: 100%;
		min-width: 75px;
	}
</style>
