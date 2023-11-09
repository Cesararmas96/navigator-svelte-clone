<script lang="ts">
	import { getWidgetAction } from '$lib/helpers'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let data: string

	let url: string
	$: url = data

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	onMount(() => {
		const resizeAction = getWidgetAction($widgetActions, 'resize')
		resizeAction.action()
	})
</script>

{#if url}
	<!-- svelte-ignore a11y-missing-attribute -->
	<img src={url} class="w-full" />
{/if}
