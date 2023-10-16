<script lang="ts">
	import WidgetHeader from './Header.svelte'
	import WidgetFooter from './Footer.svelte'
	import WidgetSettings from './toolbar/Settings.svelte'
	import ContentTop from './ContentTop.svelte'
	import ContentBottom from './ContentBottom.svelte'
	import Content from './Content.svelte'
	import { createEventDispatcher, getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Instances from './Instances.svelte'
	import { addWidgetAction } from '$lib/helpers'
	import { selectedWidgetMaximize } from '$lib/stores/widgets'
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

	const widgetActions = getContext<Writable<any>>('widgetActions')
	$: {
		header = $widget?.params?.settings?.header?.show
		footer = $widget?.params?.settings?.footer?.show
		// if ($widget?.params?.settings?.toolbar?.max) {
		// 	if (!$widgetActions.find((action: any) => action.name === 'maximizeWidget')) {
		// 		addWidgetAction(widgetActions, {
		// 			name: 'maximizeWidget',
		// 			action: async () => {
		// 				$selectedWidgetMaximize = {
		// 					widget: $widget
		// 				}
		// 			}
		// 		})
		// 	}
		// }
	}

	const handleInstanceResize = (event: Event) => {
		$widget.instance_loading = false
		dispatch('handleInstanceResize', event)
	}

	$: scrollable = !$widget.temp ? $widget?.params?.settings?.general?.scrollable : false
</script>

<div
	id={`widget-${$widget.uid}`}
	class:h-[calc(100%-2rem)]={!$widget.temp && !$widget.collapse}
	class:overflow-hidden={!scrollableBox}
	class:overflow-y-auto={scrollableBox}
	class:absolute={!$widget.temp && !$widget.collapse}
	class:-ml-1={!$widget.temp && !$widget.collapse}
	class:p-1={!$widget.temp && !$widget.collapse}
	class="w-full"
>
	{#if $widget.loading}
		<Spinner fullScreen={false} />
	{/if}
	<!-- Widget Header -->
	<div id={`widget-header-${$widget.uid}`} class:mt-1={$widget.temp} class="h-8">
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
		id={`widget-main-content-${$widget.uid}`}
		class:hidden={$widget.collapse}
		class="widget-content relative flex w-full cursor-auto flex-col space-y-4 rounded-md text-sm"
		on:pointerdown={(event) => {
			// event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div class="h-full w-full">
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
<!-- Widget Footer -->
{#if !$widget.temp}
	<div
		class:hidden={$widget.collapse}
		id={`widget-footer-${$widget.uid}`}
		class="absolute bottom-0 -ml-1 h-8 w-full p-1"
	>
		{#if !fixed && footer}
			<WidgetFooter {isToolbarVisible} />
		{/if}
	</div>
{/if}
