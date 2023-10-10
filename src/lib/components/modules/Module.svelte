<script lang="ts">
	import { Tabs, TabItem, Modal, Button, Dropdown, DropdownItem, MenuButton } from 'flowbite-svelte'
	import Dashboard from '../dashboards/Dashboard.svelte'
	import { hideDashboardSettings, selectedDashboard, storeDashboards } from '$lib/stores/dashboards'
	import Icon from '../common/Icon.svelte'
	import { openConfirmModal, openModal } from '$lib/helpers/common/modal'
	import { patchData } from '$lib/services/getData'
	import { page } from '$app/stores'

	export let trocModule: any

	let dashboards: any
	let currentDashboard: any
	$: {
		dashboards = $storeDashboards.filter((item) => item.module_id === trocModule?.module_id)
		currentDashboard = { ...dashboards[0] }
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

	const confirmCustomize = async (impersonation: boolean) => {
		const { data } = await patchData(`${import.meta.env.VITE_API_URL}/api/v2/dashboards`, {
			dashboard_id: currentDashboard.dashboard_id,
			impersonation
		})

		// if (data.value && data.value.data && data.value.data.dashboard_id) {
		// 	window.location.reload()
		// 	// $mitt.emit(`update-dashboards-${module?.module_id}`, {
		// 	//   duid: data.value.data.duid,
		// 	// })

		// 	// $mitt.emit(`get-widgets-${props.currentDashboard.duid}`, {})

		// 	sendSuccessNotification(data.value.message)
		// } else {
		// 	// useNotify('Could not remove widget.')
		// }
	}

	const handleCustomize = async () => {
		let impersonation = true
		let description =
			'Are you sure that you want to customizable this dashboard?\nThis action cannot be undone.'

		if (currentDashboard.user_id) {
			impersonation = false
			description =
				'Are you sure that you want to publish this dashboard?\nThis action cannot be undone.'
		}

		openConfirmModal({
			title: '',
			description,
			type: 'warning',
			confirmCallback: () => confirmCustomize(impersonation)
		})
	}

	const handleConvertToModule = async () => {
		openModal('Convert To Module', 'ConvertToModule', { modules: $page.data.menu })
	}
	// $: console.log('dashboards', currentDashboard)
</script>

<Tabs style="pill" contentClass="p-0 mt-2">
	<div class="card ml-[5px] mr-[10px] w-full p-1">
		<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
			{#each dashboards as dashboard}
				<TabItem
					open={dashboard.dashboard_id === currentDashboard.dashboard_id}
					on:mouseover={showRemoveIcon}
					on:mouseleave={hideRemoveIcon}
					defaultClass="hover:nav-hover"
					on:click={() => (currentDashboard = { ...dashboard })}
				>
					<div slot="title" class="flex flex-row items-center gap-2">
						<Icon icon={dashboard.attributes.icon} size="20px" />
						<p title={dashboard?.dashboard_id}>
							{dashboard.description}
						</p>
						<div
							class:hidden={currentDashboard.dashboard_id !== dashboard.dashboard_id}
							class="flex items-center"
						>
							<!-- <Button
								class="dots-menu-{dashboard.dashboard_id.toString()} m-0 p-0 hover:bg-gray-100 focus:ring-0 dark:text-white dark:hover:bg-gray-500 dark:focus:ring-0"
							/> -->
							<Icon
								icon="tabler:chevron-down"
								size="20px"
								classes="dots-menu-{dashboard.dashboard_id.toString()}"
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
								<!-- {#if user!.superuser && currentDashboard.is_system} -->
								<DropdownItem on:click={handleCustomize}>
									{!currentDashboard.user_id ? 'Customize' : 'Publish'}</DropdownItem
								>
								<!-- {/if} -->
								<DropdownItem on:click={handleConvertToModule}>Convert to Module</DropdownItem>
							</Dropdown>
						</div>
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
