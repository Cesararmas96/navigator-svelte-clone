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

	let widgetActions = writable([])
	setContext('widgetActions', widgetActions)

	let widgetBase: string
	$: {
		if (widget.params && !widget.params?.settings)
			widget.params.settings = Object.assign({}, defaultSettings.params.settings)

		if (widget?.widget_type_id) {
			widgetBase = widget.widget_type_id.split('-')[0]
			widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
			if (widgetBase === 'Rest' || widgetBase === 'Api') {
				let reloadFetchData = writable(false)
				setContext('reloadFetchData', reloadFetchData)
			}

			$widgetStore = widget
			setContext('widget', widgetStore)
		}
	}

	$: {
		if (
			$selectedWidgetSettings?.state === 'saved' &&
			$selectedWidgetSettings?.widget?.uid === widget?.uid
		) {
			dispatch('handleResizable', {
				resizable: $selectedWidgetSettings.widget.params.settings.general.resizable,
				fixed: $selectedWidgetSettings.widget.params.settings.general.fixed
			})
			widget = $selectedWidgetSettings.widget
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
		fixed = widget?.params?.settings?.general?.fixed
		header = widget?.params?.settings?.header?.show
		footer = widget?.params?.settings?.footer?.show
		scrollable = widget?.params?.settings?.general?.scrollable
		draggable = fixed ? false : widget?.params?.settings?.general?.draggable
		if ($themeMode !== 'dark') {
			opacity = widget?.params?.settings?.appearance?.opacity
			background = widget?.params?.settings?.appearance?.background || '#ffffff'
			backgroundRGB = widget?.params?.settings?.appearance?.backgroundRGB || '255, 255, 255'
			color = widget?.params?.settings?.appearance?.color || '#37507f'
			border = widget?.params?.settings?.appearance?.border
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
	id={widget?.uid}
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
	<!-- class:overflow-hidden={!scrollable}
	class:overflow-y-auto={scrollable} -->
	<div
		class="widget-content relative flex h-full w-full cursor-auto space-y-4 overflow-hidden rounded-md text-sm"
		on:pointerdown={(event) => {
			event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div class="absolute h-auto w-full overflow-hidden">
			<!-- load dynamic widgets -->
			{#if $widgetStore?.classbase === 'CardWidget' || $widgetStore?.classbase === 'ApiTableWidget' || $widgetStore?.classbase === 'MediaWidget'}
				<ComponentBase name={widgetBase} let:data>
					<ComponentType name={$widgetStore?.classbase} {data} />
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
