<script lang="ts">
	import type { TtabContent, StrFile } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import TabPanel from '$components/shared/tab-panel.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';

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

	const handleFormatChange = (val: string | number) => onChange(
		produce(content, (draft) => {
			draft.format = val as number;
		})
	);
</script>

<div class="ttab-view">
	<Box secondary>
		<div class="controls">
			<label>
				Interaction
				<select
					value={index}
					on:change={(e) => {
						index = parseInt(e.currentTarget.value);
					}}
					class="index-select"
				>
					{#each content.items as item, i}
						<option value={i}>
							({i}) {ttasItems?.[item.strIndex] ?? ''}
						</option>
					{/each}
				</select>
			</label>
			<TextInput
				label="Format"
				variant="hex"
				maxLength={8}
				onChange={handleFormatChange}
				value={content.format}
				style="width: 100%"
			/>
		</div>
	</Box>
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
</div>

<style>
	.ttab-view {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 15px;
		min-width: 0;
		overflow: hidden;
	}
	.index-select {
		display: block;
		width: 100%;
	}
</style>
