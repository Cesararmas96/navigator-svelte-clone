<script lang="ts">
	import { isDarkMode, isUrl } from '$lib/helpers/common/common'
	import { addWidgetAction, initWidgetActions } from '$lib/helpers/widget/actions'
	import { createEventDispatcher, getContext, onMount, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'
	import { selectedWidgetSettings } from '$lib/stores/widgets'
	import { storeUser } from '$lib/stores'
	import { themeMode } from '$lib/stores/preferences'
	import { initWidgetTop } from '$lib/helpers/widget/widget-top'
	import { merge } from 'lodash-es'

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
	export let resized: boolean = false
	export let isMobileDevice: boolean = false

	let collapsed: boolean = false

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
					draggable: false,
					resizable: false,
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
					collapse: true,
					clone: true,
					help: true,
					export: true,
					screenshot: true,
					max: true,
					share: true,
					pin: true,
					like: true,
					cut: true,
					copy: true,
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

	const dashboard = getContext<Writable<any>>('dashboard')

	$: isOwner = $dashboard?.attributes?.user_id === $storeUser?.user_id
	setContext('isWidgetOwner', isOwner)

	let widgetStore: any = writable(widget)
	setContext('widget', widgetStore)
	console.log('widgetStore', $widgetStore)

	const dispatchResize = () => {
		setTimeout(() => {
			dispatch('handleResize')
		}, 100)
	}

	const initActions = () => {
		const widgetActions: Writable<any[]> = initWidgetActions()

		addWidgetAction(widgetActions, {
			name: 'resize',
			action: dispatchResize
		})

		addWidgetAction(widgetActions, {
			name: 'remove',
			action: () => dispatch('handleRemove')
		})

		addWidgetAction(widgetActions, {
			name: 'clone',
			action: () => dispatch('handleCloning')
		})

		addWidgetAction(widgetActions, {
			name: 'collapse',
			action: () => {
				setTimeout(() => {
					collapsed = !collapsed
					dispatch('handleCollapse', collapsed)
				}, 100)
			}
		})

		addWidgetAction(widgetActions, {
			name: 'saveSettings',
			action: () => {
				dispatch('handleResizable', {
					resizable: $selectedWidgetSettings.widget.params.settings.general.resizable,
					fixed: $selectedWidgetSettings.widget.params.settings.general.fixed
				})
				$widgetStore = $selectedWidgetSettings.widget
				$selectedWidgetSettings = null
			}
		})
	}

	initActions()
	initWidgetTop()

	// onMount(() => {
	$widgetStore.instances = []
	if ($widgetStore.params && !$widgetStore.temp) {
		$widgetStore.params.settings = merge(
			{},
			defaultSettings.params.settings,
			$widgetStore.params.settings
		)
		console.log('widgetStore', $widgetStore.title)
		console.log('widgetStore', $widgetStore.params.settings)
	}
	$widgetStore.context = 'widget'
	// })

	$: {
		fixed = $widgetStore?.params?.settings?.general?.fixed
		draggable = fixed ? false : $widgetStore?.params?.settings?.general?.draggable
	}

	$: if ($themeMode !== 'dark') {
		opacity = !fixed ? $widgetStore?.params?.settings?.appearance?.opacity : 0
		background = $widgetStore?.params?.settings?.appearance?.background || '#ffffff'
		backgroundRGB = $widgetStore?.params?.settings?.appearance?.backgroundRGB || '255, 255, 255'
		color = $widgetStore?.params?.settings?.appearance?.color || '#37507f'
		border = $widgetStore?.params?.settings?.appearance?.border
	} else {
		opacity = 100
		background = ''
		backgroundRGB = ''
		color = ''
		border = false
	}

	$: if (resized) {
		$widgetStore.resized = true
	}
	const bgTypeClass = (bg: string) => {
		if (fixed) return 'bg-transparent'
		return !isDarkMode() && !fixed ? (isUrl(bg) ? 'widget-bg-image' : '') : ''
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	id={widget?.widget_id}
	style:color
	style:--widget-bg-image={'url(' + background + ')'}
	style:--widget-bg-color={backgroundRGB}
	style:--widget-bg-opacity={opacity / 100}
	style:--widget-fixed={fixed ? 'fixed' : ''}
	style:border-color={fixed || $themeMode === 'dark' ? '' : '#E5E7EB'}
	class:border={$themeMode !== 'dark' && border && !fixed}
	class:border-gray-200={$themeMode !== 'dark' && border && !fixed}
	class:cursor-default={fixed || !draggable}
	class:widget-drilldown-open={$widgetStore?.instances && $widgetStore?.instances?.length > 0}
	class:card={!fixed}
	class:relative={isMobileDevice}
	class={`justify-content-between widget-bg-color flex h-full w-full flex-col rounded-lg p-1 ${bgTypeClass(
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
		// event.preventDefault()
		// event.stopPropagation()
	}}
>
	{#if widgetStore}
		<slot widget={widgetStore} {isToolbarVisible} {fixed} {isOwner} />
	{/if}
</div>

<style>
	.widget-bg-image {
		background-color: transparent;
	}

	.widget-bg-image::before {
		content: '';
		background-image: var(--widget-bg-image);
		background-size: cover;
		background-position: center;
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

	.widget-drilldown-open {
		box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 15px;
		z-index: 10;
	}
</style>
