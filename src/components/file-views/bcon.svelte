<script>
	import produce from 'immer';
	import Box from '../box.svelte';
	import {formatHex} from '../../util';

	export let resource;
	export let onChange;

	const displayOptions = {
		Hex: {
			format: (val) => formatHex(val, 4),
			parse: (val) => parseInt(val, 16),
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
				checked={resource.changes?.flag ?? resource.content.flag}
				on:input={(e) => onChange(
					produce(resource.changes ?? resource.content, (draft) => {
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
	<Box
		as="ol"
		style={{ 'margin-top': '5px' }}
		secondary
	>
	{#each resource.changes?.items ?? resource.content.items as item, i}
		<li>
			<label>
				{formatHex(i, 1)}:
				<input
					type="text"
					value={format(item)}
					on:input={(e) => {
						onChange(
							produce(resource.changes ?? resource.content, (draft) => {
								draft.items[i] = parse(e.target.value);
							})
						);
					}}
				/>
			</label>
		</li>
	{/each}
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
	li {
		margin-top: 5px;
	}
	label {
		display: flex;
		align-items: center;
	}
	input {
		margin-left: 5px;
	}
</style>
