<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'

	export let data: any = null

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let url: string = $widget.format_definition?.url || $widget.url

	let tempUrl
	$: if ($widget.data && $widget.data.url !== tempUrl) {
		tempUrl = $widget.data.url
		$widget.loading = true
	}

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

{#if $widget.format_definition?.type && $widget.format_definition?.type === 'iframe'}
	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe
		id="iframe-{$widget.widget_id}"
		src={url}
		width="100%"
		style="border:0;"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	/>
{:else if $widget.format_definition?.type && $widget.format_definition?.type === 'img'}
	<!-- svelte-ignore a11y-missing-attribute -->
	<img
		id="iframe-{$widget.widget_id}"
		src={$widget.data.url}
		width="100%"
		on:load={() => ($widget.loading = false)}
	/>
{:else}
	<embed id="iframe-{$widget.widget_id}" type="text/html" src={$widget.url} width="100%" />
{/if}
