<script lang="ts">
	import Grid, { GridItem } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import { storeWidgets } from '$lib/stores/widgets'

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
</script>

<svelte:window bind:innerWidth />

<Grid {itemSize} class="grid-container" gap={5} {cols} collision="compress">
	{#each widgets as item}
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
			<Widget widget={item} on:handleDraggable={(e) => e.detail} />
		</GridItem>
	{/each}
</Grid>
