<script>
	export let onClick;
</script>

<div class="bevel">
	<button on:click={onClick} {...$$props}>
		<slot />
	</button>
</div>

<style>
	.bevel {
		display: inline-block;
		width: min-content;
		padding: 2px;
		border: 1px solid var(--color-accent);
		border-radius: 50%;
		box-shadow: 1px 1px 3px 0 var(--color-black);
		background:
			radial-gradient(at bottom right, var(--color-accent), var(--color-accent) 10%, transparent 70%, #eee 85%),
			var(--color-bg);
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 35px;
		height: 35px;
		border: 1px solid var(--color-bg);
		border-radius: 50%;
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(89, 104, 158, 0.5), #eee 85%),
			rgb(135, 179, 211);
	}
	button:not(:disabled):hover {
		color: var(--color-white);
		text-shadow: 1px 1px 3px var(--color-bg);
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(76, 112, 88, 0.5), #eee 85%),
			rgb(129, 219, 107);
	}
	button:disabled {
		color: rgb(72, 77, 94);
		border: 1px solid rgb(72, 77, 94);
		background:
			radial-gradient(at bottom right, transparent 0%, transparent 50%, rgba(76, 112, 88, 0.5), rgba(255, 255, 255, 0.5) 90%),
			rgb(90, 96, 117);
	}
</style>
