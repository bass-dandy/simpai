<script lang="ts">
	import type {ObjdContent} from 'dbpf-transform';
	import produce from 'immer';
	import TextInput from '../../text-input.svelte';
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

<div>
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

	<div class="radio-group">
		<h3>Room sort</h3>
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

	<div class="radio-group">
		<h3>Function sort</h3>
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

	{#if currentFunctionSubSort?.length}
		<div class="radio-group">
			<h3>Function subsort</h3>
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
	{/if}

	<div class="radio-group">
		<h3>Skill flags</h3>
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
</div>

<style>
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
	h3 {
		position: absolute;
		top: 0;
		left: 20px;
		transform: translateY(-50%);
		margin: 0;
		padding: 0 10px;
		background-color: var(--color-fg);
		font-size: 1rem;
		font-weight: normal;
	}
	.radio-group {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 15px 5px 5px;
		margin-top: 20px;
		border: 1px solid var(--color-accent);
		border-radius: 5px;
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
