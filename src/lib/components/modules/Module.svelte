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
	import { closeModal, openConfirmModal, openModal } from '$lib/helpers/common/modal'
	import { deleteData, getApiData, patchData, postData, putData } from '$lib/services/getData'
	import { page } from '$app/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { clearAlerts, dismissAlert, sendAlert } from '$lib/helpers/common/alerts'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import html2canvas from 'html2canvas'
	import { loading } from '$lib/stores/preferences'
	import { storeUser } from '$lib/stores'
	import { generateRandomString } from '$lib/helpers/common/common'

	export let trocModule: any
	export let isShared: boolean = false

	const baseUrl = import.meta.env.VITE_API_URL
	let dropdownOpen = false
	const user = $storeUser
	let currentDashboard
	let popupRemoveModal = false
	let selectedDashboardID: string

	$: if ($page.data.dashboards) {
		loadDashboards($page.data.dashboards)
	} else {
		loadDashboards([])
	}

	const loadDashboards = (dashboards: any[]) => {
		$storeDashboards = [...dashboards]
		if ($storeDashboards.length > 0) {
			currentDashboard = { ...$storeDashboards[0] }
		}
	}

	clearAlerts()

	$: if (!$storeDashboards || $storeDashboards?.length === 0) {
		sendAlert({
			id: 'no-dashboard',
			title:
				'There are no dashboards here yet. But you can start to add them by clicking on the "New tab" buttom above',
			type: AlertType.INFO
		})
	} else {
		dismissAlert('no-dashboard')
		if (
			!Boolean(currentDashboard) ||
			(Boolean(currentDashboard) &&
				!$storeDashboards.some((d) => d.dashboard_id === currentDashboard?.dashboard_id))
		) {
			currentDashboard = { ...$storeDashboards[0] }
		}
	}

	$: isOwner = currentDashboard?.attributes?.user_id === $storeUser.user_id

	$: if ($storeCCPDashboard) addDashboardCopyAlert()

	const getCurrentDashboard = async (id: string) => {
		const dashboards = await getApiData(
			`${baseUrl}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${
				trocModule?.module_id
			}&explorer=${trocModule?.module_slug?.includes('explorer') ? true : false}`,
			'GET'
		)
		$storeDashboards = []
		$storeDashboards = dashboards
		return { ...$storeDashboards.find((d: any) => d.dashboard_id === id) }
	}

	async function handleNewDashboard(event: MouseEvent) {
		event.preventDefault()
		event.stopPropagation()
		loading.set(true)

		let count = $storeDashboards?.length + 1 || 1

		try {
			const tab = await putData(`${baseUrl}/api/v2/dashboards`, {
				name: `New dashboard #${generateRandomString()}`,
				attributes: {
					icon: 'tabler:device-desktop-analytics',
					color: '#1E90FF',
					row_header: 'false',
					// user_id: user.user_id,
					explorer: 'v3'
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
				position: count
			})
			currentDashboard = await getCurrentDashboard(tab.dashboard_id)
		} catch (e: any) {
			sendErrorNotification(e)
		}
		loading.set(false)
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
			const temp = $storeDashboards.filter(
				(d: any) => d.dashboard_id !== currentDashboard.dashboard_id
			)
			$storeDashboards = []
			setTimeout(() => {
				$storeDashboards = [...temp]
				currentDashboard = $storeDashboards[0] ? { ...$storeDashboards[0] } : null
				sendSuccessNotification('Dashboard successfully deleted')
				clearAlerts()
			}, 100)
		} catch (e: any) {
			sendErrorNotification(e.message)
		}
		loading.set(false)
	}

	const confirmCustomize = async (impersonation: boolean, attributes?: Record<string, any>) => {
		loading.set(true)
		try {
			const user = impersonation ? { user_id: $storeUser?.user_id } : { user_id: null }
			let resp = await postData(
				`${import.meta.env.VITE_API_URL}/api/v2/dashboards/${currentDashboard.dashboard_id}`,
				{
					attributes: { ...(attributes ? attributes : currentDashboard.attributes), ...user }
				}
			)
			if (resp[0] && resp[0].dashboard_id) {
				resp = { ...resp[0] }
				currentDashboard = structuredClone(resp)
				storeDashboards.update((dashboards) =>
					dashboards.map((item) => {
						if (item.dashboard_id === currentDashboard.dashboard_id) {
							return currentDashboard
						}
						return item
					})
				)
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

	const handleCustomize = async (attributes: Record<string, any>) => {
		let impersonation = true
		let description =
			'Are you sure that you want to customizable this dashboard?\nThis action cannot be undone.'

		if (currentDashboard?.attributes?.user_id === $storeUser?.user_id) {
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
		storeCCPDashboardBehavior.set({ type: behavior, dashboard_id: currentDashboard.dashboard_id })
		addDashboardCopyAlert()
		dropdownOpen = false
	}

	const handleDashboardPaste = async () => {
		loading.set(true)

		const { dashboard_id } = $storeCCPDashboard
		const payload = { dashboard_id, module_id: trocModule.module_id }

		try {
			const clone = await postData(`${baseUrl}/api/v2/dashboard/clone`, payload)
			$storeDashboards = [...$storeDashboards, clone.data]
		} catch (e: any) {
			sendErrorNotification(e)
		}

		if ($storeCCPDashboardBehavior.type === 'cut') {
			try {
				await getApiData(`${baseUrl}/api/v2/dashboards/${dashboard_id}`, 'DELETE')
				if ($storeCCPDashboardBehavior.dashboard_id === currentDashboard.dashboard_id) {
					$storeDashboards = $storeDashboards.filter(
						(d: any) => d.dashboard_id !== currentDashboard.dashboard_id
					)
				}
			} catch (e: any) {
				sendErrorNotification(e)
			}
		}

		currentDashboard = { ...$storeDashboards[$storeDashboards.length - 1] }
		clearCopyDashboard()
		loading.set(false)
	}

	const clearCopyDashboard = () => {
		storeCCPDashboard.set(null)
		storeCCPDashboardBehavior.set(null)
	}

	const addDashboardCopyAlert = () => {
		const behavior = $storeCCPDashboardBehavior.type
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
		const url = `/share/dashboard/${currentDashboard.dashboard_id}`
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

	const handleWidgetInsert = (widget: any) => {
		closeModal()
		$storeDashboards = $storeDashboards.map((item) => {
			if (item.dashboard_id === currentDashboard.dashboard_id) {
				item.newWidget = widget
				return item
			}
			return item
		})
	}

	const insertWidget = () => {
		openModal('Insert Widget', 'AddWidgetModal', {
			currentDashboard,
			handleWidgetInsert,
			size: 'md'
		})
	}
</script>

<Alerts position="top" />

<Tabs style="pill" contentClass="mt-0">
	<div class="card my-2 ml-[5px] mr-[10px] w-full p-1">
		<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
			{#if $storeDashboards && $storeDashboards.length > 0 && currentDashboard}
				{#each $storeDashboards as dashboard}
					<TabItem
						open={dashboard.dashboard_id === currentDashboard.dashboard_id}
						inactiveClasses="!cursor-pointer"
						activeClasses="cursor-default border-t-2 border-primary"
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
									classes="cursor-pointer"
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
									{#if user.superuser || $storeUser.user_id === currentDashboard.user_id}
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
									{#if isOwner || currentDashboard.user_id === $storeUser.user_id}
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
						<Dashboard
							{dashboard}
							on:handleCustomize={(e) => confirmCustomize(false, e.detail)}
							{isShared}
						/>
					</TabItem>
				{/each}
			{/if}
			<!-- {#if user.superuser}
				<TabItem
					defaultClass="cursor-pointer"
					on:click={handleNewDashboard}
					open={!$storeDashboards || $storeDashboards.length === 0}
				>
					<div slot="title" class="flex items-center gap-2">
						<Icon icon="gala:add" size="20px" />
						New tab
					</div>
					<div><Alerts /></div>
				</TabItem>
			{/if} -->
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
