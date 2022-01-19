<script>
	import Box from './Box.svelte';

	export let tabs;
	export let activeTab;
	export let onChange;
	export let style = {};
</script>

<Box
	style={{
		display: 'flex',
		'flex-direction': 'column',
		overflow: 'hidden',
		...style,
	}}
>
	{#if tabs.length > 1}
		<ul>
		{#each tabs as tab, i}
			<li>
				<button
					on:click={() => onChange(i)}
					disabled={activeTab === i}
				>
					{tab.title}
				</button>
			</li>
		{/each}
		</ul>
	{/if}
	<Box
		secondary
		style={{ flex: '1', overflow: 'hidden' }}
	>
		<svelte:component this={tabs[activeTab].content} />
	</Box>
</Box>

<style>
	ul {
		position: relative;
		top: 1px;
		list-style: none;
		margin: 0;
		padding: 0 15px;
		display: flex;
		overflow: auto;
	}
	button {
		padding: 10px 15px;
		border: 0;
		background-color: transparent;
		border: 1px solid transparent;
		border-bottom: 0;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	button:disabled {
		border-color: var(--color-accent);
		background-color: var(--color-fg);
	}
	button:not(:disabled) {
		cursor: pointer;
	}
	button:not(:disabled):hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
