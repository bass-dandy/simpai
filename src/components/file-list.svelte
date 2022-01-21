<script>
	import {getFileType} from 'dbpf-transform';
	import {defaultFileName} from '../consts';
	import {activePackage, openResources} from '../stores';
	import {formatHex} from '../util';
</script>

{#if $activePackage}
<ul>
{#each $activePackage.files as file, i}
	<li on:click={() => openResources.openResource(i)}>
		<div class="file-line">
			<div>
				{
					file.content.filename || defaultFileName[
						getFileType(file.meta.typeId)
					]
				}
			</div>
			<div class="type">
				{getFileType(file.meta.typeId)}
			</div>
		</div>
		<div class="file-line">
			<div class="meta">
				<div>Group</div>
				{formatHex(file.meta.groupId)}
			</div>
			<div class="meta">
				<div>Instance (High)</div>
				{formatHex(file.meta.instanceId2, 8)}
			</div>
			<div class="meta">
				<div>Instance</div>
				{formatHex(file.meta.instanceId, 8)}
			</div>
		</div>
	</li>
{/each}
</ul>
{/if}

<style>
	ul {
		height: 100%;
		list-style: none;
		margin: 0;
		padding: 0;
		width: max-content;
		overflow: auto;
	}
	li {
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
	.type {
		margin-left: 20px;
	}
	.meta {
		font-size: 0.8rem;
	}
	.meta:last-child {
		text-align: right;
	}
</style>
