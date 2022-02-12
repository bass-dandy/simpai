<script lang="ts">
	import produce from 'immer';
	import Button from './button.svelte';
	import {activeResource, packages} from '../stores';

	import Copy from '../svg/copy.svg';
	import Save from '../svg/save.svg';
	import SaveOutline from '../svg/save-outline.svg';
	import Trash from '../svg/trash.svg';
	import Undo from '../svg/undo.svg';

	let dirty;
	let content;
	let meta;

	$: {
		dirty = $activeResource.contentChanges !== undefined || $activeResource.metaChanges !== undefined;
		content = $activeResource.contentChanges ?? $activeResource.content;
		meta = $activeResource.metaChanges ?? $activeResource.meta;
	}
</script>

<div>
	{#if Object.hasOwn($activeResource?.content, 'filename')}
		<label for="filename-input">File name</label>
		<input
			id="filename-input"
			type="text"
			value={content.filename}
			on:input={(e) => packages.editActiveResource(
				produce(content, (draft) => {
					draft.filename = e.target.value;
				})
			)}
		/>
	{/if}
	<div class="meta">
		<div class="input-wrapper">
			<label for="group-id-input">Group ID</label>
			<input
				id="group-id-input"
				type="text"
				value={meta.groupId}
				on:input={(e) => packages.editActiveResourceMeta(
					produce(meta, (draft) => {
						draft.groupId = e.target.value;
					})
				)}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id2-input">Instance ID (High)</label>
			<input
				id="instance-id2-input"
				type="text"
				value={meta.instanceId2}
				on:input={(e) => packages.editActiveResourceMeta(
					produce(meta, (draft) => {
						draft.instanceId2 = e.target.value;
					})
				)}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id-input">Instance ID</label>
			<input
				id="instance-id-input"
				type="text"
				value={meta.instanceId}
				on:input={(e) => packages.editActiveResourceMeta(
					produce(meta, (draft) => {
						draft.instanceId = e.target.value;
					})
				)}
			/>
		</div>
	</div>
	<div class="actions">
		<Button
			disabled={!dirty}
			onClick={() => packages.saveActiveResource()}
			variant="skeuomorphic"
		>
			{#if dirty}
				<Save height={20}/>
			{:else}
				<SaveOutline height={20}/>
			{/if}
		</Button>
		<Button
			disabled={!dirty}
			onClick={() => packages.resetActiveResource()}
			variant="skeuomorphic"
		>
			<Undo height={20} />
		</Button>
		<Button
			onClick={() => packages.copyActiveResource()}
			variant="skeuomorphic"
		>
			<Copy height={20} />
		</Button>
		<Button
			onClick={() => packages.deleteActiveResource()}
			variant="skeuomorphic"
		>
			<Trash height={20} />
		</Button>
	</div>
</div>

<style>
	.actions {
		position: absolute;
		bottom: 0;
		transform: translateY(23px);
	}
	.meta {
		display: flex;
	}
	.input-wrapper {
		flex: 1;
	}
	.input-wrapper:not(:last-child) {
		margin-right: 15px;
	}
	input {
		width: 100%;
	}
	#filename-input {
		margin-bottom: 15px;
	}
</style>
