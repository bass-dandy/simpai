<script lang="ts">
	import { formatHex } from '$lib/util';

	// svelte does not seem to have a way to express discriminated union prop types
	// if variant = hex or float, value is a number
	// if variant = text, value is a string
	// unfortunately, this means consumers will have to cast in onChange
	export let variant: 'hex' | 'float' | 'text' = 'text';
	export let value: string | number;
	export let onChange: (value: string | number) => void;

	export let label = '';
	export let maxLength: number | undefined = undefined;
	export let disabled: boolean = false;
	export let style: string | undefined = undefined;

	$: formatValue = () => {
		switch (variant) {
			case 'hex':
				return formatHex(value as number, maxLength);
			case 'float':
				const formattedValue = (value as number).toString(); 
				return formattedValue !== 'NaN' ? formattedValue : '0';
			default:
				return value as string;
		}
	};

	// update display value when input value is committed
	$: currentValue = formatValue();

	const validate = (val: string) => {
		switch (variant) {
			case 'hex':
				return RegExp(`^(0x|0X)?[a-fA-F0-9]{0,${maxLength ?? ''}}$`).test(val);
			case 'float':
				return RegExp('^-?(\\d*)?\\.?(\\d*)?$').test(val);
			default:
				return true;
		}
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
		if (variant === 'text') {
			if (currentValue !== value) onChange(currentValue);
		} else {
			let numValue = 0;

			switch (variant) {
				case 'hex':
					numValue = parseInt(currentValue, 16);
					break;
				case 'float':
					numValue = parseFloat(currentValue);
					break;
			}

			if (Number.isNaN(numValue)) numValue = 0;

			if (numValue !== value) {
				onChange(numValue);
			} else {
				// 0x02 === 0x002 for example, so just reformat without committing a change
				currentValue = formatValue();
			}
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
