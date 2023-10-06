<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte'
	import Breadcrumb from '$lib/components/layouts/Breadcrumb.svelte'
	import Header from '$lib/components/layouts/Header.svelte'
	import { storeDashboards } from '$lib/stores/dashboards.js'
	import { sidebarMin } from '$lib/stores/sidebar.js'
	import { storeModules } from '$lib/stores/modules'
	import { storeWidgets } from '$lib/stores/widgets'
	import Footer from '$lib/components/layouts/Footer.svelte'

	export let data

	$storeModules = data.menu
	$storeDashboards = data.dashboards
	$storeWidgets = data.widgets

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
			<div class="ml-[5px] mr-[10px]">
				<Footer />
			</div>
		</main>
	</div>
</div>
