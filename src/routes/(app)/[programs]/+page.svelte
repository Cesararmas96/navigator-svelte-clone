<script lang="ts">
	import { page } from '$app/stores'
	import { storeModules } from '$lib/stores/modules'
	import { onMount } from 'svelte'
	import { storePrograms } from '$lib/stores/programs'
	import { storeUser } from '$lib/stores/session.js'

	export let data

	$storePrograms = data.programs
	$storeUser = data.user

	const trocModule = $storeModules.find((item) => {
		const index = $page.url.pathname.split('/')[2] ? 2 : 1
		return item.module_name === $page.url.pathname.split('/')[index]
	})

	let ModuleComp: any

	onMount(async () => {
		const modulo = await import('$lib/components/modules/Module.svelte')
		ModuleComp = modulo.default
	})
</script>

<svelte:component this={ModuleComp} {trocModule} />
