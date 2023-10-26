import type { GridParams } from "svelte-grid-extended/types"
import { generateUID } from "../common/common"
import { sl } from "date-fns/locale"

const rowHeight = 12
const minRowHeight = 14

export const loadV2Locations = (widgetLocation: Record<string, any>, _dashboard: any, _widgets: any[], cols: number, isMobile: boolean) => {
  console.log('loadV2Locations')
  let widgets: any[] = []
  let x: number = 0
  let y: number = 0

  if (widgetLocation) {
    const locations = _dashboard.attributes.cols.split(',') || [_dashboard.attributes.cols]
    Object.keys(widgetLocation).forEach(function callback(value: any, index: number) {
      Object.entries(widgetLocation[value]).map(([key, item]: [string, any]) => {
        const data = _widgets.find((item) => item.widget_id === key) || {}
        const slug = data.widget_slug
        data.resize_on_load = true
        let w = !isMobile ? parseInt(locations[index]) * (cols / 12) : cols
        w = Number(w)? w : cols
        if (w + x > cols) {
          x = 0
          y += minRowHeight
        }
        widgets.push({ slug, x, y, w, h: minRowHeight, data })
        x += w
      })
    })
  } else {
    const data = _widgets[0]
    widgets.push({ slug: data.widget_slug, x: 0, y: 0, w: cols, h: minRowHeight, data })
  }
  return widgets
}

export const loadV3Locations = (widgetLocation: Record<string, any>, _widgets: any[], cols: number, isMobile: boolean) => {
  console.log('loadV3Locations')
  if (!widgetLocation || Object.keys(widgetLocation).length === 0) {
    let row = 0
    widgetLocation = {};
    _widgets.forEach((widget: any) => {
      widget.resize_on_load = true
      widgetLocation[widget.widget_slug] = { x: 0, y: row, w: cols, h: minRowHeight };
      row += minRowHeight;
    });
  }

  if (isMobile) {
    let y = 0
    return Object.entries(widgetLocation)
  		.map(([key, item]: [string, any]) => {
        const data = _widgets.find((i) => i.widget_slug === key) || {}
        return { slug: key, x: 0, w: cols, h: item.h, y: ++y, data }
      })
  } else {
    return Object.entries(widgetLocation)
      .map(([key, item]: [string, any]) => {
        const data = _widgets.find((item) => item.widget_slug === key) || {}
        return { slug: key, ...item, data }
      })
  }
  // _dashboard.attributes.explorer = 'v3' 
}

export const loadLocalStoredLocations = (_dashboard: any, _widgets: any[], isMobile) => {
  console.log('loadLocalStoredLocations')
  const grid = localStorage.getItem('grid')
  if (!grid) return []

  let y = 0
  const gridData = JSON.parse(grid)
  const dashboardGrid = gridData.widget_location[_dashboard.dashboard_id]
  if (dashboardGrid) {
    return Object.entries(dashboardGrid).sort(([keyA, itemA], [keyB, itemB]) => {
      if ((itemA as any).x < (itemB as any).x) return -1;
      if ((itemA as any).x > (itemB as any).x) return 1;
      if ((itemA as any).y < (itemB as any).y) return -1;
      if ((itemA as any).y > (itemB as any).y) return 1;
      return 0;
    }).map(([key, item]: [string, any]) => {
      const data = _widgets.find((item) => item.widget_slug === key) || {}

      if (isMobile) {
        data.resize_on_load = true
        const ret = { slug: key, x: 0, w: 12, h: item.h, y, data }
        y = y + item.h
        return ret
      }
      return { slug: key, ...item, data }
    })
  }
}

export const saveLocations = (dashboard: any, gridItems: any[], gridParams: GridParams) => {
  console.log('saveLocations')
  const items = Object.entries(gridParams.items).reduce((acc, [key, item]) => {
    const gridItem = gridItems.find((i) => i.slug === key)
    if (gridItem) {
      gridItem.x = item.x
      gridItem.y = item.y
      gridItem.w = item.w
      gridItem.h = item.h
    }
    acc[key] = { x: item.x, y: item.y, w: item.w, h: item.h };
    return acc;
  }, {});

  const grid = localStorage.getItem('grid')
  if (grid) {
    const gridData = JSON.parse(grid)
    if (gridData.widget_location[dashboard.dashboard_id]) {
      gridData.widget_location[dashboard.dashboard_id] = items
    } else {
      gridData.widget_location = { ...gridData.widget_location, [dashboard.dashboard_id]: items }
    }
    localStorage.setItem('grid', JSON.stringify(gridData))
  } else { 
    localStorage.setItem('grid', JSON.stringify({
      "widget_location": {
        [dashboard.dashboard_id]: items
      }
    }))
  }

}

export const syncGridItems = (items: any[], gridParams: GridParams) => {
  console.log('syncGridItems')
  items.map((item) => {
    item.y = gridParams.items[item.slug].y
    item.h = gridParams.items[item.slug].h
    item.w = gridParams.items[item.slug].w
    item.x = gridParams.items[item.slug].x
  });
}

export const reloadLocations = (widgetLocation: Record<string, any>, gridParams: GridParams, isMobile: boolean) => {
  console.log('reloadLocations')
  let y = 0
  // gridParams.itemSize = {height: 10, width: 300}
  // gridParams.cols = 1
  gridParams.updateGrid()
  if (!isMobile) {
    return Object.entries(widgetLocation)
  		.map(([key, item]: [string, any]) => {
        gridParams.items[key].y = item.y
        gridParams.items[key].h = item.h
        gridParams.items[key].w = item.w
        gridParams.items[key].x = item.x
        return gridParams.items[key]
      })
  } else {
    return Object.entries(gridParams.items)
      .map(([key, item]: [string, any]) => {
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
    .filter((i) => i.data.parent?.widget_slug === item.slug)
    .sort((a, b) => a.data.parent.order - b.data.parent.order)

  const lastCloned =
    clones.length > 0
      ? clones.reduce((accumulator, current) => {
          return accumulator.data.parent?.widget_slug > current.data.parent?.widget_slug ? accumulator : current
        })
      : null

  const w = item.w
  const h = item.h
  const x = item.x
  const y = lastCloned ? lastCloned.y + lastCloned.h : item.y + item.h

  const widget = structuredClone(item.data)

  widget.widget_id = `widget-clone-${generateUID()}`
  widget.parent = { widget_slug: item.widget_slug, order: clones.length }
  widget.title = widget.title + ' Copy' + (clones ? ` (${clones.length + 1})` : '')
  widget.widget_slug = `${widget.widget_slug}-clone${clones ? clones.length + 1 : ''}`
  widget.master_filtering = true
  widget.cloned = true
  delete widget.clone
  delete widget.temp
  delete widget.instance_loaded
  delete widget.loaded
  delete widget.fetch
  const newItem = { slug: widget.widget_slug, x, y, w, h, data: { ...widget } }

  if (!haveSpaceAvailable(newItem, items)) items = insertLineInGrid(lastCloned ? lastCloned : item, items)

  return newItem
}

export const pasteItem = (item: any, items: any[]) => {
  const widget = {...item.data}

  const w = item.w
  const h = item.h
  const x = item.x
  const y = item.y


  widget.widget_id = `widget-ccp-${generateUID()}`
  widget.title = widget.title + ' - Copy'
  widget.widget_slug = `${widget.widget_slug}-copy`
  widget.master_filtering = true
  delete widget.clone
  delete widget.temp
  delete widget.instance_loaded
  delete widget.loaded
  delete widget.fetch
  const newItem = { slug: widget.widget_slug, x, y, w, h, data: { ...widget } }
  return [...items, newItem]
}

export const resizeItem = (item: any, items: any[]) => {
  const header = document.getElementById(`widget-header-${item.data.widget_id}`)?.clientHeight || 0
  const content = document.getElementById(`widget-main-content-${item.data.widget_id}`)?.clientHeight || 0
  // const widgetInstances =
  //   document.getElementById(`widget-instances-${item.uid}`)?.clientHeight || 0
  const height = header + content //+ widgetInstances
  const prevousHeight = maxHeight(item.y, items)
  item.h = Math.ceil(height / rowHeight)
  return reorderAfterResize(item, prevousHeight, items)
}

export const removeItem = (item: any, items: any[], gridParams: GridParams) => {  
  if (item.data.parent) items = reorderLines(item, items, gridParams)
  items = items.filter((gridItem) => gridItem.slug !== item.slug)
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
  return Math.max(...items.filter((i) => i.y === yPos).map((i) => i.h))
}

const reorderAfterResize = (item: any, prevousHeight: number, items: any[]) => {
  const height = maxHeight(item.y, items) - prevousHeight
  items.map((i) => {
    if (i.y > item.y) i.y += height
    return i
  })
  return [...items]
}

export const reorderLines = (item: any, items: any[], gridParams: GridParams) => {
  const height = maxHeight(item.y, items)
  return reorderAfterResize(item, 0, items)
}

export const addNewItem = (item, gridController: any) => {
  const w = item.w
  const h = item.h
  return gridController.getFirstAvailablePosition(w, h)
}