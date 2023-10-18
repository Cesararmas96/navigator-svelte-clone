<script lang="ts">
	import { getWidgetAction } from '$lib/helpers'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let data: string

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	let url: string

	$: {
		url = data
		if (url && !url.includes('https://') && !url.includes('http://')) {
			url = 'https://' + url
		}
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const widget = getContext<Writable<any>>('widget')
	const resizeAction = getWidgetAction($widgetActions, 'resize')

	onMount(() => {
		if ($widget.resize_on_load) resizeAction.action()
	})
</script>

{#if url && url.match(patternUrl)}
	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe src={url} class="h-full w-full" height="500" />
{/if}
