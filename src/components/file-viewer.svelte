<script>
	import {getFileType} from 'dbpf-transform';
	import Box from './box.svelte';
	import FileMeta from './file-meta.svelte';
	import {getViewForFileType} from './file-views';
	import TabPanel  from './tab-panel.svelte';
	import {activePackage, activeResource, packages} from '../stores';
</script>

{#if $activeResource}
<div class="file-viewer">
	<TabPanel
		tabs={{
			...Object.entries($activePackage?.resources ?? {}).reduce((acc, [resourceId, resource]) => {
				if (resource.isOpen) {
					acc[resourceId] = {
						title: resource.content.filename || getFileType(resource.meta.typeId),
						content: FileMeta,
					};
				}
				return acc;
			}, {})
		}}
		activeTab={$activePackage?.activeResourceId}
		onChange={(resourceId) => packages.setActiveResource(resourceId)}
		onClose={(resourceId) => packages.closeResource(resourceId)}
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
{/if}

<style>
	.file-viewer {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
