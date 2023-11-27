<script lang="ts">
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import ContentTopItem from './ContentTopItem.svelte'

	export let widget: Writable<any>

	const widgetTop: Writable<any[]> = getContext('WidgetTop')
</script>

<div id={`widget-content-top-${$widget.widget_id}`}>
	{#each $widgetTop as item (item.component)}
		<ContentTopItem {item} />
	{/each}
</div>
