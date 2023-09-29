<script lang="ts">
	import {
		Grid,
		type ColDef,
		type GridOptions,
		type GridReadyEvent,
		type ValueGetterParams
	} from 'ag-grid-community'
	import { getContext, onMount } from 'svelte'
	import { themeMode } from '$lib/stores/preferences'

	import 'ag-grid-community/styles/ag-grid.css'
	import 'ag-grid-community/styles/ag-theme-balham.css'
	import type { Writable } from 'svelte/store'
	import {
		cellClass,
		cellClassRules,
		formatByPattern,
		formulaFunctionsMap,
		gridCellBuildFunctionsMap,
		gridFunctionsMap,
		gridHeight,
		headerClass,
		recordsPerPage
	} from '$lib/helpers/widget/aggrid'
	import moment from 'moment'
	import {
		hideFormBuilderDrawer,
		selectedFormBuilderRecord,
		selectedFormBuilderWidget
	} from '$lib/stores/widgets'
	import Toolbar from './AgGridWidget/Toolbar.svelte'
	import { capitalizeWord } from '$lib/helpers/common/common'

	export let data: any

	const widget = getContext<Writable<any>>('widget')
	$: console.log($widget)

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
	 * @description Genera las columnas por defecto a partir de los datos
	 * @param data
	 */
	function generateColumnDefsByData(data: any) {
		const columns: any[] = []
		Object.entries(data).map(([key, value]: [string, any]) => {
			columns.push({
				headerName: capitalizeWord(key).replace('_', ' '),
				field: key,
				resizable: true,
				hide: Array.isArray(value) || typeof value === 'object',
				valueFormatter: (params: any) =>
					moment(params.value, 'YYYY-MM-DD HH:mm:ss.SSSSSSZ', true).isValid()
						? moment(params.value, 'YYYY-MM-DD HH:mm:ss.SSSSSSZ').format('YYYY-MM-DD HH:mm:ss')
						: params.value
			})
		})
		return columns
	}

	/**
	 * @description Genera las columnas a partir de la definición del widget
	 */
	let columnDefs: ColDef[] =
		!$widget.format_definition || Object.keys($widget.format_definition).length === 0
			? generateColumnDefsByData($widget.data && $widget.data.length > 0 ? $widget.data[0] : {})
			: Object.entries($widget.format_definition)
					.filter(([key, col]: [string, any]) => !col.hidden) // Filtrar columnas ocultas
					.map(([key, col]: [string, any]) => {
						return {
							order: col.order,
							headerName: col.title,
							field: key,
							format: col.format,
							cellClass: cellClass(col),
							cellClassRules: cellClassRules(col, $widget.params.thresholds),
							headerClass: headerClass(col),
							// valueFormatter: (params: any) => {
							// 	return params.colDef.format
							// 		? formatByPattern(params.value, params.colDef.format)
							// 		: params.value
							// },
							cellRenderer: (params: ValueGetterParams) => {
								if (col.render && gridCellBuildFunctionsMap[col.render])
									return gridCellBuildFunctionsMap[col.render](params)

								// if ($widget.params.pqgrid?.formulas && Array.isArray($widget.params.pqgrid?.formulas)) {
								// 	$widget.params.pqgrid.formulas.map((formula: any, formulaIndex: number) => {
								// 		if (typeof formulaFunctionsMap[formula[1]] === 'function') {
								// 			const pqFormula = formula[1].toString()
								// 			return formulaFunctionsMap[pqFormula](params, $widget)

								// 			// $widget.params.pqgrid.formulas[formulaIndex][1] = (...args: any) => {
								// 			// 	return formulaFunctionsMap[pqFormula](params)
								// 			// }
								// 		} else {
								// 			// console.log(
								// 			// 	`The formula ${payload.params.value.pqgrid.formulas} function not exist.`
								// 			// )
								// 			// delete payload.params.value.pqgrid.formulas[formulaIndex]
								// 		}
								// 	})
								// } else {
								// 	// 	: params.data[key]
								// 	return params.data[key]
								// }
								return col.format ? formatByPattern(params.data[key], col.format) : params.data[key]

								// return params.data[key]
							}
						}
					})

	columnDefs = columnDefs.sort((a: any, b: any) => a.order - b.order)

	/**
	 * @description Genera la columna de acciones
	 */
	if ($widget.params.actions) {
		columnDefs.push({
			headerName: 'Actions',
			field: 'actions',
			cellClass: 'text-center',
			headerClass: 'header-center',
			maxWidth: 100,
			cellRenderer: (params: ValueGetterParams) => {
				return gridCellBuildFunctionsMap['actions']({
					data: params.data,
					widget: $widget,
					callback: actionBtnMap[$widget.params.actions.postRender]
				})
			}
		})
	}

	export const actionBtnMap: { [key: string]: (data: any) => any } = {
		postRenderModulesProgram: postRenderModulesProgram,
		postRenderFormBuilder: postRenderFormBuilder,
		createModelWithFormBuilder: createModelWithFormBuilder
	}

	function postRenderModulesProgram(params: any) {
		console.log('postRenderModulesProgram', params)
	}

	function postRenderFormBuilder(params: any) {
		const { action, data } = params.srcElement.dataset
		$selectedFormBuilderWidget = $widget
		$selectedFormBuilderRecord = { action, data }
		$hideFormBuilderDrawer = false
	}

	function createModelWithFormBuilder() {
		$selectedFormBuilderWidget = $widget
		$selectedFormBuilderRecord = { action: 'new', data: null }
		$hideFormBuilderDrawer = false
	}
	/**
	 * @description Genera la configuración de la tabla
	 */
	let gridOptions: GridOptions = {
		defaultColDef,
		pagination: true,
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

	onMount(() => {
		const eGridDiv: HTMLElement = document.querySelector(`#grid-${$widget.uid}`)!
		new Grid(eGridDiv, gridOptions)
		eGridDiv.style.height = gridHeight($widget.uid, $widget.params)
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
</script>

<Toolbar
	position="top"
	btnsActions={$widget.params.btnsActions}
	on:click={(e) => actionBtnMap[e.detail](e)}
/>
<div
	id="grid-{$widget.uid}"
	style="width: 100%"
	class:ag-theme-balham={!isDark}
	class:ag-theme-balham-dark={isDark}
/>
<Toolbar position="bottom" btnsActions={$widget.params.btnsActions} />

<style>
	.ag-theme-balham {
		--ag-borders: 0px;
		--ag-row-border-width: 0px;
		--ag-odd-row-background-color: #f9f9f9;
		--ag-header-foreground-color: #000;
	}
</style>
