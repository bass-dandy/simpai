<script lang="ts">
	import type {ObjdContent} from 'dbpf-transform';
	import produce from 'immer';
	import Box from '../box.svelte';

	export let content: ObjdContent;
	export let onChange: (newContent: ObjdContent) => void;

	const roomSortFlags = [
		'Kitchen',
		'Bedroom',
		'Bathroom',
		'Living room',
		'Outside',
		'Dining room',
		'Misc.',
		'Study',
		'Kids',
	] as const;

	const functionSortFlags = [
		'Seating',
		'Surfaces',
		'Appliances',
		'Electronics',
		'Plumbing',
		'Decorative',
		'General',
		'Lights',
		'Hobbies',
		'Aspiration',
		'Career',
	] as const;

	const functionSubSort: Record<
		typeof functionSortFlags[number],
		readonly (string | null)[]
	> = {
		Seating: [
			'Dining room',
			'Living room',
			'Sofas',
			'Beds',
			'Recreation',
			null,
			null,
			'Misc.',
		],
		Surfaces: [
			'Counter',
			'Table',
			'End table',
			'Desk',
			'Coffee table',
			'Shelf',
			null,
			'Misc.',
		],
		Appliances: [
			'Cooking',
			'Refrigerator',
			'Small',
			'Large',
			null,
			null,
			null,
			'Misc.',
		],
		Electronics: [
			'Entertainment',
			'TV & computer',
			'Audio',
			'Small',
			null,
			null,
			null,
			'Misc.',
		],
		Plumbing: [
			'Toilet',
			'Shower',
			'Sink',
			'Hot tub',
			null,
			null,
			null,
			'Misc.',
		],
		Decorative: [
			'Wall',
			'Sculpture',
			'Rug',
			'Plant',
			'Mirror',
			'Curtain',
			null,
			'Misc.',
		],
		General: [
			null,
			'Dresser',
			null,
			'Party',
			'Child',
			'Car',
			'Pets',
			'Misc.',
		],
		Lights: [
			'Table lamp',
			'Floor lamp',
			'Wall lamp',
			'Ceiling lamp',
			'Outdoor',
			null,
			null,
			'Misc.',
		],
		Hobbies: [
			'Creativity',
			'Knowledge',
			'Excercise',
			'Recreation',
			null,
			null,
			null,
			'Misc.',
		],
		Aspiration: [],
		Career: [],
	} as const;

	const skillFlags = [
		'Cleaning',
		'Cooking',
		'Mechanical',
		'Logic',
		'Body',
		'Creativity',
		'Charisma',
		'School study',
	] as const;

	const objectTypes = {
		Unknown: 0x0,
		Person: 0x2,
		Normal: 0x4,
		ArchitecturalSupport: 0x5,
		SimType: 0x7,
		Door: 0x8,
		Window: 0x9,
		Stairs: 0xA,
		ModularStairs: 0xB,
		ModularStairsPortal: 0xC,
		Vehicle: 0xD,
		Outfit: 0xE,
		Memory: 0xF,
		Template: 0x10,
		Tiles: 0x13,
	};

	let currentRoomSortFlags = 0;
	let currentFunctionSortFlags = 0;
	let currentFunctionSubSortFlags = 0;
	let currentSkillFlags = 0;
	let currentFunctionSubSort: typeof functionSubSort[typeof functionSortFlags[number]] | undefined;

	$: {
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

	const toggleFlag = (flagName: keyof ObjdContent['data'], offset: number) => {
		onChange(
			produce(content, (draft) => {
				draft.data[flagName] = (1 << offset);
			})
		);
	};
</script>

<div class="objd-container">
	<Box secondary>
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
	</Box>
</div>

<style>
	.objd-container {
		height: 100%;
		overflow: auto;
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
	@media screen and (min-width: 1050px) {
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
