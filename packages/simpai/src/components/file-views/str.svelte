<script lang="ts">
	import type {StrContent} from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';

	import {getLanguage} from '$lib/util';
	import {languages} from '$lib/consts';

	export let content: StrContent;
	export let onChange: (newContent: StrContent) => void;

	const handleDescChange = (e: Event, i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.stringSets[i];
			if (tgt) tgt.description = (e.target as HTMLInputElement).value;
		})
	);

	const handleLangChange = (e: Event, i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.stringSets[i];
			if (tgt) tgt.languageId = parseInt((e.target as HTMLSelectElement).value, 10);
		})
	);

	const handleValChange = (e: Event, i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.stringSets[i];
			if (tgt) tgt.value = (e.target as HTMLTextAreaElement).value;
		})
	);
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
						on:input={(e) => handleDescChange(e, i)}
					/>
				</label>
			</div>
			<div class="language">
				<label>
					Language
					<select
						class="language"
						value={stringSet.languageId}
						on:input={(e) => handleLangChange(e, i)}
					>
					{#each languages as _, i}
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
				on:input={(e) => handleValChange(e, i)}
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
	.language {
		display: block;
	}
	.value {
		resize: vertical;
		width: 100%;
	}
</style>
