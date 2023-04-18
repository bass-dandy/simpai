<script lang="ts">
	import type { TtabContent } from 'dbpf-transform';

	import Box from '$components/shared/box.svelte';

	import Settings from './settings.svelte';

	export let content: TtabContent;
	export let onChange: (newContent: TtabContent) => void;
</script>

<Box secondary style={{ height: '100%', overflow: 'auto' }}>
	<Settings {content} {onChange} index={0} />
</Box>
