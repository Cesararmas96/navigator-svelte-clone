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

	$storeModules = data.menu
	$storeModule = data.trocModule
	$storePrograms = data.programs
	$storeUser = data.user
	$storeDashboards = data.dashboards.map((dashboard) => {
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
		const stores = await postData(
			`${import.meta.env.VITE_API_URL}/api/v2/services/queries/${
				$page.params.programs
			}_stores?refresh=1`,
			{}
		)
		$storeStores = { ...$storeStores, [$page.params.programs]: Object.values(stores) }
	}
	if (!$storeStores || !$storeStores[$page.params.programs]) setStores()

	let width: number
</script>

<svelte:window bind:innerWidth={width} />

<Header />

<Sidebar menu={data.menu} />

<div id="content" class={$sidebarMin ? 'content-alt' : ''}>
	<Breadcrumb />

	<div data-simplebar>
		<main class=" p-4">
			<div class="min-h-[calc(100vh-240px)]">
				<slot />
			</div>
			<!-- <div class="ml-[5px] mr-[10px]">
				<Footer />
			</div> -->
		</main>
	</div>
</div>
