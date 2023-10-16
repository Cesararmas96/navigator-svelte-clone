<script lang="ts">
	import Dashboard from '$lib/components/dashboards/Dashboard.svelte'
	import { storeUser } from '$lib/stores/session'
	export let data

	storeUser.set(data.user)
	const dashboard = { ...data.dashboard }
</script>

<div class="nav-scroll mb-2 flex h-full w-full flex-col items-start px-2 py-3">
	<h1 class="mb-1 px-2">{dashboard.name}</h1>
	<Dashboard {dashboard} />
</div>
