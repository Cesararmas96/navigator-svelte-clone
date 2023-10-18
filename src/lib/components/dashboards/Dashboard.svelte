<script lang="ts">
	import Grid, { GridItem, type GridController } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import WidgetBox from '../widgets/WidgetBox.svelte'
	import {
		loadV2Locations,
		loadV3Locations,
		resizeItem,
		cloneItem,
		removeItem,
		addNewItem,
		pasteItem,
		saveLocations,
		loadLocalStoredLocations
	} from '$lib/helpers/dashboard/grid'
	import { deleteData, getApiData, postData, putData } from '$lib/services/getData'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import {
		clearAlerts,
		dismissAlert,
		sendAlert,
		sendErrorAlert,
		sendInfoAlert
	} from '$lib/helpers/common/alerts'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'
	import { storeUser } from '$lib/stores'
	import { generateUniqueSlug } from '$lib/helpers/common/common'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { writable } from 'svelte/store'
	import { createEventDispatcher, setContext } from 'svelte'
	import { onMount } from 'svelte'
	import Spinner from '$lib/components/common/Spinner.svelte'

	import {
		Button,
		Card,
		Table,
		TableBodyCell,
		TableBodyRow,
		TableHeadCell,
		Modal,
		P
	} from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { openModal } from '$lib/helpers/common/modal'
	import AddWidgetModal from '$lib/components/modals/AddWidgetModal.svelte'

	export let dashboard: any

	const dispatch = createEventDispatcher()

	const storeDashboard: any = writable(dashboard)
	setContext('dashboard', storeDashboard)
	$: $storeDashboard = dashboard
	$: widgetLocation = { ...dashboard.widget_location }
	const baseUrl = import.meta.env.VITE_API_URL

	const cols = 12
	const itemSize = { height: 10 }

	let innerWidth: number
	let gridItems: any[] = []
	let gridController: GridController
	let widgets: any[] = []

	$: if ($storeDashboard.user_id === $storeUser.user_id) {
		const alert: AlertMessage = {
			id: 'dashboard-system-msg',
			title: `Customizing a system dashboard`,
			message: `Don't forget that you are customizing a system dashboard, please publish it again`,
			type: AlertType.WARNING,
			callback1Btn: 'Publish',
			callback1: () => dispatch('handleCustomize', false)
		}
		sendAlert(alert)
	} else {
		dismissAlert('dashboard-system-msg')
	}

	const isMobile = (): boolean => {
		return innerWidth < 500
	}

	const getGridItems = async (dashboardId: string) => {
		gridItems = []

		try {
			widgets = await getApiData(`${baseUrl}/api/v2/widgets?dashboard_id=${dashboardId}`, 'GET')
			if (!widgets) {
				sendAlert({
					id: 'dashboard-no-widgets',
					title: 'No widgets',
					message: 'There are no widgets in this dashboard',
					type: AlertType.INFO
				})
				return []
			} else {
				dismissAlert('dashboard-no-widgets')
			}
			widgets = widgets.map((widget: any) => {
				widget.widget_slug = generateUniqueSlug(widget.title, widgets)
				return widget
			})

			let items: any[] = []

			items = loadLocalStoredLocations(dashboard, widgets, isMobile())!
			if (items && items.length > 0) return items

			const setNewLocations =
				!dashboard.widget_location || Object.keys(dashboard.widget_location).length === 0

			items =
				dashboard.attributes.explorer === 'v3' || setNewLocations
					? loadV3Locations(widgetLocation, widgets, cols, isMobile())
					: loadV2Locations(widgetLocation, dashboard, widgets, cols, isMobile())

			return items
		} catch (error: any) {
			console.error(error)
			sendErrorNotification(error)
			sendErrorAlert(
				'Error loading the widgets',
				`There was a problem with the server. Please try again later or contact technical support if the issue persists. (${error.message})`
			)
			return []
		}
	}

	let isChanging = false

	const updateLocations = async () => {
		if (isChanging || isMobile()) return
		isChanging = true
		setTimeout(async () => {
			isChanging = false
			saveLocations(dashboard, gridItems, gridController.gridParams)
			if (dashboard.user_id !== $storeUser.user_id) return
			const payload = { widget_location: { ...gridController.gridParams.items } }
			console.log(`${baseUrl}/api/v2/widgets/location/${dashboard.dashboard_id}`, payload)
			await postData(
				`${baseUrl}/api/v2/dashboard/widgets/location/${dashboard.dashboard_id}`,
				payload
			)
			if (dashboard.attributes.explorer !== 'v3') {
				postData(`${baseUrl}/api/v2/dashboards/${dashboard.duid}`, {
					attributes: { explorer: 'v3' }
				})
			}
		}, 2000)
	}

	$: handleResizable = (item: any) => {
		gridItems = resizeItem(item, gridItems)
	}
	$: handleCloning = (item: any) => {
		const clonedItem = cloneItem(item, gridItems)
		gridItems = [...gridItems, clonedItem]
	}
	$: handleRemove = (item: any) => {
		// item.data.component.$destroy()
		gridItems = removeItem(item, gridItems)
		// gridItems.map((item: any) => {
		// 	delete item.data.loaded
		// 	return item
		// })
	}

	let resizedSlug = ''
	$: changeItemSize = (item: any) => {
		resizedSlug = item.slug
	}

	$: {
		getGridItems($storeDashboard.dashboard_id).then((items: any) => {
			gridItems = items
		})
	}

	const handleWidgetPaste = async () => {
		try {
			const copiedWidget = $storeCCPWidget

			const { program_id, dashboard_id } = dashboard // Assuming dashboard is defined somewhere
			const widget_id = copiedWidget.widget_id // TODO: Check if widget_id is defined
			const tempTitle = copiedWidget.title + ($storeCCPWidgetBehavior === 'copy' ? ' - Copy' : '')

			const payload = {
				program_id,
				dashboard_id,
				title: tempTitle,
				widget_id,
				user_id: $storeUser.user_id
			}

			const item = gridItems.find((item: any) => item.slug === copiedWidget.widget_slug)
			const response = await putData(`${baseUrl}/api/v2/widgets`, payload)
			console.log(copiedWidget.uid)
			item.data = response.data
			const newItem = structuredClone(item)
			const position = addNewItem(newItem, gridController)
			newItem.data = copiedWidget
			newItem.x = position.x
			newItem.y = position.y

			const behavior = $storeCCPWidgetBehavior
			if (behavior === 'cut') {
				// await deleteData(`${baseUrl}/api/v2/widgets/${copiedWidget.uid}`)
				gridItems = gridItems.filter((item: any) => item.slug !== copiedWidget.widget_slug)
			}

			gridItems = pasteItem(newItem, gridItems)
		} catch (error: any) {
			console.error(`An error occurred: ${error.message}`)
			// TODO: Handle error and display an appropriate message to the user if needed.
		}

		clearCopyWidgets()
	}

	const clearCopyWidgets = () => {
		storeCCPWidget.set(null)
		storeCCPWidgetBehavior.set(null)
	}

	const addWidgetCopyAlert = () => {
		const behavior = $storeCCPWidgetBehavior
		const alert: AlertMessage = {
			id: 'widget-copied',
			title: `Widget ${behavior === 'copy' ? 'copied' : 'cut'}`,
			message: `You have a widget ${
				behavior === 'copy' ? 'copied' : 'cut'
			} in clipboard. Use Paste Widget button to paste it`,
			type: AlertType.INFO,
			callback1Btn: 'Paste Widget',
			callback1: handleWidgetPaste,
			callback2Btn: 'Clear',
			callback2: clearCopyWidget
		}
		sendAlert(alert)
	}

	const clearCopyWidget = () => {
		storeCCPWidget.set(null)
		storeCCPWidgetBehavior.set(null)
	}

	$: if ($storeCCPWidget) addWidgetCopyAlert()

	let displayModal = false

	const handleWidgetInsert = async (widgetUid: string) => {
		const token = $storeUser.token

		try {
			const payload = { widget_name: 'New widget' }
			const resp = await fetch(
				`${baseUrl}/api/v2/widgets-template/${widgetUid}`,
				// const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/b13b619a-847e-4734-a3d2-fa198f0531b7`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				}
			)

			if (!resp.ok) {
				const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`
				throw new Error(errorMessage)
			}
			const widget = await resp.json()

			widget.resize_load = true
			const newItem = Object.create({})
			newItem.data = widget
			newItem.w = 6
			newItem.h = 12
			const position = addNewItem(newItem, gridController)
			newItem.x = position.x
			newItem.y = position.y

			console.log(newItem)

			gridItems = pasteItem(newItem, gridItems)

			displayModal = false
			return widget
		} catch (error) {
			console.error('An error occurred:', error.message)
			// Handle the error as needed, e.g., display an error message or log it.
		}
	}

	onMount(() => {
		dispatch('handleWidgetInsert', insertWidget)
	})

	const insertWidget = () => {
		openModal('Insert Widget', 'AddWidgetModal', { dashboard, handleWidgetInsert })
	}
</script>

<svelte:window bind:innerWidth />

<Alerts />

<div id="grid" class="w-full">
	<Grid
		{itemSize}
		class="grid-container"
		gap={5}
		{cols}
		collision="compress"
		bind:controller={gridController}
		on:change={updateLocations}
	>
		{#each gridItems as item}
			<GridItem
				x={item.x}
				y={item.y}
				w={item.w}
				h={item.h}
				class="grid-item"
				activeClass="grid-item-active"
				previewClass="bg-red-500 rounded"
				on:change={(e) => {
					changeItemSize(item)
				}}
				let:active
				bind:id={item.slug}
			>
				<WidgetBox
					widget={item.data}
					resized={resizedSlug === item.slug && !active}
					let:fixed
					let:isOwner
					let:isToolbarVisible
					let:widget
					on:handleResize={() => handleResizable(item)}
					on:handleCloning={() => handleCloning(item)}
					on:handleRemove={() => handleRemove(item)}
					on:handleResizable={(e) => {
						item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
					}}
				>
					<!-- bind:this={item.component} -->
					<Widget
						{widget}
						{fixed}
						{isToolbarVisible}
						{isOwner}
						on:handleInstanceResize={() => handleResizable(item)}
					/>
				</WidgetBox>
			</GridItem>
		{/each}
	</Grid>
</div>
