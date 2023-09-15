<script lang="ts">
	import { isDarkMode, isUrl } from '$lib/helpers/common/common'
	import { initWidgetActions } from '$lib/helpers/widget/actions'
	import { initInstances } from '$lib/helpers/widget/instances'
	import { createEventDispatcher, getContext, onMount, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'
	import { selectedWidgetSettings } from '$lib/stores/widgets'
	import { initWidgetData } from '$lib/helpers/widget/data'

	let isToolbarVisible: boolean = false
	let fixed: boolean
	let opacity: number
	let background: string
	let backgroundRGB: string
	let color: string = ''
	let border: boolean
	let draggable: boolean

	const dispatch = createEventDispatcher()

	export let widget: any

	const defaultSettings = {
		title: '',
		description: '',
		attributes: {
			icon: 'mdi:widgets-outline'
		},
		params: {
			component: 'Parent',
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

	const isOwner: boolean = true // TODO: check if user is owner of widget
	setContext('isWidgetOwner', isOwner)

	const bgTypeClass = (bg: string) => {
		return !isDarkMode() ? (isUrl(bg) ? 'widget-bg-image' : 'widget-bg-color') : ''
	}

	let widgetStore = writable(widget)

	initWidgetActions()
	initInstances()
	initWidgetData()

	let widgetBase: string
	$: {
		if (widget) {
			if (widget.params && !widget.params?.settings && !widget.temp) {
				widget.params.settings = Object.assign({}, defaultSettings.params.settings)
			}
			if (widget.widget_type_id) {
				widgetBase = widget.widget_type_id.split('-')[0]
				widgetBase = widgetBase.charAt(0).toUpperCase() + widgetBase.slice(1)
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

	$: {
		fixed = widget?.params?.settings?.general?.fixed
		draggable = fixed ? false : widget?.params?.settings?.general?.draggable
		if (!isDarkMode()) {
			opacity = widget?.params?.settings?.appearance?.opacity
			background = widget?.params?.settings?.appearance?.background || '#ffffff'
			backgroundRGB = widget?.params?.settings?.appearance?.backgroundRGB || '255, 255, 255'
			color = widget?.params?.settings?.appearance?.color || '#37507f'
			border = widget?.params?.settings?.appearance?.border
		}
	}

	$: if ($widgetStore.collapse_action) {
		$widgetStore.collapse_action = null
		setTimeout(() => {
			dispatch('handleResize')
		}, 100)
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	id={widget?.uid}
	style:color
	style:--widget-bg-image={'url(' + background + ')'}
	style:--widget-bg-color={backgroundRGB}
	style:--widget-bg-opacity={opacity / 100}
	style:--widget-fixed={fixed ? 'fixed' : ''}
	style:border-color={fixed || isDarkMode() ? '' : '#E5E7EB'}
	class:border={!isDarkMode() && border}
	class:border-gray-200={!isDarkMode() && border}
	class:cursor-default={fixed || !draggable}
	class={`card justify-content-between flex h-full w-full flex-col rounded-lg p-1 ${bgTypeClass(
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
	<slot {isToolbarVisible} {fixed} {isOwner} />
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
