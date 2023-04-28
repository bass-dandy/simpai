<script lang="ts">
	import type { BhavFile } from 'dbpf-transform';
	import Popover from 'svelte-easy-popover';

	import Button from '$components/shared/button.svelte';
	import TextInput from '$components/shared/text-input.svelte';
	import { clickOutside, globalEsc } from '$lib/actions';
	import { globals, primitives } from '$lib/bhav';
	import { select } from '$lib/selectors';
	import { packages } from '$lib/stores';
	import { formatHex } from '$lib/util';
	import ChevronIcon from '$svg/chevron-down-solid.svg?component';

	export let onChange: (instanceId: number) => void;
	export let value: number;
	export let label: string = '';
	export let style: string = '';

	const tabs = ['Local', 'Primitive', 'Global'] as const;

	let activeTab: typeof tabs[number] = 'Local';
	let isOpen = false;
	let search = '';
	let options: Record<string, string> = {};
	let popoverTgt: HTMLDivElement;
	let popoverToggle: HTMLButtonElement;

	$: localBhavs = select($packages).resourcesByType<BhavFile>('BHAV');
	$: activeLocalBhavId = select($packages).resourceIdByTypeAndInstanceId('BHAV', value);

	$: {
		switch (activeTab) {
			case 'Local':
				options = localBhavs.reduce((acc, bhav) => {
					acc[formatHex(bhav.meta.instanceId, 4)] = bhav.content.filename;
					return acc;
				}, {} as Record<string, string>);
				break;
			case 'Primitive':
				options = primitives;
				break;
			case 'Global':
				options = globals;
				break;
		}
		if (search.length >= 2) {
			options = Object.entries(options).reduce((acc, [opcode, label]) => {
				if (opcode.toLowerCase().includes(search.toLowerCase())) {
					acc[opcode] = label;
				}
				return acc;
			}, {} as Record<string, string>);
		}
	}

	const handleClose = () => {
		isOpen = false;
		popoverToggle.focus();
	};

	const handleChange = (opcode: number) => {
		onChange(opcode);
		handleClose();
	};
</script>

<div class="bhav-select" class:stacked={!!label} style={style}>
	{#if label}
		<div class="label-with-edit">
			<label for="bhav-select">
				{label}
			</label>
			{#if activeLocalBhavId}
				<Button onClick={() => activeLocalBhavId ? packages.openResource(activeLocalBhavId) : null}>
					Edit BHAV
				</Button>
			{/if}
		</div>
	{/if}

	<div class="combobox" bind:this={popoverTgt}>
		<TextInput
			variant="hex"
			maxLength={4}
			{value}
			{onChange}
			style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0; flex: 1;"
		/>
		<button
			class="popup-toggle"
			class:open={isOpen}
			on:click={() => { isOpen = !isOpen }}
			aria-label="open bhav selector"
			bind:this={popoverToggle}
		>
			<ChevronIcon height={8} />
		</button>
		<Popover
			referenceElement={popoverTgt}
			placement="bottom-end"
			spaceAway={5}
			{isOpen}
		>
			<div
				class="popup"
				use:clickOutside
				use:globalEsc
				on:outclick={handleClose}
				on:globalEsc={handleClose}
			>
				<input
					type="text"
					class="search"
					placeholder="Search by instanceId"
					bind:value={search}
					autofocus
				/>
				<ul class="tabs">
					{#each tabs as tab}
						<li>
							<button
								on:click={() => { activeTab = tab; }}
								class:active={activeTab === tab}
							>
								{tab}
							</button>
						</li>
					{/each}
				</ul>
				<ul class="options">
					{#each Object.entries(options) as [opcode, label]}
						<li class:active={opcode === formatHex(value, 4)}>
							<button on:click={() => handleChange(parseInt(opcode, 16))}>
								({opcode}) {label}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</Popover>
	</div>

	{#if !label && activeLocalBhavId}
		<Button
			onClick={() => activeLocalBhavId ? packages.openResource(activeLocalBhavId) : null}
			style="margin-left: 5px; white-space: nowrap;"
		>
			Edit BHAV
		</Button>
	{/if}
</div>

<style>
	.bhav-select {
		display: flex;
		align-items: center;
	}
	.stacked {
		flex-direction: column;
		align-items: flex-start;
	}
	.label-with-edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-lg);
		width: 100%;
	}
	.combobox {
		display: flex;
		position: relative;
		width: 100%;
	}
	.popup-toggle {
		background: var(--color-bg);
		border: 1px solid var(--color-accent);
		border-top-right-radius: 3px;
		border-bottom-right-radius: 3px;
	}
	.popup-toggle:hover, .popup-toggle.open {
		background: var(--color-accent);
		color: var(--color-input);
	}
	.popup {
		display: flex;
		flex-direction: column;
		height: 250px;
		width: 400px;
		padding: var(--spacing-sm);
		background: var(--color-bg);
		border-radius: 5px;
		border: 1px solid var(--color-accent);
		box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
	.search {
		width: 100%;
		margin-bottom: var(--spacing-sm);
	}
	.tabs {
		display: flex;
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	.tabs li {
		flex: 1;
	}
	.tabs button {
		width: 100%;
		padding: var(--spacing-sm);
		border: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: transparent;
	}
	.tabs button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
	.tabs button.active {
		background: var(--color-fg);
		border: 1px solid var(--color-accent);
		border-bottom: 0;
	}
	.options {
		flex: 1;
		list-style-type: none;
		padding: 0;
		margin: 0;
		overflow: auto;
	}
	.options button {
		width: 100%;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background: transparent;
		border: 0;
		padding: var(--spacing-sm);
	}
	.options li {
		background: var(--color-btn);
	}
	.options li:nth-child(odd) {
		background: var(--color-input);
	}
	.options li.active {
		background: var(--color-bg);
	}
	.options li:hover {
		background: var(--color-accent);
	}
	.options li:hover button, .options li.active button {
		color: var(--color-input);
	}
</style>
