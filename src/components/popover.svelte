<script lang="ts">
	export let position: 'top' | 'right' | 'bottom' | 'left' = 'top';
</script>

<div class={`popover ${position}`}>
	<slot />
</div>

<style>
	.popover {
		position: absolute;
		padding: 5px 10px;
		border-radius: 3px;
		font-size: 1rem;
		white-space: nowrap;
		color: var(--color-white);
		background-color: var(--color-accent);
		box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.25);
		z-index: 1;
	}
	.popover::after {
		content: "";
		display: block;
		position: absolute;
		height: 0;
		width: 0;
		border: 7px solid transparent;
	}
	.top {
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%);
	}
	.top::after {
		left: 50%;
		top: 100%;
		transform: translateX(-50%);
		border-top-color: var(--color-accent);
	}
	.right {
		top: 50%;
		left: calc(100% + 10px);
		transform: translateY(-50%);
	}
	.right::after {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		border-right-color: var(--color-accent);
	}
	.bottom {
		top: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%);
	}
	.bottom::after {
		left: 50%;
		bottom: 100%;
		transform: translateX(-50%);
		border-bottom-color: var(--color-accent);
	}
	.left {
		top: 50%;
		right: calc(100% + 10px);
		transform: translateY(-50%);
	}
	.left::after {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		border-left-color: var(--color-accent);
	}
</style>
