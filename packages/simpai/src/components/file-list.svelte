<script lang="ts">
	import { getFileType } from 'dbpf-transform';

	import { packages, activePackage } from '$lib/stores';
	import { formatHex } from '$lib/util';

	import type { Resource } from '../types';
	import Accordion from './shared/accordion.svelte';
	import Card from './shared/card.svelte';
	import FileListActions from './file-list-actions.svelte';

	const descriptionsByFileType: Record<string, string> = {
		BCON: 'Behavior constant',
		BHAV: 'Behavior function',
		CTSS: 'Catalogue description',
		GLOB: 'Semiglobal',
		JFIF: 'Image',
		NREF: 'Name reference',
		OBJD: 'Object data',
		OBJF: 'Object functions',
		STR: 'Text lists',
		TGA: 'Image',
		TPRP: 'BHAV labels',
		TRCN: 'BCON labels',
		TTAB: 'Pie menu functions',
		TTAS: 'TTAB labels',
	};

	const getFileName = (resource: Resource) => (resource.content as { filename: string })?.filename ?? '';

	let search = '';
	let resourcesByFileType: Record<string, [string, Resource][]>;

	$: {
		const regex = new RegExp(search, 'i');

		const filteredResources = search
			? Object.entries($activePackage?.resources ?? {})
				.filter(([, resource]) => {
					return formatHex(resource.meta.groupId, 8).match(regex)
						|| formatHex(resource.meta.instanceId, 8).match(regex)
						|| formatHex(resource.meta.instanceId2, 8).match(regex)
						|| getFileName(resource).match(regex);
				})
			: Object.entries($activePackage?.resources ?? {});

		resourcesByFileType = filteredResources
			.reduce((acc: Record<string, [string, Resource][]>, [resourceId, resource]) => {
				const fileType = getFileType(resource.meta.typeId);

				const tgt: [string, Resource][] = acc[fileType] ?? [];
				tgt.push([resourceId, resource]);

				acc[fileType] = tgt;
				return acc;
			}, {});
	}
</script>

<div class="file-list">
	<FileListActions bind:search />
	<ul class="type-list">
		{#each Object.entries(resourcesByFileType).sort() as [fileType, resources] (fileType)}
			<li>
				<Accordion
					title={
						`[${fileType}] ${descriptionsByFileType[fileType] ?? ''}`
					}
					headingLevel="h2"
					id={fileType}
					contentStyle="padding: var(--spacing-sm)"
				>
					<ul class="resource-list">
						{#each resources as [resourceId, resource] (resourceId)}
							<li>
								<Card onClick={() => packages.openResource(resourceId)}>
									<div class="file-info">
										<div class="filename">
											{getFileName(resource)}
										</div>
										<div class="type">
											{fileType}
										</div>
									</div>
									<dl>
										<div class="file-meta">
											<dt>Group</dt>
											<dd>{formatHex(resource.meta.groupId)}</dd>
										</div>
										<div class="file-meta">
											<dt>Instance (High)</dt>
											<dd>{formatHex(resource.meta.instanceId2, 8)}</dd>
										</div>
										<div class="file-meta">
											<dt>Instance</dt>
											<dd>{formatHex(resource.meta.instanceId, 8)}</dd>
										</div>
									</dl>
								</Card>
							</li>
						{/each}
					</ul>
				</Accordion>
			</li>
		{/each}
	</ul>
</div>

<style>
	.file-list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.type-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		list-style-type: none;
		margin: var(--spacing-md) 0 0;
		padding: 0 var(--spacing-md);
		overflow: auto;
	}
	.resource-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.resource-list li {
		width: 100%;
	}
	.resource-list li:not(:first-child) {
		margin-top: 5px;
	}
	.file-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-bottom: 1px dashed var(--color-border);
	}
	.filename {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.type {
		margin-left: 15px;
	}
	dl {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
	}
	dl, dd, dt {
		margin: 0;
		padding: 0;
	}
	.file-meta:nth-child(2) {
		margin: 0 15px;
		text-align: center;
	}
	.file-meta:last-child {
		text-align: right;
	}
</style>
