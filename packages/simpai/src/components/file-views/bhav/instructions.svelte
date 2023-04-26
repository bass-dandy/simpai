<script lang="ts">
	import type { BhavContent } from 'dbpf-transform';

	import Button from '$components/shared/button.svelte';
	import Card from '$components/shared/card.svelte';
	import { getBhavName } from '$lib/bhav';
	import { formatHex } from '$lib/util';
	import ArrowRightIcon from '$svg/arrow-right.svg?component';

	export let content: BhavContent;
	export let onChange: (i: number) => void;
	export let activeIndex: number;

	$: labelsByOpcode = content.instructions.reduce((acc, inst) => {
		acc[inst.opcode] = getBhavName(inst.opcode);
		return acc;
	}, {} as Record<string, string>);

	const getOpcodeRegion = (opcode: number) => {
		if (opcode <= 0x00FF) return 'primitive';
		if (opcode <= 0x0FFF) return 'global';
		if (opcode <= 0x1FFF) return 'local';
		if (opcode <= 0x2FFF) return 'semi-global';
		return 'unk';
	};

	const getSpecialReturn = (opcode: number) => {
		if (content.format < 0x8007) {
			if (opcode === 0xFD) return 'Error';
			if (opcode === 0xFE) return 'True';
			if (opcode === 0xFF) return 'False';
		} else {
			if (opcode === 0xFFFC) return 'Error';
			if (opcode === 0xFFFD) return 'True';
			if (opcode === 0xFFFE) return 'False';
		}
		return '';
	};
</script>

<ul class="instructions">
	{#each content.instructions as instruction, i}
		<li>
			<Card
				onClick={() => onChange(i)}
				isActive={activeIndex === i}
				activeStyle="background-color: var(--color-bg); color: var(--color-input)"
			>
				<div class="card-content">
					<div class="left">
						<div>
							{formatHex(i, 4)} [{getOpcodeRegion(instruction.opcode)} {formatHex(instruction.opcode, 4)}]
						</div>
						<div>
							{labelsByOpcode[instruction.opcode]}
						</div>
					</div>

					<div class="right">
						<div class="case">True</div>
						<ArrowRightIcon height={12} />
						{#if getSpecialReturn(instruction.gotoOnTrue)}
							{getSpecialReturn(instruction.gotoOnTrue)}
						{:else}
							<Button
								onClick={() => onChange(instruction.gotoOnTrue)}
								style={activeIndex === i ? 'color: var(--color-input);' : ''}
							>
								{formatHex(instruction.gotoOnTrue, 4)}
							</Button>
						{/if}

						<div class="case">False</div>
						<ArrowRightIcon height={12} />
						{#if getSpecialReturn(instruction.gotoOnFalse)}
							{getSpecialReturn(instruction.gotoOnFalse)}
						{:else}
							<Button
								onClick={() => onChange(instruction.gotoOnFalse)}
								style={activeIndex === i ? 'color: var(--color-input);' : ''}
							>
								{formatHex(instruction.gotoOnFalse, 4)}
							</Button>
						{/if}
					</div>
				</div>
			</Card>
		</li>
	{/each}
</ul>

<style>
	.instructions {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li:not(:first-child) {
		margin-top: var(--spacing-sm);
	}
	.card-content {
		display: flex;
		gap: var(--spacing-md);
	}
	.left {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	.right {
		min-width: 120px;
		display: grid;
		grid-template-columns: repeat(3, min-content);
		white-space: nowrap;
		gap: var(--spacing-sm);
	}
	.case {
		text-align: right;
	}
</style>
