<script>
	import Box from '../box.svelte';
	import {formatHex} from '../../util';

	export let resource;
</script>

<div>
	<Box secondary>
		<label>
			Flag
			<input type="checkbox" checked={resource.content.flag} />
		</label>
	</Box>
	<Box
		as="ol"
		style={{ 'margin-top': '5px' }}
		secondary
	>
	{#each resource.content.items as item, i}
		<li>
			<label>
				{formatHex(i, 1)}:
				<input type="text" value={formatHex(item, 4)} />
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
