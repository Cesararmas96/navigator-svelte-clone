<script lang="ts">
	import { initWidgetActions } from '$lib/helpers/widget/actions'
	import { initInstances } from '$lib/helpers/widget/instances'
	import { createEventDispatcher, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let widget: any
	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const dispatch = createEventDispatcher()

	let widgetStore = writable(widget)

	let widgetBase: string
	$: {
		if (!widget.loaded) {
			initWidgetActions()
			initInstances()

			widget.params.settings.toolbar.clone = false

			if (widget.widget_type_id) {
				widgetBase = widget.widget_type_id.split('-')[0]
				widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
			}
			$widgetStore = widget
			widget.loaded = true
			setContext('widget', widgetStore)
		}
	}

	$: if ($widgetStore.instance_loaded) {
		$widgetStore.instance_loading = null
		$widgetStore.instance_loaded = null
		dispatch('handleInstanceResize')
	}

	$: if ($widgetStore.close_instance) {
		$widgetStore.instance_loaded = null
		dispatch('handleCloseInstance', $widgetStore.uid)
	}

	$: if ($widgetStore.collapse_action) {
		$widgetStore.collapse_action = null
		setTimeout(() => {
			dispatch('handleInstanceResize')
		}, 100)
	}
</script>

<slot widget={widgetStore} {isToolbarVisible} {fixed} {isOwner} />
