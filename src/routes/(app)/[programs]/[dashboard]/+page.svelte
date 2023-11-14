<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'
	import { onMount } from 'svelte'

	export let data

	let ModuleComp: any

	onMount(async () => {
		const modulo = await import('$lib/components/modules/Module.svelte')
		ModuleComp = modulo.default
	})
</script>

<svelte:component this={ModuleComp} trocModule={data.trocModule} />
<!-- <Module trocModule={data.trocModule} /> -->
