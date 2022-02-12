<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Box from './box.svelte';

	export let tabs: {
		title: string;
		hideClose?: boolean;
		content: typeof SvelteComponent;
	}[];
	export let activeTab: string;
	export let onChange: () => void;
	export let onClose: () => void;
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
		<ul>
		{#each Object.entries(tabs) as [id, tab] (id)}
			<li>
				<button
					class="tab"
					class:closable={!tab.hideClose}
					on:click={() => onChange(id)}
					disabled={activeTab === id}
				>
					<span class="tab-text">{tab.title}</span>
				</button>
				{#if !tab.hideClose}
					<button
						class="tab-close"
						on:click={() => onClose(id)}
						aria-label="close tab"
					/>
				{/if}
			</li>
		{/each}
		</ul>
	{/if}
	<Box
		secondary
		style={{ flex: '1', ...contentStyle }}
	>
		<svelte:component this={tabs[activeTab]?.content} />
	</Box>
</Box>

<style>
	ul {
		position: relative;
		top: 1px;
		z-index: 1;
		list-style: none;
		margin: 0 15px;
		padding: 0;
		display: flex;
		align-items: flex-end;
		overflow: auto;
	}
	li {
		position: relative;
		white-space: nowrap;
	}
	.tab {
		padding: 10px 15px;
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
		border-color: var(--color-accent);
		background-color: var(--color-fg);
	}
	.tab:not(:disabled) {
		cursor: pointer;
	}
	.tab:not(:disabled):hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
	.tab-text {
		vertical-align: sub;
	}
	.tab-close {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		padding: 0;
		margin: 0;
		border: 0;
		line-height: 15px;
		background-color: transparent;
		color: var(--color-accent);
	}
	.tab-close::after {
		display: block;
		width: 15px;
		height: 15px;
		content: url('static/images/times-circle-regular.svg');
	}
	.tab-close:hover::after {
		content: url('static/images/times-circle-solid.svg');
	}
</style>
