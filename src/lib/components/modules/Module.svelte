<script lang="ts">
	import { Tabs, TabItem, Modal, Button, Dropdown, DropdownItem, MenuButton } from 'flowbite-svelte'
	import Dashboard from '../dashboards/Dashboard.svelte'
	import { hideDashboardSettings, selectedDashboard, storeDashboards } from '$lib/stores/dashboards'
	import Icon from '../common/Icon.svelte'

	export let trocModule: any

	let dashboards: any
	let openDashboardId: number
	$: {
		dashboards = $storeDashboards.filter((item) => item.module_id === trocModule?.module_id)
		openDashboardId = dashboards[0].dashboard_id
	}

	let popupRemoveModal = false
	let selectedDashboardId: number

	function handleNewDashboard(event: MouseEvent) {
		event.preventDefault()
		event.stopPropagation()
		const dashboardId = new Date().getTime()
		const tab = {
			dashboard_id: dashboardId,
			description: 'New tab',
			attributes: {
				icon: 'mdi:tab',
				color: ''
			},
			module_id: trocModule.module
		}
		$storeDashboards = [...$storeDashboards, tab]
	}

	const showRemoveIcon = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		if (target.children.length === 0) return
		const icon = target.children[0].children[1]
		if (icon) icon.classList.remove('invisible')
	}

	const hideRemoveIcon = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const icon = target.children[0].children[1]
		const menu = target.children[0].children[2]
		if (icon && !menu) icon.classList.add('invisible')
	}

	const handleDashboardSettings = (event: any, dashboard: any) => {
		$hideDashboardSettings = false
		$selectedDashboard = dashboard
	}
	const handleDashboardRemove = (dashboardId: number) => {
		selectedDashboardId = dashboardId
		popupRemoveModal = true
	}
	const handleRemoveConfirm = () => {
		dashboards = dashboards.filter((d: any) => d.dashboard_id !== selectedDashboardId)
		$storeDashboards = dashboards
	}
</script>

<Tabs style="pill" contentClass="p-0 mt-2">
	<div class="card ml-[5px] mr-[10px] w-full p-1">
		<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
			{#each dashboards as dashboard}
				<TabItem
					open={dashboard.dashboard_id === openDashboardId}
					on:mouseover={showRemoveIcon}
					on:mouseleave={hideRemoveIcon}
					defaultClass="hover:nav-hover"
					on:click={() => (openDashboardId = dashboard.dashboard_id)}
				>
					<div slot="title" class="flex items-center gap-2">
						<Icon icon={dashboard.attributes.icon} size="20px" />
						{dashboard.description}
						<MenuButton
							class="dots-menu-{dashboard.dashboard_id.toString()} invisible m-0 p-0 hover:bg-gray-100 focus:ring-0 dark:text-white dark:hover:bg-gray-500 dark:focus:ring-0"
							vertical
						/>
						<Dropdown
							triggeredBy=".dots-menu-{dashboard.dashboard_id.toString()}"
							id={dashboard.dashboard_id.toString()}
						>
							<DropdownItem on:click={($event) => handleDashboardSettings($event, dashboard)}
								>Settings</DropdownItem
							>
							<DropdownItem on:click={() => handleDashboardRemove(dashboard.dashboard_id)}
								>Remove</DropdownItem
							>
						</Dropdown>
					</div>
					<Dashboard {dashboard} />
				</TabItem>
			{/each}
			<TabItem on:click={handleNewDashboard} open={dashboards.length === 0}>
				<div slot="title" class="flex items-center gap-2">
					<Icon icon="gala:add" size="20px" />
					New tab
				</div>
				<div>.</div>
			</TabItem>
		</div>
	</div>
</Tabs>

<Modal bind:open={popupRemoveModal} size="xs" autoclose>
	<div class="text-center">
		<Icon
			icon="line-md:alert-circle"
			size="70px"
			classes="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
		/>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this dashboard?
		</h3>
		<Button color="red" class="mr-2" on:click={handleRemoveConfirm}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
