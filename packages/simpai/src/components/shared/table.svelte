<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface ComponentProp {
		component: ComponentType;
		props: any;
	};

	interface ElementProp {
		element: string;
		props: any;
	};

	export let columns: string[];

	export let columnConfig: {
		[key: string]: {
			stretch?: boolean;
			shrink?: boolean;
			hideTitle?: boolean;
		};
	} | undefined = undefined;

	export let rows: {
		[key: string]: string | number | undefined | ComponentProp | ElementProp;
	}[];

	export let style: string = '';

	const isComponentProp = (prop: any): prop is ComponentProp => {
		return prop && typeof prop !== 'string' && typeof prop !== 'number' && prop.component;
	};

	const isElementProp = (prop: any): prop is ElementProp => {
		return prop && typeof prop !== 'string' && typeof prop !== 'number' && prop.element;;
	};
</script>

<table {style}>
	<thead>
		{#each columns as column}
			<th
				class:stretch="{columnConfig?.[column]?.stretch}"
				class:shrink="{columnConfig?.[column]?.shrink}"
			>
				{#if !columnConfig?.[column]?.hideTitle}
					{column}
				{/if}
			</th>
		{/each}
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				{#each columns as column}
					{@const cellData = row[column]}
					<td>
						{#if isComponentProp(cellData)}
							<svelte:component
								this={cellData.component}
								{...(cellData.props ?? {})}
							/>
						{:else if isElementProp(cellData)}
							<svelte:element
								this={cellData.element}
								{...(cellData.props ?? {})}
							/>
						{:else}
							{cellData ?? '-'}
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		font-size: 1rem;
		margin-bottom: 10px;
		position: relative;
		border-spacing: 0;
	}
	th, tr:not(:last-child) > td {
		border-bottom: 1px solid var(--color-border);
	}
	th, td {
		padding: 5px;
		text-align: left;
	}
	th {
		top: 0;
		position: sticky;
		background-color: var(--color-fg);
		padding-top: 15px;
		padding-bottom: 10px;
		z-index: 1;
	}
	.stretch {
		width: 100%;
	}
	.shrink {
		width: 0;
	}
	td:not(:last-of-type) {
		padding-right: 10px;
	}
</style>
