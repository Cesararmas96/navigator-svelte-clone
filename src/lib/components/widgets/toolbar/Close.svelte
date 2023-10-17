<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'

	const widget = getContext<Writable<any>>('widget')

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	async function closeWidget() {
		const removeAction = getWidgetAction($widgetActions, 'remove')
		if ($widget.temp) {
			const closeInstanceAction = getWidgetAction($widgetActions, 'closeInstance')
			closeInstanceAction.action()
		} else if ($widget.cloned) {
			removeAction.action()
		} else {
			const urlBase = import.meta.env.VITE_API_URL
			const endpoint = `${urlBase}/api/v2/widgets/${$widget.uid}`
			const method = 'DELETE'

			// Removes DOM element and DELETE request if not cloned
			// if (!isClonedWidget) {
			// 	try {
			// 		// const response = await getData(endpoint, method);
			// 		removeWidgetFromDOM()
			// 	} catch (e: any) {
			// 		console.log(e.message)
			// 	}
			// } else removeWidgetFromDOM()
		}
	}
</script>

<button on:click={closeWidget} class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
	<Icon icon="tabler:x" size="18" />
</button>
<Tooltip placement="bottom" class="z-10">Remove</Tooltip>
