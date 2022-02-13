<script lang="ts">
	import {getFileType} from 'dbpf-transform';
	import Button from './button.svelte';
	import {defaultFileName} from '../consts';
	import {packages, activePackage} from '../stores';
	import {formatHex} from '../util';

	let search = '';
	let resources;

	const getFileName = (resource) =>
		resource.content.filename || defaultFileName[
			getFileType(resource.meta.typeId)
		];

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
	<label>
		Search
		<input
			type="text"
			placeholder="Search by file name, file type, group ID, or instance ID"
			bind:value={search}
		/>
	</label>
	<ul>
	{#each resources as [resourceId, resource] (resourceId)}
		<li>
			<Button
				variant="block"
				onClick={() => packages.openResource(resourceId)}
				style="padding: 5px 15px;"
			>
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
			</Button>
		</li>
	{/each}
	</ul>
</div>

<style>
	.file-list {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	label {
		margin: 10px 15px;
	}
	input {
		display: block;
		width: 100%;
	}
	ul {
		flex: 1;
		margin: 0;
		padding: 5px 15px;
		overflow: auto;
		list-style: none;
	}
	li {
		width: 100%;
		background-color: var(--color-input);
		border: 1px solid var(--color-accent);
		transition: transform 0.1s ease-out;
	}
	li:not(:first-child) {
		margin-top: 5px;
	}
	li:hover, li:focus-within {
		cursor: pointer;
		transform: scale(1.02, 1.02);
	}
	.file-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-bottom: 1px dashed var(--color-bg);
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
	}
	.file-meta:last-child {
		text-align: right;
	}
</style>
