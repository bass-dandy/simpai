<script>
	export let size;
	let style;

	$: style = size ? `transform:scale(${size / 100})` : undefined;
</script>

<div
	class="plumbob-wrapper"
	style={`height:${size}px;width:${size / 2}px`}
>
	<div {style}>
		<div class="rotator">
			<div class="triangle bottom face-1" />
			<div class="triangle bottom face-2" />
			<div class="triangle bottom face-3" />
			<div class="triangle bottom face-4" />
			<div class="triangle bottom face-5" />
			<div class="triangle bottom face-6" />
			<div class="triangle top face-1" />
			<div class="triangle top face-2" />
			<div class="triangle top face-3" />
			<div class="triangle top face-4" />
			<div class="triangle top face-5" />
			<div class="triangle top face-6" />
		</div>
	</div>
</div>

<style>
	@keyframes spin {
		from { transform: rotateY(0deg); }
		to { transform: rotateY(360deg); }
	}
	@keyframes shine {
		0% {
			border-bottom-color: var(--color-green);
			border-top-color: var(--color-green);
		}
		50% {
			border-bottom-color: var(--color-white);
			border-top-color: var(--color-white);
		}
		100% {
			border-bottom-color: var(--color-green);
			border-top-color: var(--color-green);
		}
	}
	.plumbob-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.rotator {
		position: relative;
		width: 0;
		height: 0;
		animation: spin 12s infinite linear;
		transform-style: preserve-3d;
	}
	.triangle {
		/* this height/angle combo ends up being 50px tall */
		--height: 53px;
		--angle: 19.27deg;

		position: absolute;
		left: calc(var(--height) * -1);
		width: 0;
		height: 0;
		animation: shine 12s infinite linear;
		border-left: var(--height) solid transparent;
		border-right: var(--height) solid transparent;
	}
	.top {
		bottom: -3px;
		transform-origin: 50% 0%;
		border-bottom: var(--height) solid var(--color-green);
	}
	.top.face-1 {
		transform: rotateY(0deg) rotateX(19.27deg) scaleX(.20);
	}
	.top.face-2 {
		transform: rotateY(60deg) rotateX(19.27deg) scaleX(.20);
		animation-delay: -1000ms;
	}
	.top.face-3 {
		transform: rotateY(120deg) rotateX(19.27deg) scaleX(.20);
		animation-delay: -2000ms;
	}
	.top.face-4 {
		transform: rotateY(180deg) rotateX(19.27deg) scaleX(.20);
		animation-delay: 3000ms;
	}
	.top.face-5 {
		transform: rotateY(240deg) rotateX(19.27deg) scaleX(.20);
		animation-delay: -4000ms;
	}
	.top.face-6 {
		transform: rotateY(300deg) rotateX(19.27deg) scaleX(.20);
		animation-delay: -5000ms;
	}
	.bottom {
		top: -3px;
		transform-origin: 50% 100%;
		border-top: var(--height) solid var(--color-green);
	}
	.bottom.face-1 {
		transform: rotateY(0deg) rotateX(-19.27deg) scaleX(.20);
	}
	.bottom.face-2 {
		transform: rotateY(60deg) rotateX(-19.27deg) scaleX(.20);
		animation-delay: -5000ms;
	}
	.bottom.face-3 {
		transform: rotateY(120deg) rotateX(-19.27deg) scaleX(.20);
		animation-delay: -4000ms;
	}
	.bottom.face-4 {
		transform: rotateY(180deg) rotateX(-19.27deg) scaleX(.20);
		animation-delay: -3000ms;
	}
	.bottom.face-5 {
		transform: rotateY(240deg) rotateX(-19.27deg) scaleX(.20);
		animation-delay: -2000ms;
	}
	.bottom.face-6 {
		transform: rotateY(300deg) rotateX(-19.27deg) scaleX(.20);
		animation-delay: -1000ms;
	}
</style>
