<script lang="ts">
	export let item: any

	let Thing: any

	if (item) {
		import(`./top/${item.component}.svelte`).then((value: any) => {
			Thing = value.default
		})
	}
</script>

{#if Thing}
	<svelte:component this={Thing} {...item.props} />
{/if}
