/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-env es6 */
import { sendWarningNotification } from '$lib/stores/toast'
import moment from 'moment-timezone'
import { capitalizeWord } from '../common/common'
import type { ValueGetterParams } from 'ag-grid-community'
import { fnFormatMoney, fnFormatPercent, formats } from '../common/formats'
import { addInstance, clearInstances } from './instances'

export const colAction = (
	key: string,
	widget: any,
	callbacks: any,
	colDef?: Record<string, any>
) => {
	return {
		headerName: colDef?.title || 'Actions',
		field: key,
		order: colDef?.order || 9999,
		cellClass: 'text-center',
		headerClass: 'header-center',
		maxWidth: 140,
		cellRenderer: (params: ValueGetterParams) => {
			return gridCellBuildFunctionsMap[colDef?.render || key](
				{
					data: params.data,
					tableParams: params,
					widget: widget
				},
				callbacks[widget.params.actions.postRender],
				colDef
			)
		}
	}
}

type FunctionMapType = {
	[key: string]: number[]
}

/**
 * @description Genera las columnas por defecto a partir de los datos
 * @param data
 */
export const generateColumnDefsByData = (widget: any, simpleTable: boolean) => {
	const data = widget.data && widget.data.length > 0 ? widget.data[0] : {}
	const definitions = widget.format_definition || {}
	const columns: any[] = []

	Object.entries(data).map(([key, value]: [string, any], idx: number) => {
		if (
			Object.keys(definitions)
				.map((key: string) => key)
				.includes(key)
		)
			return
		const columnDef = {
			headerName: capitalizeWord(key).replace('_', ' '),
			field: key,
			order: 9998,
			resizable: true,
			cellClass: simpleTable ? cellClassSimpleTable(definitions, idx) : '',
			hide: Array.isArray(value) || typeof value === 'object',
			valueFormatter: (params: any) => {
				if (simpleTable) {
					const def: FunctionMapType = definitions
					for (const [fnName, indices] of Object.entries(def)) {
						if (indices.includes(idx)) {
							const fn = formats[fnName]
							return fn(params.value)
						}
					}
				} else {
					return moment(params.value, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ', true).isValid()
						? moment(params.value, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').format(
								'ddd, MMM DD YYYY, HH:mm:ss'
						  )
						: params.value
				}
			}
		}
		if (widget.params?.table?.roll_up?.sum?.includes(key)) {
			columnDef['aggFunc'] = 'sum'
		}
		columns.push(columnDef)
	})
	return columns
}

/**
 * @description Genera las columnas por defecto a partir de los datos
 * @param data
 */
export const generateColumnDefsByDefinition = (widget: any, callbacks: any) => {
	const definitions = widget.format_definition
	const colsDef = Object.entries(definitions)
		.filter(([key, col]: [string, any]) => !col.hidden) // Filtrar columnas ocultas
		.map(([key, col]: [string, any]) => {
			const sort = colSorted(col, widget.params?.pqgrid?.sortModel?.sorter)
			col.sorted = sort ? true : false
			return key === 'actions' || key === 'custom_actions'
				? colAction(key, widget, callbacks, col)
				: {
						order: col.order,
						headerName: col.title,
						field: key,
						headerCheckboxSelection: col.checkbox,
						checkboxSelection: col.checkbox,
						showDisabledCheckboxes: col.checkbox,
						cellEditor: col.cellEditor, //? SimpleTextEditor : undefined,
						// format: col.format,
						cellClass: cellClass(col),
						cellClassRules: cellClassRules(key, col, widget.params.thresholds),
						headerClass: headerClass(col),
						cellStyle: cssToObjet(col.style),
						editable: col.cellEditor ? true : false,

						wrapText: true,
						autoHeight: true,

						sort: sort,
						cellRenderer: (params: ValueGetterParams) => {
							if (col.render && gridCellBuildFunctionsMap[col.render])
								return gridCellBuildFunctionsMap[col.render](params, callbacks, col)

							if (
								widget.params.pqgrid?.formulas &&
								Array.isArray(widget.params.pqgrid?.formulas) &&
								widget.params.pqgrid?.formulas.some((item) => item.includes(col.dataIndx))
							) {
								const a = widget.params.pqgrid.formulas.map(
									(formula: any, formulaIndex: number) => {
										if (typeof formulaFunctionsMap[formula[1]] === 'function') {
											const pqFormula = formula[1].toString()
											return formulaFunctionsMap[pqFormula](params, widget)

											// $widget.params.pqgrid.formulas[formulaIndex][1] = (...args: any) => {
											// 	return formulaFunctionsMap[pqFormula](params)
											// }
										} else {
											// console.log(
											// 	`The formula ${payload.params.value.pqgrid.formulas} function not exist.`
											// )
											// delete payload.params.value.pqgrid.formulas[formulaIndex]
										}
									}
								)
								return a[0]
							} else {
								// 	: params.data[key]
								// return params.data[key]
							}
							return col.format
								? formatByPattern(params.data[key], col.format)
								: !Array.isArray(params.data[key])
								? params.data[key]
								: new Array(params.data[key]).join(', ')
						}
				  }
		})
	// if (widget.classbase === 'selectpqtableWidget') colsDef.push(colAction(widget, callbacks))
	return colsDef
}

export const cellClassSimpleTable = (formatDefinition: any, idx: number): string => {
	let cellClass = ''
	if (
		formatDefinition &&
		formatDefinition['fnFormatNumberInteger'] &&
		formatDefinition['fnFormatNumberInteger'].includes(idx)
	)
		cellClass = 'text-right'
	if (
		formatDefinition &&
		formatDefinition['fnFormatPercent'] &&
		formatDefinition['fnFormatPercent'].includes(idx)
	)
		cellClass = 'text-right'
	return cellClass
}

export const cellClass = (formatDefinition: any): string => {
	let cellClass = ''
	cellClass += !formatDefinition.align && formatDefinition.format ? ' text-right' : ''
	cellClass += formatDefinition.align ? ` text-${formatDefinition.align}` : ''
	if (formatDefinition.render) cellClass += ` action-${formatDefinition.render}`

	return cellClass
}

export const headerClass = (formatDefinition: any): string => {
	let cellClass = ''
	cellClass += !formatDefinition.align && formatDefinition.format ? ' header-right' : ''
	cellClass += formatDefinition.align ? ` header-${formatDefinition.align}` : ''
	cellClass += formatDefinition.sorted ? ` bg-gray-300` : ''
	return cellClass
}

export const setMainContentHeight = (id: string): any => {
	const gridHeight = document.getElementById(`grid-${id}`)!.offsetHeight
	document.getElementById(`widget-main-${id}`)?.setAttribute('style', `height: ${gridHeight}px`)
}

export const setInstancesContentHeight = (patent_id: string, id: string): any => {
	const instancesHeight = document.getElementById(`widget-instances-${patent_id}`)!
	document
		.getElementById(`widget-main-${id}`)
		?.setAttribute('style', `height: ${instancesHeight.offsetHeight}px`)
	document
		.getElementById(`grid-${id}`)
		?.setAttribute('style', `height: ${instancesHeight.offsetHeight}px`)
}

export const gridHeight = (id: string): any => {
	const mainHeight = document.getElementById(`widget-main-${id}`)!.offsetHeight
	const toolbarTopEL = document.getElementById(`widget-content-top-${id}`)
	const toolbarTop = toolbarTopEL ? toolbarTopEL.offsetHeight : 0
	const toolbarBottomEL = document.getElementById(`widget-content-bottom-${id}`)
	const toolbarBottom = toolbarBottomEL ? toolbarBottomEL.offsetHeight : 0
	const instancesEL = document.getElementById(`widget-instances-${id}`)
	const instances = instancesEL ? instancesEL.offsetHeight : 0
	const contentHeight = mainHeight - toolbarTop - toolbarBottom - instances
	return `${contentHeight}px`
}

export const gridInstanceHeight = (id: string): any => {
	const mainHeight = 400 //document.getElementById(`widget-main-${id}`)!.offsetHeight
	const toolbarTopEL = document.getElementById(`widget-content-top-${id}`)
	const toolbarTop = toolbarTopEL ? toolbarTopEL.offsetHeight : 0
	const toolbarBottomEL = document.getElementById(`widget-content-bottom-${id}`)
	const toolbarBottom = toolbarBottomEL ? toolbarBottomEL.offsetHeight : 0
	const contentHeight = mainHeight - toolbarTop - toolbarBottom
	return `${contentHeight}px`
}

export const hidePagination = (formatDefinition: any): any => {
	formatDefinition = formatDefinition.aggrid ? formatDefinition.aggrid : formatDefinition.pqgrid
	return formatDefinition?.hide_pagination
}

export const recordsPerPage = (formatDefinition: any): any => {
	let recordsPerPage = '10'
	formatDefinition = formatDefinition.aggrid ? formatDefinition.aggrid : formatDefinition.pqgrid
	recordsPerPage =
		formatDefinition && formatDefinition.pageModel && formatDefinition.pageModel.rPP
			? formatDefinition.pageModel.rPP
			: recordsPerPage
	return recordsPerPage
}

// const formatCurrency = (val: number, decimals: number) =>
//   '$' + val.toLocaleString(undefined, {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals
//   })

// const formatPercentage = (val: number, decimals: number) =>
//   (val * 100).toLocaleString(undefined, {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals
//   }) + '%'

export const formatByPattern = (value: number, pattern: string): string => {
	let result = ''
	// if (!value) return result

	let date, year, month, day, hour, minute, second

	switch (pattern) {
		case '####':
			result = value ? value.toString() : '0'
			break

		case '#,###':
		case '#,####':
		case '##,###':
		case '$#,###':
		case '$##,###':
			result = (pattern[0] === '$' ? '$' : '') + Math.round(value).toLocaleString()
			break

		case '#,###.0':
		case '##,###.0':
		case '$#,###.0':
		case '$##,###.0':
			result = fnFormatMoney(value)
			break

		case '#,###.00':
		case '##,###.00':
		case '$#,###.00':
		case '$##,###.00':
			result = fnFormatMoney(value)
			break

		case 'yy-mm-dd':
			date = new Date(value)
			year = String(date.getFullYear()).slice(-2)
			month = String(date.getMonth() + 1).padStart(2, '0')
			day = String(date.getDate()).padStart(2, '0')
			result = `${year}-${month}-${day}`
			break

		case '##,###.0%':
		case '#,###.0%':
			result = fnFormatPercent(value, '0.0%', 1)
			break

		case '##,###.00%':
		case '#,###.00%':
		case '#,###,00%':
			result = fnFormatPercent(value, '0.00%', 2)
			break

		default:
			throw new Error('Patrón no reconocido ' + pattern)
	}

	return result
}

export const gridFunctionsMap: { [key: string]: (params: any) => void } = {
	scorecardKeyWalmartMetrics: scorecardKeyWalmartMetrics,
	scorecardOperational: scorecardOperational,
	scorecardSales: scorecardSales,
	epsonFieldSuccessIndex: epsonFieldSuccessIndex,
	keyMetrics: keyMetrics,
	keyMetricsScorecard: keyMetricsScorecard,
	scorecardKeyMetrics: scorecardKeyMetrics,
	tmFieldSuccessIndex: tmFieldSuccessIndex,
	lorealDataIntegrity: lorealDataIntegrity,
	lorealProposalController: lorealProposalController
}

function scorecardKeyWalmartMetrics(params: any) {
	if (!params.data.store_id && params.data.market_name) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market_name && params.data.district_name) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_name && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_name) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_name) {
		return {
			cls: 'cls-company'
		}
	}
}

function scorecardOperational(params: any) {
	if (!params.data.store_id && params.data.market_name) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market_name && params.data.district_name) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_name && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_name) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_name) {
		return {
			cls: 'cls-company'
		}
	}
}

function scorecardSales(params: any) {
	if (!params.data.store_id && params.data.market) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market && params.data.district_id) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_id && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_id) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_id) {
		return {
			cls: 'cls-company'
		}
	}
}

function epsonFieldSuccessIndex(params: any) {
	if (params.data.region_id && params.data.area && !params.data.district) {
		return {
			cls: 'cls-market bold'
		}
	} else if (!params.data.region_id && !params.data.district) {
		return {
			cls: 'cls-company bold'
		}
	}
}

function keyMetrics(params: any) {
	if (!params.data.store_id && params.data.market_name) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market_name && params.data.district_name) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_name && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_name) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_name) {
		return {
			cls: 'cls-company'
		}
	}
}

function keyMetricsScorecard(params: any) {
	if (!params.data.store_id && params.data.market) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market && params.data.district_id) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_id && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_id) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_id) {
		return {
			cls: 'cls-company'
		}
	}
}

function scorecardKeyMetrics(params: any) {
	if (!params.data.store_id && params.data.market_name) {
		return {
			cls: 'cls-market'
		}
	} else if (!params.data.market_name && params.data.district_id) {
		return {
			cls: 'cls-district'
		}
	} else if (!params.data.district_id && params.data.region_name) {
		return {
			cls: 'cls-region'
		}
	} else if (!params.data.region_name && params.data.territory_name) {
		return {
			cls: 'cls-territory'
		}
	} else if (!params.data.region_name && !params.data.territory_name) {
		return {
			cls: 'cls-company'
		}
	}
}

function // Trend Micro
tmFieldSuccessIndex(params: any) {
	if (!params.data.visitor_email) {
		return {
			cls: 'cls-company bold'
		}
	}
}

function // LOREAL
lorealDataIntegrity(params: any) {
	if (!params.data.pos_enabled || !params.data.customer_enabled || !params.data.platform_enabled) {
		return {
			cls: 'cls-red bold'
		}
	}
}

function lorealProposalController(params: any) {
	if (params.data.proposal_name) {
		return {
			cls: 'cls-controller-review bold'
		}
	}
}

export const colSorted = (col: any, sort: any): any => {
	if (!sort || !col.dataIndx) return null

	const sortCol = sort.find((s: any) => s.dataIndx === col.dataIndx)
	if (!sortCol) return null

	return sortCol.dir === 'up' ? 'asc' : 'desc'
}

export const cellClassRules = (key: string, formatDefinition: any, thresholds: any): any => {
	let rule = {}
	if (!thresholds) return rule
	if (formatDefinition.render) {
		const fn = gridCellFunctionsMap[formatDefinition.render]
		if (fn) rule = fn(thresholds[formatDefinition.dataIndx || key])
		else
			sendWarningNotification(
				`Function ${formatDefinition.render} not found in gridCellFunctionsMap`
			)
	}
	return rule
}

const operatorTokens: any = {
	lt: '<',
	gt: '>',
	eq: '===',
	ne: '!==',
	let: '<=',
	get: '>='
}

export const gridCellFunctionsMap: { [key: string]: (params: any) => any } = {
	metricsRender: metricsRender
}

const cssToObjet = (cssStr) => {
	const objetCss = { 'white-space': 'normal', 'line-height': '1.2' }
	if (!cssStr) return objetCss

	const declations = cssStr.split(';')

	declations.forEach((declaration) => {
		const [key, value] = declaration.split(':').map((str) => str.trim())
		if (key && value) {
			const propertyCamelCase = key.replace(/-([a-z])/g, (match, letra) => letra.toUpperCase())
			objetCss[propertyCamelCase] = value
		}
	})

	return objetCss
}

function metricsRender(threshold: any) {
	if (threshold) {
		const _threshold = {}
		Object.keys(threshold).map((key) => {
			const operator = operatorTokens[threshold[key].operator]
			_threshold[threshold[key].class] = `x ${operator} ${threshold[key].value}`
		})
		return _threshold
	}
}

export const gridCellBuildFunctionsMap: {
	[key: string]: (
		params: any,
		callback?: Record<string, () => void> | (() => void),
		colDef?: Record<string, any>
	) => any
} = {
	modulesActive: modulesActive,
	modulesProgram: modulesProgram,
	actions: actions,
	jsonPretty: jsonPretty,
	dateAndTime: dateAndTime,
	isActiveYesOrNo: isActiveYesOrNo,
	tasksActions: tasksActions,
	ticketsForBoseZammad: ticketsForBoseZammad,
	clickCell: clickCell,
	confirmMileage: confirmMileage,
	mileageActions: mileageActions,
	status: status,
	numberWithPattern: numberWithPattern
}

function modulesActive(params: any) {
	if (params.column.colId === 'active') {
		const cls = params.data[params.column.colId] ? 'badge-success' : 'badge-danger'
		const span = document.createElement('span')
		span.classList.add('badge')
		span.classList.add(cls)
		span.innerHTML = params.data[params.column.colId] ? 'Active' : 'Disable'
		return span
	}
}

function modulesProgram(params: any) {
	return params.data[params.column.colId]
}

function jsonPretty(params: any) {
	try {
		return JSON.stringify(params.data[params.column.colId])
	} catch (error) {
		return params.data[params.column.colId]
	}
}

function dateAndTime(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	try {
		if (params.column.colId && params.data[params.column.colId]) {
			const date = moment.tz(params.data[params.column.colId], 'America/New_York')
			return date.format(colDef?.format || 'ddd, MMM DD YYYY, HH:mm:ss')
		}
	} catch (error) {
		console.log(error)
	}
}

function isActiveYesOrNo(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	try {
		const active = params.data[params.column.colId]
		const title = !active ? 'No' : 'Yes'
		const cls = params.data[params.column.colId] ? 'badge-success' : 'badge-danger'
		if (!colDef!.postRender) {
			const span = document.createElement('span')
			span.classList.add('badge')
			span.classList.add(cls)
			span.innerHTML = title
			return span
		} else {
			const a = document.createElement('a')
			a.dataset.colId = params.column.colId
			a.dataset.data = JSON.stringify(params.data)
			a.dataset.colDef = JSON.stringify(colDef)
			a.dataset.rowId = params.rowIndex
			a.classList.add('cursor-pointer')
			a.classList.add('badge')
			a.classList.add(cls)
			a.addEventListener('click', callback![colDef!.postRender])
			a.href = '#'
			a.innerHTML = title
			return a
		}
	} catch (error) {
		console.log(error)
	}
}

function status(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	try {
		const status = params.data[params.column.colId]
		let badge = 'ag-waiting'
		let title = 'To be Confirmed'

		switch (status) {
			case 'waiting':
				badge = 'ag-waiting'
				title = 'To be Confirmed'
				break
			case 'pending':
				badge = 'ag-pending'
				title = 'Pending from Approval'
				break
			case 'approved':
				badge = 'ag-approved'
				title = 'Approved'
				break
			case 'rejected':
				badge = 'ag-rejected'
				title = 'Rejected'
				break
		}
		const span = document.createElement('span')
		span.classList.add('badge')
		span.classList.add('badge-' + badge)
		span.title = status
		span.innerHTML = title
		return span
	} catch (error) {
		console.log(error)
	}
}

function tasksActions(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	try {
		const status = params.data[params.column.colId]
		let badge = 'secondary'
		let title = 'Idle'

		switch (status) {
			case 0:
				badge = 'secondary'
				title = 'Idle'
				break
			case 1:
				badge = 'aqua'
				title = 'Pending'
				break
			case 2:
				badge = 'info'
				title = 'Started'
				break
			case 3:
				badge = 'primary'
				title = 'Task Running'
				break
			case 4:
				badge = 'secondary'
				title = 'Task Stopped'
				break
			case 5:
				badge = 'success'
				title = 'Done'
				break
			case 6:
				badge = 'success'
				title = 'Done (No Data)'
				break
			case 7:
				badge = 'warning'
				title = 'Not Found'
				break
			case 9:
				badge = 'danger'
				title = 'Task Failed'
				break
			case 10:
				badge = 'warning'
				title = 'Warning'
				break
			case 11:
				badge = 'secondary'
				title = 'Skipped'
				break
			case 12:
				badge = 'danger'
				title = 'Task Error'
				break
			case 98:
				badge = 'danger'
				title = 'Task Exception'
				break
			case 99:
				badge = 'dark'
				title = 'Closed'
				break
		}
		if (!params.data['traceback']) {
			const span = document.createElement('span')
			span.classList.add('badge')
			span.classList.add('badge-' + badge)
			span.title = status
			span.innerHTML = title
			return span
		} else {
			const a = document.createElement('a')
			a.dataset.action = 'btnBadge'
			a.dataset.colId = params.column.colId
			a.dataset.data = JSON.stringify(params.data)
			a.dataset.colDef = JSON.stringify(colDef)
			a.dataset.rowId = params.rowIndex
			a.classList.add('cursor-pointer')
			a.classList.add('badge')
			a.classList.add('badge-' + badge)
			a.addEventListener('click', callback![colDef!.postRender])
			a.href = '#'
			a.title = status
			a.innerHTML = title
			return a
		}
	} catch (error) {
		console.log(error)
	}
}

function ticketsForBoseZammad(params: any) {
	try {
		const status = params.data[params.column.colId]
		let badge = 'secondary'
		let title = 'Idle'

		switch (status) {
			case 1:
				badge = 'info'
				title = 'New'
				break
			case 2:
				badge = 'primary'
				title = 'Open'
				break
			case 3:
				badge = 'warning'
				title = 'Pending Reminder'
				break
			case 4:
				badge = 'success'
				title = 'Merged'
				break
			case 6:
				badge = 'danger'
				title = 'Pending Close'
				break
		}

		const span = document.createElement('span')
		span.classList.add('badge')
		span.classList.add(`badge-${badge}`)
		span.innerHTML = title
		return span
	} catch (error) {
		console.log(error)
	}
}

function mileageActions(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const container = document.createElement('span')
	container.classList.add('flex', 'items-center', 'justify-center', 'gap-1', 'mt-0.5', 'opacity-60')
	const constrols = params.widget?.params?.actions?.btns
	if (constrols) {
		constrols.map((btn: any) => {
			if (btn === 'approve' && params.data['status'] !== 'pending') return
			if (btn === 'reject' && params.data['status'] !== 'pending') return
			if (params.data?.attributes?.show_controls && !params.data?.attributes?.show_controls[btn])
				return
			container.appendChild(createActionBtn({ btn, ...params }, callback, colDef))
		})
	}
	return container
}

function actions(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const container = document.createElement('span')
	container.classList.add('flex', 'items-center', 'justify-center', 'gap-1', 'mt-0.5', 'opacity-60')
	const constrols = params.widget?.params?.actions?.btns
	if (constrols) {
		constrols.map((btn: any) => {
			if (params.data?.attributes?.show_controls && !params.data?.attributes?.show_controls[btn])
				return
			container.appendChild(createActionBtn({ btn, ...params }, callback, colDef))
		})
	}
	return container
}

const icons: any = {
	edit: 'material-symbols:edit-square-outline-rounded',
	delete: 'material-symbols:delete-outline-rounded',
	play: 'tabler:play',
	upload: 'tabler:cloud-upload',
	approve: 'material-symbols:select-check-box-rounded',
	reject: 'material-symbols:dangerous-outline-rounded',
	comments: 'fa-solid:comment'
}

function createActionBtn(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const data = params.data
	const widget = params.widget
	const btn = document.createElement('iconify-icon')
	btn.icon = icons[params.btn]
	btn.height = '20px'
	btn.dataset.action = params.btn
	btn.dataset.data = JSON.stringify(data)
	btn.dataset.keys = JSON.stringify(
		widget.params?.model?.primaryKey
			? [widget.params?.model?.primaryKey]
			: widget.params?.model?.keys || []
	)
	btn.dataset.rowId = params.tableParams.rowIndex
	btn.dataset.colId = params.tableParams.column.colId
	if (colDef) btn.dataset.colDef = JSON.stringify(colDef)

	btn.classList.add('cursor-pointer')
	btn.classList.add('actions-btn')
	if (colDef && colDef[`${params.btn}Class`] && data[params.btn])
		btn.classList.add(colDef[`${params.btn}Class`])

	if (callback && typeof callback === 'function') {
		btn.addEventListener('click', callback)
	}
	return btn
}

function clickCell(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const icon = document.createElement('iconify-icon')
	icon.icon = 'tabler:hand-finger'
	icon.classList.add('ml-1')
	icon.dataset.colId = params.column.colId
	icon.dataset.data = JSON.stringify(params.data)
	icon.dataset.colDef = JSON.stringify(colDef)
	icon.dataset.rowId = params.rowIndex
	icon.addEventListener('click', (event) => {
		event.preventDefault()
		callback!['postRenderOpenDrilldown']()
	})

	const div = document.createElement('div')
	div.classList.add('ag-cell-clickable')
	div.dataset.colId = params.column.colId
	div.dataset.data = JSON.stringify(params.data)
	div.dataset.colDef = JSON.stringify(colDef)
	div.dataset.rowId = params.rowIndex
	div.addEventListener('click', callback!['postRenderOpenDrilldown'])
	div.title = 'Click for details'
	div.innerHTML = `${params.data[params.column.colId]}`
	div.appendChild(icon)
	return div
}

function confirmMileage(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const icon = document.createElement('iconify-icon')
	icon.icon = params.data[params.column.colId] ? 'tabler:pencil' : 'tabler:hand-finger'
	icon.classList.add('ml-1')
	icon.dataset.colId = params.column.colId
	icon.dataset.data = JSON.stringify(params.data)
	icon.dataset.colDef = JSON.stringify(colDef)
	icon.dataset.rowId = params.rowIndex
	icon.addEventListener('click', (event) => {
		event.preventDefault()
		callback!['addMileage']()
	})

	const isClickable = params.data['status'] !== 'approved'

	const div = document.createElement('div')
	div.dataset.colId = params.column.colId
	div.dataset.data = JSON.stringify(params.data)
	div.dataset.colDef = JSON.stringify(colDef)
	div.dataset.rowId = params.rowIndex
	div.title = 'Click for details'
	div.innerHTML = params.data[params.column.colId]
		? `${params.data[params.column.colId]} miles${isClickable ? ' - (edit)' : ''}`
		: 'Confirm mileage'
	if (isClickable) {
		div.classList.add('ag-cell-clickable')
		div.addEventListener('click', callback!['addMileage'])
		div.appendChild(icon)
	} else {
		div.classList.add('ag-cell-no-clickable')
	}
	return div
}

function numberWithPattern(
	params: any,
	callback?: Record<string, () => void> | (() => void),
	colDef?: Record<string, any>
) {
	const number = params.data[params.column.colId]
	if (!number) return
	const decimalMatch = colDef?.pattern.match(/#\.(#+)/)
	let decimalPlaces = 0

	if (decimalMatch) {
		decimalPlaces = decimalMatch[1].length
	}

	const formattedNumber = number.toFixed(decimalPlaces)
	const formattedString = colDef?.pattern.replace('#.' + '#'.repeat(decimalPlaces), formattedNumber)

	const div = document.createElement('div')
	div.dataset.colId = params.column.colId
	div.dataset.data = JSON.stringify(params.data)
	div.dataset.colDef = JSON.stringify(colDef)
	div.dataset.rowId = params.rowIndex
	div.classList.add('w-full')
	div.innerHTML = formattedString

	return div
}

export const openDrillDownTempTaskMonitor = (widget: any) => {
	// if (drilldownOpen) return
	widget.instance_loading = true
	clearInstances(widget)
	const drilldowns: any[] =
		widget.params.drilldowns && Array.isArray(widget.params.drilldowns)
			? widget.params.drilldowns
			: []
	drilldowns.forEach((drilldown: any) => {
		const drilldownConfig = Object.assign(
			{},
			{
				master_filtering: true,
				conditions:
					!drilldown!.extendConditions || drilldown!.extendConditions === 'false'
						? {}
						: widget.conditions,
				dashboard_id: widget.dashboard_id,
				module_id: widget.module_id,
				program_id: widget.program_id,
				widget_type_id: widget.widget_type_id,
				parent: widget.widget_id,
				dataExtra: drilldown!.dataExtra // TODO: investigar que es el dataExtra
			},
			drilldown,
			{
				params: {
					...drilldown.params,
					settings: widget.params.settings
				}
			}
		)
		addInstance(widget, drilldownConfig)
		// activeDrilldown = addInstance(widget, drilldownConfig)
		// if (
		//   drilldownOptions!.removeFields &&
		//   drilldownConfig.conditions &&
		//   drilldownConfig.conditions.fields
		// ) {
		//   delete drilldownConfig.conditions.fields
		// }
		// const vm = createVNode(WidgetComponent, {
		//   widget: drilldownConfig,
		// })
		// vm.appContext = currentInstance!.appContext
		// render(vm, containerWidget)
		// element[0].appendChild(containerWidget)
	})
}
// $: isLoading = $widget.instance_loading && drilldownOpen

// function btnsRenderTasksActions(params: any, callback?: Record<string, () => void> | (() => void), colDef?: Record<string, any>) {
// 	const container = document.createElement('span')
// 	container.classList.add('flex', 'items-center', 'justify-center', 'gap-1', 'mt-0.5', 'opacity-60')
// 	params.widget.params.actions.btns.map((btn: any) => {
// 		container.appendChild(createActionBtn({ btn, ...params }, callback, colDef))
// 	})
// 	return container
//   return "XXX"
//   // const btnPlay = `<a type='button' style="padding: 5px" class='btnPlay' data-toggle="tooltip" data-placement="top" title="Play"><iconify-icon icon="tabler:play"></iconify-icon></a>`
//   // const btnExport = `<a type='button' style="padding: 5px" class='btnExport' data-toggle="tooltip" data-placement="top" title="Upload"><iconify-icon icon="tabler:cloud-upload"></iconify-icon></a>`
//   // const btnSound = `<a type='button' style="padding: 5px" class='btnSound' data-toggle="tooltip" data-placement="top" title="Sound"><iconify-icon icon="tabler:volume"></iconify-icon></a>`

//   // let btns = ''
//   // if (
//   //   ui.rowData.attributes &&
//   //   ui.rowData.attributes.show_controls &&
//   //   ui.rowData.attributes.show_controls.play
//   // ) {
//   //   ui.column.btns.includes('play') ? (btns = btns.concat(btnPlay)) : null
//   // }

//   // if (
//   //   (ui.rowData.attributes &&
//   //     ui.rowData.attributes.file_id &&
//   //     ui.rowData.attributes.show_controls &&
//   //     ui.rowData.attributes.show_controls.upload) ||
//   //   ui.rowData.file_id
//   // ) {
//   //   ui.column.btns.includes('export') ? (btns = btns.concat(btnExport)) : null
//   // }

//   // ui.column.btns.includes('sound') ? (btns = btns.concat(btnSound)) : null

//   // return btns
// }

/** 
function btnsRenderActionsDefaults(widget: WidgetPqTable, pq: any, ui: any) {
  const btnDefinitions = [
    {
      id: 'view',
      class: 'btnView',
      title: 'View',
      icon: 'tabler:eye',
    },
    {
      id: 'info',
      class: 'btnInfo',
      title: 'Information',
      icon: 'fa:info',
    },
    {
      id: 'test',
      class: 'btnTest',
      title: 'Test Widget',
      icon: 'fa:envelope',
    },
    {
      id: 'notifications',
      class: 'btnNotifications',
      title: 'Notifications',
      icon: 'fa:envelope',
    },

    {
      id: 'send',
      class: 'btnSend',
      title: 'Send',
      icon: 'fa:paper-plane-o',
    },
    {
      id: 'edit',
      class: 'btnEdit',
      title: 'Edit',
      icon: 'tabler:edit',
    },
    {
      id: 'check',
      class: 'btnCheck',
      title: 'Check',
      icon: 'fa:check',
    },
    {
      id: 'export',
      class: 'btnExport',
      title: 'Export',
      icon: 'fa:upload',
    },
    {
      id: 'upload',
      class: 'btnUpload',
      title: 'Upload',
      icon: 'fa:upload',
    },
    {
      id: 'status',
      class: 'btnChangeStatus',
      title: 'Change Status',
      icon: 'tabler:exchange',
    },
    {
      id: 'play',
      class: 'btnPlay',
      title: 'Play',
      icon: 'fa:play',
    },
    {
      id: 'password',
      class: 'btnKey',
      title: 'Change Password',
      icon: 'tabler:lock',
    },
    {
      id: 'token',
      class: 'btnToken',
      title: 'Generate Token',
      icon: 'tabler:key',
    },
    {
      id: 'shared',
      class: 'btnShared',
      title: 'Shared',
      icon: 'tabler:share',
    },
    {
      id: 'replace',
      class: 'btnReplace',
      title: 'Replace',
      icon: 'fa:window-restore',
    },
    {
      id: 'delete',
      class: 'btnDelete',
      title: 'Delete',
      icon: 'tabler:trash',
    },
  ]

  const btns: any[] = [`<div class="flex items-center justify-center gap-2">`]

  btns.push(
    ...btnDefinitions
      .filter((btn) => ui.column.btns.includes(btn.id))
      .map((btn) => {
        return `<a type="button" class="${btn.class || btn.id}" title="${
          btn.title
        }"><iconify-icon icon="${btn.icon}"></iconify-icon></a>`
      })
  )

  btns.push(`</div>`)

  return {
    text: btns.join(''),
  }
}

function partnerPortalStatusDeals(widget: WidgetPqTable, pq: any, ui: any) {
  try {
    const status = Number(ui.rowData.state_id)

    let badge = 'secondary'
    let title = 'Idle'

    switch (status) {
      case 1:
        badge = 'gray'
        title = 'In Discussion'
        break
      case 2:
        badge = 'purple'
        title = 'Demo'
        break
      case 3:
        badge = 'coffee'
        title = 'Proposal'
        break
      case 4:
        badge = 'orange'
        title = 'Negotiation'
        break
      case 5:
        badge = 'yellow'
        title = 'Lead Qualification'
        break
      case 6:
        badge = 'success'
        title = 'Purchasing'
        break
      case 7:
        badge = 'primary'
        title = 'Closed Won'
        break
      case 8:
        badge = 'secondary'
        title = 'Closed Lost'
        break
      case 9:
        badge = 'danger'
        title = 'Parking Lot'
        break
    }

    return `<a type='button' style="padding: 5px" class='btnChangeStatus' data-toggle="tooltip" data-placement="top" title="Click to toggle status"><span class="v-badge v-badge--inline v-badge__wrapper v-badge__badge badge badge-${badge}">${title}</span></a>`
  } catch (error) {
    console.log(error)
  }
}

function btnsRenderVibaActions(widget: WidgetPqTable, pq: any, ui: any) {
  const $data = ui.rowData

  const btnSound = `<a type='button' style="padding: 5px" class='${
    $data.has_recording === false ? 'btn-icon-disabled' : 'btnSound'
  }' data-toggle="tooltip" data-placement="top" title="Sound"><iconify-icon icon="fa:volume-up"></iconify-icon></a>`

  const btnChat = `<a type='button' style="padding: 5px" class='${
    $data.has_chat_messages === false ? 'btn-icon-disabled' : 'btnChat'
  }' data-toggle="tooltip" data-placement="top" title="Chat Transcript"><iconify-icon icon="fa:comments-o"></iconify-icon></a>`

  const btnForm = `<a type='button' style="padding: 5px" class='${
    $data.has_form_data === false ? 'btn-icon-disabled' : 'btnForm'
  }' data-toggle="tooltip" data-placement="top" title="Submitted Form Data"><iconify-icon icon="fa:file-text-o"></iconify-icon></a>`

  let btns = ''

  ui.column.btns.includes('chat') && $data.has_chat_messages !== null
    ? (btns = btns.concat(btnChat))
    : null

  ui.column.btns.includes('sound') && $data.has_recording !== null
    ? (btns = btns.concat(btnSound))
    : null

  ui.column.btns.includes('form') && $data.has_form_data !== null
    ? (btns = btns.concat(btnForm))
    : null

  return btns
}

function fnMathCeil(widget: WidgetPqTable, pq: any, ui: any) {
  try {
    if (ui.dataIndx) {
      const value = Math.ceil(ui.rowData[ui.dataIndx]).toString()

      return value.toString()
    }
  } catch (error) {
    console.log(error)
  }
}

function currentPoWmResetTrackers(widget: WidgetPqTable, pq: any, ui: any) {
  try {
    if (ui.rowData.current_po && ui.rowData.current_po === 'TRUE') {
      return `<span class="v-badge v-badge--inline v-badge__wrapper v-badge__badge badge badge-primary" title="Current">Current</span>`
    } else {
      return 'No'
    }
  } catch (error) {
    console.log(error)
  }
}

function btnsRenderWmResetTrackersReplace(widget: WidgetPqTable, pq: any, ui: any) {
  const btnSave = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnSave' data-toggle="tooltip" data-placement="top" title="Save"><i class="fa fa-floppy-o" style="font-size: 14.5px !important;"></i></a>`
  const btnEdit = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnEdit' data-toggle="tooltip" data-placement="top" title="Edit"><i class="fa fa-edit" style="font-size: 14.5px !important;"></i></a>`
  const btnReplace = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnReplace' data-toggle="tooltip" data-placement="top" title="Replace"><i class="fa fa-window-restore" style="font-size: 14.5px !important;"></i></a>`
  const btnDelete = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnDelete' data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash" style="font-size: 14.5px !important;"></i></a>`
  const btnDuplicate = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnDuplicate' data-toggle="tooltip" data-placement="top" title="Duplicate"><i class="fa fa-copy" style="font-size: 14.5px !important;"></i></a>`
  const btnNotes = `<a type='button' style="padding: 5px; margin-right: 5px;" class='btnNotes' data-toggle="tooltip" data-placement="top" title="Notes"><i class="fa fa-comment" style="font-size: 14.5px !important;"></i></a>`

  let btns = ''
  const grid = pq.getPqGrid()

  const rowIndx = ui.rowIndx
  const rowData = ui.rowData

  if (grid.isDirty({ rowIndx, rowData })) {
    btns = btns.concat(btnSave)
  }

  ui.column.btns.includes('edit') ? (btns = btns.concat(btnEdit)) : null
  ui.column.btns.includes('duplicate')
    ? (btns = btns.concat(btnDuplicate))
    : null
  ui.column.btns.includes('replace') ? (btns = btns.concat(btnReplace)) : null

  if (rowData.notes) {
    ui.column.btns.includes('notes') ? (btns = btns.concat(btnNotes)) : null
  }

  if (
    rowData.po_version !== 1 &&
    rowData.current_po !== 'TRUE' &&
    !this.$moment(rowData.effective_date).isBefore(
      this.$moment().format('YYYY-MM-DD')
    )
  ) {
    ui.column.btns.includes('delete') ? (btns = btns.concat(btnDelete)) : null
  }

  return btns
}
 */

export const formulaFunctionsMap: { [key: string]: (params: any, widget: any) => any } = {
	goldStarStatus: goldStarStatus
}

// function isActive(widget: WidgetPqTable, pq: any, ui: any) {
//   try {
//     const active = ui.rowData[ui.dataIndx]
//     let badge = 'success'
//     let title = 'Active'

//     if (!active) {
//       badge = 'danger'
//       title = 'Disabled'
//     }

//     if (!ui.column.postRender) {
//       return `<a type='button' style="padding: 5px"><span class="v-badge v-badge--inline v-badge__wrapper v-badge__badge badge badge-${badge}" title="${title}">${title}</span></a>`
//     } else {
//       return `<a type='button' style="padding: 5px" class='btnChangeYesOrNo' data-toggle="tooltip" data-placement="top" title="Click to toggle status"><span class="v-badge v-badge--inline v-badge__wrapper v-badge__badge badge badge-${badge}">${title}</span></a>`
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

function evalThresholds(data, thresholds, field, callback) {
	const column = data[field]
	const threshold = thresholds[field]

	if (!threshold) {
		return false
	}

	Object.keys(threshold).map((key) => {
		const operator = operatorTokens[threshold[key].operator]

		try {
			// eslint-disable-next-line no-eval
			const validationOperator = eval(`${column} ${operator} ${threshold[key].value}`)

			if (typeof callback === 'function' && validationOperator) {
				callback(data, threshold[key], field)
			}
		} catch (error) {
			return false
		}
	})
}

function goldStarStatus(params: any, widget: any) {
	if (widget.params?.thresholds) {
		let goldStartCount = 0

		Object.keys(params.data).forEach((column: any) => {
			let green = false

			evalThresholds(
				params.data,
				widget.params?.thresholds,
				column,
				(data: any, threshold: any, field: any) => {
					return (green = true)
				}
			)
			if (green) {
				goldStartCount++
			}
		})

		return goldStartCount
	} else {
		return ''
	}
}
