<script lang="ts">
	import type { TtabContent, StrFile } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import Button from '$components/shared/button.svelte';
	import SelectList from '$components/shared/select-list.svelte';
	import TabPanel from '$components/shared/tab-panel.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { defaultFileData } from '$lib/consts';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { without } from '$lib/util';

	import HumanMotives from './human-motives.svelte';
	import AnimalMotives from './animal-motives.svelte';
	import Settings from './settings.svelte';

	export let content: TtabContent;
	export let onChange: (newContent: TtabContent) => void;

	let activeTab = 'settings';
	let index = 0;

	let ttasItems: string[] = [];

	$: {
		const ttasId = select($packages).linkedResourceId('TTAS');
		const ttas = select($packages).resourceById<StrFile>(ttasId);
		ttasItems = (
			ttas?.contentChanges?.stringSets ?? ttas?.content?.stringSets ?? []
		).map((item) => item.value);
	};

	const remove = (i: number) => onChange(
		produce(content, (draft) => {
			draft.items = without(draft.items, i);
		})
	);

	const append = () => onChange(
		produce(content, (draft) => {
			draft.items.push({
				...(defaultFileData.TTAB.items[0] as TtabContent['items'][number])
			});
		})
	);

	const handleFormatChange = (val: string | number) => onChange(
		produce(content, (draft) => {
			draft.format = val as number;

			if (content.format >= 84 && val as number < 84) {
				// switch tab since it's about to disappear
				activeTab = 'settings';
			}
		})
	);
</script>

<div class="ttab-view">
	<Box secondary>
		<div class="controls-x">
			<SelectList
				options={
					content.items.map((item, i) => ({
						label: `(${i}) ${ttasItems?.[item.strIndex] ?? ''}`,
						isActive: index === i,
						onSelect: () => index = i,
						onRemove: () => remove(i),
					}))
				}
				style="height: 100px; width: 100%;"
			/>
			<div class="controls-y">
				<TextInput
					label="Format"
					variant="hex"
					maxLength={8}
					onChange={handleFormatChange}
					value={content.format}
					style="width: 100%"
				/>
				<Button onClick={append} style="margin-bottom: 5px">
					Append new interaction
				</Button>
			</div>
		</div>
	</Box>
	{#if content.items[index]}
		<TabPanel
			tabs={{
				settings: {
					title: 'Settings',
					content: Settings,
					hideClose: true,
					props: { content, onChange, index },
				},
				motives: {
					title: content.format >= 84 ? 'Human motives' : 'Motives',
					content: HumanMotives,
					hideClose: true,
					props: { content, onChange, index },
				},
				...(content.format >= 84 ? {
					animalMotives: {
						title: 'Animal motives',
						content: AnimalMotives,
						hideClose: true,
						props: { content, onChange, index },
					},
				} : {}),
			}}
			activeTab={activeTab}
			onChange={(id) => activeTab = id}
			onClose={() => null}
			headingLevel="h3"
			style={{
				flex: '1',
				'background': 'transparent',
				border: '0',
				overflow: 'hidden',
				padding: '0',
				'margin-top': '5px',
			}}
			contentStyle={{ 'overflow-y': 'auto' }}
		/>
	{:else}
		<Box secondary style={{ 'margin-top': 'var(--spacing-sm)' }}>
			No interaction selected
		</Box>
	{/if}
</div>

<style>
	.ttab-view {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.controls-x {
		display: flex;
		gap: var(--spacing-md);
	}
	.controls-y {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		white-space: nowrap;
	}
</style>
