<script lang="ts">
	import { page } from '$app/stores'
	import Dashboard from '$lib/components/dashboards/Dashboard.svelte'
	import { postData } from '$lib/services/getData.js'
	import { storeModule, storeStores } from '$lib/stores/modules.js'
	import { storeUser } from '$lib/stores/session'
	export let data

	storeUser.set(data.user)
	storeModule.set(data.trocModule)

	const setStores = async () => {
		try {
			const stores = await postData(
				`${import.meta.env.VITE_API_URL}/api/v2/services/queries/${
					data.program.program_slug
				}_stores?refresh=1`,
				{},
				false
			)
			if (stores)
				$storeStores = { ...$storeStores, [data.program.program_slug]: Object.values(stores) }
		} catch (error) {
			$storeStores = { ...$storeStores }
		}
	}
	if (!$storeStores || !$storeStores[data.program.program_slug]) setStores()

	const dashboard = { ...data.dashboard }
</script>

<div class="nav-scroll mb-2 flex h-screen w-full flex-col items-start px-2 py-3">
	<Dashboard {dashboard} isShared={true} />
</div>
