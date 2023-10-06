<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'

	import { storeDashboards } from '$lib/stores/dashboards.js'
	import { storeWidgets } from '$lib/stores/widgets.js'

	export let data
	$: {
		$storeDashboards = data.dashboards
		$storeWidgets = data.widgets
	}
</script>

<Module trocModule={data.trocModule} />
