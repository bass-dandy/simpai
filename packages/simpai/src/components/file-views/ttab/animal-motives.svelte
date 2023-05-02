<script lang="ts">
	import type { TtabContent } from 'dbpf-transform';
	import produce from 'immer';

	import Button from '$components/shared/button.svelte';
	import Modal from '$components/shared/modal.svelte';
	import Subsection from '$components/shared/subsection.svelte';
	import TextInput from '$components/shared/text-input.svelte';

	import { simTypes, motives } from './consts';

	export let content: TtabContent;
	export let onChange: (newContent: TtabContent) => void;
	export let index: number;

	let activeValueIndex: [number, number, number] | null = null;

	$: motiveGroups = content.items[index]?.animalGroups?.groups ?? [];

	$: activeValue = activeValueIndex && motiveGroups?.[activeValueIndex[0]]?.items?.[activeValueIndex[1]]?.[activeValueIndex[2]];

	const handleChange = (
		key: 'min' | 'delta' | 'type',
		value: number | string,
	) => onChange(
		produce(content, (draft) => {
			if (!activeValueIndex) return;

			const [groupIndex, motiveIndex, valueIndex] = activeValueIndex;

			const animalGroups = draft.items[index]!.animalGroups ?? { groups: [] };

			while (groupIndex >= animalGroups.groups.length) {
				animalGroups.groups.push({ items: [] });
			}
			const group = animalGroups.groups[groupIndex];

			if (group) {
				while (motiveIndex >= group.items.length) {
					group.items.push([
						{
							min: 0,
							delta: 0,
							type: 0,
						},
						{
							min: 0,
							delta: 0,
							type: 0,
						},
						{
							min: 0,
							delta: 0,
							type: 0,
						},
					]);
				}
				const motive = group.items[motiveIndex]?.[valueIndex];

				if (motive) motive[key] = value as number;
			}

			draft.items[index]!.animalGroups = animalGroups;
		})
	);
</script>

<div class="motive-tables">
	{#each ['0', '1', '2', '3', '4', '5', '6'] as title, groupIndex}
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
							{#each [null, null, null] as _, valueIndex}
								<td>
									<Button onClick={() => (activeValueIndex = [groupIndex, motiveIndex, valueIndex])}>
										Edit values
									</Button>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</Subsection>
	{/each}
</div>

<Modal
	title="Edit values"
	isOpen={activeValueIndex !== null}
	onClose={() => (activeValueIndex = null)}
>
	<div class="modal-content">
		<TextInput
			variant="hex"
			maxLength={4}
			label="Min"
			value={activeValue?.min ?? 0}
			onChange={(val) => handleChange('min', val)}
			style="width: 100%"
		/>
		<TextInput
			variant="hex"
			maxLength={4}
			label="Delta"
			value={activeValue?.delta ?? 0}
			onChange={(val) => handleChange('delta', val)}
			style="width: 100%"
		/>
		<label>
			Type
			<select
				value={activeValue?.type ?? 0}
				on:change={(e) => {
					handleChange('type', parseInt(e.currentTarget.value));
				}}
			>
				{#each simTypes as simType, i}
					<option value={i}>
						{simType}
					</option>
				{/each}
			</select>
		</label>
	</div>
</Modal>

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
	.modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}
</style>
