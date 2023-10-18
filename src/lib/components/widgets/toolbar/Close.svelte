<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'
	import { deleteData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'

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
			try {
				await deleteData(`${urlBase}/api/v2/widgets/${$widget.uid}`)
				removeAction.action()
			} catch (e: any) {
				sendErrorNotification('Failed to remove widget. ' + e.message)
				console.log(e)
			}
		}
	}
</script>

<button on:click={closeWidget} class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
	<Icon icon="tabler:x" size="18" />
</button>
<Tooltip placement="bottom" class="z-10">Remove</Tooltip>
