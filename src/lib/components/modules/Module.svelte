<script lang="ts">
	import { Tabs, TabItem, Modal, Button, Dropdown, DropdownItem } from 'flowbite-svelte'
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
	import { deleteData, getApiData, postData, putData } from '$lib/services/getData'
	import { page } from '$app/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { clearAlerts, sendAlert, sendInfoAlert } from '$lib/helpers/common/alerts'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import html2canvas from 'html2canvas'
	import { loading } from '$lib/stores/preferences'
	import { storeUser } from '$lib/stores'
	import { onMount } from 'svelte'

	export let trocModule: any
	export let dashboards: any

	const baseUrl = import.meta.env.VITE_API_URL
	// let pastedDashboard: any
	let dropdownOpen = false
	const user = $storeUser

	clearAlerts()

	let currentDashboard

	$: if (!dashboards || dashboards?.length === 0)
		sendInfoAlert(
			'There are no dashboards here yet. But you can start to add them by clicking on the "New tab" buttom above'
		)

	$: isOwner =
		currentDashboard?.attributes?.user_id === $storeUser.user_id ||
		currentDashboard?.user_id === $storeUser.user_id

	let popupRemoveModal = false
	let selectedDashboardID: string

	const getCurrentDashboard = async (id: string) => {
		dashboards = await getApiData(
			`${baseUrl}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${
				trocModule?.module_id
			}&explorer=${trocModule?.module_slug?.includes('explorer') ? true : false}`,
			'GET'
		)
		console.log(
			'dashboards',
			`${baseUrl}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${
				trocModule?.module_id
			}&explorer=${trocModule?.module_slug?.includes('explorer') ? true : false}`
		)
		$storeDashboards = dashboards
		return { ...$storeDashboards.find((d: any) => d.dashboard_id === id) }
	}

	async function handleNewDashboard(event: MouseEvent) {
		event.preventDefault()
		event.stopPropagation()
		loading.set(true)

		try {
			const tab = await putData(`${baseUrl}/api/v2/dashboards`, {
				name: `New dashboard (${dashboards.length + 1})`,
				attributes: {
					icon: 'tabler:device-desktop-analytics',
					color: '#1E90FF',
					row_header: 'false'
				},
				params: {
					closable: false,
					sortable: false,
					showSettingsBtn: true
				},
				module_id: trocModule.module_id,
				program_id: trocModule.program_id,
				user_id: user.user_id,
				enabled: true,
				position: dashboards.length + 1
			})
			currentDashboard = await getCurrentDashboard(tab.dashboard_id)
		} catch (e: any) {
			console.log(e)
			sendErrorNotification(e)
		}
		loading.set(false)
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
	const handleDashboardRemove = (dashboardID: string) => {
		selectedDashboardID = dashboardID
		popupRemoveModal = true
	}
	const handleRemoveConfirm = async () => {
		loading.set(true)
		try {
			await deleteData(`${baseUrl}/api/v2/dashboards/${currentDashboard.dashboard_id}`, {
				dashboard_id: currentDashboard.dashboard_id
			})
			const temp = dashboards.filter((d: any) => d.dashboard_id !== currentDashboard.dashboard_id)
			dashboards = []
			dashboards = [...temp]
			currentDashboard = dashboards[0] ? { ...dashboards[0] } : null
			$storeDashboards = dashboards
			sendSuccessNotification('Dashboard successfully deleted')
			clearAlerts()
		} catch (e: any) {
			sendErrorNotification(e.message)
		}
		loading.set(false)
	}

	const confirmCustomize = async (impersonation: boolean) => {
		loading.set(true)
		try {
			const user = impersonation ? { user_id: $storeUser.user_id } : { user_id: null }
			const resp = await postData(
				`${import.meta.env.VITE_API_URL}/api/v2/dashboards/${currentDashboard.dashboard_id}`,
				{
					attributes: { ...currentDashboard.attributes, ...user }
				}
			)
			if (resp['0'] && resp['0'].dashboard_id) {
				currentDashboard = { ...resp['0'] }
				$storeDashboards = $storeDashboards.map((item) => {
					if (item.dashboard_id === currentDashboard.dashboard_id) {
						return currentDashboard
					}
					return item
				})
				sendSuccessNotification(
					impersonation ? 'You can customize this dashboard' : 'Dashboard published'
				)
			} else {
				sendErrorNotification('There was an error while customizing the dashboard')
			}
		} catch (e: any) {
			sendErrorNotification(e.message)
		}
		loading.set(false)
	}

	const handleCustomize = async () => {
		let impersonation = true
		let description =
			'Are you sure that you want to customizable this dashboard?\nThis action cannot be undone.'

		if (currentDashboard?.attributes?.user_id) {
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
		loading.set(true)

		const { dashboard_id } = $storeCCPDashboard
		const payload = { dashboard_id, module_id: trocModule.module_id }

		try {
			const clone = await postData(`${baseUrl}/api/v2/dashboard/clone`, payload)
			dashboards = [...dashboards, clone.data]
		} catch (e: any) {
			sendErrorNotification(e)
		}

		if ($storeCCPDashboardBehavior === 'cut') {
			try {
				await getApiData(`${baseUrl}/api/v2/dashboards/${currentDashboard.dashboard_id}`, 'DELETE')
				dashboards = dashboards.filter((d: any) => d.dashboard_id !== currentDashboard.dashboard_id)
			} catch (e: any) {
				sendErrorNotification(e)
			}
		}

		$storeDashboards = dashboards
		currentDashboard = { ...dashboards[dashboards.length - 1] }
		clearCopyDashboard()
		loading.set(false)
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
		const url = `/share/dashboard/${currentDashboard.program_id}/${currentDashboard.module_id}/${currentDashboard.dashboard_id}`
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('target', '_blank')
		link.click()
		dropdownOpen = false
	}

	const handleScreenshot = async () => {
		loading.set(true)
		sendSuccessNotification('Generating the screenshot, please wait...')
		setTimeout(async () => {
			const mainContent = document.getElementById(`grid`)!
			const spinner = mainContent.querySelector(`#spinner`)
			if (spinner) spinner.classList.add('hidden')

			mainContent.querySelectorAll('.animate__animated').forEach((element) => {
				element.classList.remove('animate__animated')
			})

			const canvas = await html2canvas(mainContent)
			sendSuccessNotification('Preparing to download...')
			const link = document.createElement('a')
			link.href = canvas.toDataURL('image/png')
			link.download = `${currentDashboard.name}.png`
			link.click()
			loading.set(false)
			dropdownOpen = false
		}, 700)
	}

	onMount(() => {
		if (dashboards && dashboards.length > 0) {
			currentDashboard = { ...dashboards[0] }
		}
	})

	$: if (
		dashboards &&
		dashboards.length > 0 &&
		currentDashboard &&
		!dashboards.some((d) => d.dashboard_id === currentDashboard.dashboard_id)
	) {
		currentDashboard = { ...dashboards[0] }
	}

	$: if ($storeCCPDashboard) addDashboardCopyAlert()

	let showInsertWidgetItem = false
	let insertWidgetCallback: any
	const handleWidgetInsert = (e: any) => {
		showInsertWidgetItem = true
		insertWidgetCallback = e.detail
	}

	const insertWidget = () => {
		openModal('Insert Widget', 'AddWidgetModal', { currentDashboard, handleWidgetInsert })
	}
</script>

<Alerts position="top" />

{#if $storeDashboards && $storeDashboards.length > 0 && currentDashboard}
	<Tabs style="pill" contentClass="p-0 mt-2">
		<div class="card ml-[5px] mr-[10px] w-full p-1">
			<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
				{#if $storeDashboards && $storeDashboards.length > 0}
					{#each $storeDashboards as dashboard}
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
										{#if isOwner}
											<DropdownItem
												defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
												on:click={insertWidget}
											>
												<Icon icon="zondicons:add-outline" size="18" classes="mr-1" />
												Insert Widget
											</DropdownItem>
										{/if}
										<DropdownItem
											on:click={() => handleDashboardCopy('copy')}
											defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
										>
											<Icon icon="mdi:content-copy" size="18" classes="mr-1" />
											Copy dashboard</DropdownItem
										>
										{#if isOwner}
											<DropdownItem
												on:click={() => handleDashboardCopy('cut')}
												defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
											>
												<Icon icon="mdi:content-cut" size="18" classes="mr-1" />
												Cut dashboard</DropdownItem
											>
										{/if}
										{#if user.superuser && currentDashboard.user_id === null}
											<DropdownItem
												on:click={handleCustomize}
												defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
											>
												<Icon
													icon={currentDashboard.attributes.user_id !== $storeUser.user_id
														? 'mdi:file-edit-outline'
														: 'mdi:publish'}
													size="18"
													classes="mr-1"
												/>
												{currentDashboard.attributes.user_id !== $storeUser.user_id
													? 'Customize'
													: 'Publish'}</DropdownItem
											>
										{/if}
										{#if isOwner}
											<DropdownItem
												on:click={handleConvertToModule}
												defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
											>
												<Icon icon="fluent:convert-range-20-regular" size="18" classes="mr-1" />
												Convert to Module</DropdownItem
											>
										{/if}
										<DropdownItem
											on:click={handleShareDashboard}
											defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
										>
											<Icon icon="mdi:share-variant" size="18" classes="mr-1" />
											Share Dashboard</DropdownItem
										>
										<DropdownItem
											on:click={handleScreenshot}
											defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
										>
											<Icon icon="tabler:camera" size="18" classes="mr-1" />
											Screenshot</DropdownItem
										>
										{#if isOwner}
											<DropdownItem
												on:click={() => handleDashboardRemove(dashboard.dashboard_id)}
												defaultClass="flex flex-row text-red-500 font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
											>
												<Icon icon="tabler:trash" size="18" classes="mr-1" />
												Remove</DropdownItem
											>
										{/if}
									</Dropdown>
								</div>
							</div>
							<Dashboard {dashboard} on:handleCustomize={(e) => confirmCustomize(e.detail)} />
						</TabItem>
					{/each}
				{/if}
				<TabItem
					on:click={handleNewDashboard}
					open={!$storeDashboards || $storeDashboards.length === 0}
				>
					<div slot="title" class="flex items-center gap-2">
						<Icon icon="gala:add" size="20px" />
						New tab
					</div>
					<div><Alerts /></div>
				</TabItem>
			</div>
		</div>
	</Tabs>
{/if}
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
