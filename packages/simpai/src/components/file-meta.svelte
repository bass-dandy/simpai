<script lang="ts">
	import type {SimsFileContent, SimsFileMeta} from 'dbpf-transform';
	import produce from 'immer';
	import Button from './button.svelte';
	import TextInput from './text-input.svelte';
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

	const handleFilenameChange = (val: string | number) => {
		if (!content || content instanceof ArrayBuffer) return;

		packages.editActiveResource(
			produce(content, (draft) => {
				draft.filename = val as string;
			})
		);
	};

	const getMetaChangeHandler = (key: 'groupId' | 'instanceId' | 'instanceId2') => (val: string | number) => {
		if (!meta) return;

		packages.editActiveResourceMeta(
			produce(meta, (draft) => {
				draft[key] = val as number;
			})
		);
	};
</script>

<div>
	{#if content && !(content instanceof ArrayBuffer) && Object.hasOwn(content, 'filename')}
		<TextInput
			label="File name"
			value={content?.filename}
			onChange={handleFilenameChange}
			style="margin-bottom: 15px; width: 100%;"
		/>
	{/if}
	<div class="meta">
		<div class="input-wrapper">
			<TextInput
				variant="hex"
				maxLength={8}
				label="Group ID"
				value={meta?.groupId ?? 0}
				onChange={getMetaChangeHandler('groupId')}
				style="width: 100%"
			/>
		</div>
		<div class="input-wrapper">
			<TextInput
				variant="hex"
				maxLength={8}
				label="Instance ID (High)"
				value={meta?.instanceId2 ?? 0}
				onChange={getMetaChangeHandler('instanceId2')}
				style="width: 100%"
			/>
		</div>
		<div class="input-wrapper">
			<TextInput
				variant="hex"
				maxLength={8}
				label="Instance ID"
				value={meta?.instanceId ?? 0}
				onChange={getMetaChangeHandler('instanceId')}
				style="width: 100%"
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
</style>
