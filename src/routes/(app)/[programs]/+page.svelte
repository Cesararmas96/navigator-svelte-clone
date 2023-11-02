<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'
	import { page } from '$app/stores'
	import { storeModules } from '$lib/stores/modules'
	import { storeDashboards } from '$lib/stores/dashboards.js'

	const trocModule = $storeModules.find((item) => {
		const index = $page.url.pathname.split('/')[2] ? 2 : 1
		return item.module_name === $page.url.pathname.split('/')[index]
	})

	$storeDashboards = $page.data.dashboards
</script>

<Module {trocModule} dashboards={$storeDashboards} />
