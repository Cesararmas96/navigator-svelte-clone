<script lang="ts">
	import Grid, { GridItem, type GridController } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import { storeWidgets } from '$lib/stores/widgets'
	import WidgetBox from '../widgets/WidgetBox.svelte'
	import {
		loadV2Locations,
		loadV3Locations,
		resizeItem,
		cloneItem,
		removeItem
	} from '$lib/helpers/dashboard/grid'

	export let dashboard: any

	const cols = 12
	const itemSize = { height: 10 }

	let innerWidth: number
	let gridItems: any[] = []
	// let gridController: GridController

	const isMobile = (): boolean => {
		return window.innerWidth < 500
	}

	gridItems =
		dashboard.attributes.explorer === 'v3' ||
		!dashboard.widget_location ||
		Object.keys(dashboard.widget_location).length === 0
			? loadV3Locations(dashboard, $storeWidgets, cols, false)
			: loadV2Locations(dashboard, $storeWidgets, cols, false)

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
		console.log('changeItemSize', item)
		resizedUID = item.uid
	}
</script>

<svelte:window bind:innerWidth />

<Grid {itemSize} class="grid-container" gap={5} {cols} collision="compress">
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
