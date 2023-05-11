<script lang="ts">
	import type { BhavContent } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import Button from '$components/shared/button.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { defaultFileData } from '$lib/consts';
	import { packages } from '$lib/stores';
	import { select } from '$lib/selectors';
	import { formatHex, times } from '$lib/util';

	import Instruction from './instruction.svelte';
	import Instructions from './instructions.svelte';

	export let content: BhavContent;
	export let onChange: (newContent: BhavContent) => void;

	$: tprpId = select($packages).linkedResourceId('TPRP');

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

	const keyToLabel = [
		['treeVersion', 'Tree version'],
		['argCount', 'Arg count'],
		['localCount', 'Local count'],
	] as const;

	const handleFormatChange = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.format = parseInt((e.target as HTMLOptionElement).value);
		})
	);

	const handleChange = (
		key: typeof keyToLabel[number][0],
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
			{#each keyToLabel as [key, label]}
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
			{#if tprpId}
				<Button
					onClick={() => tprpId ? packages.openResource(tprpId) : null}
					style="padding-bottom: var(--spacing-sm)"
				>
					Edit TPRP
				</Button>
			{:else}
				<Button
					onClick={() => {
						packages.createLinkedResource('TPRP', {
							...defaultFileData.TPRP,
							params: times(content.argCount, () => ({ label: '', pdata: 1 })),
							locals: times(content.localCount, () => ''),
						});
					}}
					style="padding-bottom: var(--spacing-sm)"
				>
					Create TPRP
				</Button>
			{/if}
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
			onChange={(i) => { activeIndex = i; }}
			{content}
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
