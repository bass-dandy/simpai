<script lang="ts">
	import type { TprpContent } from 'dbpf-transform';
	import produce from 'immer';

	import TabPanel from '$components/shared/tab-panel.svelte';
	import Table from '$components/shared/table.svelte';
	import TextInput from '$components/shared/text-input.svelte';

	export let content: TprpContent;
	export let onChange: (newContent: TprpContent) => void;

	let activeTab = 'params';
</script>

<TabPanel
	tabs={{
		params: {
			title: 'Params',
			hideClose: true,
			content: Table,
			props: {
				columns: ['Param', 'Label'],
				rows: content.params.map((param, i) => ({
					Param: {
						component: TextInput,
						props: {
							variant: 'hex',
							maxLength: 2,
							value: param.pdata,
							onChange: (val) => onChange(
								produce(content, (draft) => {
									const tgt = draft.params[i];
									if (tgt) tgt.pdata = val;
								})
							),
							style: 'width: 100%',
						},
					},
					Label: {
						component: TextInput,
						props: {
							value: param.label,
							onChange: (val) => onChange(
								produce(content, (draft) => {
									const tgt = draft.params[i];
									if (tgt) tgt.label = val;
								})
							),
							style: 'width: 100%',
						},
					},
				})),
			},
		},
		locals: {
			title: 'Locals',
			hideClose: true,
			content: Table,
			props: {
				columns: ['', 'Label'],
				columnConfig: {
					Label: { stretch: true },
				},
				rows: content.locals.map((local, i) => ({
					'': `${i}.`,
					Label: {
						component: TextInput,
						props: {
							value: local,
							onChange: (val) => onChange(
								produce(content, (draft) => {
									draft.locals[i] = val;
								})
							),
							style: 'width: 100%',
						},
					},
				})),
			},
		},
	}}
	{activeTab}
	onChange={(key) => {
		activeTab = key;
	}}
	onClose={() => null}
	headingLevel="h3"
	style={{ border: '0', padding: '0' }}
/>
