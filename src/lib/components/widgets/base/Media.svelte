<script lang="ts">
	import { getWidgetAction } from '$lib/helpers'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	const widgetActions: any = getContext('widgetActions')
	const dashboard: Writable<any> = getContext('dashboard')

	const sharedData = $widget.query_slug?.dashboard

	$widget.params.settings.toolbar.reload = false
	$widget.params.settings.toolbar.filtering = false
	$widget.params.settings.toolbar.export = false

	let data = { ...$widget }

	$: if (
		sharedData &&
		$dashboard.gridItemsData &&
		$dashboard.gridItemsData[sharedData] &&
		!$dashboard.gridItemsData[sharedData].loaded
	) {
		const showSharedWidgets = getWidgetAction($widgetActions, 'showSharedWidgets')
		showSharedWidgets.action(true)
		$dashboard.gridItemsData[sharedData].loaded = true
		data =
			$dashboard.gridItemsData && $dashboard.gridItemsData[sharedData]
				? $dashboard.gridItemsData[sharedData]
				: []

		if (data) $widget.data = data
	}
</script>

<slot {data} {widget} />
