<script lang="ts">
	import type { BconContent, TrcnContent, TrcnFile } from 'dbpf-transform';
	import produce from 'immer';
	import Box from '../box.svelte';
	import Button from '../button.svelte';
	import CloseButton from '../close-button.svelte';
	import Table from '../table.svelte';
	import TextInput from '../text-input.svelte';
	import {defaultFileData} from '../../consts';
	import {select} from '../../selectors';
	import {packages} from '../../stores';
	import {formatHex, formatSignedInt, without} from '../../util';

	export let content: BconContent;
	export let onChange: (newContent: BconContent) => void;

	const displayOptions = {
		Hex: {
			format: (val: number) => formatHex(val, 4),
			parse: (val: string) => parseInt(val, 16),
		},
		Int: {
			format: (val: number) => formatSignedInt(val),
			parse: (val: string) => new Uint16Array([parseInt(val, 10)])[0],
		},
		uInt: {
			format: (val: number) => val >>> 0,
			parse: (val: string) => parseInt(val, 10),
		},
	};

	type DisplayOption = keyof typeof displayOptions;

	let selectedDisplayOption: DisplayOption = 'Hex';
	let format: (typeof displayOptions)[DisplayOption]['format'];
	let parse: (typeof displayOptions)[DisplayOption]['parse'];

	$: ({format, parse} = displayOptions[selectedDisplayOption]);

	let trcnId: string | undefined;
	let labels: TrcnContent['items'] | undefined;

	$: {
		trcnId = select($packages).linkedResourceId('TRCN');
		const trcn = select($packages).resourceById<TrcnFile>(trcnId);
		labels = trcn?.contentChanges?.items ?? trcn?.content?.items;
	};

	const handleCreateLabelClick = () => {
		packages.createLinkedResource('TRCN', {
			...defaultFileData.TRCN,
			filename: content.filename,
			items: content.items.map((_, i) => ({
				...(defaultFileData.TRCN.items[0] as typeof defaultFileData['TRCN']['items'][number]),
				constName: `Label ${i}`,
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

	const handleDisplayChange = (e: Event) => {
		selectedDisplayOption = (e.target as HTMLInputElement).value as DisplayOption;
	};
</script>

<div class="bcon-view">
	<Box
		secondary
		style={{
			display: 'flex',
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
				Display as
				<select
					class="display-as"
					value={selectedDisplayOption}
					on:input={handleDisplayChange}
				>
				{#each Object.keys(displayOptions) as key (key)}
					<option value={key}>
						{key}
					</option>
				{/each}
				</select>
			</label>
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
	<Table
		columns={[
			'',
			'Line',
			'Value',
			...(labels ? ['Label', 'ID', 'Default', 'Min', 'Max', 'Used'] : [])
		]}
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
			Value: {
				component: TextInput,
				props: {
					onChange: (newValue) => onChange(
						produce(content, (draft) => {
							draft.items[i] = parse(newValue) ?? 0;
						})
					),
					value: format(item),
					style: 'width: 100%; min-width: 75px;',
				},
			},
			Label: labels?.[i]?.constName,
			ID: format(labels?.[i]?.constId ?? 0),
			Default: format(labels?.[i]?.value ?? 0),
			Min: format(labels?.[i]?.minValue ?? 0),
			Max: format(labels?.[i]?.maxValue ?? 0),
			Used: {
				element: 'input',
				props: {
					type: 'checkbox',
					checked: labels?.[i]?.used,
					disabled: true,
				},
			},
		}))}
	/>
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
	.display-as {
		margin-left: 5px;
	}
</style>
