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
		reloadLocations
	} from '$lib/helpers/dashboard/grid'
	import { getApiData, postData } from '$lib/services/getData'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { sendAlert } from '$lib/helpers/common/alerts'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'
	import { storeUser } from '$lib/stores'

	export let dashboard: any
	const baseUrl = import.meta.env.VITE_API_URL

	const cols = 12
	const itemSize = { height: 10 }

	let innerWidth: number
	let gridItems: any[] = []
	let gridController: GridController
	let widgets: any[] = []

	const isMobile = (): boolean => {
		return innerWidth < 500
	}

	const getGridItems = async (dashboardId: string) => {
		widgets = await getApiData(`${baseUrl}/api/v2/widgets?dashboard_id=${dashboardId}`, 'GET')
		const setNewLocations =
			!dashboard.widget_location || Object.keys(dashboard.widget_location).length === 0
		const items =
			dashboard.attributes.explorer === 'v3' || setNewLocations
				? loadV3Locations(dashboard, widgets, cols, isMobile())
				: loadV2Locations(dashboard, widgets, cols, isMobile())
		return items
	}

	let isChanging = false

	const updateLocations = async () => {
		if (isChanging) return
		isChanging = true
		setTimeout(async () => {
			isChanging = false
			const payload = { widget_location: { ...gridController.gridParams.items } }
			console.log(`${baseUrl}/api/v2/widgets/location/${dashboard.dashboard_id}`)
			postData(`${baseUrl}/api/v2/widgets/location/${dashboard.dashboard_id}`, payload)
			// if (dashboard.attributes.explorer !== 'v3') {
			// 	postData(`${baseUrl}/api/v2/dashboards/${dashboard.duid}`, {
			// 		dashboard: { attributes: { explorer: 'v3' } }
			// 	})
			// }
		}, 2000)
	}

	$: handleResizable = (item: any) => {
		gridItems = resizeItem(item, gridItems)
	}
	$: handleCloning = (item: any) => {
		gridItems = cloneItem(item, gridItems)
	}
	$: handleRemove = (item: any) => {
		// item.data.component.$destroy()
		gridItems = removeItem(item, gridItems)
		// gridItems.map((item: any) => {
		// 	delete item.data.loaded
		// 	return item
		// })
	}

	let resizedUID = ''
	$: changeItemSize = (item: any) => {
		resizedUID = item.uid
	}

	$: {
		gridItems = []
		getGridItems(dashboard.dashboard_id).then((items: any) => {
			gridItems = items
		})
	}

	const handleWidgetPaste = async () => {
		try {
			const copiedWidget = $storeCCPWidget

			const { program_id, dashboard_id } = dashboard // Assuming dashboard is defined somewhere
			const widget_id = copiedWidget.widget_id // TODO: Check if widget_id is defined
			const tempTitle = 'Temp Title'

			const item = gridItems.find((item: any) => item.uid === copiedWidget.uid)
			const newItem = structuredClone(item)
			const position = addNewItem(newItem, gridController)
			newItem.data = copiedWidget
			newItem.x = position.x
			newItem.y = position.y

			gridItems = pasteItem(newItem, gridItems)

			// 3. Build the payload
			const payload = {
				program_id,
				dashboard_id,
				title: tempTitle,
				widget_id,
				user_id: $storeUser.user_id
			}
			// 4. Insert the widget
			// const response = await getApiData(`${baseUrl}/api/v2/widgets`, 'PUT', payload)
			// 4.2 Insert the widget into widgets store
			// $storeWidgets.push(response.data)
			// 5. Check if behavior was "cut" to remove the widget
			const behavior = $storeCCPWidgetBehavior
			// if (behavior === 'cut') {
			// 	await getApiData(`${baseUrl}/api/v2/widgets/${copiedWidget.uid}`, 'DELETE')
			// }
		} catch (error: any) {
			console.error(`An error occurred: ${error.message}`)
			// TODO: Handle error and display an appropriate message to the user if needed.
		}
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
</script>

<svelte:window
	bind:innerWidth
	on:resize={() => {
		setTimeout(() => {
			console.log('resize', gridController.gridParams.items)
			gridController.gridParams.updateGrid()
			gridItems = reloadLocations(dashboard, gridController.gridParams, isMobile())
		}, 100)
	}}
/>

<Alerts />

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
		>
			<WidgetBox
				widget={item.data}
				resized={resizedUID === item.uid && !active}
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
