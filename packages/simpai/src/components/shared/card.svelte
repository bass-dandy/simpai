<script lang="ts">
	export let onClick: () => void;
	export let isActive: boolean = false;
	export let activeStyle: string = '';
</script>

<button on:click={onClick} style={isActive ? activeStyle : ''}>
	<slot />
</button>

<style>
	button {
		display: block;
		width: 100%;
		padding: 5px 15px;
		border: 1px solid var(--color-accent);
		background-color: var(--color-input);
		transition: transform 0.1s ease-out;
		text-align: left;
	}
	button:hover, button:focus {
		cursor: pointer;
		transform: scale(1.02, 1.02);
	}
</style>
