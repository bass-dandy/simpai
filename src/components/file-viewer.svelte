<script>
	import {getFileType} from 'dbpf-transform';
	import Box from './box.svelte';
	import FileMeta from './file-meta.svelte';
	import {getViewForFileType} from './file-views';
	import TabPanel  from './tab-panel.svelte';
	import {activeResource, activeResourceIndex, openResources} from '../stores';
</script>

<div class="file-viewer">
	<TabPanel
		tabs={
			$openResources.map((resource) => ({
				title: resource.content.filename || getFileType(resource.meta.typeId),
				content: FileMeta,
			}))
		}
		activeTab={$activeResourceIndex}
		onChange={(i) => activeResourceIndex.set(i)}
		style={{ 'flex-shrink': 0 }}
		contentStyle={{ 'padding-bottom': '30px', 'position': 'relative' }}
	/>
	<Box
		style={{
			'flex-shrink': '1',
			'min-height': '0',
			'margin-top': '30px',
			overflow: 'hidden',
		}}
	>
		<svelte:component
			this={getViewForFileType($activeResource)}
			resource={$activeResource}
		/>
	</Box>
</div>

<style>
	.file-viewer {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
