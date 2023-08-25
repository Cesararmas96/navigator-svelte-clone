<script lang="ts">
	import { onMount } from 'svelte'

	export let name: string
	export let data: any
	export let methods: string[]

	let Thing: any

	onMount(async () => {
		Thing = (await import(`./type/${name}.svelte`)).default
	})
</script>

<svelte:component this={Thing} {data} {methods} />
