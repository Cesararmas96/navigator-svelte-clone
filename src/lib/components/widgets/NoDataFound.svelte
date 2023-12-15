<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import Icon from '../common/Icon.svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')

	onMount(() => {
		if ($widget.resize_on_load) resizeAction.action()
		if ($widget.temp) {
			const instanceLoadedAction = getWidgetAction($widgetActions, 'instanceLoaded')
			instanceLoadedAction.action()
		}
	})
</script>

<div class="flex flex-col items-center justify-center p-3">
	<Icon icon="icon-park:doc-search-two" size="32" classes="color-white" />

	<h2 class="my-1 text-lg">Unable to load the data</h2>

	<p class="text-md">
		This can happen if there is no data to fulfill the selected search criteria, or you are not
		connected to the internet, or if an underlying system or component is not available.
	</p>
</div>
