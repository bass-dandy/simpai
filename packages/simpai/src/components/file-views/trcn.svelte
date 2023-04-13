<script lang="ts">
	import type { BconContent, BconFile, TrcnContent } from 'dbpf-transform';
	import produce from 'immer';
	import Box from '../box.svelte';
	import Button from '../button.svelte';
	import Checkbox from '../checkbox.svelte';
	import CloseButton from '../close-button.svelte';
	import Table from '../table.svelte';
	import TextInput from '../text-input.svelte';
	import {defaultFileData} from '../../consts';
	import {select} from '../../selectors';
	import {packages} from '../../stores';
	import {formatHex, times, without} from '../../util';

	export let content: TrcnContent;
	export let onChange: (newContent: TrcnContent) => void;

	let bconId: string | undefined;
	let bconValues: BconContent['items'] | undefined;

	$: {
		bconId = select($packages).linkedResourceId('BCON');
		const bcon = select($packages).resourceById<BconFile>(bconId);
		bconValues = bcon?.contentChanges?.items ?? bcon?.content.items;
	};

	const getTextInput = (field: keyof TrcnContent['items'][number], i: number) => {
		const item = content.items[i];

		return item ? {
			component: TextInput,
			props: {
				onChange: (newValue: string) => onChange(
					produce(content, (draft) => {
						const updateItem = draft.items[i];
						if (updateItem) {
							updateItem[field] = (field === 'constName' || field === 'desc') ? newValue : parseInt(newValue);
						}
					})
				),
				value: item[field],
				style: 'width: 100%; min-width: 75px;',
			},
		} : undefined;
	};

	const updateIds = (items: TrcnContent['items']) => {
		items.forEach((item, i) => {
			item.constId = i + 1;
		});
	};

	const handleAppendClick = () => {
		onChange(
			produce(content, (draft) => {
				draft.items.push({
					...(defaultFileData.TRCN.items[0] as typeof defaultFileData['TRCN']['items'][number]),
				});
				updateIds(draft.items);
			})
		);
	};
</script>

<div class="trcn-view">
	<Box
		secondary
		style={{ 'margin-bottom': '5px' }}
	>
		{#if bconId}
			<Button onClick={() => bconId ? packages.openResource(bconId) : null}>
				Edit BCON
			</Button>
		{:else}
			<span class="warn">
				Warning: failed to find BCON file with matching instance id
			</span>
		{/if}
		<Button onClick={handleAppendClick} style="margin-left: 5px">
			Append new value
		</Button>
	</Box>
	<Table
		columns={['', 'Value', 'Label', 'Default', 'Min', 'Max', 'Used']}
		columnConfig={{
			'': { shrink: true }
		}}
		rows={times(Math.max(content.items.length, bconValues?.length ?? 0), (i) => {
			const item = content.items[i];

			return {
				'': item ? {
					component: CloseButton,
					props: {
						onClick: () => {
							onChange(
								produce(content, (draft) => {
									draft.items = without(draft.items, i);
									updateIds(draft.items);
								})
							);
						},
						'aria-label': `delete line ${i}`,
					},
				} : '',
				Value: bconValues?.[i] !== undefined ? formatHex(bconValues[i], 4) : undefined,
				Label: getTextInput('constName', i),
				Default: getTextInput('value', i),
				Min: getTextInput('minValue', i),
				Max: getTextInput('maxValue', i),
				Used: item ? {
					component: Checkbox,
					props: {
						checked: !!item?.used,
						onClick: () => onChange(
							produce(content, (draft) => {
								const item = draft.items[i];
								if (item) item.used = item.used ? 0 : 1;
							})
						),
					},
				} : '',
			};
		})}
	/>
</div>

<style>
	.trcn-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: auto;
	}
	.warn {
		font-size: 1rem;
	}
</style>