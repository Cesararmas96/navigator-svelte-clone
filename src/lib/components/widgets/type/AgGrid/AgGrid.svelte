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
		recordsPerPage
	} from '$lib/helpers/widget/aggrid'
	import {
		hideFormBuilderDrawer,
		selectedFormBuilderRecord,
		selectedFormBuilderWidget
	} from '$lib/stores/widgets'
	import Toolbar from './Toolbar.svelte'
	import { getWidgetAction } from '$lib/helpers'
	import { openConfirmModal } from '$lib/helpers/common/modal'
	import Modal from '$lib/components/common/Modal.svelte'
	import { deleteData, postData } from '$lib/services/getData'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import Filter from './Filter.svelte'
	import type { as } from 'vitest/dist/reporters-5f784f42'

	export let data: any
	export let simpleTable: boolean = false

	const widget = getContext<Writable<any>>('widget')
	const formatDefinitionKeys = $widget.format_definition
		? Object.keys($widget.format_definition).map((key: string) => key)
		: []

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
		console.log(`${import.meta.env.VITE_API_URL}${$widget.params.model.meta}${slugKeys}`)
		// const response = await deleteData(`${import.meta.env.VITE_API_URL}${$widget.params.model.meta}${slugKeys}`)
		// if (response) {
		// 	deleteItem(rowId)
		// 	sendSuccessNotification('Delete')
		// } else {
		// 	sendErrorNotification('An error has occurred')
		// }
	}

	// async function confirmDeleteUsers(data: any, keys: string[], rowId: string) {
	// 	const slugKeys: string = keys.map((key) => `/${data[key]}`).join('')
	// 	const response = await deleteData(`${import.meta.env.VITE_API_URL}/api/v1/users${slugKeys}`)
	// 	if (response) {
	// 		deleteItem(rowId)
	// 		sendSuccessNotification('Delete')
	// 	} else {
	// 		sendErrorNotification('An error has occurred')
	// 	}
	// }

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
	let gridOptions: GridOptions = {
		defaultColDef,
		pagination: !simpleTable,
		paginationPageSize: recordsPerPage($widget.params),
		columnDefs,
		rowData: data,
		rowHeight: 25,
		animateRows: true,
		getRowClass: (params) => {
			const rowInit = $widget.params.pqgrid?.rowInit
			const fn = rowInit && gridFunctionsMap[rowInit]
			return fn ? fn(params)?.cls || '' : ''
		},
		onGridReady: (params: GridReadyEvent<any, any>) => {
			onGridSizeChanged(params)
		},
		onGridSizeChanged: onGridSizeChanged
	}

	/**
	 * @description Actualiza la configuración de la tabla cuando se cambia el tamaño de la tabla
	 */
	function onGridSizeChanged(event: any) {
		gridOptions.api!.sizeColumnsToFit()
		const scrollModel = $widget.params.pqgrid?.scrollModel
		if (scrollModel?.autoFit && scrollModel?.autoFit === false) {
			event.columnApi.autoSizeAllColumns(true)
		}
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')

	onMount(() => {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.uid}`)!
		new Grid(eGridDiv, gridOptions)
		eGridDiv.style.height = gridHeight($widget.uid, $widget.params)
		if ($widget.temp) {
			const instanceLoadedAction = getWidgetAction($widgetActions, 'instanceLoaded')
			instanceLoadedAction.action()
		}
		if ($widget.resize_on_load) resizeAction.action()
		setTimeout(() => {
			eGridDiv.style.height = gridHeight($widget.uid, $widget.params)
		}, 100)
	})

	$: isDark = $themeMode === 'dark'

	/**
	 * @description Actualiza el tamaño de la tabla cuando se cambia el tamaño del widget
	 */
	$: if ($widget.resized && document.querySelector(`#grid-${$widget.uid}`)) {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.uid}`)!
		eGridDiv.style.height = gridHeight($widget.uid, $widget.params)
		$widget.resized = false
	}

	const newItem = (obj: any) => {
		gridOptions.api!.applyTransaction({ add: [obj.dataModel] })
		gridOptions.api!.refreshCells({ force: true })
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
		console.log(elementId)
		gridOptions.api!.setQuickFilter((document.getElementById(elementId)! as HTMLInputElement).value)
	}
</script>

<Toolbar
	position="top"
	widgetUID={$widget.uid}
	btnsActions={$widget.params.btnsActions}
	filterCallback={onFilterTextBoxChanged}
	on:click={(e) => actionBtnMap[e.detail](e)}
/>
<div
	id="grid-{$widget.uid}"
	style="width: 100%"
	class:ag-theme-balham={!isDark}
	class:ag-theme-balham-dark={isDark}
/>
<Toolbar position="bottom" widgetUID={$widget.uid} btnsActions={$widget.params.btnsActions} />

<style>
	.ag-theme-balham {
		--ag-borders: 0px;
		--ag-row-border-width: 0px;
		--ag-odd-row-background-color: #f9f9f9;
		--ag-header-foreground-color: #000;
	}
</style>
