<script lang="ts">
	import { onMount } from 'svelte'
	import { storeModule } from '$lib/stores/modules'

	let ModuleComp: any

	onMount(async () => {
		const modulo = await import('$lib/components/modules/Module.svelte')
		ModuleComp = modulo.default
	})
</script>

<svelte:component this={ModuleComp} trocModule={$storeModule} />
