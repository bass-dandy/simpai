<script lang="ts">
	import type {SimsFileContent, SimsFileMeta} from 'dbpf-transform';
	import produce from 'immer';
	import Button from './button.svelte';
	import {activeResource, packages} from '../stores';
	import {select} from '../selectors';

	import Copy from '../svg/copy.svg?component';
	import Save from '../svg/save.svg?component';
	import SaveOutline from '../svg/save-outline.svg?component';
	import Trash from '../svg/trash.svg?component';
	import Undo from '../svg/undo.svg?component';

	let dirty: boolean;
	let content: SimsFileContent | undefined;
	let meta: SimsFileMeta | undefined;

	$: {
		dirty = select($packages).isDirty();
		content = $activeResource?.contentChanges ?? $activeResource?.content;
		meta = $activeResource?.metaChanges ?? $activeResource?.meta;
	}

	const handleFilenameChange = (e: Event) => {
		if (!content || content instanceof ArrayBuffer) return;

		packages.editActiveResource(
			produce(content, (draft) => {
				draft.filename = (e.target as HTMLInputElement).value;
			})
		);
	};

	const getMetaChangeHandler = (key: 'groupId' | 'instanceId' | 'instanceId2') => (e: Event) => {
		if (!meta) return;

		packages.editActiveResourceMeta(
			produce(meta, (draft) => {
				draft[key] = parseInt((e.target as HTMLInputElement).value, 10);
			})
		);
	};
</script>

<div>
	{#if content && !(content instanceof ArrayBuffer) && Object.hasOwn(content, 'filename')}
		<label for="filename-input">File name</label>
		<input
			id="filename-input"
			type="text"
			value={content?.filename}
			on:input={handleFilenameChange}
		/>
	{/if}
	<div class="meta">
		<div class="input-wrapper">
			<label for="group-id-input">Group ID</label>
			<input
				id="group-id-input"
				type="text"
				value={meta?.groupId}
				on:input={getMetaChangeHandler('groupId')}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id2-input">Instance ID (High)</label>
			<input
				id="instance-id2-input"
				type="text"
				value={meta?.instanceId2}
				on:input={getMetaChangeHandler('instanceId2')}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id-input">Instance ID</label>
			<input
				id="instance-id-input"
				type="text"
				value={meta?.instanceId}
				on:input={getMetaChangeHandler('instanceId')}
			/>
		</div>
	</div>
	<div class="actions">
		<Button
			disabled={!dirty}
			onClick={() => packages.saveActiveResource()}
			variant="skeuomorphic"
			tooltip="Save changes"
			aria-label="Save changes"
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
			tooltip="Abandon changes"
			aria-label="Abandon changes"
		>
			<Undo height={20} />
		</Button>
		<Button
			onClick={() => packages.copyActiveResource()}
			variant="skeuomorphic"
			tooltip="Clone resource"
			aria-label="Clone resource"
		>
			<Copy height={20} />
		</Button>
		<Button
			onClick={() => packages.deleteActiveResource()}
			variant="skeuomorphic"
			tooltip="Delete resource"
			aria-label="Delete resource"
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
