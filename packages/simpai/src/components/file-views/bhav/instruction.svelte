<script lang="ts">
	import type { BhavContent, BhavFile } from 'dbpf-transform';
	import produce from 'immer';

	import BhavSelect from '$components/shared/bhav-select.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import {select} from '$lib/selectors';
	import {packages} from '$lib/stores';
	import { formatHex } from '$lib/util';

	export let content: BhavContent;
	export let onChange: (newContent: BhavContent) => void;
	export let index: number;

	$: instruction = content.instructions[index];

	$: targets = content.instructions.map((inst, i) => {
		const bhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', inst.opcode);
		const bhav = select($packages).resourceById<BhavFile>(bhavId);

		return {
			label: `(${formatHex(i, 4)}) ${bhav?.content.filename ?? ''}`,
			opcode: i,
		};
	});

	// key:label tuple instead of object because Object.entries fucks up key types
	const tgtInputs = [
		['gotoOnTrue', 'True target'],
		['gotoOnFalse', 'False target'],
	] as const;

	const handleChange = (
		key: keyof Omit<BhavContent['instructions'][number], 'operands'>,
		val: number | string
	) => onChange(
		produce(content, (draft) => {
			const tgt = draft.instructions[index];
			if (tgt) tgt[key] = val as number;
		})
	);

	const handleOperandChange = (val: number | string, operandIndex: number) => onChange(
		produce(content, (draft) => {
			const inst = draft.instructions[index];
			if (inst) inst.operands[operandIndex] = val as number;
		})
	);
</script>

{#if instruction}
	<div class="targets">
		<BhavSelect
			label="Opcode"
			value={instruction.opcode}
			onChange={(id) => handleChange('opcode', id)}
		/>
		{#each tgtInputs as [key, label]}
			<label class="true-false-tgt">
				{label}
				<select
					value={instruction[key]}
					on:change={(e) => handleChange(key, parseInt(e.target.value))}
				>
					<option value={0xFFFC}>
						Throw error
					</option>
					<option value={0xFFFD}>
						Return true
					</option>
					<option value={0xFFFE}>
						Return false
					</option>
					{#each targets as tgt}
						<option value={tgt.opcode}>
							{tgt.label}
						</option>
					{/each}
				</select>
			</label>
		{/each}
	</div>
	<h3>Operands</h3>
	<div class="operands">
		{#each instruction.operands as operand, i}
			<TextInput
				variant="hex"
				maxLength={2}
				value={operand}
				onChange={(val) => handleOperandChange(val, i)}
				style="width: 100%"
			/>
		{/each}
	</div>
{/if}

<style>
	.targets {
		display: flex;
		align-items: flex-end;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
	}
	.true-false-tgt {
		width: 125px;
	}
	.true-false-tgt select {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	h3 {
		margin: 0;
		padding: 0;
		font-size: 1rem;
		font-weight: normal;
	}
	.operands {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: var(--spacing-xs);
	}
</style>
