<script lang="ts">
	import {getFileType} from 'dbpf-transform';

	import {defaultFileName} from '$lib/consts';
	import {packages, activePackage} from '$lib/stores';
	import {formatHex} from '$lib/util';

	import type {Resource} from '../types';
	import Card from './shared/card.svelte';
	import FileListActions from './file-list-actions.svelte';

	let search = '';
	let resources: [string, Resource][];

	const getFileName = (resource: Resource) =>
		(resource.content as { filename: string })?.filename
			|| defaultFileName[
				getFileType(resource.meta.typeId) as keyof typeof defaultFileName
			]
			|| '';

	$: {
		const regex = new RegExp(search, 'i');

		resources = search
			? Object.entries($activePackage?.resources ?? {})
				.filter(([, resource]) => {
					return formatHex(resource.meta.groupId, 8).match(regex)
						|| formatHex(resource.meta.instanceId, 8).match(regex)
						|| formatHex(resource.meta.instanceId2, 8).match(regex)
						|| getFileName(resource).toUpperCase().match(regex)
						|| getFileType(resource.meta.typeId).match(regex);
				})
			: Object.entries($activePackage?.resources ?? {});
	}
</script>

<div class="file-list">
	<FileListActions bind:search />
	<ul>
	{#each resources as [resourceId, resource] (resourceId)}
		<li>
			<Card onClick={() => packages.openResource(resourceId)}>
				<div class="file-info">
					<div class="filename">
						{getFileName(resource)}
					</div>
					<div class="type">
						{getFileType(resource.meta.typeId)}
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
</div>

<style>
	.file-list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	ul {
		flex: 1;
		margin: 10px 0 0;
		padding: 5px 15px;
		overflow: auto;
		list-style: none;
	}
	li {
		width: 100%;
	}
	li:not(:first-child) {
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
