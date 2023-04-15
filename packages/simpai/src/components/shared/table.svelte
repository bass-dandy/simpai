<script lang="ts">
	import type { ComponentType } from 'svelte';

	import Box from './box.svelte';

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
		};
	} | undefined = undefined;

	export let rows: {
		[key: string]: string | number | undefined | ComponentProp | ElementProp;
	}[];

	const isComponentProp = (prop: any): prop is ComponentProp => {
		return prop && typeof prop !== 'string' && typeof prop !== 'number' && prop.component;
	};

	const isElementProp = (prop: any): prop is ElementProp => {
		return prop && typeof prop !== 'string' && typeof prop !== 'number' && prop.element;;
	};
</script>

<Box
	secondary
	style={{
		overflow: 'auto',
		flex: '1',
		'padding-top': '0',
	}}
>
	<table>
		<thead>
			{#each columns as column}
				<th
					class:stretch="{columnConfig?.[column]?.stretch}"
					class:shrink="{columnConfig?.[column]?.shrink}"
				>
					{column}
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
</Box>

<style>
	table {
		width: 100%;
		font-size: 1rem;
		margin-bottom: 10px;
		position: relative;
		border-spacing: 0;
	}
	th, tr:not(:last-child) > td {
		border-bottom: 1px solid var(--color-accent);
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