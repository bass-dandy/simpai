<script lang="ts">
	import type {ObjdContent} from 'dbpf-transform';
	import produce from 'immer';

	import Subsection from '$components/shared/subsection.svelte';
	import TextInput from '$components/shared/text-input.svelte';

	import {
		roomSortFlags,
		functionSortFlags,
		functionSubSort,
		skillFlags,
		objectTypes,
	} from './consts';

	export let content: ObjdContent;
	export let onChange: (newContent: ObjdContent) => void;

	let currentObjectType = 0;
	let currentRoomSortFlags = 0;
	let currentFunctionSortFlags = 0;
	let currentFunctionSubSortFlags = 0;
	let currentSkillFlags = 0;
	let currentFunctionSubSort: typeof functionSubSort[typeof functionSortFlags[number]] | undefined;

	$: {
		currentObjectType = content.data.objectType;
		currentRoomSortFlags = content.data.roomSortFlags;
		currentFunctionSortFlags = content.data.functionSortFlags;
		currentFunctionSubSortFlags = content.data.functionSubSort;
		currentSkillFlags = content.data.skillFlags;

		const currentFunctionSort = functionSortFlags.find((_, i) => {
			return currentFunctionSortFlags === (1 << i);
		});

		currentFunctionSubSort = currentFunctionSort
			? functionSubSort[currentFunctionSort]
			: undefined;
	}

	const guids: (keyof ObjdContent['data'])[] = [
		'guid',
		'originalGuid',
		'proxyGuid',
		'diagonalSelectorGuid',
		'gridSelectorGuid',
	];

	const handleGuidChange = (key: keyof ObjdContent['data'], value: number | string) => onChange(
		produce(content, (draft) => {
			draft.data[key] = value as number;
		})
	);

	const toggleFlag = (flagName: keyof ObjdContent['data'], offset: number) => {
		onChange(
			produce(content, (draft) => {
				draft.data[flagName] = (1 << offset);
			})
		);
	};
</script>

<div class="catalog-sort">
	<div class="input-group">
		<label>
			Object type
			<select
				class="type-select"
				bind:value={currentObjectType}
				on:input|preventDefault={(e) => onChange(
					produce(content, (draft) => {
						draft.data.objectType = parseInt(e.currentTarget.value);
					})
				)}
			>
				{#each objectTypes as objectType, i}
					{#if objectType !== null}
						<option value={i}>
							{objectType}
						</option>
					{/if}
				{/each}
			</select>
		</label>
		{#each guids as field}
			<TextInput
				variant="hex"
				maxLength={8}
				label={field}
				value={content.data[field]}
				onChange={(val) => handleGuidChange(field, val)}
				style="display: block; width: 100%;"
			/>
		{/each}
	</div>

	<Subsection title="Room sort" headingLevel="h4">
		<div class="radio-group">
			{#each roomSortFlags as flag, i}
				<label>
					<input
						type="radio"
						bind:group={currentRoomSortFlags}
						value={1 << i}
						on:change|preventDefault={() => toggleFlag('roomSortFlags', i)}
					/>
					{flag}
				</label>
			{/each}
		</div>
	</Subsection>

	<Subsection title="Function sort" headingLevel="h4">
		<div class="radio-group">
			{#each functionSortFlags as flag, i}
				<label>
					<input
						type="radio"
						bind:group={currentFunctionSortFlags}
						value={1 << i}
						on:change|preventDefault={() => toggleFlag('functionSortFlags', i)}
					/>
					{flag}
				</label>
			{/each}
		</div>
	</Subsection>

	{#if currentFunctionSubSort?.length}
		<Subsection title="Function subsort" headingLevel="h4">
			<div class="radio-group">
				{#each currentFunctionSubSort as flag, i}
					{#if flag !== null}
						<label>
							<input
								type="radio"
								bind:group={currentFunctionSubSortFlags}
								value={1 << i}
								on:change|preventDefault={() => toggleFlag('functionSubSort', i)}
							/>
							{flag}
						</label>
					{/if}
				{/each}
			</div>
		</Subsection>
	{/if}

	<Subsection title="Skill flags" headingLevel="h4">
		<div class="radio-group">
			{#each skillFlags as flag, i}
				<label>
					<input
						type="radio"
						bind:group={currentSkillFlags}
						value={1 << i}
						on:change|preventDefault={() => toggleFlag('skillFlags', i)}
					/>
					{flag}
				</label>
			{/each}
		</div>
	</Subsection>
</div>

<style>
	.catalog-sort {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.type-select {
		display: block;
		width: 100%;
	}
	.input-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
	}
	@media screen and (min-width: 1075px) {
		.input-group {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	@media screen and (min-width: 1075px) {
		.radio-group {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media screen and (min-width: 1200px) {
		.radio-group {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
