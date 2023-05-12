<script lang="ts">
	import ChevronIcon from '$svg/chevron-down-solid.svg?component';

	export let title = '';
	export let id: string;
	export let headingLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	export let isInitiallyExpanded = false;
	export let style = '';
	export let toggleStyle = '';
	export let contentStyle = '';

	let isExpanded = isInitiallyExpanded;
	let isContentHidden = !isExpanded;
	let timeoutId: NodeJS.Timeout | undefined = undefined;
	let contentRef: HTMLDivElement;

	const toggle = () => {
		clearTimeout(timeoutId);

		if (!isExpanded) {
			isExpanded = true;
			isContentHidden = false;
		} else {
			isExpanded = false;
			timeoutId = setTimeout(() => {
				isContentHidden = true;
			}, 200)
		}
	};
</script>

<div class="accordion" {style}>
	<button
		class="toggle"
		on:click={toggle}
		aria-expanded={isExpanded}
		aria-controls={id}
		style={toggleStyle}
	>
		<svelte:element this={headingLevel} class="heading">
			{title}
		</svelte:element>
		<div class="icon" class:expanded={isExpanded}>
			<ChevronIcon height={10} />
		</div>
	</button>
	<div
		{id}
		class="expander"
		class:expanded={isExpanded}
		style={isExpanded && contentRef ? `height: ${contentRef.clientHeight}px` : ''}
	>
		<div
			class="content"
			class:hidden={isContentHidden}
			bind:this={contentRef}
			style={contentStyle}
		>
			<slot />
		</div>
	</div>
</div>

<style>
	.accordion {
		border: 1px solid var(--color-border);
	}
	.toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--spacing-md);
		margin: 0;
		border: 0;
		background-color: var(--color-input);
	}
	.toggle:hover {
		background-color: var(--color-fg);
	}
	.heading {
		margin: 0;
		padding: 0;
		font-size: 1rem;
	}
	.icon {
		transform: rotate(-90deg);
		transition: transform 0.2s ease-out;
	}
	.icon.expanded {
		transform: rotate(0deg);
	}
	.expander {
		overflow: hidden;
		transition: height 0.2s ease-out;
	}
	.expander:not(.expanded) {
		height: 0px;
	}
	.content {
		padding: var(--spacing-md);
	}
	.content.hidden {
		display: none;
	}
</style>
