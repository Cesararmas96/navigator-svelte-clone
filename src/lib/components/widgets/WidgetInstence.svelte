<script lang="ts">
	import { addWidgetAction, getWidgetAction, initWidgetActions } from '$lib/helpers/widget/actions'
	import { initInstances } from '$lib/helpers/widget/instances'
	import { createEventDispatcher, onMount, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'
	import Spinner from '../common/Spinner.svelte'
	import { initWidgetTop } from '$lib/helpers/widget/widget-top'

	export let widget: any
	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const dispatch = createEventDispatcher()

	let widgetStore = writable(widget)
	setContext('widget', widgetStore)

	let widgetBase: string
	let widgetActions: Writable<any[]>
	let instanceLoaded: boolean = false

	const initActions = () => {
		widgetActions = initWidgetActions()

		addWidgetAction(widgetActions, {
			name: 'closeInstance',
			action: () => {
				dispatch('handleCloseInstance', $widgetStore.widget_slug)
			}
		})

		addWidgetAction(widgetActions, {
			name: 'instanceLoaded',
			action: () => {
				instanceLoaded = true
				$widgetStore.instance_loading = null
				$widgetStore.instance_loaded = null
				dispatch('handleInstanceResize', 'loaded')
			}
		})

		addWidgetAction(widgetActions, {
			name: 'collapse',
			action: () => {
				setTimeout(() => {
					dispatch('handleInstanceResize')
				}, 100)
			}
		})
	}

	initActions()
	initInstances()
	initWidgetTop()

	onMount(() => {
		widget.params.settings.toolbar.clone = false

		if (widget.widget_type_id) {
			widgetBase = widget.widget_type_id.split('-')[0]
			widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
		}
		$widgetStore = widget
	})
</script>

<div class:invisible={!instanceLoaded}>
	<slot widget={widgetStore} {isToolbarVisible} {fixed} {isOwner} />
</div>
