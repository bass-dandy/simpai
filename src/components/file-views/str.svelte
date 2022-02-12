<script>
	import produce from 'immer';
	import {languages} from '../../consts';
	import {getLanguage} from '../../util';
	import Box from '../box.svelte';

	export let content;
	export let onChange;
</script>

<ul>
{#each content.stringSets as stringSet, i (i)}
	<Box as="li" style={{ 'margin-top': i ? '5px' : '0' }} secondary>
		<div class="meta">
			<div class="description">
				<label>
					Description
					<input
						type="text"
						placeholder="No description"
						value={stringSet.description}
						on:input={(e) => onChange(
							produce(content, (draft) => {
								draft.stringSets[i].description = e.target.value;
							})
						)}
					/>
				</label>
			</div>
			<div class="language">
				<label>
					Language
					<select
						class="language"
						value={stringSet.languageId}
						on:input={(e) => onChange(
							produce(content, (draft) => {
								draft.stringSets[i].languageId = parseInt(e.target.value, 10);
							})
						)}
					>
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
				on:input={(e) => onChange(
					produce(content, (draft) => {
						draft.stringSets[i].value = e.target.value;
					})
				)}
			/>
		</label>
	</Box>
{/each}
</ul>

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
