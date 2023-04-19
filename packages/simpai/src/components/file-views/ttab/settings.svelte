<script lang="ts">
	import type { TtabContent, BhavFile, StrFile } from 'dbpf-transform';
	import produce from 'immer';
	import type { ComponentProps } from 'svelte';

	import Button from '$components/shared/button.svelte';
	import Subsection from '$components/shared/subsection.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { formatHex } from '$lib/util';

	import { flags, flags2, flagsAlt, flags2Alt } from './consts';

	export let content: TtabContent;
	export let onChange: (newContent: TtabContent) => void;
	export let index: number;

	type GeneratedInputField = keyof Omit<TtabContent['items'][number], 'counts' | 'humanGroups' | 'animalGroups'>;

	const inputConfigs: (
		Pick<ComponentProps<TextInput>, 'variant' | 'maxLength' | 'label'> & { key: GeneratedInputField }
	)[] = [
		{
			key: 'attenuationValue',
			variant: 'hex',
			maxLength: 8,
			label: 'Attenuation value',
		},
		{
			key: 'autonomy',
			variant: 'hex',
			maxLength: 8,
			label: 'Autonomy',
		},
		{
			key: 'joinIndex',
			variant: 'hex',
			maxLength: 8,
			label: 'Join index',
		},
		{
			key: 'uiDisplayType',
			variant: 'hex',
			maxLength: 4,
			label: 'UI display type',
		},
		{
			key: 'objectType',
			variant: 'hex',
			maxLength: 8,
			label: 'Object type',
		},
		{
			key: 'facialAnimation',
			variant: 'hex',
			maxLength: 8,
			label: 'Facial animation ID',
		},
		{
			key: 'modelTableId',
			variant: 'hex',
			maxLength: 8,
			label: 'Model table ID',
		},
		{
			key: 'memoryIterMult',
			variant: 'hex',
			maxLength: 8,
			label: 'Memory iterative multiplier',
		},
	];

	$: ttabItem = content.items[index];

	let ttasId: string | undefined;
	let ttasItems: string[] = [];

	$: {
		ttasId = select($packages).linkedResourceId('TTAS');
		const ttas = select($packages).resourceById<StrFile>(ttasId);
		ttasItems = (
			ttas?.contentChanges?.stringSets ?? ttas?.content?.stringSets ?? []
		).map((item) => item.value);
	};

	$: bhavItems = select($packages).resourcesByType<BhavFile>('BHAV');
	$: actionBhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', ttabItem?.action ?? 0);
	$: guardBhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', ttabItem?.guard ?? 0);

	$: isFlagChecked = (i: number) => {
		const bitStatus = ((ttabItem?.flags ?? 0) & (1 << i)) > 0;

		// for some reason these 3 bits are flipped
		return (i === 4 || i === 5 || i === 6) ? !bitStatus : bitStatus;
	};

	$: flagLabels = content.format > 84 ? flagsAlt : flags;
	$: flag2Labels = content.format > 84 ? flags2Alt : flags2;

	const handleChange = (key: GeneratedInputField, val: number | string) => onChange(
		produce(content, (draft) => {
			const item = draft.items[index];
			if (item) item[key] = val as number;
		})
	);

	const toggleFlag = (key: 'flags' | 'flags2', offset: number) => onChange(
		produce(content, (draft) => {
			const item = draft.items[index];
			if (item) item[key] ^= (1 << offset);
		})
	);
</script>

<div class="settings">
	<div class="input-grid">
		<div>
			<div class="label-with-edit">
				<label for="pie-string-select">
					Pie string ID
				</label>
				<Button onClick={() => ttasId ? packages.openResource(ttasId) : null}>
					Edit TTAS
				</Button>
			</div>
			<select
				value={ttabItem?.strIndex ?? 0}
				on:change={(e) => {
					handleChange('strIndex', parseInt(e.currentTarget.value));
				}}
				id="pie-string-select"
			>
				{#each ttasItems as ttasItem, i}
					<option value={i}>
						({formatHex(i, 8)}) {ttasItem}
					</option>
				{/each}
			</select>
		</div>

		<div />

		<div>
			<div class="label-with-edit">
				<label for="action-select">
					Action BHAV
				</label>
				<Button onClick={() => actionBhavId ? packages.openResource(actionBhavId) : null}>
					Edit BHAV
				</Button>
			</div>
			<select
				value={ttabItem?.action ?? 0}
				on:change={(e) => {
					handleChange('action', parseInt(e.currentTarget.value));
				}}
				id="action-select"
			>
				{#each bhavItems as bhavItem}
					<option value={bhavItem.meta.instanceId}>
						({formatHex(bhavItem.meta.instanceId, 4)}) {bhavItem.content.filename}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<div class="label-with-edit">
				<label for="guard-select">
					Guardian BHAV
				</label>
				<Button onClick={() => guardBhavId ? packages.openResource(guardBhavId) : null}>
					Edit BHAV
				</Button>
			</div>
			<select
				value={ttabItem?.guard ?? 0}
				on:change={(e) => {
					handleChange('guard', parseInt(e.currentTarget.value));
				}}
				id="guard-select"
			>
				{#each bhavItems as bhavItem}
					<option value={bhavItem.meta.instanceId}>
						({formatHex(bhavItem.meta.instanceId, 4)}) {bhavItem.content.filename}
					</option>
				{/each}
			</select>
		</div>

	</div>

	<div class="flags-wrapper">
		<Subsection
			headingLevel="h4"
			title="Flags"
			style="flex: 1"
		>
			<div class="checkbox-grid">
				{#each flagLabels as flag, i}
					<label>
						<input
							type="checkbox"
							checked={isFlagChecked(i)}
							on:change|preventDefault={() => toggleFlag('flags', i)}
						/>
						{flag}
					</label>
				{/each}
			</div>
		</Subsection>
		<Subsection
			headingLevel="h4"
			title="Flags2"
			style="flex: 1"
		>
			<div class="checkbox-grid">
				{#each flag2Labels as flag, i}
					<label>
						<input
							type="checkbox"
							checked={((ttabItem?.flags2 ?? 0) & (1 << i)) > 0}
							on:change|preventDefault={() => toggleFlag('flags2', i)}
						/>
						{flag ?? '?'}
					</label>
				{/each}
			</div>
		</Subsection>
	</div>

	<div class="input-grid">
		<TextInput
			variant="hex"
			value={ttabItem?.attenuationCode ?? 0}
			onChange={(val) => handleChange('attenuationCode', val)}
			label="Attenuation code"
			style="width: 100%"
		/>
		{#each inputConfigs as config}
			<TextInput
				{...config}
				value={ttabItem?.[config.key] ?? 0}
				onChange={(val) => handleChange(config.key, val)}
				style="width: 100%"
			/>
		{/each}
	</div>
</div>

<style>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	.label-with-edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	select {
		display: block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.flags-wrapper {
		display: flex;
		gap: 15px;
	}
	.checkbox-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5px;
	}
	.input-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
	}
</style>
