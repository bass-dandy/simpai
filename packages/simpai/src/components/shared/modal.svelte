<script lang="ts">
	import {fade, fly} from 'svelte/transition';
	import Portal from 'svelte-portal/src/Portal.svelte';

	import { globalEsc, clickOutside } from '$lib/actions';
	import Box from './box.svelte';

	export let title: string | undefined = undefined;
	export let isOpen: boolean;
	export let onClose: () => void;
</script>

{#if isOpen}
<Portal>
	<div
		class="background"
		transition:fade={{ duration: 100 }}
	>
		<div
			transition:fly={{ y: -200, duration: 100 }}
			use:globalEsc
			use:clickOutside
			on:globalEsc={onClose}
			on:outclick={onClose}
		>
			<Box
				secondary
				style={{ position: 'relative' }}
			>
				{#if title}
					<h2>{title}</h2>
				{/if}
				<slot/>
			</Box>
		</div>
	</div>
</Portal>
{/if}

<style>
	.background {
		position: fixed;
		display: flex;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		padding: 15px;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
	h2 {
		margin: 0;
		margin-bottom: 10px;
		font-size: 1rem;
		border-bottom: 1px solid var(--color-border);
	}
</style>
