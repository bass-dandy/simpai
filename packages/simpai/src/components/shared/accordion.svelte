<script lang="ts">
	import ChevronIcon from '$svg/chevron-down-solid.svg?component';

	export let title = '';
	export let id: string;
	export let headingLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	export let isInitiallyExpanded = false;

	let isExpanded = isInitiallyExpanded;
</script>

<div class="accordion">
	<button
		class="toggle"
		on:click={() => ( isExpanded = !isExpanded )}
		aria-expanded={isExpanded}
		aria-controls={id}
	>
		<svelte:element this={headingLevel} class="heading">
			{title}
		</svelte:element>
		<div class="icon" class:expanded={isExpanded}>
			<ChevronIcon height={10} />
		</div>
	</button>
	{#if isExpanded}
		<div class="content" {id}>
			<slot />
		</div>
	{/if}
</div>

<style>
	.accordion {
		border: 1px solid var(--color-border);
	}
	.toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--spacing-md);
		margin: 0;
		border: 0;
		background-color: var(--color-input);
	}
	.toggle:hover {
		background-color: var(--color-fg);
	}
	.heading {
		margin: 0;
		padding: 0;
		font-size: 1rem;
	}
	.icon {
		transform: rotate(-90deg);
		transition: transform 0.1s ease-out;
	}
	.icon.expanded {
		transform: rotate(0deg);
	}
	.content {
		padding: var(--spacing-md);
	}
</style>
