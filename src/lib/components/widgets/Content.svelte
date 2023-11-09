<script lang="ts">
	import type { Writable } from 'svelte/store'
	import ComponentBase from './ComponentBase.svelte'
	import ComponentType from './ComponentType.svelte'
	import { onMount } from 'svelte'
	import { contentHeight } from '$lib/helpers/widget/widget'

	export let widget: Writable<any>

	onMount(() => {
		setTimeout(() => {
			const widgetMainEL = document.getElementById(`widget-main-${$widget.widget_id}`)!
			const widgetContentEL = document.getElementById(`widget-content-${$widget.widget_id}`)!
			const height = `${contentHeight($widget.widget_id)}`
			widgetMainEL.style.height = height
			widgetContentEL.style.height = height
		}, 500)
	})
</script>

<div id={`widget-content-${$widget.widget_id}`}>
	<ComponentBase {widget} let:data>
		<ComponentType {widget} {data} />
	</ComponentBase>
</div>
