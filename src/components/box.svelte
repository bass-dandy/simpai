<script lang="ts">
	import {formatStyle} from '../util';

	export let style: Record<string, string> = {};
	export let secondary = false;
	export let as = 'div';

	let props: {
		style: string;
		class: 'primary' | 'secondary';
	};

	$: props = {
		style: formatStyle(style),
		class: secondary ? 'secondary' : 'primary',
	};
</script>

{#if as === 'div'}
<div {...props}>
	<slot />
</div>
{:else if as === 'ul'}
<ul {...props}>
	<slot />
</ul>
{:else if as === 'ol'}
<ol {...props}>
	<slot />
</ol>
{:else if as === 'li'}
<li {...props}>
	<slot />
</li>
{/if}

<style>
	div, ul, ol, li {
		border: 1px solid var(--color-accent);
		border-radius: 15px;
		font-size: 1.2rem;
	}
	ul, ol {
		list-style: none;
		margin: 0;
	}
	.primary {
		padding: 5px;
		background-color: var(--color-bg);
	}
	.secondary {
		padding: 15px;
		background-color: var(--color-fg);
	}
</style>
