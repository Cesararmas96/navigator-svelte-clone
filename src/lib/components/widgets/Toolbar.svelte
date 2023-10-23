<script lang="ts">
	import { Dropdown, Tooltip } from 'flowbite-svelte'
	import ToolbarLike from './footer/Like.svelte'
	import ToolbarReload from './toolbar/Reload.svelte'
	import ToolbarSettings from './toolbar/Settings.svelte'
	import ToolbarPin from './toolbar/Pin.svelte'
	import ToolbarHelp from './toolbar/Help.svelte'
	import ToolbarScreenshot from './toolbar/Screenshot.svelte'
	import ToolbarExportData from './toolbar/ExportData.svelte'
	import ToolbarShared from './toolbar/Shared.svelte'
	import Icon from '../common/Icon.svelte'
	import { getContext, onMount } from 'svelte'
	import ToolbarFilter from './toolbar/Filter.svelte'
	import ToolbarClone from './toolbar/Clone.svelte'
	import ToolbarMaximize from './toolbar/Maximize.svelte'
	import ToolbarClose from './toolbar/Close.svelte'
	import ToolbarCollapse from './toolbar/Collapse.svelte'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'
	import { storeUser } from '$lib/stores'
	import { themeMode } from '$lib/stores/preferences'
	import type { Writable } from 'svelte/store'
	import ToolbarCutCopy from './toolbar/CutCopy.svelte'
	import { getWidgetAction } from '$lib/helpers'
	import ButtonItem from './toolbar/ButtonItem.svelte'
	import ButtonToggle from './toolbar/ButtonToggle.svelte'
	import { screenshot, togglePin } from '$lib/helpers/widget/toolbar'
	import { selectedWidgetMaximize } from '$lib/stores/widgets'
	import { sendSuccessNotification } from '$lib/stores/toast'
	import { openExportDataModal } from '$lib/helpers/common/modal'
	import { goto } from '$app/navigation'

	export let isToolbarVisible: boolean

	const widgetActions = getContext<Writable<any>>('widgetActions')
	const widget = getContext<Writable<any>>('widget')

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	let isWidgetOwner: boolean = $widget.user_id === $storeUser.user_id
	let menuOpen = false

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
		const title = document.getElementById(`widget-title-${widget_id}`)!
		const toolbar = document.getElementById(`widget-toolbar-${widget_id}`)!
		const widget = document.getElementById(`widget-${widget_id}`)!
		showInMenu = widget?.offsetWidth - (title?.offsetWidth + toolbar?.offsetWidth + 20) < 0
	}

	$: if (isToolbarVisible) {
		setTimeout(() => {
			handleShowMenu($widget.widget_id)
		}, 10)
	}

	let toolbarItems
	let listOutOfMenu
	let listInMenu

	onMount(() => {
		toolbarItems = {
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
				hide: toolbar['reload'],
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
				hide: toolbar['clone'] || $widget['shared'],
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
				hide: toolbar['collapse'],
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
				hide: toolbar['max'] || $widget['shared'],
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
							action: (status) => togglePin(status, $widget.widget_id, $storeUser.user_id)
						},
						inactive: {
							name: 'Pin',
							icon: 'tabler:pinned',
							tooltipText: 'Pin widget',
							action: (status) => togglePin(status, $widget.widget_id, $storeUser.user_id)
						}
					}
				},
				hide: toolbar['pin'] || $widget['shared'],
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
						storeCCPWidgetBehavior.set('copy')
					}
				},
				hide: toolbar['copy'] || $widget['shared'],
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
						storeCCPWidgetBehavior.set('cut')
					}
				},
				hide:
					$widget['user_id'] !== $storeUser['user_id'] ||
					$widget['temp'] ||
					$widget['cloned'] ||
					$widget['shared'],
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
				hide: toolbar['screenshot'],
				showInMenu: true
			},
			export: {
				component: ButtonItem,
				item: {
					name: 'Export Data',
					icon: 'tabler:file-export',
					tooltipText: 'Export data',
					action: () => {
						// openExportDataModal(modal, $widget.query_slug.slug);
					}
				},
				hide: toolbar['export'],
				showInMenu: true
			},
			share: {
				component: ButtonItem,
				item: {
					name: 'Share',
					icon: 'mdi:share-variant',
					tooltipText: 'Share',
					action: () => {
						const url = `/share/widget/${$widget?.dashboard_id}/${$widget?.widget_id}`
						const link = document.createElement('a')
						link.href = url
						link.target = '_blank'
						link.click()
					}
				},
				hide: toolbar['share'],
				showInMenu: true
			}
		}

		listOutOfMenu = Object.keys(toolbarItems).filter(
			(item) => !toolbarItems[item].hide && !toolbarItems[item].showInMenu
		)
		listInMenu = Object.keys(toolbarItems).filter(
			(item) => !toolbarItems[item].hide && toolbarItems[item].showInMenu
		)
	})
</script>

{#if toolbarItems}
	<div
		id={`widget-toolbar-${$widget.widget_id}`}
		style:background-color={patternUrl.test(bg) ? 'transparent' : bg}
		class={isToolbarVisible
			? `widget-toolbar absolute right-2 mt-1 rounded-md bg-white dark:bg-dark-100`
			: 'hidden'}
		on:pointerdown={(event) => {
			event.preventDefault()
			event.stopPropagation()
		}}
	>
		<div class="flex flex-row justify-end pl-0">
			{#each listOutOfMenu as item}
				<svelte:component
					this={toolbarItems[item].component}
					showInMenu={toolbarItems[item].showInMenu}
					item={toolbarItems[item].item}
				/>
			{/each}
			<!-- {#if toolbar.reload}<ToolbarReload {showInMenu} />{/if} -->
			<!-- {#if toolbar.filtering}<ToolbarFilter />{/if} -->
			<!-- {#if toolbar.clone && !$widget.shared}<ToolbarClone />{/if} -->
			<!-- <ToolbarCollapse /> -->
			<!-- {#if toolbar.max && !$widget.shared}<ToolbarMaximize />{/if} -->
			<!-- {#if toolbar.pin && !$widget.shared}<ToolbarPin />{/if} -->
			<!-- {#if toolbar['pin'] === undefined || toolbar['pin'] === true}
					<svelte:component
						this={toolbarItems['pin'].component}
						{showInMenu}
						item={toolbarItems['pin'].item}
					/>
				{/if} -->

			{#if !toolbar.help && $widget.description}<ToolbarHelp helpText={$widget.description} />{/if}
			<!-- {#if !$widget.shared}<ToolbarCutCopy action="copy" {showInMenu} />{/if}
				{#if (isWidgetOwner || $widget.temp || $widget.cloned) && !$widget.shared}
					<ToolbarCutCopy action="cut" {showInMenu} />
				{/if} -->

			<Tooltip placement="bottom" class="z-10" triggeredBy="#more-actions">More</Tooltip>
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
						on:itemClick={() => (menuOpen = !menuOpen)}
					/>
				{/each}

				<!-- {#if toolbar.reload}<ToolbarReload {showInMenu} />{/if} -->
				<!-- {#if showInMenu}
					{#if toolbar['reload'] === undefined || toolbar['reload'] === true}
						<svelte:component
							this={toolbarItems['reload'].component}
							{showInMenu}
							item={toolbarItems['reload'].item}
						/>
					{/if}
					{#if !$widget.shared}<ToolbarCutCopy action="copy" {showInMenu} />{/if}
					{#if (isWidgetOwner || $widget.temp || $widget.cloned) && !$widget.shared}
						<ToolbarCutCopy action="cut" {showInMenu} />
					{/if}
				{/if}
				{#if toolbar.screenshot}
					<ToolbarScreenshot on:itemClick={() => (menuOpen = !menuOpen)} />
				{/if}
				{#if toolbar.export}
					<ToolbarExportData on:itemClick={() => (menuOpen = !menuOpen)} />
				{/if}
				{#if isWidgetOwner && !($widget.temp || $widget.cloned) && !$widget.shared}
					<ToolbarSettings on:itemClick={() => (menuOpen = !menuOpen)} />
				{/if} -->
			</Dropdown>

			{#if isWidgetOwner || $widget.temp || ($widget.cloned && !$widget.shared)}
				<ToolbarClose />
			{/if}
		</div>
	</div>
{/if}
