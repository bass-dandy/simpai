<script>
	import {getFileType} from 'dbpf-transform';
	import Box from './box.svelte';
	import {formatHex} from '../util';

	export let files;
	export let selectedFile;
</script>

<Box style={{ height: '100%' }}>
	<ul>
	{#each files as file}
		<li
			on:click={() => {
				selectedFile = file;
			}}
		>
			<div class="file-line">
				<div>{file.content.filename ?? ''}</div>
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
</Box>

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
		margin-top: 5px;
		background-color: var(--color-input);
		border: 1px solid var(--color-accent);
		transition: transform 0.1s ease-out;
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
