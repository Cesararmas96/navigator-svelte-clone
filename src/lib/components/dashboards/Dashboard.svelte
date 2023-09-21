<script lang="ts">
	import Grid, { GridItem, type GridController } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import { storeWidgets } from '$lib/stores/widgets'
	import WidgetBox from '../widgets/WidgetBox.svelte'
	import { writable } from 'svelte/store'
	import { generateUID } from '$lib/helpers/common/common'

	export let dashboard: any
	let widgets: any[] = []

	let innerWidth: number

	$: dashboard

	widgets = []
	let x: number = 0
	let y: number = 0
	const locations = dashboard.attributes.cols.split(',')

	Object.keys(dashboard.widget_location).forEach(function callback(value: any, index: number) {
		const id = Object.keys(dashboard.widget_location[value])[0]
		const data = $storeWidgets.find((item) => item.uid === id) || {}
		const w = parseInt(locations[index]) * (cols / 12)
		if (w + x > cols) {
			x = 0
			y += 4
		}
		widgets.push({ id, x, y, w, h: 4, data })
		x += w
	})

	const cols = 12
	const itemSize = { height: 40 }

	const gridItems = writable(widgets)

	let gridController: GridController

	function addNewItem() {
		const w = 4
		const h = 4
		const newPosition = gridController.getFirstAvailablePosition(w, h)
		$gridItems = newPosition
			? [...$gridItems, { id: generateUID(), x: newPosition.x, y: newPosition.y, w, h, data: {} }]
			: $gridItems
	}

	function resizeItem(item: any) {
		const header = document.getElementById(`widget-header-${item.id}`)?.clientHeight || 0
		const content = document.getElementById(`widget-main-content-${item.id}`)?.clientHeight || 0
		const widgetInstances =
			document.getElementById(`widget-instances-${item.id}`)?.clientHeight || 0
		const height = header + content + widgetInstances
		const prevousHeight = maxHeight(item.y)
		item.h = Math.ceil(height / 40)
		reorderAfterResize(item, prevousHeight)
	}

	function maxHeight(yPos: number) {
		const items = $gridItems
		return Math.max(...items.filter((i) => i.y === yPos).map((i) => i.h))
	}

	function reorderAfterResize(item: any, prevousHeight: number) {
		const items = $gridItems
		const height = maxHeight(item.y) - prevousHeight
		items.map((i) => {
			if (i.y > item.y) i.y += height
			return i
		})
		$gridItems = [...items]
	}
</script>

<svelte:window bind:innerWidth />

<Grid
	{itemSize}
	class="grid-container"
	gap={5}
	{cols}
	collision="compress"
	bind:controller={gridController}
>
	{#each $gridItems as item}
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
				on:handleResizable={(e) => {
					item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
				}}
				let:fixed
				let:isOwner
				let:isToolbarVisible
				on:handleResize={() => resizeItem(item)}
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

<!-- movable={item.data.params?.settings?.draggable && !item.data.params?.settings?.fixed}
resizable={item.data.params?.settings?.resizable && !item.data.params?.settings?.fixed} -->
