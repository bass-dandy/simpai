<script>
	import {formatStyle} from '../util';
	import Close from '../svg/times-circle-regular.svg';
	import CloseFilled from '../svg/times-circle-solid.svg';

	export let onClick;
	export let style;

	let isHovered;
	const hover = () => { isHovered = true; };
	const unhover = () => { isHovered = false; };
</script>

<button
	style={formatStyle(style)}
	on:click={onClick}
	on:mouseenter={hover}
	on:mouseleave={unhover}
	on:focus={hover}
	on:blur={unhover}
	aria-label="close tab"
>
	{#if isHovered}
		<CloseFilled height={15} />
	{:else}
		<Close height={15} />
	{/if}
</button>

<style>
	button {
		padding: 0;
		margin: 0;
		border: 0;
		line-height: 15px;
		background-color: transparent;
		color: var(--color-accent);
	}
</style>
