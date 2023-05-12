<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import Box from './box.svelte';
	import CloseButton from './close-button.svelte';

	export let tabs: Record<string, {
		title: string;
		hideClose?: boolean;
		props?: Record<string, any>;
		content: typeof SvelteComponent;
	}>;
	export let activeTab: string;
	export let onChange: (id: string) => void;
	export let onClose: (id: string) => void;

	export let headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined = undefined;
	export let hideSingleTab = false;
	export let style: Record<string, string> = {};
	export let contentStyle: Record<string, string> = {};
</script>

<Box
	style={{
		display: 'flex',
		'flex-direction': 'column',
		...style,
	}}
>
	{#if !hideSingleTab || Object.keys(tabs).length > 1}
		<section role="tablist" tabindex="0">
		{#each Object.entries(tabs) as [id, tab] (id)}
			<div role="tab" aria-selected={activeTab === id}>
				<button
					class="tab"
					class:closable={!tab.hideClose}
					on:click={() => onChange(id)}
					disabled={activeTab === id}
				>
					{#if activeTab === id && headingLevel}
						<svelte:element this={headingLevel} class="tab-text">
							{tab.title}
						</svelte:element>
					{:else}
						<div class="tab-text">{tab.title}</div>
					{/if}
				</button>
				{#if !tab.hideClose}
					<CloseButton
						onClick={() => onClose(id)}
						aria-label="close tab"
						style={{
							position: 'absolute',
							right: '10px',
							top: '50%',
							transform: 'translateY(-50%)',
						}}
					/>
				{/if}
			</div>
		{/each}
		</section>
	{/if}
	<Box
		secondary
		style={{ flex: '1', ...contentStyle }}
	>
		<svelte:component
			this={tabs[activeTab]?.content}
			{...(tabs[activeTab]?.props ?? {})}
		/>
	</Box>
</Box>

<style>
	section[role="tablist"] {
		position: relative;
		top: 1px;
		z-index: 1;
		margin: 0 var(--spacing-md);
		display: flex;
		align-items: flex-end;
		overflow: auto;
	}
	div[role="tab"] {
		position: relative;
	}
	.tab {
		padding: 10px var(--spacing-lg) 10px var(--spacing-md);
		border: 0;
		background-color: transparent;
		border: 1px solid transparent;
		border-bottom: 0;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	.tab.closable {
		padding-right: 30px;
	}
	.tab:disabled {
		border-color: var(--color-border);
		background-color: var(--color-fg);
	}
	.tab:not(:disabled) {
		cursor: pointer;
	}
	.tab:not(:disabled):hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
	.tab-text {
		max-width: 175px;
		margin: 0;
		padding: 0;
		font-size: 1rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: sub;
	}
</style>
