<script>
	export let style = {};
	let styleString;

	$: styleString = Object
		.entries(style)
		.map(([key, val]) => `${key}: ${val}`)
		.join(';');
</script>

<div style={styleString}>
	<slot />
</div>

<style>
	div {
		padding: 15px;
		background-color: var(--color-bg);
		border: 2px solid var(--color-accent);
		border-radius: 15px;
		box-shadow: 5px 5px 10px 0px var(--color-accent);
		font-size: 1.2rem;
	}
</style>
