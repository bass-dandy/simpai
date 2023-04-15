<script lang="ts">
	import {formatStyle} from '$lib/util';

	export let onClick: () => void;
	export let style: Record<string, string> | undefined = undefined;
</script>

<button
	on:click={onClick}
	style={style && formatStyle(style)}
	{...$$restProps}
/>

<style>
	button {
		padding: 0;
		margin: 0;
		border: 0;
		line-height: 15px;
		background-color: transparent;
		color: var(--color-accent);
	}
	button::after {
		display: block;
		width: 15px;
		height: 15px;
		content: url('/images/times-circle-regular.svg');
	}
	button:hover::after {
		content: url('/images/times-circle-solid.svg');
	}
</style>
