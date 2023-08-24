<script lang="ts">
	import { onMount } from 'svelte'

	export let name: string

	let Thing: any

	onMount(async () => {
		Thing = (await import(`../charts/amcharts/${name}.svelte`)).default
	})
</script>

<svelte:component this={Thing}>
	<p>some slotted content</p>
</svelte:component>
