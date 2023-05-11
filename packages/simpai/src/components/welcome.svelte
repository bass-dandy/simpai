<script lang="ts">
	import Button from '$components/shared/button.svelte';
	import {packages} from '$lib/stores';

	import DropZone from './shared/drop-zone.svelte';
	import Plumbob from './shared/plumbob.svelte';

	const openTemplate = async (filename: string) => {
		const res = await fetch(`/simpai/templates/${filename}`);

		await packages.addPackage(
			new File([await res.arrayBuffer()], filename)
		);
	};
</script>

<div class="welcome">
	<div class="intro">
		<h1>SIMPAI</h1>
		Sims 2 Package Alteration Interface
	</div>
	<DropZone
		accept=".package"
		onDrop={packages.addPackage}
		style="margin: var(--spacing-sm) var(--spacing-md)"
	>
		<Plumbob size={50} />
		<span class="dropzone-text">
			Drag .package file here or
		</span>
	</DropZone>
	<div class="help">
		Or start from one of these templates:<br />
		<ul class="template-list">
			<li>
				<Button
					onClick={() => packages.addEmptyPackage('empty.package')}
					style="font-size: 1.2rem"
				>
					Empty package
				</Button>
			</li>
			<li>
				<Button
					onClick={() => openTemplate('career.package')}
					style="font-size: 1.2rem"
				>
					Custom career
				</Button>
			</li>
		</ul>
	</div>
</div>

<style>
	.welcome {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.intro {
		margin-bottom: 15px;
		text-align: center;
		font-size: 0.8rem;
	}
	h1 {
		margin: 0 0 0 10px;
		font-family: "sims-llhp";
		font-size: 5rem;
		color: var(--color-white);;
		-webkit-text-stroke: 1px var(--color-accent);
		-webkit-text-fill-color: white;
	}
	.help {
		margin-top: 15px;
		text-align: center;
	}
	.template-list {
		width: max-content;
		margin: auto;
		padding: 0;
		text-align: left;
	}
	.dropzone-text {
		margin-top: 10px;
	}
</style>
