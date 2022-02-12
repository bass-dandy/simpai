<script>
	export let content;

	let src;

	$: {
		const blob = new Blob([
			new Uint8Array(content)
		], {type: "image/jpeg"});

		src = window.URL.createObjectURL(blob);
	}
</script>

<div>
	<img {src} alt="" />
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
		text-align: center;
	}
	img {
		background-color: white;
	}
</style>
