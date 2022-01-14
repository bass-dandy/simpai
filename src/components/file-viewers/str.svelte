<script>
	import {languages} from '../../consts';
	import {getLanguage} from '../../util';
	import Box from '../box.svelte';

	export let file;
</script>

<Box style={{ 'max-height': '100%' }}>
	<ul>
	{#each file.content.stringSets as stringSet, i (i)}
		<Box as="li" style={{ 'margin-top': i ? '15px' : '0' }} secondary>
			<div class="meta">
				<div class="description">
					<label>
						Description
						<input
							type="text"
							placeholder="No description"
							value={stringSet.description}
						/>
					</label>
				</div>
				<div class="language">
					<label>
						Language
						<select class="language" value={stringSet.languageId}>
						{#each languages as language, i}
							<option value={i + 1}>{getLanguage(i + 1)}</option>
						{/each}
						</select>
					</label>
				</div>
			</div>
			<label>
				Value
				<textarea
					class="value"
					placeholder="No value"
					value={stringSet.value}
				/>
			</label>
		</Box>
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

	label {
		display: block;
		margin-bottom: 0;
	}

	.meta {
		display: flex;
		margin-bottom: 15px;
	}

	.description {
		flex: 1;
		margin-right: 15px;
	}

	input {
		width: 100%;
	}

	select {
		display: block;
	}

	.value {
		resize: vertical;
		width: 100%;
	}
</style>
