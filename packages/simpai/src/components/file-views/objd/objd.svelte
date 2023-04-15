<script lang="ts">
	import type {ObjdContent} from 'dbpf-transform';

	import TabPanel from '$components/shared/tab-panel.svelte';

	import CatalogSort from './catalog-sort.svelte';
	import RawData from './raw-data.svelte';

	export let content: ObjdContent;
	export let onChange: (newContent: ObjdContent) => void;

	let activeTab = 'catalogSort';
</script>

<div class="objd-container">
	<TabPanel
		tabs={{
			catalogSort: {
				title: 'Catalog sort',
				content: CatalogSort,
				hideClose: true,
				props: {
					content,
					onChange,
				},
			},
			rawData: {
				title: 'Raw data',
				content: RawData,
				hideClose: true,
				props: {
					content,
					onChange,
				},
			},
		}}
		activeTab={activeTab}
		onChange={(id) => activeTab = id}
		onClose={() => null}
		headingLevel="h3"
		style={{ height: '100%', 'background': 'transparent', border: '0' }}
		contentStyle={{ overflow: 'auto' }}
	/>
</div>

<style>
	.objd-container {
		overflow: hidden;
		height: calc(100% + 12px);
		margin: -6px;
	}
</style>
