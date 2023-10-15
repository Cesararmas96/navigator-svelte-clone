<script lang="ts">
	import { getWidgetAction } from '$lib/helpers'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import NoDataFound from './NoDataFound.svelte'

	export let widget: Writable<any>
	export let data: any

	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const classbase = $widget.classbase.replace('Widget', '')
	const resizeAction = getWidgetAction($widgetActions, 'resize')

	let Thing: any

	onMount(async () => {
		if (!$widget.data) $widget.data = data
		Thing = (await import(`./type/${classbase}/${classbase}.svelte`)).default
		if ($widget.temp) {
			$widget.instance_loading = true
		}
	})
</script>

{#if $widget.data}
	<svelte:component this={Thing} data={$widget.data} />
{:else}
	<NoDataFound />
{/if}
