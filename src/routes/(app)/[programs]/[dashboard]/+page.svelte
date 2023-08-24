<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'
	import { page } from '$app/stores'
	import { storeModules } from '$lib/stores/modules'

	let trocModule: any

	$: {
		trocModule = $storeModules.find((item) => item.module_name === $page.url.pathname.split('/')[2])
	}
</script>

<Module {trocModule} />
