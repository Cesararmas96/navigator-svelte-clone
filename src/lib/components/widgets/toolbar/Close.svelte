<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'
	import { deleteData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { openConfirmModal } from '$lib/helpers/common/modal'
	import { storeUser } from '$lib/stores'

	export let isMobileDevice: boolean = false

	let widget = getContext<Writable<any>>('widget')
	let dashboard = getContext<Writable<any>>('dashboard')

	const deleteWidget = $dashboard.attributes?.user_id === $storeUser?.user_id

	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const removeAction = getWidgetAction($widgetActions, 'remove')

	async function closeWidget() {
		if ($widget.temp) {
			const closeInstanceAction = getWidgetAction($widgetActions, 'closeInstance')
			closeInstanceAction.action()
		} else if ($widget.cloned) {
			removeAction.action()
		} else if (Boolean($widget?.query_slug?.dashboard) && !deleteWidget) {
			const showSharedWidgets = getWidgetAction($widgetActions, 'showSharedWidgets')
			showSharedWidgets.action(false)
		} else if (deleteWidget) {
			openConfirmModal({
				description: `You're about to permanently delete this. This process is irreversible.`,
				type: 'warning',
				confirmCallback: () => confirmDeleteWidget()
			})
		}
	}

	const confirmDeleteWidget = async () => {
		const urlBase = import.meta.env.VITE_API_URL
		try {
			await deleteData(`${urlBase}/api/v2/widgets/`, [{ widget_id: `${$widget.widget_id}` }])
			removeAction.action()
		} catch (e: any) {
			sendErrorNotification('Failed to remove widget. ' + e.message)
			console.log(e)
		}
	}
</script>

<button on:click={closeWidget} class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
	<Icon icon="tabler:x" size="18" classes={deleteWidget ? 'text-red-700' : ''} />
</button>
<Tooltip placement="bottom" class={`z-10 ${isMobileDevice ? 'hidden' : ''}`}>Remove</Tooltip>
