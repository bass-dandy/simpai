<script lang="ts">
	import type { BhavFile } from 'dbpf-transform';

	import Button from '$components/shared/button.svelte';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { formatHex } from '$lib/util';

	export let onChange: (instanceId: number) => void;
	export let value: number;
	export let label: string = '';
	export let style: string = '';

	$: bhavs = select($packages).resourcesByType<BhavFile>('BHAV');
	$: bhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', value);
</script>

<div class="bhav-select" class:stacked={!!label} style={style}>
	{#if label}
		<div class="label-with-edit">
			<label for="bhav-select">
				{label}
			</label>
			{#if bhavId}
				<Button onClick={() => bhavId ? packages.openResource(bhavId) : null}>
					Edit BHAV
				</Button>
			{/if}
		</div>
	{/if}
	<select
		value={value}
		on:change={(e) => onChange(parseInt(e.currentTarget.value))}
		id="bhav-select"
	>
		{#each bhavs as bhav}
			<option value={bhav.meta.instanceId}>
				({formatHex(bhav.meta.instanceId, 4)}) {bhav.content.filename}
			</option>
		{/each}
	</select>
	{#if !label && bhavId}
		<Button
			onClick={() => bhavId ? packages.openResource(bhavId) : null}
			style="margin-left: 5px; white-space: nowrap;"
		>
			Edit BHAV
		</Button>
	{/if}
</div>

<style>
	.bhav-select {
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.stacked {
		flex-direction: column;
		align-items: flex-start;
	}
	.label-with-edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.stacked select {
		width: 100%;
	}
	select {
		display: block;
		flex: 1;
		min-width: 0;
		text-overflow: ellipsis;
	}
</style>
