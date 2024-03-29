<script lang="ts">
	import { Boundary } from '@crownframework/svelte-error-boundary';
	import type {ComponentProps} from 'svelte';
	import {getFileType, type SimsFileContent} from 'dbpf-transform';

	import Box from '$components/shared/box.svelte';
	import TabPanel  from '$components/shared/tab-panel.svelte';

	import {select} from '$lib/selectors';
	import {activePackage, activeResource, packages} from '$lib/stores';

	import FileMeta from './file-meta.svelte';
	import {getViewForFileType} from './file-views';

	let tabs: ComponentProps<TabPanel>['tabs'];

	$: tabs = {
		...Object.entries($activePackage?.resources ?? {})
			.reduce((acc: ComponentProps<TabPanel>['tabs'], [resourceId, resource]) => {
				if (resource.isOpen) {
					acc[resourceId] = {
						title: `${
							(resource.content as { filename: string })?.filename || getFileType(resource.meta.typeId)
						}${
							select($packages).isDirty(resourceId) ? '*' : ''
						}`,
						content: FileMeta,
					};
				}
				return acc;
			}, {})
	};

	const handleChange = (contentChanges: SimsFileContent) => {
		if (contentChanges) packages.editActiveResource(contentChanges);
	};
</script>

{#if $activePackage && $activeResource}
	<div class="file-viewer">
		<TabPanel
			tabs={tabs}
			activeTab={$activePackage.activeResourceId}
			onChange={(resourceId) => packages.setActiveResource(resourceId)}
			onClose={(resourceId) => packages.closeResource(resourceId)}
			headingLevel="h2"
			style={{ 'flex-shrink': '0' }}
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
			{#key $activePackage.activeResourceId}
				<Boundary>
					<svelte:component
						this={getViewForFileType($activeResource)}
						content={$activeResource.contentChanges ?? $activeResource.content}
						onChange={handleChange}
					/>
				</Boundary>
			{/key}
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
