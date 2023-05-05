<script lang="ts">
	import CloseButton from '$components/shared/close-button.svelte';

	export let options: {
		label: string;
		isActive: boolean;
		onSelect: () => void;
		onRemove?: () => void;
	}[];
	export let style: string = '';
</script>

<ol class="select-list" role="listbox" {style}>
	{#each options as item, i}
		<li class:active={item.isActive}>
			{#if item.onRemove}
				<CloseButton
					onClick={() => item.onRemove?.()}
					aria-label={`remove item ${i}`}
				/>
			{/if}
			<button
				class="list-option"
				on:click={item.onSelect}
				role="option"
				aria-selected={item.isActive}
			>
				{item.label}
			</button>
		</li>
	{/each}
</ol>

<style>
	.select-list {
		overflow: auto;
		list-style: none;
		padding: 0;
		margin: 0;
		border: 1px solid var(--color-border);
	}
	li {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: 0 var(--spacing-sm);
		background-color: var(--color-input);
	}
	li:nth-child(odd) {
		background-color: var(--color-fg);
	}
	li:hover {
		color: var(--color-input);
		background-color: var(--color-accent);
	}
	li:hover .list-option {
		color: var(--color-input);
	}
	li.active {
		color: var(--color-input);
		background-color: var(--color-highlight);
	}
	li.active .list-option {
		color: var(--color-input);
	}
	.list-option {
		display: block;
		flex: 1;
		padding: var(--spacing-sm);
		border: 0;
		background-color: transparent;
		text-align: left;
	}
</style>
