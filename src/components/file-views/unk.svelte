<script>
	import {getFileType} from 'dbpf-transform';
	import Box from '../box.svelte';

	export let resource;
</script>

<Box secondary>No view for file of type {getFileType(resource.meta.typeId)}</Box>
