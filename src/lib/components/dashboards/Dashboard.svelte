<script lang="ts">
	import Grid, { GridItem, type GridController } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import { storeWidgets } from '$lib/stores/widgets'
	import WidgetBox from '../widgets/WidgetBox.svelte'
	import { generateUID } from '$lib/helpers/common/common'
	import { onMount } from 'svelte'

	export let dashboard: any

	const cols = 12
	const itemSize = { height: 40 }

	let innerWidth: number
	let gridItems: any[]
	// let gridController: GridController

	const loadV2Locations = (_dashboard: any) => {
		let widgets: any[] = []
		let x: number = 0
		let y: number = 0
		const locations = _dashboard.attributes.cols.split(',') || [_dashboard.attributes.cols]
		Object.keys(_dashboard.widget_location).forEach(function callback(value: any, index: number) {
			const uid = Object.keys(_dashboard.widget_location[value])[0]
			const data = $storeWidgets.find((item) => item.uid === uid) || {}
			const w = parseInt(locations[index]) * (cols / 12)
			if (w + x > cols) {
				x = 0
				y += 4
			}
			widgets.push({ uid, x, y, w, h: 4, data })
			x += w
		})
		return widgets
	}

	const loadV3Locations = (_dashboard: any) => {
		if (isMobile()) {
			let row = 0
			return _dashboard.widget_location.map((widget: any) => {
				const data = $storeWidgets.find((item) => item.uid === widget.uid) || {}
				widget.x = 0
				widget.y = row
				widget.w = cols
				row += widget.h
				return { ...widget, ...data }
			})
		}
		return _dashboard.widget_location.map((widget: any) => {
			const data = $storeWidgets.find((item) => item.uid === widget.uid) || {}
			return { ...widget, ...data }
		})
	}

	$: gridItems = dashboard.attributes.cols ? loadV2Locations(dashboard) : loadV3Locations(dashboard)

	// function addNewItem() {
	// 	const w = 4
	// 	const h = 4
	// 	const newPosition = gridController.getFirstAvailablePosition(w, h)
	// 	gridItems = newPosition
	// 		? [...gridItems, { uid: generateUID(), x: newPosition.x, y: newPosition.y, w, h, data: {} }]
	// 		: gridItems
	// }

	function resizeItem(item: any) {
		const header = document.getElementById(`widget-header-${item.uid}`)?.clientHeight || 0
		const content = document.getElementById(`widget-main-content-${item.uid}`)?.clientHeight || 0
		const widgetInstances =
			document.getElementById(`widget-instances-${item.uid}`)?.clientHeight || 0
		const height = header + content + widgetInstances
		const prevousHeight = maxHeight(item.y)
		item.h = Math.ceil(height / 40)
		reorderAfterResize(item, prevousHeight)
	}

	function maxHeight(yPos: number) {
		const items = gridItems
		return Math.max(...items.filter((i) => i.y === yPos).map((i) => i.h))
	}

	function reorderAfterResize(item: any, prevousHeight: number) {
		const items = gridItems
		const height = maxHeight(item.y) - prevousHeight
		items.map((i) => {
			if (i.y > item.y) i.y += height
			return i
		})
		gridItems = [...items]
	}

	const isMobile = (): boolean => {
		return window.innerWidth < 500
	}
</script>

<svelte:window bind:innerWidth />

<Grid {itemSize} class="grid-container" gap={5} {cols} collision="compress">
	{#each gridItems as item, i}
		<GridItem
			x={item.x}
			y={item.y}
			w={item.w}
			h={item.h}
			class="grid-item"
			activeClass="grid-item-active"
			previewClass="bg-red-500 rounded"
			movable={item.data.params?.settings?.draggable && !item.data.params?.settings?.fixed}
			resizable={item.data.params?.settings?.resizable && !item.data.params?.settings?.fixed}
		>
			<WidgetBox
				widget={item.data}
				let:fixed
				let:isOwner
				let:isToolbarVisible
				on:handleResize={() => resizeItem(item)}
				on:handleResizable={(e) => {
					item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
				}}
			>
				<Widget
					{fixed}
					{isToolbarVisible}
					{isOwner}
					on:handleInstanceResize={() => resizeItem(item)}
				/>
			</WidgetBox>
		</GridItem>
	{/each}
</Grid>
