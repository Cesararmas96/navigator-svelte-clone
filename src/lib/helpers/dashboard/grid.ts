/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridParams } from 'svelte-grid-extended/types'
import { generateUID } from '../common/common'
import { collapse } from '../common/collapse'

const rowHeight = 12
const minRowHeight = 14

export const loadV2Locations = (
	widgetLocation: Record<string, any>,
	_dashboard: any,
	_widgets: any[],
	cols: number,
	isMobile: boolean
) => {
	const widgets: any[] = []
	let x: number = 0
	let y: number = 0

	if (widgetLocation) {
		const locations = _dashboard.attributes.cols.split(',') || [_dashboard.attributes.cols]
		Object.keys(widgetLocation).forEach(function callback(value: any, index: number) {
			Object.entries(widgetLocation[value]).map(([key, item]: [string, any]) => {
				const data = _widgets.find((item) => item.widget_id === key) || {}
				const title = data.title
				data.resize_on_load = true
				let w = !isMobile ? parseInt(locations[index]) * (cols / 12) : cols
				w = Number(w) ? w : cols
				if (w + x > cols) {
					x = 0
					y += minRowHeight
				}
				widgets.push({ title, x, y, w, h: minRowHeight, data })
				x += w
			})
		})
	} else {
		const data = _widgets[0]
		widgets.push({ title: data.title, x: 0, y: 0, w: cols, h: minRowHeight, data })
	}
	return widgets
}

export const loadV3Locations = (
	widgetLocation: Record<string, any>,
	_widgets: any[],
	cols: number,
	isMobile: boolean
) => {
	if (!widgetLocation || Object.keys(widgetLocation).length === 0) {
		let row = 0
		widgetLocation = {}
		return _widgets.map((widget: any) => {
			widget.resize_on_load = true
			widgetLocation[widget.title] = {
				title: widget.title,
				x: 0,
				y: row,
				w: cols,
				h: minRowHeight,
				data: widget
			}
			row += minRowHeight
			return { ...widgetLocation[widget.title] }
		})
	}

	// if (isMobile) {
	// 	let y = 0
	// 	return Object.entries(widgetLocation).map(([key, item]: [string, any]) => {
	// 		const data = _widgets.find((i) => i.title === key || i.widget_slug === key) || {}
	// 		return { title: data.title, x: 0, w: cols, h: item.h, y: ++y, data }
	// 	})
	// } else {
	return Object.entries(widgetLocation)
		.map(([key, item]: [string, any]) => {
			const data = _widgets.find((item) => item.title === key || item.widget_slug === key) || null
			if (!data) return null
			return { title: data.title, ...item, data }
		})
		.filter((item) => item !== null)
	// }
}

export const loadLocalStoredLocations = (
	_dashboard: any,
	_widgets: any[],
	isMobile,
	dbTimestamp: number
) => {
	const grid = localStorage.getItem('grid')
	if (!grid) return []

	const y = 0
	const gridData = JSON.parse(grid)
	const dashboardGrid = gridData.widget_location[_dashboard.dashboard_id]
	if (dashboardGrid) {
		const timestamp = dashboardGrid?.timestamp || 0
		if (timestamp < dbTimestamp) return []
		return Object.entries(dashboardGrid)
			.sort(([keyA, itemA], [keyB, itemB]) => {
				if ((itemA as any).x < (itemB as any).x) return -1
				if ((itemA as any).x > (itemB as any).x) return 1
				if ((itemA as any).y < (itemB as any).y) return -1
				if ((itemA as any).y > (itemB as any).y) return 1
				return 0
			})
			.map(([key, item]: [string, any]) => {
				if (key === 'timestamp') return null
				const data = _widgets.find((item) => item.title === key) || {}
				return { title: key, ...item, data }
			})
			.filter((item) => item !== null)
	}
}

export const getControllerItemsLocations = (gridItems: any[], gridParams: GridParams) => {
	return Object.entries(gridParams.items).reduce((acc, [key, item]) => {
		const gridItem = gridItems.find((i) => i.title === key)
		if (gridItem) {
			gridItem.x = item.x
			gridItem.y = item.y
			gridItem.w = item.w
			gridItem.h = item.h
		}
		acc[key] = { x: item.x, y: item.y, w: item.w, h: item.h }
		return acc
	}, {})

	// return Object.entries(gridParams.items).reduce((acc, [key, item]) => {
	// 	acc[key] = { x: item.x, y: item.y, w: item.w, h: item.h }
	// 	return acc
	// }, {})
}

export const saveLocalStorageLocations = (
	dashboard: any,
	gridItems: any[],
	gridParams: GridParams
) => {
	const deletedItems: string[] = []
	const items = Object.entries(gridParams.items).reduce((acc, [key, item]) => {
		const gridItem = gridItems.find((i) => i.title === key)
		if (gridItem) {
			gridItem.x = item.x
			gridItem.y = item.y
			gridItem.w = item.w
			gridItem.h = item.h
		} else {
			deletedItems.push(key)
		}
		acc[key] = { x: item.x, y: item.y, w: item.w, h: item.h }
		return acc
	}, {})
	// dashboard.widget_location = items

	if (deletedItems.length > 0) {
		deletedItems.forEach((key) => {
			delete gridParams.items[key]
		})
	}

	const grid = localStorage.getItem('grid')
	if (grid) {
		const gridData = JSON.parse(grid)
		if (gridData.widget_location[dashboard.dashboard_id]) {
			gridData.widget_location[dashboard.dashboard_id] = {
				...items,
				timestamp: new Date().getTime()
			}
		} else {
			gridData.widget_location = {
				...gridData.widget_location,
				[dashboard.dashboard_id]: { ...items, timestamp: new Date().getTime() }
			}
		}
		localStorage.setItem('grid', JSON.stringify(gridData))
	} else {
		localStorage.setItem(
			'grid',
			JSON.stringify({
				widget_location: {
					[dashboard.dashboard_id]: { ...items, timestamp: new Date().getTime() }
				}
			})
		)
	}
}

export const removeWidgetLocalstore = (dashboardId: string, widgetId: string) => {
	const grid = localStorage.getItem('grid')
	if (!grid) return
	const gridData = JSON.parse(grid)
	if (gridData.widget_location[dashboardId] && gridData.widget_location[dashboardId][widgetId]) {
		delete gridData.widget_location[dashboardId][widgetId]
		localStorage.setItem('grid', JSON.stringify(gridData))
	}
}

export const syncGridItemsToItems = (items: any[], gridParams: GridParams) => {
	items.map((item) => {
		item.y = gridParams.items[item.title].y
		item.h = gridParams.items[item.title].h
		item.w = gridParams.items[item.title].w
		item.x = gridParams.items[item.title].x
	})
}

export const syncItemsToGridItems = (items: any[], gridParams: GridParams) => {
	items.forEach((item) => {
		gridParams.items[item.title].y = item.y
		gridParams.items[item.title].h = item.h
		gridParams.items[item.title].w = item.w
		gridParams.items[item.title].x = item.x
	})
}

export const reloadLocations = (
	widgetLocation: Record<string, any>,
	gridParams: GridParams,
	isMobile: boolean
) => {
	let y = 0
	// gridParams.itemSize = {height: 10, width: 300}
	// gridParams.cols = 1
	gridParams.updateGrid()
	if (!isMobile) {
		return Object.entries(widgetLocation).map(([key, item]: [string, any]) => {
			gridParams.items[key].y = item.y
			gridParams.items[key].h = item.h
			gridParams.items[key].w = item.w
			gridParams.items[key].x = item.x
			return gridParams.items[key]
		})
	} else {
		return Object.entries(gridParams.items).map(([key, item]: [string, any]) => {
			gridParams.items[key].y = y
			gridParams.items[key].h = item.h
			gridParams.items[key].w = 12
			gridParams.items[key].x = 0
			y = y + item.h
			return gridParams.items[key]
		})
	}
}

export const cloneItem = (item: any, items: any[]) => {
	const clones = items
		.filter((i) => i.data.parent?.widget_id === item.data.widget_id)
		.sort((a, b) => a.data.parent.order - b.data.parent.order)

	const lastCloned =
		clones.length > 0
			? clones.reduce((accumulator, current) => {
					return accumulator.data.parent?.widget_id > current.data.parent?.widget_id
						? accumulator
						: current
			  })
			: null

	const w = item.w
	const h = item.h
	const x = item.x
	const y = lastCloned ? lastCloned.y + lastCloned.h : item.y + item.h

	const widget = structuredClone(item.data)

	widget.widget_id = `widget-clone-${generateUID()}`
	widget.parent = { widget_id: item.data.widget_id, order: clones.length }
	widget.title = widget.title + ' Copy' + (clones ? ` (${clones.length + 1})` : '')
	widget.widget_slug = `${item.data.widget_id}-clone${clones ? clones.length + 1 : ''}`
	widget.master_filtering = true
	widget.cloned = true
	delete widget.clone
	delete widget.temp
	delete widget.instance_loaded
	delete widget.loaded
	delete widget.fetch
	const newItem = { title: widget.title, x, y, w, h, data: { ...widget } }

	if (!haveSpaceAvailable(newItem, items))
		items = insertLineInGrid(lastCloned ? lastCloned : item, items)

	return newItem
}

export const pasteItem = (item: any, items: any[]) => {
	const widget = { ...item.data }

	const w = item.w
	const h = item.h
	const x = item.x
	const y = item.y

	// widget.widget_id = `widget-ccp-${generateUID()}`
	// widget.title = `${widget.title}-copy`
	widget.master_filtering = true
	delete widget.clone
	delete widget.temp
	delete widget.instance_loaded
	delete widget.loaded
	delete widget.fetch
	const newItem = { title: widget.title, x, y, w, h, data: { ...widget } }
	return [...items, newItem]
}

export const resizeItem = (item: any, items: any[]) => {
	const header = document.getElementById(`widget-header-${item.data.widget_id}`)?.clientHeight || 0
	const content = document.getElementById(`widget-main-${item.data.widget_id}`)?.clientHeight || 0
	const widgetInstances =
		document.getElementById(`widget-instances-${item.data.widget_id}`)?.clientHeight || 0
	const height = header + content + widgetInstances
	const prevousHeight = maxHeight(item.y, items)
	if (item.data?.instances?.length > 0) {
		item._h = item.h
		item.h = Math.ceil(height / (rowHeight + 1))
	} else {
		if (!item._h) {
			item.h = Math.ceil(height / (rowHeight + 1))
		} else {
			item.h = item._h
			delete item._h
		}
	}
	return reorderAfterResize(item, prevousHeight, items)
}

export const resizeCollapseItem = (item: any, items: any[], collapse: boolean) => {
	const header = document.getElementById(`widget-header-${item.data.widget_id}`)?.clientHeight || 0
	const content = document.getElementById(`widget-main-${item.data.widget_id}`)?.clientHeight || 0
	const widgetInstances =
		document.getElementById(`widget-instances-${item.data.widget_id}`)?.clientHeight || 0
	const height = header + content + widgetInstances
	item.data.collapse = collapse
	if (collapse) {
		item._h = item.h
		item.h = Math.ceil(height / (rowHeight + 1))
	} else {
		item.h = item._h
		delete item._h
	}
	return reorderAfterCollapse(item, items, collapse)
}

const reorderAfterCollapse = (item: any, items: any[], collapse: boolean) => {
	const temp = structuredClone(items)
	const posY = item.y //collapse ? item._y || item.y : item.y
	const height = item.h - (item._h || 3) //maxHeight(item.y, items) - prevousHeight
	const cordsFreeToMove = [
		{
			y: posY,
			items: items
				.filter((i) => i.title === item.title) //i.y === posY && i.data.collapse)
				.map((i) => {
					return { x: i.x, w: i.w }
				})
		}
	]
	let blockedCords: { x: number; w: number }
	temp
		.sort((a, b) => a.y - b.y)
		.map((i) => {
			const iPosY = i.y //collapse ? i._y || i.y : i.y
			if (iPosY > posY) {
				if (!cordsFreeToMove.some((cords) => cords.y === iPosY))
					cordsFreeToMove.push({ y: iPosY, items: [] })

				const freeToMove = cordsFreeToMove
					.sort((a, b) => b.y - a.y)
					.find((cords) => cords.y < iPosY)

				const freeToMoveMerged = mergePositioningBlocks(freeToMove!.items) // Merge spaces collapsed

				const isItemInsideOfCollapsedItems = itemIsInsideOfCollapsedItems(i, freeToMoveMerged)
				const inItemInsideOfBlockedCords = blockedCords
					? itemIsInsideOfCollapsedItem(i, blockedCords)
					: false

				if (inItemInsideOfBlockedCords && collapse) {
					cordsFreeToMove.find((cords) => cords.y === iPosY)!.items = [...freeToMoveMerged]
				} else if (isItemInsideOfCollapsedItems && collapse) {
					// Enter here if item is inside of collapsed widget
					const tempItem = items.find((item) => item.title === i.title)
					if (!tempItem!._y) tempItem!._y = tempItem!.y
					tempItem!.y = (tempItem.data.collapse ? tempItem!._y : tempItem!.y) + height
					cordsFreeToMove.find((cords) => cords.y === iPosY)!.items.push({ x: i.x, w: i.w })
				} else if (!isItemInsideOfCollapsedItems && collapse) {
					// Enter here if item is inside of expanded widget
					cordsFreeToMove.find((cords) => cords.y === iPosY)!.items = [...freeToMoveMerged]
					blockedCords = !blockedCords
						? { x: i.x, w: i.w }
						: mergePositioningBlocks([{ ...blockedCords }, { x: i.x, w: i.w }])[0]
				} else if (isItemInsideOfCollapsedItems && !collapse && i._y) {
					// Enter here if item is inside of expanded widget
					const tempItem = items.find((item) => item.title === i.title)
					tempItem!.y += height
					cordsFreeToMove.find((cords) => cords.y === iPosY)!.items = [...freeToMoveMerged]
				} else if (freeToMoveMerged.length === 0) {
					const tempItem = items.find((item) => item.title === i.title)
					if (tempItem!._y) tempItem!.y = tempItem!._y
					delete tempItem!._y
				}
			}
			return i
		})

	return [...items]
}

export const removeItem = (item: any, items: any[], gridParams: GridParams) => {
	items = items.filter((gridItem) => gridItem.title !== item.title)
	if (item.data.parent) items = reorderAfterDelete(item, items)
	return items
}

const isOverlapped = (a: any, b: any): boolean => {
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

const haveSpaceAvailable = (item: any, items: any[]): boolean => {
	for (const _item of items) {
		if (isOverlapped(_item, item)) {
			return false
		}
	}
	return true
}

const insertLineInGrid = (item: any, items: any[]) => {
	items.map((i) => {
		if (i.y >= item.y + item.h) {
			i.y += item.h
		}
		return i
	})
	return [...items]
}

const maxHeight = (yPos: number, items: any[]) => {
	const max = Math.max(...items.filter((i) => i.y === yPos).map((i) => i.h))
	return max === -Infinity ? 0 : max
}

const itemIsInsideOfCollapsedItems = (item: any, items: any[]) => {
	for (const i of items) {
		if (itemIsInsideOfCollapsedItem(item, i)) {
			return true
		}
	}
	return false
}

const itemIsInsideOfCollapsedItem = (childItem: any, fatherItem: any) => {
	const fatherX = fatherItem.x
	const fatherW = fatherItem.x + fatherItem.w
	const childX = childItem.x
	const childW = childItem.x + childItem.w
	return (
		// (fatherX > childX && fatherX < childW && fatherW >= childW) ||
		// (fatherX <= childX && fatherW < childW && fatherW > childX) ||
		fatherX <= childX && fatherW >= childW //||
		// (fatherX > childX && fatherW < childW)
	)
}

function mergePositioningBlocks(positions: any[]) {
	if (!Array.isArray(positions) || positions.length === 0) {
		return []
	}

	positions.sort((a, b) => a.x - b.x)

	const mergedBlocks: any[] = []
	let currentBlock = { ...positions[0] }

	for (let i = 1; i < positions.length; i++) {
		const currentPosition = positions[i]

		if (currentBlock.x + currentBlock.w >= currentPosition.x) {
			currentBlock.w =
				Math.max(currentBlock.x + currentBlock.w, currentPosition.x + currentPosition.w) -
				currentBlock.x
		} else {
			mergedBlocks.push({ ...currentBlock })
			currentBlock = { ...currentPosition }
		}
	}

	mergedBlocks.push({ ...currentBlock })

	return mergedBlocks
}

const reorderAfterResize = (item: any, prevousHeight: number, items: any[]) => {
	const height = maxHeight(item.y, items) - prevousHeight
	let existInLine: boolean = false
	items.map((i) => {
		if (i.y > item.y) {
			if (existInLine || (item.x >= i.x && item.x <= i.w - 1)) {
				existInLine = true
				i.y += height
			}
		}
		return i
	})
	return [...items]
}

const reorderAfterDelete = (item: any, items: any[]) => {
	let existInLine: boolean = false
	items = items.sort((a, b) => a.y - b.y)
	items.map((i) => {
		if (i.y === item.y) existInLine = true
		if (!existInLine && i.y > item.y) i.y = i.y - item.h
		return i
	})
	return [...items]
}

export const reorderLines = (item: any, items: any[], gridParams: GridParams) => {
	const height = maxHeight(item.y, items)
	return reorderAfterDelete(item, items)
}

export const addNewItem = (item, gridController: any) => {
	const w = item.w
	const h = item.h
	return gridController ? gridController.getFirstAvailablePosition(w, h) : { x: 0, y: 0 }
}
