<script lang="ts">
	import { initWidgetActions } from '$lib/helpers/widget/actions'
	import { initWidgetData } from '$lib/helpers/widget/data'
	import { initInstances } from '$lib/helpers/widget/instances'
	import { createEventDispatcher, getContext, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const dispatch = createEventDispatcher()

	export let widget: any
	let widgetStore = writable(widget)

	const data = getContext<Writable<any[]>>('widgetData')
	initWidgetActions()
	initInstances()
	initWidgetData($data)

	let widgetBase: string
	$: {
		if (widget) {
			widget.params.settings.toolbar.clone = false

			if (widget.widget_type_id) {
				widgetBase = widget.widget_type_id.split('-')[0]
				widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
				// if (widgetBase === 'Rest' || widgetBase === 'Api') {
				// 	let reloadFetchData = writable(false)
				// 	setContext('reloadFetchData', reloadFetchData)
				// }
			}
			$widgetStore = widget
			setContext('widget', widgetStore)
		}
	}

	$: if ($widgetStore.instance_loaded) {
		$widgetStore.instance_loaded = null
		dispatch('handleInstanceResize')
	}

	$: if ($widgetStore.collapse_action) {
		$widgetStore.collapse_action = null
		setTimeout(() => {
			dispatch('handleInstanceResize')
		}, 100)
	}
</script>

<slot {isToolbarVisible} {fixed} {isOwner} />
