<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'

	export const data: any = null

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let url: string = $widget.format_definition.url || $widget.url

	function loadIframe() {
		createMediaSettings(widget)

		url = $widget.format_definition.url || $widget.url
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

	$: if (document.querySelector(`#iframe-${$widget.widget_id}`) && !$widget.param?.hidden) {
		setTimeout(() => {
			resizeIFrameToContent()
		}, 500)
	}

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

{#if $widget.format_definition.type && $widget.format_definition.type === 'iframe'}
	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe
		id="iframe-{$widget.widget_id}"
		src={url}
		width="100%"
		style="border:0;"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	/>
{:else}
	<embed id="iframe-{$widget.widget_id}" type="text/html" src={$widget.url} width="100%" />
{/if}
