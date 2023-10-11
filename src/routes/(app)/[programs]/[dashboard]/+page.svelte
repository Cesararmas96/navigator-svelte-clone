<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'

	import { storeDashboards } from '$lib/stores/dashboards.js'

	export let data
	$: $storeDashboards = data.dashboards
</script>

<Module trocModule={data.trocModule} dashboards={$storeDashboards} />
