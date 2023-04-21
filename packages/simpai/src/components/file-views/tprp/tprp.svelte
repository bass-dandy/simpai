<script lang="ts">
	import type { TprpContent } from 'dbpf-transform';
	import produce from 'immer';

	import Box from '$components/shared/box.svelte';
	import Button from '$components/shared/button.svelte';
	import TabPanel from '$components/shared/tab-panel.svelte';
	import { defaultFileData } from '$lib/consts';
	import {select} from '$lib/selectors';
	import {packages} from '$lib/stores';

	import Params from './params.svelte';
	import Locals from './locals.svelte';

	export let content: TprpContent;
	export let onChange: (newContent: TprpContent) => void;

	let activeTab = 'param';

	const append = () => onChange(
		produce(content, (draft) => {
			if (activeTab === 'param') {
				draft.params.push({
					...(defaultFileData.TPRP.params[0] as TprpContent['params'][number])
				});
			} else {
				draft.locals.push('');
			}
		})
	);

	$: bhavId = select($packages).linkedResourceId('BHAV');
</script>

<div class="tprp-view">
	<Box
		secondary
		style={{
			display: 'flex',
			'align-items': 'center',
			gap: 'var(--spacing-md)',
		}}
	>
		{#if bhavId}
			<Button onClick={() => packages.openResource(bhavId)}>
				Edit BHAV
			</Button>
		{/if}
		<Button onClick={append}>
			Append new {activeTab}
		</Button>
	</Box>
	<TabPanel
		tabs={{
			param: {
				title: 'Params',
				hideClose: true,
				content: Params,
				props: { content, onChange },
			},
			local: {
				title: 'Locals',
				hideClose: true,
				content: Locals,
				props: { content, onChange },
			},
		}}
		{activeTab}
		onChange={(key) => { activeTab = key; }}
		onClose={() => null}
		headingLevel="h3"
		style={{
			border: '0',
			padding: '0',
			flex: '1',
			overflow: 'hidden',
		}}
		contentStyle={{ overflow: 'auto', padding: '0' }}
	/>
</div>

<style>
	.tprp-view {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		height: 100%;
		overflow: hidden;
	}
</style>
