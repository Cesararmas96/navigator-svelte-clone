<script lang="ts">
	import { themeMode } from '$lib/stores/preferences'
	import WidgetHeader from './Header.svelte'
	import WidgetFooter from './Footer.svelte'
	import WidgetSettings from './toolbar/Settings.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { selectedWidgetSettings } from '$lib/stores/widgets'
	import { createEventDispatcher } from 'svelte'
	import ComponentType from './ComponentType.svelte'
	import ComponentBase from './ComponentBase.svelte'

	const dispatch = createEventDispatcher()

	export let widget: any

	$: widget

	const defaultSettings = {
		title: '',
		description: '',
		attributes: {
			icon: 'mdi:widgets-outline'
		},
		params: {
			settings: {
				general: {
					draggable: true,
					resizable: true,
					scrollable: true,
					fixed: false
				},
				appearance: {
					background: '#ffffff',
					backgroundRGB: '255, 255, 255',
					color: '#37507f',
					opacity: 100,
					border: true
				},
				header: {
					show: true,
					title: true,
					icon: true
				},
				toolbar: {
					show: true,
					close: true,
					reload: true,
					filtering: true,
					clone: true,
					help: true,
					export: true,
					screenshot: true,
					max: true,
					share: true,
					pin: true,
					like: true,
					comments: true
				},
				footer: {
					show: true,
					share: true,
					like: true,
					comments: true
				}
			}
		}
	}

	const owner: boolean = true // TODO: check if user is owner of widget
	setContext('isWidgetOwner', owner)

	const bgTypeClass = (bg: string) => {
		const patternUrl =
			/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

		return !isDarkMode() ? (patternUrl.test(bg) ? 'widget-bg-image' : 'widget-bg-color') : ''
	}

	let widgetStore = writable(widget)
	let widgetBase: string
	$: {
		if (widget.data.params && !widget.data.params?.settings)
			widget.data.params.settings = Object.assign({}, defaultSettings.params.settings)

		widgetBase = widget.data.widget_type_id.split('-')[0]
		widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
		$widgetStore = widget
		setContext('widget', widgetStore)
	}

	$: {
		if (
			$selectedWidgetSettings?.state === 'saved' &&
			$selectedWidgetSettings?.widget?.uid === widget?.data?.uid
		) {
			dispatch('handleDraggable', $selectedWidgetSettings.widget.params.settings.general.draggable)
			widget.data = $selectedWidgetSettings.widget
			$widgetStore = widget
			$selectedWidgetSettings = null
		}
	}

	let isToolbarVisible: boolean = false

	let fixed: boolean
	let header: boolean
	let footer: boolean
	let opacity: number
	let background: string
	let backgroundRGB: string
	let color: string = ''
	let border: boolean
	let scrollable: boolean
	let draggable: boolean

	$: {
		fixed = widget?.data?.params?.settings?.general?.fixed
		header = widget?.data?.params?.settings?.header?.show
		footer = widget?.data?.params?.settings?.footer?.show
		scrollable = widget?.data?.params?.settings?.general?.scrollable
		draggable = fixed ? false : widget?.data?.params?.settings?.general?.draggable
		if ($themeMode !== 'dark') {
			opacity = widget?.data?.params?.settings?.appearance?.opacity
			background = widget?.data?.params?.settings?.appearance?.background || '#ffffff'
			backgroundRGB = widget?.data?.params?.settings?.appearance?.backgroundRGB || '255, 255, 255'
			color = widget?.data?.params?.settings?.appearance?.color || '#37507f'
			border = widget?.data?.params?.settings?.appearance?.border
		}
	}

	function isDarkMode() {
		return $themeMode === 'dark'
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	id={widget?.data?.uid}
	style:height={'inherit'}
	style:color
	style:--widget-bg-image={'url(' + background + ')'}
	style:--widget-bg-color={backgroundRGB}
	style:--widget-bg-opacity={opacity / 100}
	style:--widget-fixed={fixed ? 'fixed' : ''}
	style:border-color={fixed || isDarkMode() ? '' : '#E5E7EB'}
	class:border={!isDarkMode() && border}
	class:border-gray-200={!isDarkMode() && border}
	class:cursor-default={fixed || !draggable}
	class={`card justify-content-between flex w-full flex-col rounded-lg p-1 ${bgTypeClass(
		background
	)}`}
	on:mouseenter={() => {
		isToolbarVisible = true
	}}
	on:mouseleave={() => {
		isToolbarVisible = false
	}}
	on:pointerdown={(event) => {
		if (draggable) return
		event.preventDefault()
		event.stopPropagation()
	}}
>
	<!-- Widget Header -->
	<div class="mb-2 h-11">
		{#if !fixed && header}
			<WidgetHeader {isToolbarVisible} />
		{:else if isToolbarVisible && owner}
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
		class="widget-content relative flex h-full w-full cursor-auto space-y-4 rounded-md text-sm"
		class:overflow-hidden={!scrollable}
		class:overflow-y-auto={scrollable}
		on:pointerdown={(event) => {
			event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div class="absolute h-auto w-full">
			<!-- load dynamic widgets -->
			{#if $widgetStore?.data.classbase === 'ApiTableWidget' || $widgetStore?.data.classbase === 'MediaWidget'}
				<ComponentBase name={widgetBase} let:data let:methods>
					<ComponentType name={$widgetStore?.data.classbase} {data} {methods} />
				</ComponentBase>
			{/if}
		</div>
	</div>

	<!-- Widget Footer -->
	<div class="m-h-11 mt-2 h-11">
		{#if !fixed && footer}
			<WidgetFooter {isToolbarVisible} />
		{/if}
	</div>
</div>

<style>
	.widget-bg-image {
		background-color: transparent;
	}

	.widget-bg-image::before {
		content: '';
		background-image: var(--widget-bg-image);
		background-size: cover;
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		opacity: var(--widget-bg-opacity);
		border-radius: 0.5rem;
	}

	.widget-bg-color {
		background-color: rgba(var(--widget-bg-color), var(--widget-bg-opacity));
	}

	.widget-bg-color:is([data-theme='dark']) {
		background-color: inherit;
	}
</style>
