<script lang="ts">
	import { getWidgetAction } from '$lib/helpers'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	const data = { ...$widget }

	onMount(() => {
		// const resizeAction = getWidgetAction($widgetActions, 'resize')
		// resizeAction.action()
	})
</script>

<slot {data} {widget} />
