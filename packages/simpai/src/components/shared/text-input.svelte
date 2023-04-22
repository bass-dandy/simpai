<script lang="ts">
	import { formatHex } from '$lib/util';

	// svelte does not seem to have a way to express discriminated union prop types
	// if variant = hex, value is a number
	// if variant = text, value is a string
	// unfortunately, this means consumers will have to cast
	export let variant: 'hex' | 'text' = 'text';
	export let value: string | number;
	export let onChange: (value: string | number) => void;

	export let label = '';
	export let maxLength: number | undefined = undefined;
	export let disabled: boolean = false;
	export let style: string | undefined = undefined;

	// update display value when input value is committed
	$: currentValue = variant === 'hex' ? formatHex(value as number, maxLength) : value as string;

	const validate = (val: string) => {
		const validationPattern = variant === 'hex' 
			? `^(0x|0X)?[a-fA-F0-9]{0,${maxLength ?? ''}}$`
			: '';

		return RegExp(validationPattern).test(val);
	};

	const handleChange = (e: Event) => {
		const tgt = e.target as HTMLInputElement;

		if (validate(tgt.value)) {
			// update state to match input
			currentValue = tgt.value;
		} else {
			// reset input to last valid state
			tgt.value = currentValue;
		}
	};

	const commitValue = () => {
			if (variant === 'hex') {
				const numValue = parseInt(currentValue, 16);

				if (numValue !== value) {
					onChange(numValue);
				} else {
					// 0x02 === 0x002 for example, so just reformat without committing a change
					currentValue = formatHex(value, maxLength);
				}
			} else if (currentValue !== value) {
				onChange(currentValue);
			}
	};
</script>

{#if label}
	<label>
		{label}
		<input
			type="text"
			value={currentValue}
			on:input|preventDefault={handleChange}
			on:blur={commitValue}
			disabled={disabled}
			class="labeled"
			style={style}
		/>
	</label>
{:else}
	<input
		type="text"
		value={currentValue}
		on:input|preventDefault={handleChange}
		on:blur={commitValue}
		disabled={disabled}
		style={style}
	/>
{/if}

<style>
	.labeled {
		display: block;
	}
</style>
