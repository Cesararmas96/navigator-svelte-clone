<script>
	import { hideDashboardFilters } from '$lib/stores/dashboards'

	import { CloseButton, Drawer } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import Icon from '../common/Icon.svelte'
	import Filters from './Filters.svelte'
	import { storeStores } from '$lib/stores/modules'
	import { page } from '$app/stores'

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	const close = () => {
		$hideDashboardFilters = true
	}
</script>

<div class:hidden={$hideDashboardFilters}>
	<Drawer
		activateClickOutside={false}
		placement="right"
		transitionType="fly"
		{transitionParams}
		hidden={false}
		id="sidebarSettings"
		class="mt-[64px] w-[350px] p-0"
	>
		<div class="mb-6">
			<div class="sticky top-0 flex w-full flex-col bg-inherit bg-white p-2 dark:bg-gray-800">
				<div class="mb-2 flex items-center">
					<h5
						id="drawer-label"
						class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
					>
						<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
						Dashboard Filters
					</h5>
					<CloseButton on:click={() => close()} class="dark:text-white" />
				</div>
			</div>
			<div>
				{#if $storeStores && $storeStores[$page.params?.programs || $page.data.program?.program_slug]}
					<Filters drawer={true} />
				{/if}
			</div>
		</div>
	</Drawer>
</div>
