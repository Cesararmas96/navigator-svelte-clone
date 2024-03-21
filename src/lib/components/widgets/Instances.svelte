<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Widget from './Widget.svelte'
	import WidgetInstence from './WidgetInstence.svelte'
	import { removeInstance } from '$lib/helpers/widget/instances'

	const dispatch = createEventDispatcher()

	export let widget: Writable<any>

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const handleCloseInstance = (e: any) => {
		removeInstance(widget, e.detail)
		if ($widget.instances.length > 0) return
		setTimeout(() => {
			dispatch('handleInstanceResize', 'close')
		}, 100)
	}
</script>

<div
	id={`widget-instances-${$widget.widget_id}`}
	class:hidden={!$widget.instances || $widget.instances.length === 0}
>
	{#if $widget.instances}
		<div class={`grid grid-cols-${$widget.instances.length} gap-2`}>
			{#each $widget.instances as instance}
				<WidgetInstence
					widget={instance}
					{isToolbarVisible}
					{fixed}
					{isOwner}
					on:handleInstanceResize
					on:handleCloseInstance={handleCloseInstance}
					let:widget
				>
					<Widget {widget} {isToolbarVisible} {fixed} {isOwner} />
				</WidgetInstence>
			{/each}
		</div>
	{/if}
</div>
