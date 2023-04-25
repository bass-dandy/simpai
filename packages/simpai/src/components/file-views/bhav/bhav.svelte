<script lang="ts">
	import type { BhavContent } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { formatHex } from '$lib/util';

	import Instruction from './instruction.svelte';
	import Instructions from './instructions.svelte';

	export let content: BhavContent;
	export let onChange: (newContent: BhavContent) => void;

	let activeIndex = 0;

	const formats = [
		0x8000,
		0x8001,
		0x8002,
		0x8003,
		0x8004,
		0x8005,
		0x8006,
		0x8007,
		0x8008,
		0x8009,
	];

	const keyToLabel = {
		treeVersion: 'Tree version',
		argCount: 'Arg count',
		localCount: 'Local count',
	};

	const handleFormatChange = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.format = parseInt((e.target as HTMLOptionElement).value);
		})
	);

	const handleChange = (
		key: keyof typeof keyToLabel,
		val: string | number
	) => onChange(
		produce(content, (draft) => {
			draft[key] = val as number;
		})
	);
</script>

<div class="bhav-view">
	<Box secondary>
		<div class="file-controls">
			<label>
				Format
				<select
					value={content.format}
					on:change={handleFormatChange}
				>
					{#each formats as format}
						<option value={format}>
							{formatHex(format, 4)}
						</option>
					{/each}
				</select>
			</label>
			{#each Object.entries(keyToLabel) as [key, label]}
				<TextInput
					variant="hex"
					maxLength={8}
					label={label}
					value={content[key]}
					onChange={(val) => handleChange(key, val)}
					labelStyle="flex: 1; min-width: 0;"
					style="width: 100%"
				/>
			{/each}
		</div>
	</Box>
	<Box secondary>
		<Instruction
			content={content}
			onChange={onChange}
			index={activeIndex}
		/>
	</Box>
	<Box secondary style={{ flex: '1', overflow: 'auto' }}>
		<Instructions
			instructions={content.instructions}
			onChange={(i) => { activeIndex = i; }}
			{activeIndex}
		/>
	</Box>
</div>

<style>
	.bhav-view {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		height: 100%;
	}
	.file-controls {
		display: flex;
		align-items: flex-end;
		gap: var(--spacing-md);
	}
	select {
		display: block;
	}
</style>
