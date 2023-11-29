<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'
	import { setContentHeight } from '$lib/helpers/widget/widget'
	import { gridHeight, gridInstanceHeight } from '$lib/helpers/widget/aggrid'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let id = 'chart' + $widget.widget_id
	let url: string = ''

	function loadIframe() {
		createMediaSettings(widget)

		url = $widget.url
	}

	$: if ($widget?.saved) {
		loadIframe()
		$widget.saved = null
	}

	onMount(() => {
		loadIframe()
		setContentHeight($widget.widget_id)
		resizeIFrameToContent()
	})

	const resizeIFrameToContent = () => {
		const iFrame: HTMLElement = document.querySelector(`#${id}`)!
		iFrame.style['min-height'] = !$widget.temp
			? gridHeight($widget.widget_id)
			: gridInstanceHeight($widget.widget_id)
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

<iframe {id} src={url} title={$widget.title} class="h-full w-full" />
