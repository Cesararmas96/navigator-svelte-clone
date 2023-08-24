<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte'
	import Breadcrumb from '$lib/components/layouts/Breadcrumb.svelte'
	import Header from '$lib/components/layouts/Header.svelte'
	import { storeDashboards } from '$lib/stores/dashboards.js'
	import { sidebarMin } from '$lib/stores/sidebar.js'
	import dashboardsJson from '../../../data/dashboards.json'
	import widgetsJson from '../../../data/json-widget.json'
	import { storeModules } from '$lib/stores/modules'
	import { storeWidgets } from '$lib/stores/widgets'
	import Footer from '$lib/components/layouts/Footer.svelte'

	export let data

	$storeModules = data.menu
	storeDashboards.set(dashboardsJson)
	storeWidgets.set(widgetsJson)

	let width: number
</script>

<svelte:window bind:innerWidth={width} />

<Header />

<Sidebar menu={data.menu} />

<div id="content" class={$sidebarMin ? 'content-alt' : ''}>
	<Breadcrumb />

	<div class="simplebar-scrollable-y simplebar-mouse-entered" data-simplebar="init">
		<div class="simplebar-wrapper">
			<div class="simplebar-height-auto-observer-wrapper">
				<div class="simplebar-height-auto-observer" />
			</div>
			<div class="simplebar-mask">
				<div class="simplebar-offset">
					<main class="simplebar-content p-4">
						<div class="min-h-[calc(100vh-240px)]">
							<slot />
						</div>
						<div class="ml-[5px] mr-[10px]">
							<Footer />
						</div>
					</main>
				</div>
			</div>
		</div>
	</div>
</div>
