<script>
	import DropZone from '../components/drop-zone.svelte';
	import FileList from '../components/file-list.svelte';
	import FileViewer from '../components/file-viewer.svelte';
	import Plumbob from '../components/plumbob.svelte';
	import TabPanel  from '../components/tab-panel.svelte';
	import {packages} from '../stores';
	import '../global.css';
</script>

<div class="layout">
	<div class="left">
		<div class="logo">
			<Plumbob size={60} />
			<h1>SimPE Online</h1>
		</div>
		<TabPanel
			tabs={{
				...Object.entries($packages.packages)
					.reduce((acc, [id, pkg]) => {
						acc[id] = {
							title: pkg.filename,
							content: FileList,
						};
						return acc;
					}, {}),
				'': {
					title: '+',
					content: DropZone,
					hideClose: true,
				},
			}}
			activeTab={$packages.activePackageId}
			onChange={(packageId) => packages.setActivePackage(packageId)}
			onClose={(packageId) => packages.removePackage(packageId)}
			style={{ flex: '1', overflow: 'hidden' }}
			contentStyle={{ overflow: 'hidden' }}
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
		padding: 30px;
	}
	.left {
		display: flex;
		flex-direction: column;
		max-width: 550px;
	}
	.right {
		flex: 1;
		margin-left: 15px;
		overflow: hidden;
	}
	.logo {
		display: flex;
		align-items: center;
		margin: 0 0 10px;
	}
	.logo h1 {
		margin: 0 0 0 10px;
		font-family: "sims-llhp";
		font-size: 3rem;
		color: var(--color-white);;
		-webkit-text-stroke: 1px var(--color-accent);
		-webkit-text-fill-color: white;
	}
</style>
