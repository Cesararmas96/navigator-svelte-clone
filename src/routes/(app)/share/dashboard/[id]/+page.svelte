<script lang="ts">
	import Dashboard from '$lib/components/dashboards/Dashboard.svelte'
	import { storeUser } from '$lib/stores/session'
	export let data

	storeUser.set(data.user)
	const dashboard = { ...data.dashboard }
</script>

<div class="nav-scroll mb-2 flex h-screen w-full flex-col items-start px-2 py-3">
	<Dashboard {dashboard} isShared={true} />
</div>
