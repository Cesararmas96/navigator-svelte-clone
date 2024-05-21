<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Grid from 'tui-grid'
	import { loadGridOptions } from '$lib/helpers/widget/tui-grid'
	import { gridHeight, gridInstanceHeight } from '$lib/helpers/widget/aggrid'
	import { addWidgetAction } from '$lib/helpers'
	import { setContentHeight } from '$lib/helpers/widget/widget'

	export let data: any

	const widget: Writable<any> = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	const resizeAgGridToContent = () => {
		// console.log('resizeAgGridToContent')
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
		// console.log('eGridDiv', $widget.widget_name, gridHeight($widget.widget_id))
		eGridDiv.style['min-height'] = !$widget.temp
			? gridHeight($widget.widget_id)
			: gridInstanceHeight($widget.widget_id)
		// eGridDiv.style['height'] = eGridDiv.style['min-height']
		$widget.resized = false
	}
	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: () => {
			setContentHeight($widget.widget_id)
			if (!$widget.instances || $widget.instances.length === 0) resizeAgGridToContent()
		}
	})

	onMount(() => {
		new Grid(loadGridOptions($widget, data))
		Grid.applyTheme('striped')
		resizeAgGridToContent()
	})
</script>

<div id="grid-{$widget.widget_id}" />
