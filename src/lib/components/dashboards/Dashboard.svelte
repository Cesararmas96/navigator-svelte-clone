<script lang="ts">
	import Grid, { GridItem, type GridController } from 'svelte-grid-extended'
	import Widget from '../widgets/Widget.svelte'
	import WidgetBox from '../widgets/WidgetBox.svelte'
	import {
		loadV2Locations,
		loadV3Locations,
		resizeItem,
		cloneItem,
		removeItem,
		addNewItem,
		pasteItem,
		saveLocalStorageLocations,
		loadLocalStoredLocations,
		removeWidgetLocalstore,
		getControllerItemsLocations,
		resizeCollapseItem
	} from '$lib/helpers/dashboard/grid'
	import { getApiData, patchData, postData, putData } from '$lib/services/getData'
	import Alerts from '../widgets/type/Alert/Alerts.svelte'
	import { dismissAlert, sendAlert, sendErrorAlert } from '$lib/helpers/common/alerts'
	import { AlertType, type AlertMessage } from '$lib/interfaces/Alert'
	import {
		hideDashboardFilters,
		storeCCPWidget,
		storeCCPWidgetBehavior,
		storeDashboards
	} from '$lib/stores/dashboards'
	import { storeUser } from '$lib/stores'
	import { generateRandomString, generateSlug } from '$lib/helpers/common/common'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { writable } from 'svelte/store'
	import { createEventDispatcher, setContext } from 'svelte'
	import { loading } from '$lib/stores/preferences'
	import DashboardFilters from './DashboardFilters.svelte'
	import DrawerFilters from './DrawerFilters.svelte'
	import { Button, Tooltip } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { page } from '$app/stores'
	import _ from 'lodash'
	import { onMount } from 'svelte'

	import {
		hideFormBuilderDrawer,
		selectedFormBuilderRecord,
		selectedFormBuilderWidget
	} from '$lib/stores/widgets'

	export let dashboard: any
	export let isShared: boolean = false

	let filterComponent: any
	const dispatch = createEventDispatcher()

	const baseUrl = import.meta.env.VITE_API_URL

	const cols = 12
	const itemSize = { height: 10 }

	let innerWidth: number
	let gridController: GridController
	let widgets: any[] = []
	let isChanging = false
	let resizedTitle = ''

	let filtersOpen: boolean = false

	const storeDashboard = writable(dashboard)
	setContext('dashboard', storeDashboard)

	$: $storeDashboard = dashboard

	/* Codigo temporal para simular los widgets con data compartida */
	setTimeout(() => {
		$storeDashboard.gridItemsData = {
			stores: [
				{
					store_id: 3397,
					store_name: 'Miami Gardens-WM - #3397',
					latitude: 25.935725,
					longitude: -80.207676
				},
				{
					store_id: 6397,
					store_name: 'MIAMI-WM-#6397',
					latitude: 25.623903,
					longitude: -80.395205
				},
				{
					store_id: 1680,
					store_name: 'KENDALL-WM  - #1680',
					latitude: 25.685314,
					longitude: -80.448545
				},
				{
					store_id: 2814,
					store_name: 'HIALEAH-WM - #2814',
					latitude: 25.858609,
					longitude: -80.325508
				}
			]
		}
	}, 3000)

	$: if (!$storeDashboard.loaded) {
		filterComponent = null
		setGridItems($storeDashboard.dashboard_id)
		filtersOpen = $storeDashboard?.attributes?.collapse_shows
		if (filtersOpen === undefined) filtersOpen = false
		// filtersOpen = !!$storeDashboard?.attributes?.collapse_shows
		filterComponent = DashboardFilters
		if ($storeUser.aux.filtering_fixed)
			$storeDashboard.where_new_cond = $storeUser.aux.filtering_fixed
	}

	$: if (dashboard.newWidget) {
		handleWidgetInsert({ ...dashboard.newWidget })
		dashboard.newWidget = null
	}

	$: if ($storeCCPWidget) {
		addWidgetCopyAlert($storeDashboard?.attributes?.user_id === $storeUser?.user_id)
	} else {
		dismissAlert('widget-copied')
	}

	$: if ($storeDashboard?.attributes?.user_id === $storeUser?.user_id) {
		const alert: AlertMessage = {
			id: 'dashboard-system-msg',
			title: `Customizing ${$storeDashboard?.user_id === null ? 'a system' : ''} dashboard`,
			message: `Don't forget that you are customizing a ${
				$storeDashboard?.user_id === null ? 'system' : ''
			}  dashboard, please publish it again`,
			dashboardId: $storeDashboard.dashboard_id,
			type: AlertType.WARNING,
			callback1Btn: 'Publish',
			callback1: async () => {
				await updateWidgetLocation()
				dispatch('handleCustomize', $storeDashboard?.attributes)
			}
		}
		sendAlert(alert)
	} else {
		dismissAlert('dashboard-system-msg', $storeDashboard.dashboard_id)
	}

	$: if (
		(!$storeDashboard.gridItems || $storeDashboard.gridItems.length === 0) &&
		$storeDashboard.loaded
	) {
		sendAlert({
			id: 'dashboard-no-widgets',
			title: 'No widgets',
			message: 'There are no widgets in this dashboard',
			dashboardId: $storeDashboard.dashboard_id,
			type: AlertType.INFO
		})
	} else if ($storeDashboard.loaded) {
		dismissAlert('dashboard-no-widgets', $storeDashboard.dashboard_id)
	}

	$: handleResizable = (item: any) => {
		if (isMobileDevice()) return
		$storeDashboard.gridItems = resizeItem(item, $storeDashboard.gridItems)
		gridController.gridParams.updateGrid()
		$storeDashboard.gridItems = [...$storeDashboard.gridItems]
	}
	$: handleCollapse = (item: any, collapse: boolean) => {
		if (isMobileDevice()) return
		$storeDashboard.gridItems = resizeCollapseItem(item, $storeDashboard.gridItems, collapse)
		gridController.gridParams.updateGrid()
		$storeDashboard.gridItems = [...$storeDashboard.gridItems]
	}
	$: handleCloning = (item: any) => {
		const clonedItem = cloneItem(item, $storeDashboard.gridItems)
		$storeDashboard.gridItems = [...$storeDashboard.gridItems, clonedItem]
	}
	$: handleRemove = (item: any) => {
		const temp = [...removeItem(item, $storeDashboard.gridItems, gridController.gridParams)]
		$storeDashboard.gridItems = []
		if (!$storeDashboard.widget_location)
			$storeDashboard.widget_location = $storeDashboard.attributes.widget_location
		if (!item.data?.cloned) delete $storeDashboard.widget_location[item.title]
		widgets = widgets.filter((widget: any) => widget.title !== item.title)
		setTimeout(() => {
			$storeDashboard.gridItems = temp
			if (!item.data?.cloned) {
				gridController.gridParams.unregisterItem(item)
				gridController.gridParams.updateGrid()
				updateLocations()
			}
		}, 100)
	}

	$: changeItemSize = (item: any) => {
		resizedTitle = item.title
	}

	const isMobile = (): boolean => {
		return innerWidth < 500
	}

	const setGridItems = async (dashboardId: string): Promise<void> => {
		$storeDashboard.gridItems = []
		try {
			widgets = await getApiData(`${baseUrl}/api/v2/widgets?dashboard_id=${dashboardId}`, 'GET')

			if (!widgets) return
			widgets = widgets.map((widget: any) => {
				widget.widget_slug = widget?.widget_slug || generateSlug(widget.title)
				return widget
			})

			let items: any[] = []

			const setNewLocations =
				!dashboard.widget_location || Object.keys(dashboard.widget_location).length === 0

			if (dashboard.attributes.widget_location) {
				dashboard.widget_location = { ...dashboard.attributes.widget_location }
				$storeDashboard.widget_location = { ...dashboard.attributes.widget_location }
			}

			/**
			 * Load widgets from local storage
			 */
			items = loadLocalStoredLocations(
				dashboard,
				widgets,
				isMobile(),
				$storeDashboard.widget_location?.timestamp || 0
			)!
			if (items && items.length > 0) {
				$storeDashboard.gridItems = [...items]
				return
			}

			/**
			 * Load widgets from database
			 */
			items =
				dashboard.attributes.widget_location || setNewLocations
					? loadV3Locations(dashboard.widget_location, widgets, cols, isMobile())
					: loadV2Locations(dashboard.widget_location, dashboard, widgets, cols, isMobile())
			console.log('items', items)

			$storeDashboard.gridItems = [...items]
		} catch (error: any) {
			sendErrorNotification(error)
			sendErrorAlert(
				'Error loading the widgets',
				`There was a problem with the server. Please try again later or contact technical support if the issue persists. (${error.message})`
			)
		} finally {
			$storeDashboard.loaded = true
		}
	}

	const updateWidgetLocation = async () => {
		if ($storeDashboard?.attributes?.user_id !== $storeUser?.user_id) return

		const widget_location = getControllerItemsLocations(
			$storeDashboard.gridItems,
			gridController.gridParams
		)
		widget_location['timestamp'] = new Date().getTime()
		const attributes = {
			...$storeDashboard.attributes,
			explorer: 'v3',
			widget_location
		}
		const resp = await postData(`${baseUrl}/api/v2/dashboards/${$storeDashboard.dashboard_id}`, {
			attributes: attributes
		})

		if (resp[0]) $storeDashboard.attributes = resp[0].attributes

		return $storeDashboard.attributes
	}

	const updateLocations = async () => {
		if (isChanging || isMobile()) return // || dashboard?.attributes?.user_id !== $storeUser?.user_id
		isChanging = true
		setTimeout(async () => {
			isChanging = false
			saveLocalStorageLocations(dashboard, $storeDashboard.gridItems, gridController.gridParams)
			if (dashboard?.attributes?.user_id !== $storeUser?.user_id)
				sendSuccessNotification('Updated widget position in local storage')
		}, 1000)
	}

	const handleWidgetPaste = async () => {
		loading.set(true)
		// try {
		const copiedWidget = $storeCCPWidget
		let newWidget: any
		let response: any
		let item: any
		const { dashboard_id } = dashboard

		if ($storeCCPWidgetBehavior.type === 'copy') {
			const payload = {
				program_id: dashboard.program_id,
				dashboard_id,
				title: `${copiedWidget.title.split(' #')[0]} #${generateRandomString()}`,
				attributes: copiedWidget.attributes,
				description: copiedWidget.description,
				params: copiedWidget.params,
				url: copiedWidget.url,
				conditions: copiedWidget.conditions,
				cond_definition: copiedWidget.cond_definition,
				where_definition: copiedWidget.where_definition,
				format_definition: copiedWidget.format_definition,
				query_slug: copiedWidget.query_slug,
				save_filtering: copiedWidget.save_filtering,
				master_filtering: copiedWidget.master_filtering,
				module_id: copiedWidget.module_id,
				template_id: copiedWidget.template_id,
				allow_filtering: copiedWidget.allow_filtering,
				filtering_show: copiedWidget.filtering_show,
				widget_type_id: copiedWidget.widget_type_id,
				user_id: $storeUser?.user_id
			}

			response = await putData(`${baseUrl}/api/v2/widgets`, payload)
			const _dashboard = $storeDashboards.find(
				(d: any) => d.dashboard_id === $storeCCPWidgetBehavior.dashboard_id
			)
			item = _dashboard.gridItems.find((item: any) => item.title === copiedWidget.title)
		} else {
			let payload: Record<string, any> = { dashboard_id }
			if (dashboard.gridItems.some((item: any) => item.title === copiedWidget.title)) {
				payload = {
					...payload,
					title: `${copiedWidget.title.split(' #')[0]} #${generateRandomString()}`
				}
			}
			response = await patchData(`${baseUrl}/api/v2/widgets/${copiedWidget.widget_id}`, payload)

			removeWidgetLocalstore($storeCCPWidgetBehavior.dashboard_id, copiedWidget.title)

			const _dashboard = $storeDashboards.find(
				(d: any) => d.dashboard_id === $storeCCPWidgetBehavior.dashboard_id
			)

			if (_dashboard.widget_location && _dashboard.widget_location[copiedWidget.title]) {
				delete _dashboard.widget_location[copiedWidget.title]
			}
			updateWidgetLocation()

			_dashboard.gridItems = _dashboard.gridItems
				.map((i: any) => {
					if (i.title === copiedWidget.title) {
						item = { ...i }
					} else return i
				})
				.filter((i: any) => i !== undefined)

			storeDashboards.update((dashboards) =>
				dashboards.map((item) => {
					if (item.dashboard_id === _dashboard.dashboard_id) {
						return _dashboard
					}
					return item
				})
			)
		}

		response = await getApiData(`${baseUrl}/api/v2/widgets/${response.widget_id}`, 'GET')
		newWidget = { ...response }

		const newItem = structuredClone(item)
		const position = addNewItem(newItem, gridController)
		newItem.data = newWidget
		newItem.x = position.x
		newItem.y = position.y

		$storeDashboard.gridItems = pasteItem(newItem, $storeDashboard.gridItems)
		await setTimeout(async () => {
			updateLocations()
			updateWidgetLocation()
		}, 500)
		sendSuccessNotification('Widget pasted successfully')
		// } catch (error: any) {
		// 	sendErrorNotification(error)
		// } finally {
		// 	clearCopyWidgets()
		// 	loading.set(false)
		// }
		clearCopyWidgets()
		loading.set(false)
	}

	const openDrawerAssignBadge = () => {
		$selectedFormBuilderWidget = {
			params: {
				model: {
					meta: 'api/v1/badge_assign',
					primaryKey: 'reward_id',
					schema: {
						$withoutDefs: true,
						properties: {
							reward_id: {
								nullable: false,
								readOnly: false,
								$ref: {
									url: ' '
								}
							},
							user_id: {
								_schema: {
									type: 'object',
									title: 'User',
									noHeader: true,
									properties: {
										email: {
											type: 'string',
											attrs: {
												format: null,
												placeholder: null
											},
											order: 3,
											nullable: true,
											readOnly: false,
											maxLength: 254
										},
										last_name: {
											type: 'string',
											attrs: {
												format: null,
												placeholder: null
											},
											order: 2,
											nullable: true,
											readOnly: false
										},
										first_name: {
											type: 'string',
											attrs: {
												format: null,
												placeholder: null
											},
											order: 1,
											nullable: true,
											readOnly: false
										}
									},
									description: 'View Model for getting Users.'
								},
								_result: {
									columns: {
										given_name: {
											hidden: true
										},
										display_name: {
											order: 2,
											title: 'Name'
										},
										email: {
											order: 1,
											title: 'Email'
										},
										job_title: {
											order: 4,
											title: 'Job Title',
											hidden: true
										},
										mobile: {
											hidden: true
										},
										phones: {
											hidden: true
										},
										last_name: {
											hidden: true
										},
										zammad_created: {
											hidden: true
										},
										job_code_title: {
											hidden: true
										},
										preferred_language: {
											hidden: true
										},
										position_id: {
											hidden: true
										},
										people_id: {
											hidden: true
										},
										office_location: {
											hidden: true
										},
										created_at: {
											hidden: true
										},
										username: {
											primary: true,

											order: 1,
											title: 'Email'
										},
										associate_id: {
											hidden: true
										},
										associate_oid: {
											hidden: true
										}
									}
								}
							}
						}
					}
				}
			},
			query_slug: {
				slug: '{BASE_URL_API}/api/v1/badge_assign'
			}
		}
		$selectedFormBuilderRecord = {
			action: 'new'
		}
		$hideFormBuilderDrawer = false
	}

	const clearCopyWidgets = () => {
		$storeCCPWidget = null
		$storeCCPWidgetBehavior = null
	}

	const addWidgetCopyAlert = (isOwner: boolean) => {
		const behavior = $storeCCPWidgetBehavior.type
		const alert: AlertMessage = {
			id: 'widget-copied',
			title: `Widget ${behavior === 'copy' ? 'copied' : 'cut'}`,
			message: `You have a widget ${behavior === 'copy' ? 'copied' : 'cut'} in clipboard. ${
				isOwner ? 'Use Paste Widget button to paste it' : 'Customize this dashboard to paste it'
			}`,
			type: AlertType.INFO,
			callback1Btn: isOwner ? 'Paste Widget' : '',
			callback1: handleWidgetPaste,
			callback2Btn: 'Clear',
			callback2: clearCopyWidgets
		}
		sendAlert(alert)
	}

	const handleWidgetInsert = async (_widget: any) => {
		loading.set(true)
		try {
			const title = `${_widget.title} #${generateRandomString()}`
			const payload = {
				program_id: dashboard.program_id,
				dashboard_id: dashboard.dashboard_id,
				title,
				template_id: _widget.template_id,
				user_id: $storeUser?.user_id,
				attributes: {
					title,
					user_id: $storeUser?.user_id
				}
			}
			const resp = await putData(`${baseUrl}/api/v2/widgets`, payload)

			const widget = await getApiData(`${baseUrl}/api/v2/widgets/${resp.widget_id}`, 'GET')

			widget.resize_load = true
			const newItem = Object.create({})
			newItem.data = widget
			newItem.w = _widget.attributes.width || 6
			newItem.h = _widget.attributes.height || 10
			const position = addNewItem(newItem, gridController)
			newItem.x = position.x
			newItem.y = position.y
			newItem.title = widget.title
			dashboard.widget_location = {
				...dashboard.widget_location,
				[widget.title]: {
					x: newItem.x,
					y: newItem.y,
					w: newItem.w,
					h: newItem.h
				}
			}
			$storeDashboard.gridItems = [...$storeDashboard.gridItems, newItem]
			widgets = [...widgets, widget]
			updateLocations()
			// await postData(`${baseUrl}/api/v2/dashboard/widgets/location/${dashboard.dashboard_id}`, {
			// 	widget_location: dashboard.widget_location
			// })
		} catch (error: any) {
			sendErrorNotification('An error occurred:', error.message)
		}
		loading.set(false)
	}

	let clientHeight = 0

	let haveBreadcrumb = false

	$: heightStyle =
		!isMobileDevice() && !isShared
			? `height: calc(100vh - ${175 + clientHeight}px)`
			: haveBreadcrumb
			? `height: calc(100vh - 110px)`
			: ''

	$: isMobileDevice = () => innerWidth < 1024

	const getSortedItems = (items: any[]) => {
		return items.sort((a, b) => {
			if (a.order && b.order) return a.order - b.order
			if (a.y === b.y) return a.x < b.x ? -1 : 1
			return a.y < b.y ? -1 : 1
		})
	}

	onMount(() => {
		haveBreadcrumb = document.getElementById('breadcrumb') ? true : false
	})
</script>

<svelte:window bind:innerWidth />

{#if Boolean($storeDashboard?.allow_filtering) && Boolean($storeDashboard?.attributes?.sticky)}
	<section bind:clientHeight>
		<svelte:component this={filterComponent} bind:open={filtersOpen} />
	</section>
{/if}

<div
	id="grid"
	class="block w-full overflow-x-hidden"
	style={heightStyle}
	class:overflow-y-auto={!isMobileDevice()}
>
	{#if Boolean($storeDashboard?.allow_filtering) && !Boolean($storeDashboard?.attributes?.sticky)}
		<section>
			<svelte:component this={filterComponent} bind:open={filtersOpen} />
		</section>
	{/if}

	<Alerts dashboardId={$storeDashboard.dashboard_id} />

	{#if $storeDashboard.gridItems && $storeDashboard.gridItems.length > 0}
		{#if !isMobileDevice()}
			<Grid
				{itemSize}
				class="grid-container"
				gap={5}
				{cols}
				collision="compress"
				bind:controller={gridController}
				on:change={updateLocations}
			>
				{#each $storeDashboard.gridItems as item}
					<GridItem
						x={item.x}
						y={item.y}
						w={item.w}
						h={item.h}
						class="grid-item {item.data.params.hidden ? 'hidden' : ''}"
						activeClass="grid-item-active"
						previewClass="bg-red-500 rounded"
						resizable={dashboard?.attributes?.user_id === $storeUser?.user_id}
						movable={!dashboard?.attributes?.disable_drag ||
							dashboard?.attributes?.user_id === $storeUser?.user_id}
						on:change={(e) => {
							if (dashboard?.attributes?.user_id === $storeUser?.user_id) changeItemSize(item)
						}}
						let:active
						bind:id={item.data.title}
					>
						<WidgetBox
							widget={item.data}
							resized={resizedTitle === item.title && !active}
							let:fixed
							let:isOwner
							let:isToolbarVisible
							let:widget
							on:handleResize={() => handleResizable(item)}
							on:handleCloning={() => handleCloning(item)}
							on:handleRemove={() => handleRemove(item)}
							on:handleCollapse={(e) => handleCollapse(item, e.detail)}
							on:handleResizable={(e) => {
								item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
							}}
							on:handleSharedWidgetsVisibility={(e) => {
								item.data.params.hidden = e.detail
							}}
						>
							<Widget
								{widget}
								{fixed}
								{isToolbarVisible}
								{isOwner}
								bind:reload={item.reload}
								isDraggable={!dashboard?.attributes?.disable_drag ||
									dashboard?.attributes?.user_id === $storeUser?.user_id}
								on:handleInstanceResize={() => handleResizable(item)}
							/>
						</WidgetBox>
					</GridItem>
				{/each}
			</Grid>
		{:else}
			<div class="grid grid-cols-1 gap-y-3 p-2">
				{#each getSortedItems($storeDashboard.gridItems) as item}
					<div class:hidden={item.data.params.hidden}>
						<WidgetBox
							widget={item.data}
							resized={false}
							isMobileDevice={true}
							let:fixed
							let:isOwner
							let:isToolbarVisible
							let:widget
							on:handleSharedWidgetsVisibility={(e) => {
								item.data.params.hidden = e.detail
							}}
						>
							<Widget
								{widget}
								{fixed}
								{isToolbarVisible}
								{isOwner}
								isMobileDevice={true}
								bind:reload={item.reload}
							/>
						</WidgetBox>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

{#if ['/rewards'].includes($page?.url?.pathname)}
	<Button
		pill={true}
		class="fixed bottom-6 right-6 !p-3 shadow-md"
		on:click={() => openDrawerAssignBadge()}
		><Icon icon="tabler:plus" size="20" /> Assign Badge</Button
	>
	<Tooltip placement="left">Assign Badge</Tooltip>
{/if}

{#if $storeDashboard?.allow_filtering && $hideDashboardFilters}
	<Button
		pill={true}
		class="fixed bottom-6 right-6 !p-3 shadow-md"
		on:click={() => hideDashboardFilters.set(false)}><Icon icon="tabler:filter" size="20" /></Button
	>
	<Tooltip placement="left">Filters</Tooltip>
{/if}

{#if $storeDashboard?.allow_filtering}
	<DrawerFilters />
{/if}

<style>
	.inner-shadow {
		box-shadow: inset 0 0 10px #000000;
	}
</style>
