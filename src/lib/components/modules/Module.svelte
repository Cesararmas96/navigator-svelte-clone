<script lang="ts">
	import { Tabs, TabItem, Modal, Button, Dropdown, DropdownItem, MenuButton } from 'flowbite-svelte'
	import Dashboard from '../dashboards/Dashboard.svelte'
	import {
		hideDashboardSettings,
		selectedDashboard,
		storeCCPDashboard,
		storeCCPDashboardBehavior,
		storeDashboards
	} from '$lib/stores/dashboards'
	import Icon from '../common/Icon.svelte'
	import { openConfirmModal, openModal } from '$lib/helpers/common/modal'
	import { getApiData, patchData } from '$lib/services/getData'
	import { page } from '$app/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { clearAlerts, sendAlert, sendInfoAlert } from '$lib/helpers/common/alerts'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'

	export let trocModule: any
	export let dashboards: any

	const baseUrl = import.meta.env.VITE_API_URL

	let pastedDashboard: any

	let dropdownOpen = false

	clearAlerts()

	$: currentDashboard = dashboards && dashboards.length > 0 ? { ...dashboards[0] } : {}
	$: if (!dashboards || dashboards?.length === 0)
		sendInfoAlert(
			'There are no dashboards here yet. But you can start to add them by clicking on the "New tab" buttom above'
		)

	$: userId = currentDashboard?.user_id

	$: if (pastedDashboard) {
		dashboards = [...dashboards, pastedDashboard]
	}

	// $: {
	// 	dashboards = $storeDashboards.filter((item) => item.module_id === trocModule?.module_id)
	// 	currentDashboard = { ...dashboards[0] }
	// }

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
		try {
			const resp = await patchData(`${import.meta.env.VITE_API_URL}/api/v2/dashboards`, {
				dashboard_id: currentDashboard.dashboard_id,
				impersonation
			})
			if (resp.data && resp.data.dashboard_id) {
				currentDashboard = { ...resp.data }
				dashboards = dashboards.map((item) => {
					if (item.dashboard_id === currentDashboard.dashboard_id) {
						return currentDashboard
					}
					return item
				})
				sendSuccessNotification(resp.message)
			} else {
				// useNotify('Could not remove widget.')
			}
		} catch (e: any) {
			sendErrorNotification(e.message)
		}
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
		openModal('Convert To Module', 'ConvertToModule', {
			modules: $page.data.menu,
			dashboard: currentDashboard
		})
	}

	const handleDashboardCopy = (behavior: string) => {
		storeCCPDashboard.set(currentDashboard)
		storeCCPDashboardBehavior.set(behavior)
		addDashboardCopyAlert()
		dropdownOpen = false
	}

	const handleDashboardPaste = async () => {
		// 1. Get dashboard from session storage
		let copiedDashboard: any = $storeCCPDashboard
		// TODO if widget does not exist, a modal should appear telling the user nothing was copied
		if (!copiedDashboard) return
		// TODO get session from session storage
		// 2. Extract data
		const { duid, module_id } = copiedDashboard
		// 3. Build the payload
		const payload = { duid, module_id }
		console.log(payload)
		// 4. Clone the dashboard
		try {
			// 4.1 Make API request to insert the widget
			console.log($storeDashboards)
			pastedDashboard = copiedDashboard
			clearCopyDashboard()

			await getApiData(`${baseUrl}/api/v2/dashboard/clone`, 'POST', payload).then((d) => {
				// 4.2 Insert the widget into widgets store
				clearCopyDashboard()
				$storeDashboards.push(d.data)
				console.log($storeDashboards)
			})
		} catch (e: any) {
			console.log(`There was an error: ${e.message}`)
		}
		if ($storeCCPDashboardBehavior === 'cut') {
			await getApiData(`${baseUrl}/api/v2/dashboards/${currentDashboard.uid}`, 'DELETE')
		}
	}

	const clearCopyDashboard = () => {
		storeCCPDashboard.set(null)
		storeCCPDashboardBehavior.set(null)
	}

	const addDashboardCopyAlert = () => {
		const behavior = $storeCCPDashboardBehavior
		const alert: AlertMessage = {
			id: 'top-dashboard-copied',
			title: `Dashboard ${behavior === 'copy' ? 'copied' : 'cut'}`,
			message: `You have a dashboard ${
				behavior === 'copy' ? 'copied' : 'cut'
			} in clipboard. Use Paste Dashboard button to paste it`,
			type: AlertType.INFO,
			callback1Btn: 'Paste Dashboard',
			callback1: handleDashboardPaste,
			callback2Btn: 'Clear',
			callback2: clearCopyDashboard
		}
		sendAlert(alert)
	}

	const handleShareDashboard = () => {
		console.log('handleShareDashboard', currentDashboard)
		const url = `/share/dashboard/${currentDashboard.program_id}/${currentDashboard.module_id}/${currentDashboard.duid}`
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('target', '_blank')
		link.click()
		dropdownOpen = false
	}
	$: if ($storeCCPDashboard) addDashboardCopyAlert()
</script>

<Alerts position="top" />

<Tabs style="pill" contentClass="p-0 mt-2">
	<div class="card ml-[5px] mr-[10px] w-full p-1">
		<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
			{#if dashboards}
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
								{dashboard.name}
							</p>
							<div
								class:hidden={currentDashboard.dashboard_id !== dashboard.dashboard_id}
								class="flex items-center"
							>
								<Icon
									icon="tabler:chevron-down"
									size="20px"
									on:click={() => (dropdownOpen = !dropdownOpen)}
								/>
								<Dropdown bind:open={dropdownOpen} id={dashboard.dashboard_id.toString()}>
									<!-- <DropdownItem
										on:click={($event) => handleDashboardSettings($event, dashboard)}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="tabler:settings" size="18" classes="mr-1" />
										Settings</DropdownItem
									> -->
									<DropdownItem
										on:click={() => handleDashboardCopy('copy')}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="mdi:content-copy" size="18" classes="mr-1" />
										Copy dashboard</DropdownItem
									>
									<DropdownItem
										on:click={() => handleDashboardCopy('cut')}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="mdi:content-cut" size="18" classes="mr-1" />
										Cut dashboard</DropdownItem
									>
									<!-- {#if user!.superuser && currentDashboard.is_system} -->
									<DropdownItem
										on:click={handleCustomize}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon
											icon={!userId ? 'mdi:file-edit-outline' : 'mdi:publish'}
											size="18"
											classes="mr-1"
										/>
										{!userId ? 'Customize' : 'Publish'}</DropdownItem
									>
									<!-- {/if} -->
									<DropdownItem
										on:click={handleConvertToModule}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="fluent:convert-range-20-regular" size="18" classes="mr-1" />
										Convert to Module</DropdownItem
									>
									<DropdownItem
										on:click={handleShareDashboard}
										defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="mdi:share-variant" size="18" classes="mr-1" />
										Share Dashboard</DropdownItem
									>
									<DropdownItem
										on:click={() => handleDashboardRemove(dashboard.dashboard_id)}
										defaultClass="flex flex-row text-red-500 font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
									>
										<Icon icon="tabler:trash" size="18" classes="mr-1" />
										Remove</DropdownItem
									>
								</Dropdown>
							</div>
						</div>
						<Dashboard {dashboard} />
					</TabItem>
				{/each}
			{/if}
			<TabItem on:click={handleNewDashboard} open={!dashboards}>
				<div slot="title" class="flex items-center gap-2">
					<Icon icon="gala:add" size="20px" />
					New tab
				</div>
				<div><Alerts /></div>
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
