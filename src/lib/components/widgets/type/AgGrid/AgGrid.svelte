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
			const { action, data, rowId } = params.srcElement.dataset
			$selectedFormBuilderWidget = $widget
			$selectedFormBuilderRecord = {
				action,
				data,
				rowId,
				callbackUpdate: updateItem,
				callbackNew: newItem
			}
			$hideFormBuilderDrawer = false
		},
		createModelWithFormBuilder() {
			$selectedFormBuilderWidget = $widget
			$selectedFormBuilderRecord = { action: 'new', data: null, callbackNew: newItem }
			$hideFormBuilderDrawer = false
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
	$: if ($widget.resized) {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.uid}`)!
		eGridDiv.style.height = gridHeight($widget.uid, $widget.params)
		$widget.resized = false
	}

	const updateItem = (obj: any) => {
		const rowNode = gridOptions.api!.getRowNode(obj.rowId)
		rowNode!.setData(obj.dataModel)
	}

	const newItem = (obj: any) => {
		gridOptions.api!.applyTransaction({ add: [obj.dataModel] })
		gridOptions.api!.refreshCells({ force: true })
	}
</script>

<Toolbar
	position="top"
	widgetUID={$widget.uid}
	btnsActions={$widget.params.btnsActions}
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
