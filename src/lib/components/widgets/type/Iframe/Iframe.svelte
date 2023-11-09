<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'

	const widget: any = getContext('widget')
	let url: string = ''

	function loadIframe() {
		createMediaSettings(widget)

		url = $widget.url
	}

	$: if ($widget?.saved) {
		loadIframe()
		$widget.saved = null
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	onMount(() => {
		loadIframe()
		const resizeAction = getWidgetAction($widgetActions, 'resize')
		resizeAction.action()
	})
</script>

<iframe src={url} title={$widget.title} class="w-full" />
