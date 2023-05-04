<script lang="ts">
	export let title: string;
	export let headingLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	export let style: string = '';
</script>

<div class="subsection" style={style}>
	<svelte:element this={headingLevel}>
		{title}
	</svelte:element>
	<slot />
</div>

<style>
	.subsection {
		position: relative;
		padding: 15px 5px 5px;
		border: 1px solid var(--color-border);
		border-radius: 5px;
	}
	h2, h3, h4, h5, h6 {
		position: absolute;
		top: 0;
		left: 20px;
		transform: translateY(-50%);
		margin: 0;
		padding: 0 10px;
		background-color: var(--color-fg);
		font-size: 1rem;
		font-weight: normal;
	}
</style>
