<script lang="ts">
	export let checked: boolean;
	export let onClick: () => void;
</script>

<input
	type="checkbox"
	checked={checked}
	on:click={onClick}
/>
