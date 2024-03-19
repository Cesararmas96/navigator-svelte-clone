<script lang="ts">
	import { Grid, type ColDef, type GridOptions, type GridReadyEvent } from 'ag-grid-community'
	import { getContext, onMount } from 'svelte'
	import { themeMode } from '$lib/stores/preferences'
	import 'ag-grid-community/styles/ag-grid.css'
	import 'ag-grid-community/styles/ag-theme-balham.css'
	import type { Writable } from 'svelte/store'
	import {
		colAction,
		generateColumnDefsByData,
		generateColumnDefsByDefinition,
		gridFunctionsMap,
		gridHeight,
		gridInstanceHeight,
		hidePagination,
		recordsPerPage,
		setInstancesContentHeight
	} from '$lib/helpers/widget/aggrid'
	import {
		hideFormBuilderDrawer,
		selectedFormBuilderRecord,
		selectedFormBuilderWidget
	} from '$lib/stores/widgets'
	import { addWidgetAction, getWidgetAction } from '$lib/helpers'
	import { openConfirmModal, openModal } from '$lib/helpers/common/modal'
	import { deleteData, postData } from '$lib/services/getData'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { setContentHeight, setInstanceContentHeight } from '$lib/helpers/widget/widget'
	import { setWidgetTop } from '$lib/helpers/widget/widget-top'
	import NoDataFound from '../../NoDataFound.svelte'
	import _ from 'lodash'
	import { addInstance, clearInstances } from '$lib/helpers/widget/instances'
	import { page } from '$app/stores'
	import { setWidgetBottom } from '$lib/helpers/widget/widget-bottom'

	export let data: any
	export let simpleTable: boolean = false

	const widget = getContext<Writable<any>>('widget')
	const dashboard = getContext<Writable<any>>('dashboard')

	const formatDefinitionKeys = $widget.format_definition
		? Object.keys($widget.format_definition).map((key: string) => key)
		: []

	let gridApi
	/**
	 * @description Almacena las funciones de las acciones de los botones en las celdas
	 */
	const actionBtnMap: { [key: string]: (data: any) => any } = {
		postRenderModulesProgram(params: any) {
			console.log('postRenderModulesProgram', params)
		},
		postRenderFormBuilder(params: any) {
			const { action, data, colDef, keys, rowId } = params.srcElement.dataset
			switch (action) {
				case 'edit':
				case 'new':
					$selectedFormBuilderWidget = $widget
					$selectedFormBuilderRecord = {
						action,
						data: JSON.parse(data),
						keys: JSON.parse(keys),
						rowId,
						callbackUpdate: updateItem,
						callbackNew: newItem
					}
					$hideFormBuilderDrawer = false
					break
				case 'delete':
					openConfirmModal({
						title: '',
						description: `You're about to permanently delete this. This process is irreversible.`,
						type: 'warning',
						confirmCallback: () => confirmDelete(JSON.parse(data), JSON.parse(keys), rowId)
					})
					break
			}
		},
		createModelWithFormBuilder() {
			$selectedFormBuilderWidget = $widget
			$selectedFormBuilderRecord = { action: 'new', data: null, callbackNew: newItem }
			$hideFormBuilderDrawer = false
		},
		postRenderCreateUser(params: any) {
			const { action, data, colDef, keys, rowId } = params.srcElement.dataset
			switch (action) {
				case 'edit':
				case 'new':
					$selectedFormBuilderWidget = $widget
					$selectedFormBuilderRecord = {
						action,
						data: JSON.parse(data),
						keys: JSON.parse(keys),
						rowId,
						callbackUpdate: updateItem,
						callbackNew: newItem
					}
					$hideFormBuilderDrawer = false
					break
				case 'delete':
					openConfirmModal({
						title: '',
						description: `You're about to permanently delete this . This process is irreversible.`,
						type: 'warning',
						confirmCallback: () => confirmDelete(JSON.parse(data), JSON.parse(keys), rowId)
					})
					break
			}
		},
		postRenderChangeYesOrNo(params: any) {
			const { data, colDef, colId, rowId } = params.srcElement.dataset
			const jsonData = JSON.parse(data)
			const value = !jsonData[colId]
			openConfirmModal({
				title: '',
				description: `Want to change status to ${value === true ? 'YES' : 'NO'}. Continue?`,
				type: 'warning',
				confirmCallback: () => confirmYesOrNo(value, JSON.parse(colDef), colId, jsonData, rowId)
			})
		},
		postRenderTasksActions(params: any) {
			const { action, data, colDef, keys, rowId } = params.srcElement.dataset
			switch (action) {
				case 'play':
					openModal('Confirm Task Execution', 'ActionModalTasks', {
						action: action.toUpperCase(),
						data: JSON.parse(data),
						callback: () => {
							reloadAction.action()
						}
					})
					break
				case 'export':
					break
				case 'upload':
					openModal('Upload Task', 'ActionModalTasks', {
						action: action.toUpperCase(),
						data: JSON.parse(data)
					})
					break
				case 'btnBadge':
					const _data = JSON.parse(data)
					const status = _data['task_state']
					let badge = 'info'
					let title = 'Information'

					switch (status) {
						case 0:
						case 1:
						case 2:
						case 3:
						case 11:
						case 99:
							badge = 'info'
							title = 'Information'
							break
						case 4:
						case 7:
						case 10:
							title = 'Warning'
							badge = 'warning'
							break
						case 5:
						case 6:
							title = 'Success'
							badge = 'success'
							break
						case 9:
						case 12:
						case 98:
							title = 'Failed'
							badge = 'error'
							break
					}

					const traceback = _.escape(_data['traceback'])

					openConfirmModal({
						description: traceback,
						type: badge,
						confirmButtonText: 'Copy',
						confirmCallback: () => {
							navigator.clipboard.writeText(_data['traceback'])
							sendSuccessNotification('Successfully copied to clipboard.')
						},
						cancelButtonText: 'Close',
						hideCancelButton: true
					})
					break
			}
		},
		postRenderOpenDrilldown(params: any) {
			// if (drilldownOpen) return
			$widget.params.drilldowns?.cellClick
				? actionBtnMap[$widget.params.drilldowns.cellClick](params.srcElement.dataset)
				: actionBtnMap['cellClickDefault'](params.srcElement.dataset)
		},
		async addWidgetDrilldownTempTaskMonitor(params: any) {
			let { data, colDef, rowId, colId } = params
			data = JSON.parse(data)
			colDef = JSON.parse(colDef)

			try {
				const evClick = $widget.params && $widget.params.drilldowns ? $widget.params.drilldowns : {}

				if (
					evClick.allowCells &&
					(evClick.allowCells.includes(colDef.dataIndx) || evClick.allowCells === 'all')
				) {
					$widget.instance_loading = true
					await clearInstances(widget)

					const drilldowns: any[] = []
					const conditions = _.merge({}, evClick.conditions, {
						filter: { tenant: $page.params.programs }
					})

					let drilldownPhotoFeed = {
						click: false
					}

					let name = colDef.dataIndx || evClick.name
					const value = data[colDef.dataIndx] || evClick.value

					if (name.includes("'")) {
						name = name.split("'").join("''")
					}

					if (name.includes('_')) {
						name = name.split('_').join(' ')
					}

					if (evClick.params && evClick.params.cell && typeof evClick.params.cell === 'object') {
						evClick.params.cell.map((cell) => {
							if (data[cell]) {
								if (evClick.params && evClick.params.where_cond) {
									if (!conditions.where_cond) {
										conditions.where_cond = {}
									}
									conditions.where_cond[cell] = data[cell]
								} else {
									conditions[cell] = data[cell]
								}
							}
						})
					} else {
						const cell = evClick.params && evClick.params.cell ? evClick.params.cell : 'response'

						if (evClick.params && evClick.params.where_cond) {
							if (!conditions.where_cond) {
								conditions.where_cond = {}
							}
							conditions.where_cond[cell] = `${value}`
						} else {
							conditions[cell] = `${value}`
						}
					}

					if (evClick.params && evClick.params.drilldowns) {
						drilldownPhotoFeed = _.merge(
							{},
							drilldownPhotoFeed,
							{
								click: true,
								cellClick: 'photofeedDrilldown',
								allowCells: ['Store'],
								cellRemove: ['response']
							},
							Object.keys(evClick.params.drilldowns).length > 0 ? evClick.params.drilldowns : {}
						)
					}

					const title = evClick.title || $widget.title

					drilldowns.push({
						title: `${title} - ${_.capitalize(_.startCase(name))} ${value}`,
						attributes: {
							icon: 'fa fa-table'
						},
						classbase: evClick.classbase || 'pqTableWidget',

						dashboard_id: $widget.dashboard_id,
						module_id: $widget.module_id,
						program_id: $widget.program_id,
						widget_type_id: $widget.widget_type_id,
						parent: $widget.widget_id,

						params: {
							colModelDef: true,
							query: {
								slug: evClick.slug || `${$widget.params.query.slug}_detail`
							},
							drilldowns: drilldownPhotoFeed.click ? drilldownPhotoFeed : null,
							pqgrid: drilldownPhotoFeed.click
								? {
										rowInit: 'donutPhotofeedDrilldown'
								  }
								: null,
							...evClick.widget,
							settings: $widget.params.settings
						},
						conditions,
						format_definition: evClick.colModel
					})
					addInstance(widget, drilldowns[0])
					$widget.instance_loading = false
				}
			} catch (error) {
				sendErrorNotification(error)
			}
		},
		async cellClickDefault(params: any) {
			// const _params = $widget.params
			// let { data, colDef, rowId, colId } = params
			// data = JSON.parse(data)
			// colDef = JSON.parse(colDef)
			// if (
			// 	$widget.params.drilldown.click &&
			// 	(!Array.isArray($widget.params.drilldown.click) ||
			// 		!$widget.params.drilldown.click.includes(colDef.dataIndx))
			// ) {
			// 	return false
			// }
			// try {
			// 	if (_params.drilldowns && Array.isArray(_params.drilldowns)) {
			// 		_params.drilldowns.map((drilldown) => {
			// 			if (drilldown.conditionsRaw) {
			// 				drilldown.conditions = _.merge(
			// 					{},
			// 					drilldown.conditions || {}
			// 					// setConditionsRaw(drilldown.conditionsRaw, data)
			// 				)
			// 			}
			// 			if (drilldown.type === 'iframe') {
			// 				if (data.urls && Array.isArray(data.urls)) {
			// 					data.urls.map((url, urlIndex) => {
			// 						// this.cellClick_addWidgetTemp(
			// 						// 	_.merge({}, drilldown, {
			// 						// 		classbase: 'iframe',
			// 						// 		src: url,
			// 						// 		title: `${drilldown.title} ${urlIndex + 1}`,
			// 						// 	}),
			// 						// 	ui
			// 						// )
			// 					})
			// 				}
			// 			} else {
			// 				// this.cellClick_addWidgetTemp(drilldown, ui)
			// 			}
			// 		})
			// 		sendSuccessNotification('Widget has been added successfully.')
			// 	}
			// } catch (error) {
			// 	sendErrorNotification(error)
			// }
		},
		async selectSharedData() {
			const selectedNodes = gridOptions.api.getSelectedNodes()
			if (selectedNodes.length < 2) {
				sendErrorNotification('You must select at least two stores')
				return
			}
			const selectedData = selectedNodes.map((node) => node.data)
			const params = $widget.params.btnsActions!.bottom!.selectSharedData!.params
			let payload: Record<string, any> = {}
			const stores = selectedData.map((data: any) => {
				let store: Record<string, any> = {}
				params.payload_fields.map(async (field: any) => {
					store[field] = data[field]
				})
				return store
			})
			payload['stores'] = stores

			const locations = stores.map((store) => {
				return { lat: store.latitude, lng: store.longitude }
			})

			$dashboard.gridItemsData = {
				...$dashboard.gridItemsData,
				'Optimal Route': stores.map((store) => store.store_name),
				'Total Duration': [{ 'Total Duration': 102.83 }],
				'Total Distance': [{ 'Total Distance': 53.68 }],
				Map: { locations }
			}
		},
		async addStores() {
			// const selectedNodes = gridOptions.api.getSelectedNodes()
			// const selectedData = selectedNodes.map((node) => node.data)
			// const params = $widget.params.btnsActions!.top!.selectSharedData!.params
			// let payload: Record<string, any> = {}
			// const stores = selectedData.map((data: any) => {
			// 	let store: Record<string, any> = {}
			// 	params.payload_fields.map(async (field: any) => {
			// 		store[field] = data[field]
			// 	})
			// 	return store
			// })
			// payload['stores'] = stores
			// console.log('payload', payload)
			// $dashboard.gridItemsData = {
			// 	...$dashboard.gridItemsData,
			// 	'Optimal Route': [
			// 		'Leg 1: Head <b>west</b> on <b>SW 18th Terrace</b> toward <b>SW 78th P1</b> for 11.8 mi',
			// 		'Leg 2: Head <b>north</b> for 8.3 mi',
			// 		'Leg 3: Head <b>south‹/b> for 20.7 mi',
			// 		'Leg 4: Head <b>north</b> for 7.2 mi',
			// 		'Leg 5: Head <b>west</b> toward <b>NW 87th Ave</b> for 4.6 mi',
			// 		'Leg 6: Head <b>north</b> toward <b>SW 24th St</b>/<wbr/><b>Coral Wy</b> for 1.1 mi'
			// 	],
			// 	'Total Duration': [{ 'Total Duration': 102.83 }],
			// 	'Total Distance': [{ 'Total Distance': 53.68 }]
			// }
			// console.log('gridItemsData', $dashboard.gridItemsData)
		},
		async selectProServiceEmployees() {
			const selectedNodes = gridOptions.api.getSelectedNodes()
			if (selectedNodes.length < 1) {
				sendErrorNotification('You must select at least one employee')
				return
			}
			const selectedData = selectedNodes.map((node) => node.data)
			const params = $widget.params.btnsActions!.bottom!.selectProServiceEmployees!.params
			let payload: Record<string, any> = {}
			const employees = selectedData.map((data: any) => {
				let employee: Record<string, any> = {}
				params.payload_fields.map(async (field: any) => {
					employee[field] = data[field]
				})
				return employee
			})
			payload['employees'] = employees

			$dashboard.gridItemsData = {
				...$dashboard.gridItemsData,
				show_message: { message: $dashboard.gridItemsData['message'] }
			}
		}
	}

	async function confirmYesOrNo(value: any, colDef: any, colId: any, data: any, rowId: number) {
		data[colId] = value
		const response = await postData(
			`${import.meta.env.VITE_API_URL}/api/v1/${colDef.model}/${data[colDef.id]}`,
			{ [colId]: value }
		)
		if (response) {
			updateItem({ dataModel: data, rowId: rowId })
			sendSuccessNotification('Update')
		} else {
			sendErrorNotification('An error has occurred')
		}
	}

	async function confirmDelete(data: any, keys: string[], rowId: string) {
		const slugKeys: string = keys.map((key) => `/${data[key]}`).join('')
		const response = await deleteData(
			`${import.meta.env.VITE_API_URL}/${$widget.params.model.meta}${slugKeys}`
		)
		if (response) {
			deleteItem(rowId)
			sendSuccessNotification('Delete')
		} else {
			sendErrorNotification('An error has occurred')
		}
	}

	/**
	 * @description Definición por defecto de las columnas
	 */
	const defaultColDef: ColDef = {
		sortable: true,
		wrapHeaderText: true,
		autoHeaderHeight: true,
		resizable: true,
		filter: true,
		cellDataType: false,
		useValueParserForImport: true,
		useValueFormatterForExport: true
	}

	/**
	 * @description Genera las columnas a partir de la definición del widget y/o por los datos
	 */
	let columnDefs: ColDef[] =
		simpleTable || !$widget.format_definition || Object.keys($widget.format_definition).length === 0
			? generateColumnDefsByData($widget, simpleTable)
			: [
					...generateColumnDefsByDefinition($widget, actionBtnMap),
					...generateColumnDefsByData($widget, simpleTable)
			  ]

	/**
	 * @description Genera la columna de acciones
	 */
	if ($widget.params.actions && !formatDefinitionKeys.includes('actions')) {
		columnDefs.push(colAction($widget, actionBtnMap))
	}
	columnDefs = columnDefs.sort((a: any, b: any) => a.order - b.order)

	/**
	 * @description Genera la configuración de la tabla
	 */
	let gridOptions: any = {
		//GridOptions = {
		defaultColDef,
		pagination: !simpleTable && !hidePagination($widget.params),
		paginationPageSize: recordsPerPage($widget.params),
		columnDefs,
		rowData: data ? data : null,
		// rowHeight: 25,
		autoHeight: true,
		animateRows: true,

		rowSelection: 'multiple',
		suppressRowClickSelection: true,

		getRowClass: (params) => {
			const rowInit = $widget.params.pqgrid?.rowInit
			const fn = rowInit && gridFunctionsMap[rowInit]
			return fn ? fn(params)?.cls || '' : ''
		},
		onGridReady: (params: GridReadyEvent<any, any>) => {
			onGridSizeChanged(params)
		},
		onFirstDataRendered: function (event) {
			if ($widget.temp) {
				setInstanceContentHeight($widget.parent)
				setInstancesContentHeight($widget.parent, $widget.widget_id)
				const instanceLoadedAction = getWidgetAction($widgetActions, 'instanceLoaded')
				instanceLoadedAction.action()
			}
			setTimeout(() => {
				resizeAgGridToContent()
			}, 500)
		},
		onGridSizeChanged: onGridSizeChanged
		// groupRowInnerRenderer: function (params) {
		// 	// Aquí puedes verificar las condiciones y devolver el total
		// 	if (params.node.group && $widget.params?.table?.roll_up?.total) {
		// 		return `${$widget.params?.table?.roll_up?.total} ${
		// 			params.node.aggData.num_sales + params.node.aggData.num_returns
		// 		}`
		// 	}
		// 	return null
		// }
	}

	$: if (data) {
		gridOptions.api?.setRowData(data)
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
		if (eGridDiv) {
			eGridDiv.classList.remove('hidden')
			eGridDiv.style['min-height'] = !$widget.temp
				? gridHeight($widget.widget_id)
				: gridInstanceHeight($widget.widget_id)
			eGridDiv.style['height'] = eGridDiv.style['min-height']
		}
	}

	if ($widget.params?.table?.roll_up?.total_col) {
		gridOptions['autoGroupColumnDef'] = {
			groupIncludeFooter: true, // Incluir los totales en el pie de grupo
			groupIncludeTotalFooter: true, // Incluir una fila de totales al final
			groupDefaultExpanded: -1, // Expandir todos los grupos por defecto
			autoGroupColumnDef: {
				headerName: $widget.params?.table?.roll_up?.total_col,
				field: $widget.params?.table?.roll_up?.total_col,
				cellRenderer: 'agGroupCellRenderer',
				cellRendererParams: {
					footerValueGetter: (params) => {
						// Cambiar el valor de la celda en la fila de totales
						if (params.node.level === -1) {
							return 'TOTAL:'
						}
						return params.value
					}
				}
			}
		}
	}

	/**
	 * @description Actualiza la configuración de la tabla cuando se cambia el tamaño de la tabla
	 */
	function onGridSizeChanged(event: any) {
		gridOptions.api!.sizeColumnsToFit()
		const scrollModel = $widget.params.pqgrid?.scrollModel
		if (scrollModel && scrollModel?.autoFit === false) {
			event.columnApi.autoSizeAllColumns(true)
		}
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const reloadAction = getWidgetAction($widgetActions, 'reloadFetchData')

	onMount(() => {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
		new Grid(eGridDiv, gridOptions)
		if (!data) eGridDiv.classList.add('hidden')
		// eGridDiv.style.height = gridHeight($widget.widget_id, $widget.params)
	})

	$: isDark = $themeMode === 'dark'

	/**
	 * @description Actualiza el tamaño de la tabla cuando se cambia el tamaño del widget
	 */
	//  const setSizeOnLoadAgGridContent = () => {
	// 	setContentHeight($widget.widget_id)
	// 	const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
	// 	eGridDiv.style['min-height'] = !$widget.temp
	// 		? gridHeight($widget.widget_id, $widget.params)
	// 		: gridInstanceHeight($widget.widget_id)
	// 	$widget.resized = false
	// }

	const resizeAgGridToContent = () => {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
		eGridDiv.style['min-height'] = !$widget.temp
			? gridHeight($widget.widget_id)
			: gridInstanceHeight($widget.widget_id)
		eGridDiv.style['height'] = eGridDiv.style['min-height']
		$widget.resized = false
	}
	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: () => {
			setContentHeight($widget.widget_id)
			if (!$widget.instances || $widget.instances.length === 0) resizeAgGridToContent()
		}
	})

	// const resizeAgGridInstanceContent = () => {
	// 	setContentHeight($widget.widget_id)
	// 	const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.widget_id}`)!
	// 	eGridDiv.style.height = gridHeight($widget.widget_id, $widget.params)
	// 	$widget.resized = false
	// }

	if ($widget.resized) {
		resizeAgGridToContent()
	}

	const newItem = (obj: any) => {
		gridOptions.api!.applyTransaction({ add: [obj.dataModel] })
		gridOptions.api!.refreshCells({ force: true })
		// gridOptions.api!.redrawRows() //.refreshClientSideRowModel()
		if (gridOptions.api!.getDisplayedRowCount() === 1) reloadAction.action()
	}

	const updateItem = (obj: any) => {
		const rowNode = gridOptions.api!.getRowNode(obj.rowId)
		if (rowNode) {
			rowNode.setData({ ...obj.dataModel })
			gridOptions.api!.redrawRows({ rowNodes: [rowNode] })
		}
		gridOptions.api!.refreshCells({ force: true })
	}

	const deleteItem = (id: string) => {
		const rowNode = gridOptions.api!.getRowNode(id)
		if (rowNode) {
			gridOptions.api!.applyTransaction({ remove: [rowNode.data] })
		}
	}
	function onFilterTextBoxChanged(elementId: any) {
		gridOptions.api!.setQuickFilter((document.getElementById(elementId)! as HTMLInputElement).value)
	}

	addWidgetAction(widgetActions, {
		name: 'agGridFilterTextBox',
		action: (elementId) => onFilterTextBoxChanged(elementId)
	})

	addWidgetAction(widgetActions, {
		name: 'agGridBtnMap',
		action: (method) => actionBtnMap[method](method)
	})

	if ($widget.params?.btnsActions?.top) {
		const widgetTop = getContext<Writable<any>>('WidgetTop')
		setWidgetTop(widgetTop, 'AgGridToolbar', {
			position: 'top',
			widgetID: $widget.widget_id,
			btnsActions: $widget.params.btnsActions,
			filterCallback: 'agGridFilterTextBox',
			btnCallback: 'agGridBtnMap'
		})
	}

	if ($widget.params?.btnsActions?.bottom) {
		const widgetBottom = getContext<Writable<any>>('WidgetBottom')
		setWidgetBottom(widgetBottom, 'AgGridToolbar', {
			position: 'bottom',
			widgetID: $widget.widget_id,
			btnsActions: $widget.params.btnsActions,
			btnCallback: 'agGridBtnMap'
		})
	}
</script>

<div id="aggrid-container-{$widget.widget_id}" class="grid-container flex flex-col">
	<div
		id="grid-{$widget.widget_id}"
		style="width: 100%"
		class="grid min-h-[100px]"
		class:ag-theme-balham={!isDark}
		class:ag-theme-balham-dark={isDark}
	/>
	{#if !data}
		<NoDataFound />
	{/if}
</div>

<style>
	.ag-theme-balham {
		--ag-borders: 0px;
		--ag-row-border-width: 0px;
		--ag-odd-row-background-color: #f9f9f9;
		--ag-header-foreground-color: #000;
	}

	/* Estilo para el contenedor */
</style>
