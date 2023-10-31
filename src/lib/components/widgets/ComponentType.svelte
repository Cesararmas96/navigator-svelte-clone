<script lang="ts">
	import { addWidgetAction, getWidgetAction } from '$lib/helpers'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import NoDataFound from './NoDataFound.svelte'
	import { capitalizeWord } from '$lib/helpers/common/common'
	import { setContentHeight } from '$lib/helpers/widget/widget'

	export let widget: Writable<any>
	export let data: any

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let classbase = $widget.classbase?.replace('Widget', '')

	if (!classbase) {
		classbase = capitalizeWord($widget.widget_type_id)
	}

	let Thing: any

	const resizeComponentContent = () => {
		setContentHeight($widget.widget_id)
		$widget.resized = false
	}

	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: resizeComponentContent
	})

	$: if ($widget.resized) {
		const resize = getWidgetAction($widgetActions, 'resizeContent')
		resize.action()
	}

	onMount(async () => {
		if (!$widget.data) $widget.data = data
		Thing = (await import(`./type/${classbase}/${classbase}.svelte`)).default
		if ($widget.temp) {
			$widget.instance_loading = true
		}
		// if ($widget.resize_on_load) resizeComponentContent()
	})
</script>

{#if $widget.data || $widget.params?.btnsActions}
	<svelte:component this={Thing} data={$widget.data} />
{:else}
	<NoDataFound />
{/if}
