<script lang="ts">
	export let value: string;
	export let onChange: (value: string) => void;
	export let label: string | undefined;
	export let style: string | undefined;

	const handleChange = (e: Event) => {
		onChange((e.target as HTMLInputElement).value)
	};
</script>

{#if label}
	<label>
		{label}
		<input
			type="text"
			value={value}
			on:input={handleChange}
			style={style}
		/>
	</label>
{:else}
	<input
		type="text"
		value={value}
		on:input={handleChange}
		style={style}
	/>
{/if}
