<script lang="ts">
	import WidgetHeader from './Header.svelte'
	import WidgetSettings from './toolbar/Settings.svelte'
	import ContentTop from './ContentTop.svelte'
	import ContentBottom from './ContentBottom.svelte'
	import Content from './Content.svelte'
	import { createEventDispatcher, getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Instances from './Instances.svelte'
	import Spinner from '../common/Spinner.svelte'
	import { getWidgetAction } from '$lib/helpers'
	import { resetContentHeight } from '$lib/helpers/widget/widget'

	const dispatch = createEventDispatcher()
	const widgetActions: Writable<any[]> = getContext('widgetActions')

	export let isToolbarVisible: boolean
	export let fixed: boolean
	export let isOwner: boolean
	export let isDraggable: boolean = false
	export let reload: boolean = false
	export let isMobileDevice: boolean = false

	$: if (reload) {
		const reloadAction = getWidgetAction($widgetActions, 'reloadFetchData')
		reloadAction.action()
		reload = false
	}

	let scrollable: boolean
	let scrollableBox: boolean = true
	let header: boolean
	let footer: boolean

	export let widget: Writable<any>

	$: {
		header = $widget?.params?.settings?.header?.show
		footer = $widget?.params?.settings?.footer?.show
	}

	const handleInstanceResize = (event: CustomEvent) => {
		$widget.instance_loading = false
		if (event && event.detail && event.detail === 'close') {
			resetContentHeight($widget.widget_id)
			dispatch('handleInstanceResize', event)
		} else if (event && event.detail && event.detail === 'loaded') {
			dispatch('handleInstanceResize', event)
			setTimeout(() => {
				const resize = getWidgetAction($widgetActions, 'resizeContent')
				resize.action()
			}, 1000)
		}
	}

	$: scrollable = !$widget.temp ? $widget?.params?.settings?.general?.scrollable : false
</script>

<div
	id={`widget-${$widget.widget_id}`}
	class:h-[calc(100%-0.5rem)]={!$widget.temp && !$widget.collapse && !isMobileDevice}
	class:absolute={!$widget?.temp && !$widget?.collapse && !$widget?.layout && !isMobileDevice}
	class:-ml-1={!$widget.temp && !$widget.collapse && !isMobileDevice}
	class:p-1={!$widget.temp && !$widget.collapse && !isMobileDevice}
	class="w-full"
	style:min-height={$widget?.attributes?.min_height ? $widget?.attributes?.min_height : 'auto'}
>
	{#if $widget.loading}
		<Spinner fullScreen={false} />
	{/if}
	<!-- Widget Header -->
	<div
		id={`widget-header-${$widget.widget_id}`}
		class:mt-1={$widget.temp}
		class:cursor-move={isDraggable}
		class:hidden={fixed || !header}
		class="min-h-8"
	>
		{#if !fixed && header}
			<WidgetHeader {isToolbarVisible} {isMobileDevice} />
		{:else if isToolbarVisible && isOwner}
			<div
				class="absolute right-1 z-10 -mt-1"
				on:pointerdown={(event) => {
					event.preventDefault()
					event.stopPropagation()
				}}
			>
				<WidgetSettings inMenu={false} />
			</div>
		{/if}
	</div>

	<!-- class:overflow-hidden={!$widget.attributes?.fullcontent && !isMobileDevice && !scrollableBox}
	class:overflow-y-auto={!$widget.attributes?.fullcontent && !isMobileDevice && scrollableBox} -->

	<!-- Widget Content -->
	<div
		id={`widget-main-${$widget.widget_id}`}
		class:overflow-hidden={!isMobileDevice && !scrollableBox}
		class:overflow-y-auto={!isMobileDevice && scrollableBox}
		class:hidden={$widget.collapse}
		class:!h-full={isMobileDevice}
		class="widget-content relative flex w-full cursor-auto flex-col space-y-4 rounded-md text-sm"
		on:pointerdown={(event) => {
			if (
				// @ts-ignore
				typeof event?.target?.className === 'string' &&
				// @ts-ignore
				event?.target?.className?.includes('slider' || 'draggable')
			)
				return

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
