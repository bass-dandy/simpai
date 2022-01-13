<script>
	import {getLanguage} from '../../util';
	import Box from '../box.svelte';

	export let file;
</script>

<Box style={{ height: '100%', 'box-sizing': 'border-box' }}>
	<ul>
	{#each file.content.stringSets as stringSet}
		<li>
			<div class="description">
				<span>{stringSet.description}</span>
				<span>{getLanguage(stringSet.languageId)}</span>
			</div>
			<div class="value">
				{stringSet.value}
			</div>
		</li>
	{/each}
	</ul>
</Box>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: auto;
	}

	li {
		background-color: var(--color-fg);
		padding: 15px;
		margin-bottom: 15px;
		border: 1px solid var(--color-accent);
		border-radius: 15px;
	}

	.description {
		display: flex;
		justify-content: space-between;
	}

	.value {
		background-color: var(--color-input);
		padding: 5px 15px;
		border: 1px solid var(--color-accent);
	}
</style>
