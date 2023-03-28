<script lang="ts">
	import type {BconContent} from 'dbpf-transform/dist/types/types';
	import produce from 'immer';
	import Box from '../box.svelte';
	import Button from '../button.svelte';
	import CloseButton from '../close-button.svelte';
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

	const handleFlagChange = (e: Event) => onChange(
		produce(content, (draft) => {
			draft.flag = (e.target as HTMLInputElement).checked;
		})
	);

	const handleDisplayChange = (e: Event) => {
		selectedDisplayOption = (e.target as HTMLInputElement).value as DisplayOption;
	};

	const handleValueChange = (e: Event, i: number) => onChange(
		produce(content, (draft) => {
			draft.items[i] = parse(
				(e.target as HTMLInputElement).value
			) ?? 0;
		})
	);
</script>

<div>
	<Box
		style={{
			display: 'flex',
			'justify-content': 'space-between',
		}}
		secondary
	>
		<label>
			Flag
			<input
				type="checkbox"
				checked={content.flag}
				on:input={handleFlagChange}
			/>
		</label>
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
	</Box>
	<Box secondary style={{ 'margin-top': '5px' }}>
		<table>
			<thead>
				<td/>
				<td>Line</td>
				<td>Value</td>
				<td>Label</td>
			</thead>
			<tbody>
			{#each content.items as item, i}
				<tr>
					<td>
						<CloseButton
							onClick={() => {
								onChange(
									produce(content, (draft) => {
										draft.items = without(draft.items, i);
									})
								)
							}}
							aria-label="remove value"
						/>
					</td>
					<td>{format(i)}</td>
					<td>
						<input
							type="text"
							value={format(item)}
							on:input={(e) => handleValueChange(e, i)}
						/>
					</td>
					<td>-</td>
				</tr>
			{/each}
			</tbody>
		</table>
		<Button
			onClick={() => {
				onChange(
					produce(content, (draft) => {
						draft.items.push(0);
					})
				);
			}}
		>
			Add new value
		</Button>
	</Box>
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
	}
	.display-as {
		margin-left: 5px;
	}
	table {
		border-collapse: collapse;
		font-size: 1rem;
		margin-bottom: 10px;
	}
	td {
		padding: 2px 0;
	}
	td:not(:last-of-type) {
		padding-right: 10px;
	}
</style>
