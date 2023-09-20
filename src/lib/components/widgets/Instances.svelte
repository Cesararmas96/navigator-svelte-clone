<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Widget from './Widget.svelte'
	import WidgetInstence from './WidgetInstence.svelte'
	import { removeInstance } from '$lib/helpers/widget/instances'

	const dispatch = createEventDispatcher()

	export let widget: any

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const instances = getContext<Writable<any[]>>('widgetInstances')

	const handleCloseInstance = (e: any) => {
		removeInstance(instances, e.detail)
		setTimeout(() => {
			dispatch('handleInstanceResize')
		}, 100)
	}
</script>

<div id={`widget-instances-${widget.uid}`}>
	{#if $instances}
		{#each $instances as instance}
			<WidgetInstence
				widget={instance}
				{isToolbarVisible}
				{fixed}
				{isOwner}
				on:handleInstanceResize
				on:handleCloseInstance={handleCloseInstance}
			>
				<Widget {isToolbarVisible} {fixed} {isOwner} />
			</WidgetInstence>
		{/each}
	{/if}
</div>
