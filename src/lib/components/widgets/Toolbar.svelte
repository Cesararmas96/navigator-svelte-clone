<script lang="ts">
	import { Dropdown, Tooltip } from 'flowbite-svelte'
	import ToolbarHelp from './toolbar/Help.svelte'
	import Icon from '../common/Icon.svelte'
	import { getContext } from 'svelte'
	import ToolbarClose from './toolbar/Close.svelte'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'
	import { storeUser } from '$lib/stores'
	import { themeMode } from '$lib/stores/preferences'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'
	import ButtonItem from './toolbar/ButtonItem.svelte'
	import ButtonToggle from './toolbar/ButtonToggle.svelte'
	import { like, pin, screenshot } from '$lib/helpers/widget/toolbar'
	import { selectedWidgetMaximize } from '$lib/stores/widgets'
	import { saveWidgetSettings } from '$lib/helpers/widget/settings'
	import { openExportDataModal } from '$lib/helpers/common/modal'
	import { hideWidgetSettings, selectedWidgetSettings } from '$lib/stores/widgets'
	import { sendSuccessNotification } from '$lib/stores/toast'

	export let isToolbarVisible: boolean
	export let isMobileDevice: boolean = false

	const widgetActions = getContext<Writable<any>>('widgetActions')
	const widget = getContext<Writable<any>>('widget')
	const dashboard = getContext<Writable<any>>('dashboard')

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	let isWidgetOwner: boolean = $dashboard?.attributes?.user_id === $storeUser?.user_id
	let menuOpen = false
	$: if (!isToolbarVisible) {
		menuOpen = false
	}

	let bg: string
	let toolbar: any
	$: if ($themeMode !== 'dark') {
		bg = $widget?.params?.settings?.appearance?.background
	} else {
		bg = ''
	}
	$: toolbar = $widget?.params?.settings?.toolbar

	let showInMenu: boolean = false
	const handleShowMenu = (widget_id: string) => {
		const titleEL = document.getElementById(`widget-title-${widget_id}`)!
		const toolbarEL = 200
		const widgetEL = document.getElementById(`widget-${widget_id}`)!
		showInMenu = widgetEL?.offsetWidth - (titleEL?.offsetWidth + toolbarEL) < 0 || isMobileDevice
	}

	$: if (isToolbarVisible || isMobileDevice) {
		handleShowMenu($widget.widget_id)
		setToolbarItems()
	}

	let toolbarItems
	let listOutOfMenu
	let listInMenu

	let modal: any = getContext('modal')

	const setToolbarItems = () => {
		toolbarItems = {
			like: {
				component: ButtonToggle,
				item: {
					status: $widget.like,
					items: {
						active: {
							name: 'Unlike',
							icon: 'twemoji:red-heart',
							tooltipText: 'Unlike',
							action: (status) => like(status, $widget.widget_id)
						},
						inactive: {
							name: 'Like',
							icon: 'icon-park-outline:like',
							tooltipText: 'Like',
							action: (status) => like(status, $widget.widget_id)
						}
					}
				},
				show: toolbar['like'] && !$widget['shared'],
				showInMenu
			},
			reload: {
				component: ButtonItem,
				item: {
					name: 'Reload',
					icon: 'tabler:refresh',
					tooltipText: 'Clear cache and reload',
					action: () => {
						const reloadAction = getWidgetAction($widgetActions, 'reloadFetchData')
						reloadAction.action()
					}
				},
				show: toolbar['reload'],
				showInMenu
			},
			clone: {
				component: ButtonItem,
				item: {
					name: 'Clone',
					icon: 'tabler:copy',
					tooltipText: 'Clone Widget',
					action: () => {
						const cloneAction = getWidgetAction($widgetActions, 'clone')
						cloneAction.action()
					}
				},
				show: toolbar['clone'] && !$widget['shared'],
				showInMenu
			},
			collapse: {
				component: ButtonToggle,
				item: {
					status: $widget.collapse,
					items: {
						active: {
							name: 'Expand',
							icon: 'mdi:chevron-down',
							tooltipText: 'Expand widget',
							action: (status) => {
								const collapseAction = getWidgetAction($widgetActions, 'collapse')
								collapseAction.action()
								$widget.collapse = false
								return $widget.collapse
							}
						},
						inactive: {
							name: 'Collapse',
							icon: 'mdi:chevron-up',
							tooltipText: 'Collapse widget',
							action: (status) => {
								const collapseAction = getWidgetAction($widgetActions, 'collapse')
								collapseAction.action()
								$widget.collapse = true
								return $widget.collapse
							}
						}
					}
				},
				show: toolbar['collapse'],
				showInMenu
			},
			maximize: {
				component: ButtonToggle,
				item: {
					status: Boolean($selectedWidgetMaximize),
					items: {
						active: {
							name: 'Restore',
							icon: 'tabler:arrows-diagonal-minimize-2',
							tooltipText: 'Restore',
							action: (status) => {
								$selectedWidgetMaximize = null
								return true
							}
						},
						inactive: {
							name: 'Fullscreen',
							icon: 'tabler:arrows-diagonal',
							tooltipText: 'Fullscreen',
							action: (status) => {
								$selectedWidgetMaximize = { widget: { ...$widget } }
								return false
							}
						}
					}
				},
				show: toolbar['max'] && !$widget['shared'],
				showInMenu
			},
			pin: {
				component: ButtonToggle,
				item: {
					status: $widget.pin,
					items: {
						active: {
							name: 'Unpin',
							icon: 'tabler:pinned-off',
							tooltipText: 'Unpin widget',
							action: (status) => pin(status, $widget.widget_id, $storeUser?.user_id)
						},
						inactive: {
							name: 'Pin',
							icon: 'tabler:pinned',
							tooltipText: 'Pin widget',
							action: (status) => pin(status, $widget.widget_id, $storeUser?.user_id)
						}
					}
				},
				show: toolbar['pin'] && !$widget['shared'],
				showInMenu
			},
			copy: {
				component: ButtonItem,
				item: {
					name: 'Copy',
					icon: 'tabler:clipboard-copy',
					tooltipText: 'Copy Widget',
					action: () => {
						storeCCPWidget.set($widget)
						storeCCPWidgetBehavior.set({ type: 'copy', dashboard_id: $widget.dashboard_id })
						sendSuccessNotification('Widget copied to clipboard')
					}
				},
				show: toolbar['copy'] && !$widget['shared'],
				showInMenu
			},
			cut: {
				component: ButtonItem,
				item: {
					name: 'Cut',
					icon: 'ion:cut-sharp',
					tooltipText: 'Cut Widget',
					action: () => {
						storeCCPWidget.set($widget)
						storeCCPWidgetBehavior.set({ type: 'cut', dashboard_id: $widget.dashboard_id })
						sendSuccessNotification('Widget cut to clipboard')
					}
				},
				show: isWidgetOwner && !$widget['temp'] && !$widget['cloned'] && !$widget['shared'],
				showInMenu
			},
			screenshot: {
				component: ButtonItem,
				item: {
					name: 'Screenshot',
					icon: 'tabler:camera',
					tooltipText: 'Screenshot',
					action: () => screenshot($widget.widget_id, $widget.title)
				},
				show: toolbar['screenshot'],
				showInMenu: true
			},
			settings: {
				component: ButtonItem,
				item: {
					name: 'Settings',
					icon: 'tabler:settings',
					tooltipText: 'Settings',
					action: () => {
						$selectedWidgetSettings = {
							widget: widget,
							state: 'edit',
							callback: saveWidgetSettings
						}
						$hideWidgetSettings = false
					}
				},
				show: isWidgetOwner && $widget['settings'],
				showInMenu: true
			},
			export: {
				component: ButtonItem,
				item: {
					name: 'Export Data',
					icon: 'tabler:file-export',
					tooltipText: 'Export data',
					action: () => {
						openExportDataModal(modal, { query_slug: $widget.query_slug.slug })
					}
				},
				show: toolbar['export'],
				showInMenu: true
			},
			share: {
				component: ButtonItem,
				item: {
					name: 'Share',
					icon: 'mdi:share-variant',
					tooltipText: 'Share',
					action: () => {
						const url = `/share/widget/${$widget?.widget_id}`
						const link = document.createElement('a')
						link.href = url
						link.target = '_blank'
						link.click()
					}
				},
				show: toolbar['share'],
				showInMenu: true
			}
		}

		listOutOfMenu = Object.keys(toolbarItems).filter(
			(item) => toolbarItems[item].show && !toolbarItems[item].showInMenu
		)
		listInMenu = Object.keys(toolbarItems).filter(
			(item) => toolbarItems[item].show && toolbarItems[item].showInMenu
		)
	}
</script>

{#if toolbarItems}
	<div
		id={`widget-toolbar-${$widget.widget_id}`}
		style:background-color={patternUrl.test(bg) ? 'transparent' : bg}
		class={isToolbarVisible || isMobileDevice
			? `widget-toolbar absolute right-2 rounded-md bg-white dark:bg-dark-100`
			: 'hidden'}
		on:pointerdown={(event) => {
			event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div class="flex flex-row justify-end pl-0" class:pr-2={isMobileDevice}>
			{#each listOutOfMenu as item}
				<svelte:component
					this={toolbarItems[item].component}
					showInMenu={toolbarItems[item].showInMenu}
					item={toolbarItems[item].item}
					{isMobileDevice}
				/>
			{/each}

			{#if !toolbar.help && $widget.description}<ToolbarHelp helpText={$widget.description} />{/if}

			<Tooltip
				placement="bottom"
				class={`z-10 ${isMobileDevice ? 'hidden' : ''}`}
				triggeredBy="#more-actions">More</Tooltip
			>
			<button
				id="more-actions"
				type="button"
				class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
				aria-expanded="false"
				aria-haspopup="true"
			>
				<Icon icon="tabler:dots-vertical" size="18" />
			</button>
			<Dropdown class="w-36" bind:open={menuOpen}>
				{#each listInMenu as item}
					<svelte:component
						this={toolbarItems[item].component}
						showInMenu={toolbarItems[item].showInMenu}
						item={toolbarItems[item].item}
						{isMobileDevice}
						on:itemClick={() => (menuOpen = false)}
					/>
				{/each}
			</Dropdown>

			{#if isWidgetOwner || $widget.temp || ($widget.cloned && !$widget.shared)}
				<ToolbarClose />
			{/if}
		</div>
	</div>
{/if}
