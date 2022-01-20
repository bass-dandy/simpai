<script>
	import Button from './button.svelte';
	import {activeResource} from '../stores';
	import Undo from '../svg/undo.svg';
	import Trash from '../svg/trash.svg';
	import Save from '../svg/save-outline.svg';
	import Copy from '../svg/copy.svg';
</script>

<div>
	{#if Object.hasOwn($activeResource?.content, 'filename')}
		<label for="filename-input">File name</label>
		<input
			id="filename-input"
			type="text"
			value={$activeResource.content.filename}
		/>
	{/if}
	<div class="meta">
		<div class="input-wrapper">
			<label for="group-id-input">Group ID</label>
			<input
				id="group-id-input"
				type="text"
				value={$activeResource.meta.groupId}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id2-input">Instance ID (High)</label>
			<input
				id="instance-id2-input"
				type="text"
				value={$activeResource.meta.instanceId2}
			/>
		</div>
		<div class="input-wrapper">
			<label for="instance-id-input">Instance ID</label>
			<input
				id="instance-id-input"
				type="text"
				value={$activeResource.meta.instanceId}
			/>
		</div>
	</div>
	<div class="actions">
		<Button disabled>
			<Save height={20}/>
		</Button>
		<Button disabled>
			<Undo height={20} />
		</Button>
		<Button>
			<Copy height={20} />
		</Button>
		<Button>
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
