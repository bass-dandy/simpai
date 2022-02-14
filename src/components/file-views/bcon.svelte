<script lang="ts">
	import type {BconContent} from 'dbpf-transform/dist/esm/types';
	import produce from 'immer';
	import Box from '../box.svelte';
	import CloseButton from '../close-button.svelte';
	import {formatHex, formatSignedInt, without} from '../../util';

	export let content: BconContent;
	export let onChange: () => void;

	const displayOptions = {
		Hex: {
			format: (val) => formatHex(val, 4),
			parse: (val) => parseInt(val, 16),
		},
		Int: {
			format: (val) => formatSignedInt(val, 4),
			parse: (val) => new Uint16Array([parseInt(val, 10)])[0],
		},
		uInt: {
			format: (val) => val >>> 0,
			parse: (val) => parseInt(val, 10),
		},
	};

	let selectedDisplayOption = 'Hex';
	let format;
	let parse;

	$: ({format, parse} = displayOptions[selectedDisplayOption]);
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
				on:input={(e) => onChange(
					produce(content, (draft) => {
						draft.flag = e.target.checked;
					})
				)}
			/>
		</label>
		<label>
			Display as
			<select
				class="display-as"
				value={selectedDisplayOption}
				on:input={(e) => { selectedDisplayOption = e.target.value; }}
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
							on:input={(e) => {
								onChange(
									produce(content, (draft) => {
										draft.items[i] = parse(e.target.value);
									})
								);
							}}
						/>
					</td>
					<td>
						<input
							type="text"
							value={content.labels?.[i] ?? ''}
							on:input={(e) => {
								onChange(
									produce(content, (draft) => {
										draft.labels[i] = e.target.value;
									})
								);
							}}
						/>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
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
	}
	td {
		padding: 2px 0;
	}
	td:not(:first-of-type), td:not(:last-of-type) {
		padding: 2px 5px;
	}
</style>
