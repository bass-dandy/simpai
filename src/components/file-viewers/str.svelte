<script>
	import {languages} from '../../consts';
	import {getLanguage} from '../../util';
	import Box from '../box.svelte';

	export let file;
</script>

<Box style={{ height: '100%', 'box-sizing': 'border-box' }}>
	<ul>
	{#each file.content.stringSets as stringSet}
		<li>
			<div class="description">
				<input
					type="text"
					value={stringSet.description}
				/>
				<select value={stringSet.languageId}>
				{#each languages as language, i}
					<option value={i + 1}>{getLanguage(i + 1)}</option>
				{/each}
				</select>
			</div>
			<textarea class="value" value={stringSet.value} />
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
	}

	.description input[type="text"] {
		flex: 1;
		margin-right: 15px;
	}

	.value {
		resize: vertical;
		margin-top: 15px;
		width: 100%;
		box-sizing: border-box;
	}
</style>
