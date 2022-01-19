<script>
	import {getFileType} from 'dbpf-transform';
	import Box from './box.svelte';
	import FileMeta from './file-meta.svelte';
	import {getViewForFileType} from './file-views';
	import TabPanel  from './tab-panel.svelte';
	import {activeResource} from '../stores';
</script>

{#if $activeResource}
<div class="file-viewer">
	<TabPanel
		tabs={[
			{title: $activeResource.content.filename || getFileType($activeResource.meta.typeId), content: FileMeta}
		]}
		activeTab={0}
		onChange={() => null}
		style={{ 'flex-shrink': 0 }}
	/>
	<Box
		style={{
			'flex-shrink': '1',
			'min-height': '0',
			'margin-top': '15px',
			overflow: 'hidden',
		}}
	>
		<svelte:component
			this={getViewForFileType($activeResource?.meta.typeId ?? '')}
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
