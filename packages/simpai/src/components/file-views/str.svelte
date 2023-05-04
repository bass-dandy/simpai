<script lang="ts">
	import type {StrContent} from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import Button from '$components/shared/button.svelte';
	import CloseButton from '$components/shared/close-button.svelte';

	import { formatHex, getLanguage, without } from '$lib/util';
	import { languages, defaultFileData } from '$lib/consts';

	export let content: StrContent;
	export let onChange: (newContent: StrContent) => void;

	const append = () => onChange(
		produce(content, (draft) => {
			draft.stringSets.push({
				...(defaultFileData.STR.stringSets[0] as StrContent['stringSets'][number])
			});
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

	const handleDescChange = (e: Event, i: number) => onChange(
		produce(content, (draft) => {
			const tgt = draft.stringSets[i];
			if (tgt) tgt.description = (e.target as HTMLTextAreaElement).value;
		})
	);
</script>

<div class="str-view">
	<Box secondary>
		<Button onClick={append}>
			Append new string set
		</Button>
	</Box>
	<Box secondary style={{ flex: '1', overflow: 'auto', 'padding-top': '0' }}>
		<table>
			<thead>
				<th class="shrink" />
				<th>Value</th>
				<th>Description</th>
			</thead>
			<tbody>
				{#each content.stringSets as stringSet, i (i)}
					<tr>
						<td>
							<div class="grid">
								<CloseButton
									onClick={() => onChange(
										produce(content, (draft) => {
											draft.stringSets = without(draft.stringSets, i);
										})
									)}
									aria-label={`remove string set ${i}`}
								/>
								({formatHex(i, 4)})
								<select
									class="language"
									value={stringSet.languageId}
									on:input={(e) => handleLangChange(e, i)}
								>
									{#each languages as _, i}
										<option value={i + 1}>{getLanguage(i + 1)}</option>
									{/each}
								</select>
							</div>
						</td>
						<td>
							<textarea
								placeholder="No value"
								value={stringSet.value}
								on:input={(e) => handleValChange(e, i)}
							/>
						</td>
						<td>
							<textarea
								placeholder="No description"
								value={stringSet.description}
								on:input={(e) => handleDescChange(e, i)}
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Box>
</div>

<style>
	.str-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: var(--spacing-sm);
	}
	table {
		border-spacing: 0;
		position: relative;
		width: 100%;
	}
	th, td {
		padding: var(--spacing-sm);
		text-align: left;
		font-size: 1rem;
		border-bottom: 1px solid var(--color-border);
		white-space: nowrap;
		vertical-align: top;
	}
	tr:last-child td {
		border-bottom: 0;
	}
	th {
		position: sticky;
		top: 0;
		padding-top: var(--spacing-md);
		background-color: var(--color-fg);
	}
	.shrink {
		width: 0;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-start;
		gap: var(--spacing-sm);
	}
	.grid select {
		grid-column: span 2;
		min-width: 125px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	textarea {
		min-height: 51px;
		width: 100%;
	}
</style>
