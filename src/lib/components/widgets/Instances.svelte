<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Widget from './Widget.svelte'
	import WidgetInstence from './WidgetInstence.svelte'
	import { removeInstance } from '$lib/helpers/widget/instances'
	import Loading from '../common/Loading.svelte'

	const dispatch = createEventDispatcher()

	export let widget: Writable<any>

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const handleCloseInstance = (e: any) => {
		removeInstance(widget, e.detail)
		setTimeout(() => {
			dispatch('handleInstanceResize')
		}, 100)
	}
</script>

<div
	id={`widget-instances-${$widget.uid}`}
	class:hidden={!$widget.instances || $widget.instances.length === 0}
>
	{#if $widget.instances}
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
	{/if}
</div>
