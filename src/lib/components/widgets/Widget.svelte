<script lang="ts">
	import WidgetHeader from './Header.svelte'
	import WidgetSettings from './toolbar/Settings.svelte'
	import ContentTop from './ContentTop.svelte'
	import ContentBottom from './ContentBottom.svelte'
	import Content from './Content.svelte'
	import { createEventDispatcher } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Instances from './Instances.svelte'
	import Spinner from '../common/Spinner.svelte'

	const dispatch = createEventDispatcher()

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean

	let scrollable: boolean
	let scrollableBox: boolean
	let header: boolean
	let footer: boolean

	export let widget: Writable<any>

	$: {
		header = $widget?.params?.settings?.header?.show
		footer = $widget?.params?.settings?.footer?.show
	}

	const handleInstanceResize = (event: Event) => {
		$widget.instance_loading = false
		dispatch('handleInstanceResize', event)
	}

	$: scrollable = !$widget.temp ? $widget?.params?.settings?.general?.scrollable : false
</script>

<div
	id={`widget-${$widget.widget_id}`}
	class:h-[calc(100%-0.5rem)]={!$widget.temp && !$widget.collapse}
	class:absolute={!$widget?.temp && !$widget?.collapse && !$widget?.layout}
	class:-ml-1={!$widget.temp && !$widget.collapse}
	class:p-1={!$widget.temp && !$widget.collapse}
	class="w-full"
>
	{#if $widget.loading}
		<Spinner fullScreen={false} />
	{/if}
	<!-- Widget Header -->
	<div
		id={`widget-header-${$widget.widget_id}`}
		class:mt-1={$widget.temp}
		class:cursor-move={$widget?.params?.settings?.general?.draggable}
		class="min-h-8"
	>
		{#if !fixed && header}
			<WidgetHeader {isToolbarVisible} />
		{:else if isToolbarVisible && isOwner}
			<div
				class="absolute right-2 mt-1"
				on:pointerdown={(event) => {
					event.preventDefault()
					event.stopPropagation()
				}}
			>
				<WidgetSettings inMenu={false} />
			</div>
		{/if}
	</div>

	<!-- Widget Content -->
	<div
		id={`widget-main-${$widget.widget_id}`}
		class:overflow-hidden={!scrollableBox}
		class:overflow-y-auto={scrollableBox}
		class:hidden={$widget.collapse}
		class="widget-content relative flex w-full cursor-auto flex-col space-y-4 rounded-md text-sm"
		on:pointerdown={(event) => {
			// event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div id={`widget-main-content-${$widget.widget_id}`} class="w-full">
			<ContentTop {widget} />

			<Content {widget} />

			<ContentBottom {widget} />
		</div>

		<Instances
			{widget}
			{isToolbarVisible}
			{fixed}
			{isOwner}
			on:handleInstanceResize={handleInstanceResize}
		/>
	</div>
</div>
