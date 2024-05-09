<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'
	import { storeUser } from '$lib/stores'

	export let data: any = null

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let url: string = $widget.format_definition?.url || $widget.url
	url += `&token=${$storeUser.token}`

	onMount(() => {
		resizeIFrameToContent()
	})

	let resized: boolean = false
	$: if (
		document.querySelector(`#iframe-${$widget.widget_id}`) &&
		!$widget.param?.hidden &&
		!resized
	) {
		setTimeout(() => {
			resizeIFrameToContent()
			resized = true
		}, 500)
	}

	const resizeIFrameToContent = () => {
		const iFrame: HTMLElement = document.querySelector(`#iframe-${$widget.widget_id}`)!
		if (!iFrame) return
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

<embed id="iframe-{$widget.widget_id}" type="text/html" src={url} width="100%" />
