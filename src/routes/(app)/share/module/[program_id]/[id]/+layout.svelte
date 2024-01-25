<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte'
	import Breadcrumb from '$lib/components/layouts/Breadcrumb.svelte'
	import Header from '$lib/components/layouts/Header.svelte'
	import { sidebarMin } from '$lib/stores/sidebar.js'
	import { storeDashboards } from '$lib/stores/dashboards.js'
	import { storeModule, storeModules, storeStores } from '$lib/stores/modules'
	import { storePrograms, variablesOperationalProgram } from '$lib/stores/programs.js'
	import { storeUser } from '$lib/stores/session.js'
	import { page } from '$app/stores'
	import { postData } from '$lib/services/getData.js'

	export let data

	$storeModule = data.trocModule
	$storePrograms = data.programs
	$storeUser = data.user
	$storeDashboards = data.dashboards?.map((dashboard) => {
		if ($storeUser.aux.filtering_fixed) {
			dashboard.where_cond = {
				...dashboard.where_cond,
				...$storeUser.aux.filtering_fixed
			}
		}
		return dashboard
	})
	$variablesOperationalProgram = data.variablesOperational

	const setStores = async () => {
		try {
			const stores = await postData(
				`${import.meta.env.VITE_API_URL}/api/v2/services/queries/${
					data.program.program_slug
				}_stores?refresh=1`,
				{}
			)
			if (stores)
				$storeStores = { ...$storeStores, [data.program.program_slug]: Object.values(stores) }
		} catch (error) {
			$storeStores = { ...$storeStores }
		}
	}
	if (!$storeStores || !$storeStores[data.program.program_slug]) setStores()

	let width: number
</script>

<svelte:window bind:innerWidth={width} />

<div id="shared-content" class="absolute h-screen w-full p-0">
	<Breadcrumb />

	<main>
		<slot />
	</main>
</div>
