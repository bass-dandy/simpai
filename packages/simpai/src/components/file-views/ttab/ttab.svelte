<script lang="ts">
	import type { TtabContent, StrFile } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import Button from '$components/shared/button.svelte';
	import CloseButton from '$components/shared/close-button.svelte';
	import TabPanel from '$components/shared/tab-panel.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { defaultFileData } from '$lib/consts';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { without } from '$lib/util';

	import MotiveTables from './motive-tables.svelte';
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
		})
	);
</script>

<div class="ttab-view">
	<Box secondary>
		<div class="controls-x">
			<ol class="interaction-select" role="listbox">
				{#each content.items as item, i}
					<li class:active-interaction={index === i}>
						<CloseButton
							onClick={() => remove(i)}
							aria-label={`remove interaction ${i}`}
						/>
						<button
							class="interaction-option"
							on:click={() => { index = i; }}
							role="option"
							aria-selected={index === i}
						>
							({i}) {ttasItems?.[item.strIndex] ?? ''}
						</button>
					</li>
				{/each}
			</ol>
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
					title: 'Motive tables',
					content: MotiveTables,
					hideClose: true,
					props: { content, onChange, index },
				},
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
			contentStyle={{ overflow: 'auto' }}
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
	.interaction-select {
		width: 100%;
		height: 100px;
		overflow: auto;
		list-style: none;
		padding: 0;
		margin: 0;
		border: 1px solid var(--color-accent);
	}
	.interaction-select li {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: 0 var(--spacing-sm);
		background-color: var(--color-input);
	}
	.interaction-select li:nth-child(odd) {
		background-color: var(--color-btn);
	}
	.interaction-select li.active-interaction {
		background-color: var(--color-bg);
	}
	.interaction-option {
		display: block;
		flex: 1;
		padding: var(--spacing-sm);
		border: 0;
		background-color: transparent;
		text-align: left;
	}
	.interaction-select li.active-interaction .interaction-option {
		color: var(--color-input);
	}
</style>
