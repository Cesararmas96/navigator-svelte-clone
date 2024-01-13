<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'

	export const data: any = null

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let url: string = ''

	function loadIframe() {
		createMediaSettings(widget)

		url = $widget.url
	}

	// $: if ($widget?.saved) {
	// 	loadIframe()
	// 	$widget.saved = null
	// }

	onMount(() => {
		// loadIframe()
		// setContentHeight($widget.widget_id)
		resizeIFrameToContent()
	})

	const resizeIFrameToContent = () => {
		const iFrame: HTMLElement = document.querySelector(`#iframe-${$widget.widget_id}`)!
		iFrame.style['min-height'] = contentHeight($widget.widget_id)
		iFrame.style['height'] = iFrame.style['min-height']
		$widget.resized = false
	}
	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: () => {
			setContentHeight($widget.widget_id)
			resizeIFrameToContent()
		}
	})
</script>

<embed id="iframe-{$widget.widget_id}" type="text/html" src={$widget.url} width="100%" />
