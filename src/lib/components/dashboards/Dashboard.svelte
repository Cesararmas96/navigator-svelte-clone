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
		pasteItem
	} from '$lib/helpers/dashboard/grid'
	import { getApiData } from '$lib/services/getData'
	import { storeWidgets } from '$lib/stores/widgets'
	import { getSession } from '$lib/helpers/auth/session'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { sendAlert } from '$lib/helpers/common/alerts'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'

	export let dashboard: any
	const baseUrl = import.meta.env.VITE_API_URL

	const cols = 12
	const itemSize = { height: 10 }

	let innerWidth: number
	let gridItems: any[] = []
	let gridController: GridController

	const isMobile = (): boolean => {
		return window.innerWidth < 500
	}

	const getGridItems = async (dashboardId: string) => {
		const widgets = await getApiData(
			`${import.meta.env.VITE_API_URL}/api/v2/widgets?dashboard_id=${dashboardId}`,
			'GET'
		)
		return dashboard.attributes.explorer === 'v3' ||
			!dashboard.widget_location ||
			Object.keys(dashboard.widget_location).length === 0
			? loadV3Locations(dashboard, widgets, cols, false)
			: loadV2Locations(dashboard, widgets, cols, false)
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

			const session = await getSession()
			const { program_id, dashboard_id } = dashboard // Assuming dashboard is defined somewhere
			const widget_id = copiedWidget.widget_id // TODO: Check if widget_id is defined
			const tempTitle = 'Temp Title'
			const userId = session.session.user_id

			const item = gridItems.find((item: any) => item.uid === copiedWidget.uid)
			const newItem = structuredClone(item)
			const position = addNewItem(newItem, gridController)
			newItem.data = copiedWidget
			newItem.x = position.x
			newItem.y = position.y
			console.log('position', position)

			gridItems = pasteItem(newItem, gridItems)
			console.log('gridItems', gridItems)

			// 3. Build the payload
			const payload = { program_id, dashboard_id, title: tempTitle, widget_id, user_id: userId }
			// 4. Insert the widget
			// const response = await getApiData(`${baseUrl}/api/v2/widgets`, 'PUT', payload)
			// 4.2 Insert the widget into widgets store
			// console.log($storeWidgets)
			// $storeWidgets.push(response.data)
			// console.log($storeWidgets)
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

<svelte:window bind:innerWidth />

<Alerts />

<Grid
	{itemSize}
	class="grid-container"
	gap={5}
	{cols}
	collision="compress"
	bind:controller={gridController}
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
