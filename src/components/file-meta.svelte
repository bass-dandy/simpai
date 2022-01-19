<script>
	import {activeResource} from '../stores';
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
</div>

<style>
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
