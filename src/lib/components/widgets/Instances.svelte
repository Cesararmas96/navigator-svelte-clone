<script lang="ts">
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Widget from './Widget.svelte'
	import WidgetInstence from './WidgetInstence.svelte'

	export let widget: any

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	const instances = getContext<Writable<any[]>>('widgetInstances')
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
			>
				<Widget {isToolbarVisible} {fixed} {isOwner} />
			</WidgetInstence>
		{/each}
	{/if}
</div>
