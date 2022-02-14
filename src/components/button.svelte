<script lang="ts">
	export let onClick: () => void;
	export let variant: 'skeuomorphic' | 'block' | 'link' = 'link';
	export let style: string;

	// only used for skeuomorphic buttons
	export let size = 35;
</script>

{#if variant === 'skeuomorphic'}
	<div class="bevel" {style}>
		<button
			class={variant}
			on:click={onClick}
			style={`height: ${size}px; width: ${size}px;`}
			{...$$restProps}
		>
			<slot />
		</button>
	</div>
{:else}
	<button
		class={variant}
		on:click={onClick}
		{style}
		{...$$restProps}
	>
		<slot />
	</button>
{/if}

<style>
	.bevel {
		display: inline-block;
		width: min-content;
		padding: 2px;
		border: 1px solid var(--color-accent);
		border-radius: 50%;
		box-shadow: 1px 1px 3px 0 var(--color-black);
		background:
			radial-gradient(at bottom right, var(--color-accent), var(--color-accent) 10%, transparent 70%, #eee 85%),
			var(--color-bg);
	}
	.skeuomorphic {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-bg);
		border-radius: 50%;
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(89, 104, 158, 0.5), #eee 85%),
			rgb(135, 179, 211);
	}
	.skeuomorphic:not(:disabled):hover {
		color: var(--color-white);
		text-shadow: 1px 1px 3px var(--color-bg);
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(76, 112, 88, 0.5), #eee 85%),
			rgb(129, 219, 107);
	}
	.skeuomorphic:disabled {
		color: rgb(72, 77, 94);
		border: 1px solid rgb(72, 77, 94);
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(76, 112, 88, 0.5), rgba(255, 255, 255, 0.5) 90%),
			rgb(90, 96, 117);
	}
	.block, .link {
		margin: 0;
		padding: 0;
		border: 0;
		background-color: transparent;
		text-align: left;
	}
	.block {
		display: block;
		width: 100%;
	}
	.link {
		text-decoration: dotted underline;
		text-underline-offset: 2px;
	}
	.link:hover {
		text-decoration: underline;
	}
</style>
