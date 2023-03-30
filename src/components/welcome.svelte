<script lang="ts">
	import {packages} from '../stores';
	import Button from './button.svelte';
	import DropZone from './drop-zone.svelte';

	const careerTemplate = 'career.package';
</script>

<div class="welcome">
	<div class="intro">
		<h1>SIMPAI</h1>
		Sims 2 Package Alteration Interface
	</div>
	<DropZone />
	<div class="help">
		Not sure where to start?<br />
		<Button
			onClick={async () => {
				const res = await fetch(`/simpai/templates/${careerTemplate}`);

				await packages.addPackage(
					new File([await res.arrayBuffer()], careerTemplate)
				);
			}}
			style="font-size: 1.2rem"
		>
			Try the custom career template!
		</Button>
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
</style>
