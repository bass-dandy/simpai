<script>
	import Box from '../box.svelte';

	export let file;
	let src;

	$: {
		const blob = new Blob([
			new Uint8Array(file.content)
		], {type: "image/jpeg"});

		src = window.URL.createObjectURL(blob);
	}
</script>

<Box>
	<div>
		<img {src} alt="" />
	</div>
</Box>

<style>
	div {
		text-align: center;
	}

	img {
		background-color: white;
	}
</style>
