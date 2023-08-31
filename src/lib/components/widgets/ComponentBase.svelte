<script lang="ts">
	import { onMount } from 'svelte'

	export let name: string

	let Thing: any

	onMount(async () => {
		Thing = (await import(`./base/${name}.svelte`)).default
	})
</script>

<svelte:component this={Thing} let:data>
	<slot {data} />
</svelte:component>
