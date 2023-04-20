<script lang="ts">
	import type { BhavFile } from 'dbpf-transform';

	import Button from '$components/shared/button.svelte';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { formatHex } from '$lib/util';

	export let onChange: (instanceId: number) => void;
	export let value: number;
	export let label: string;
	export let style: string = '';

	$: bhavs = select($packages).resourcesByType<BhavFile>('BHAV');
	$: bhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', value);
</script>

<div style={style}>
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
</div>

<style>
	.label-with-edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	select {
		display: block;
		width: 100%;
	}
</style>
