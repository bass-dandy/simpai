<script>
	import Box from './box.svelte';
	import TabClose from './tab-close.svelte';

	export let tabs;
	export let activeTab;
	export let onChange;
	export let onClose;
	export let hideSingleTab = false;
	export let style = {};
	export let contentStyle = {};
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
					{tab.title}
				</button>
				{#if !tab.hideClose}
					<TabClose
						onClick={() => onClose(id)}
						style={{
							position: 'absolute',
							right: '10px',
							top: '50%',
							transform: 'translateY(-50%)',
						}}
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
		margin: 0;
		padding: 0 15px;
		display: flex;
		overflow: auto;
	}
	li {
		position: relative;
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
</style>
