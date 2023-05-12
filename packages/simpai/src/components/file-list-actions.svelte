<script lang="ts">
	import { packages } from '$lib/stores';
	import DownloadIcon from '$svg/file-arrow-down.svg?component';

	import Button from './shared/button.svelte';
	import AddResource from './add-resource.svelte';
	import Settings from './settings.svelte';

	export let search = '';
</script>

<div>
	<label for="file-search" class="search-label">
		Search
	</label>
	<div class="actions">
		<input
			id="file-search"
			type="text"
			placeholder="File name, group ID, or instance ID"
			bind:value={search}
		/>
		<Button
			variant="skeuomorphic"
			size={25}
			style="padding: 1px;"
			onClick={() => packages.downloadActivePackage()}
			tooltip="Download package"
			aria-label="download package"
		>
			<DownloadIcon height={20} />
		</Button>
		<AddResource />
		<Settings />
	</div>
</div>

<style>
	.search-label, .actions {
		margin: 0 15px;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
	#file-search {
		flex: 1;
	}
</style>
