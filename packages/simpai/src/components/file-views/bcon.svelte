<script lang="ts">
	import type { BconContent, TrcnContent, TrcnFile } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared//box.svelte';
	import Button from '$components/shared/button.svelte';
	import CloseButton from '$components/shared/close-button.svelte';
	import Table from '$components/shared/table.svelte';
	import TextInput from '$components/shared/text-input.svelte';

	import {defaultFileData} from '$lib/consts';
	import {select} from '$lib/selectors';
	import {packages} from '$lib/stores';
	import {formatHex, without} from '$lib/util';

	export let content: BconContent;
	export let onChange: (newContent: BconContent) => void;

	let trcnId: string | undefined;
	let trcnLabels: TrcnContent['items'] | undefined;

	$: {
		trcnId = select($packages).linkedResourceId('TRCN');
		const trcn = select($packages).resourceById<TrcnFile>(trcnId);
		trcnLabels = trcn?.contentChanges?.items ?? trcn?.content?.items;
	};

	const handleCreateLabelClick = () => {
		packages.createLinkedResource('TRCN', {
			...defaultFileData.TRCN,
			filename: content.filename,
			items: content.items.map((_, i) => ({
				...(defaultFileData.TRCN.items[0] as typeof defaultFileData['TRCN']['items'][number]),
				constId: i + 1,
			})),
		});
	};

	const handleAppendClick = () => onChange(
		produce(content, (draft) => {
			draft.items.push(0);
		})
	);

	const handleFlagChange = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.flag = (e.target as HTMLInputElement).checked;
		})
	);
</script>

<div class="bcon-view">
	<Box
		secondary
		style={{
			display: 'flex',
			gap: '15px',
			'justify-content': 'space-between',
			'margin-bottom': '5px',
		}}
	>
		<div class="control-group">
			{#if trcnId}
				<Button onClick={() => trcnId ? packages.openResource(trcnId) : null}>
					Edit TRCN
				</Button>
			{:else}
				<Button onClick={handleCreateLabelClick}>
					Create TRCN
				</Button>
			{/if}
			<Button onClick={handleAppendClick}>
				Append new value
			</Button>
		</div>
		<div class="control-group">
			<label>
				Flag
				<input
					type="checkbox"
					checked={content.flag}
					on:input={handleFlagChange}
				/>
			</label>
		</div>
	</Box>
	<Box
		secondary
		style={{
			overflow: 'auto',
			flex: '1',
			'padding-top': '0',
		}}
	>
		<Table
			columns={[
				'',
				'Index',
				'Value',
				...(trcnLabels ? ['Label', 'Default', 'Min', 'Max', 'Used'] : [])
			]}
			columnConfig={{
				'': { shrink: true },
				Index: {
					shrink: true,
					hideTitle: true,
				},
			}}
			rows={content.items.map((item, i) => ({
				'': {
					component: CloseButton,
					props: {
						onClick: () => {
							onChange(
								produce(content, (draft) => {
									draft.items = without(draft.items, i);
								})
							);
						},
						'aria-label': `delete line ${i}`,
					},
				},
				Index: `(${formatHex(i, 4)})`,
				Value: {
					component: TextInput,
					props: {
						onChange: (newValue) => onChange(
							produce(content, (draft) => {
								draft.items[i] = newValue;
							})
						),
						value: item,
						variant: 'hex',
						maxLength: 4,
						style: 'width: 100%; min-width: 75px;',
					},
				},
				Label: trcnLabels?.[i]?.constName,
				Default: formatHex(trcnLabels?.[i]?.value, 4) || '-',
				Min: formatHex(trcnLabels?.[i]?.minValue, 4) || '-',
				Max: formatHex(trcnLabels?.[i]?.maxValue, 4) || '-',
				Used: trcnLabels?.[i] ? {
					element: 'input',
					props: {
						type: 'checkbox',
						checked: trcnLabels?.[i]?.used,
						disabled: true,
					},
				} : undefined,
			}))}
		/>
	</Box>
</div>

<style>
	.bcon-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: auto;
	}
	.control-group {
		display: flex;
		align-items: center;
		gap: 15px;
	}
</style>
