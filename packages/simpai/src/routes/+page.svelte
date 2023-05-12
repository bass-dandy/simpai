<script lang="ts">
	import { type ComponentProps, onMount, setContext } from 'svelte';

	import TabPanel  from '$components/shared/tab-panel.svelte';
	import FileList from '$components/file-list.svelte';
	import FileViewer from '$components/file-viewer.svelte';
	import Welcome from '$components/welcome.svelte';
	import { packages } from '$lib/stores';

	import '../global.css';
	import { displayMode } from '../types';

	const displayStorageKey = 'display_mode'

	const getDisplayMode = () => {
		return localStorage.getItem(displayStorageKey) as displayMode || (
			window.matchMedia('(prefers-color-scheme: dark)').matches
				? displayMode.dark
				: displayMode.light
		);
	};

	const setDisplayMode = (mode: displayMode) => {
		const root = document.querySelector(':root');

		root?.classList.remove(displayMode.light);
		root?.classList.remove(displayMode.dark);
		root?.classList.remove(displayMode.highContrast);

		root?.classList.add(mode);

		localStorage.setItem(displayStorageKey, mode);
	}

	setContext('display_mode', { getDisplayMode, setDisplayMode });

	onMount(() => setDisplayMode(getDisplayMode()));

	$: tabs = {
		...Object.entries($packages.packages)
			.reduce((acc: ComponentProps<TabPanel>['tabs'], [id, pkg]) => {
				acc[id] = {
					title: pkg.filename,
					content: FileList,
				};
				return acc;
			}, {}),
		'': {
			title: '+',
			content: Welcome,
			hideClose: true,
		},
	};
</script>

<div class="layout">
	<div class="left">
		<TabPanel
			tabs={tabs}
			activeTab={$packages.activePackageId}
			onChange={(packageId) => packages.setActivePackage(packageId)}
			onClose={(packageId) => packages.removePackage(packageId)}
			headingLevel="h1"
			style={{ width: '100%', flex: '1', 'min-height': '0' }}
			contentStyle={{ 'min-height': '0', padding: '15px 0' }}
			hideSingleTab
		/>
	</div>
	<div class="right">
		<FileViewer />
	</div>
</div>

<style>
	.layout {
		display: flex;
		height: 100vh;
		padding: var(--spacing-md);
	}
	.left {
		display: flex;
		width: 450px;
	}
	.right {
		flex: 1;
		min-width: 0;
		margin-left: var(--spacing-md);
	}
</style>
