<script>
	import {getFileType} from 'dbpf-transform';
	import {defaultFileName} from '../consts';
	import {packages} from '../stores';
	import {formatHex} from '../util';
</script>

<ul>
{#each Object.entries($packages.packages[$packages.activePackageId]?.resources ?? {}) as [resourceId, resource] (resourceId)}
	<li on:click={() => packages.openResource(resourceId)}>
		<div class="file-line">
			<div class="filename">
				{
					resource.content.filename || defaultFileName[
						getFileType(resource.meta.typeId)
					]
				}
			</div>
			<div class="type">
				{getFileType(resource.meta.typeId)}
			</div>
		</div>
		<div class="file-line">
			<div class="meta">
				<div>Group</div>
				{formatHex(resource.meta.groupId)}
			</div>
			<div class="meta">
				<div>Instance (High)</div>
				{formatHex(resource.meta.instanceId2, 8)}
			</div>
			<div class="meta">
				<div>Instance</div>
				{formatHex(resource.meta.instanceId, 8)}
			</div>
		</div>
	</li>
{/each}
</ul>

<style>
	ul {
		height: 100%;
		list-style: none;
		margin: 0;
		padding: 5px 15px;
		overflow: auto;
	}
	li {
		width: 100%;
		padding: 5px 15px;
		background-color: var(--color-input);
		border: 1px solid var(--color-accent);
		transition: transform 0.1s ease-out;
	}
	li:not(:first-child) {
		margin-top: 5px;
	}
	li:hover {
		cursor: pointer;
		transform: scale(1.02, 1.02);
	}
	.file-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.file-line:first-of-type {
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
	.meta {
		font-size: 0.8rem;
	}
	.meta:nth-child(2) {
		margin: 0 15px;
	}
	.meta:last-child {
		text-align: right;
	}
</style>
