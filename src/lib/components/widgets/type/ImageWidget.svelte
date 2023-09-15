<script lang="ts">
	export let data: string

	let url: string
	$: url = data
</script>

{#if url}
	<!-- svelte-ignore a11y-missing-attribute -->
	<img src={url} class="w-full" />
{/if}
