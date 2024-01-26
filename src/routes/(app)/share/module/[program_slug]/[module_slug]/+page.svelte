<script lang="ts">
	import { storeModule } from '$lib/stores/modules'
	import { onMount } from 'svelte'

	let ModuleComp: any

	onMount(async () => {
		const modulo = await import('$lib/components/modules/Module.svelte')
		ModuleComp = modulo.default
	})
</script>

<svelte:component this={ModuleComp} trocModule={$storeModule} isShared={true} />
