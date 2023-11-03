<script lang="ts">
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	let Thing: any
	const widgetTop = getContext<Writable<any>>('WidgetTop')

	$: if ($widgetTop) {
		import(`./top/${$widgetTop.component}.svelte`).then((value: any) => {
			Thing = value.default
		})
	}
</script>

<div id={`widget-content-top-${$widget.widget_id}`}>
	{#if $widgetTop}
		<svelte:component this={Thing} {...$widgetTop.props} />
	{/if}
</div>
