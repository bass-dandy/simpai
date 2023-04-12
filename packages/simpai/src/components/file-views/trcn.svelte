<script lang="ts">
	import type { TrcnContent } from 'dbpf-transform';
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
	import {without} from '../../util';

	export let content: TrcnContent;
	export let onChange: (newContent: TrcnContent) => void;

	let bconId: string | undefined;

	$: {
		bconId = select($packages).linkedResourceId('BCON');
	};

	function getTextInput(field: keyof TrcnContent['items'][number], i: number) {
		return {
			component: TextInput,
			props: {
				onChange: (newValue) => onChange(
					produce(content, (draft: TrcnContent) => {
						const item = draft.items[i];
						if (item) item[field] = newValue;
					})
				),
				value: content.items[i]?.[field],
				style: 'width: 100%; min-width: 75px;',
			},
		};
	}

	const handleAppendClick = () => {
		onChange(
			produce(content, (draft) => {
				draft.items.push({
					...((defaultFileData.TRCN as TrcnContent).items[0] as TrcnContent['items'][number]),
					constName: `Label ${draft.items.length}`,
					constId: draft.items.length + 1,
				});
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
		columns={['', 'Line', 'Label', 'ID', 'Default', 'Min', 'Max', 'Used']}
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
			Line: i,
			Label: getTextInput('constName', i),
			ID: getTextInput('constId', i),
			Default: getTextInput('value', i),
			Min: getTextInput('minValue', i),
			Max: getTextInput('maxValue', i),
			Used: {
				component: Checkbox,
				props: {
					checked: !!item.used,
					onClick: () => onChange(
						produce(content, (draft) => {
							const item = draft.items[i];
							if (item) item.used = item.used ? 0 : 1;
						})
					),
				},
			},
		}))}
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
