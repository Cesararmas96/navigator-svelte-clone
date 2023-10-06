import { generateUID } from "../common/common"

const rowHeight = 12
const minRowHeight = 14

export const loadV2Locations = (_dashboard: any, _widgets: any[], cols: number, isMobile: boolean) => {
  let widgets: any[] = []
  let x: number = 0
  let y: number = 0
  if (_dashboard.widget_location) {
    const locations = _dashboard.attributes.cols.split(',') || [_dashboard.attributes.cols]
    Object.keys(_dashboard.widget_location).forEach(function callback(value: any, index: number) {
      const uid = Object.keys(_dashboard.widget_location[value])[0]
      const data = _widgets.find((item) => item.uid === uid) || {}
      const w = parseInt(locations[index]) * (cols / 12)
      if (w + x > cols) {
        x = 0
        y += minRowHeight
      }
      widgets.push({ uid, x, y, w, h: minRowHeight, data })
      x += w
    })
  } else {
    const data = _widgets[0]
    widgets.push({ uid: data.uid, x: 0, y: 0, w: cols, h: minRowHeight, data })
  }
  return widgets
}

export const loadV3Locations = (_dashboard: any, _widgets: any[], cols: number, isMobile: boolean) => {
  if (!_dashboard.widget_location || Object.keys(_dashboard.widget_location).length === 0) {
    let row = 0
    _dashboard.widget_location = {};
    _widgets.forEach((widget: any) => {
        _dashboard.widget_location[widget.uid] = { x: 0, y: row, w: cols, h: minRowHeight };
        row += minRowHeight;
    });
  }

  // if (isMobile) {

  //   return Object.entries(_dashboard.widget_location)
  // 		.map(([key, col]: [string, any]) => {
  //       console.log(key, col)
  //     })

  //   // return _dashboard.widget_location.map((widget: any) => {
  //   //   const data = _widgets.find((item) => item.uid === widget.uid) || {}
  //   //   widget.x = 0
  //   //   widget.y = row
  //   //   widget.w = cols
  //   //   row += widget.h
  //   //   return { ...widget, ...data }
  //   // })
  // }
  const items = Object.entries(_dashboard.widget_location)
    .map(([key, item]: [string, any]) => {
      const data = _widgets.find((item) => item.uid === key) || {}
      return { uid: key, ...item, data }
    })
    _dashboard.attributes.explorer = 'v3'
  
  return items
}

export const cloneItem = (item: any, items: any[]) => {
  const clones = items
    .filter((i) => i.data.parent?.uid === item.uid)
    .sort((a, b) => a.data.parent.order - b.data.parent.order)

  const lastCloned =
    clones.length > 0
      ? clones.reduce((accumulator, current) => {
          return accumulator.data.parent?.uid > current.data.parent?.uid ? accumulator : current
        })
      : null

  const w = item.w
  const h = item.h
  const x = item.x
  const y = lastCloned ? lastCloned.y + lastCloned.h : item.y + item.h

  const widget = structuredClone(item.data)

  widget.id = `widget-clone-${generateUID()}`
  widget.uid = widget.id
  widget.parent = { uid: item.uid, order: clones.length }
  widget.title = widget.title + ' Copy' + (clones ? ` (${clones.length + 1})` : '')
  widget.master_filtering = true
  delete widget.clone
  delete widget.temp
  delete widget.instance_loaded
  delete widget.loaded
  delete widget.fetch
  const newItem = { uid: widget.uid, x, y, w, h, data: { ...widget } }

  if (!haveSpaceAvailable(newItem, items)) items = insertLineInGrid(lastCloned ? lastCloned : item, items)

  return [...items, newItem]
}

export const resizeItem = (item: any, items: any[]) => {
  const header = document.getElementById(`widget-header-${item.uid}`)?.clientHeight || 0
  const content = document.getElementById(`widget-main-content-${item.uid}`)?.clientHeight || 0
  const widgetInstances =
    document.getElementById(`widget-instances-${item.uid}`)?.clientHeight || 0
  const height = header + content + widgetInstances
  const prevousHeight = maxHeight(item.y, items)
  item.h = Math.ceil(height / rowHeight)
  return reorderAfterResize(item, prevousHeight, items)
}

export const removeItem = (item: any, items: any[]) => {  
  if (item.data.parent) items = reorderAfterDelete(item, items)
  items = items.filter((gridItem) => gridItem.uid !== item.uid)
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

const reorderAfterDelete = (item: any, items: any[]) => {
  const height = maxHeight(item.y, items)
  console.log(height)
  items.map((i) => {
    if (i.y > item.y) i.y -= height
    return i
  })
  return [...items]
}
// function addNewItem() {
//   const w = 4
//   const h = 4
//   const newPosition = gridController.getFirstAvailablePosition(w, h)
//   gridItems = newPosition
//     ? [...gridItems, { uid: generateUID(), x: newPosition.x, y: newPosition.y, w, h, data: {} }]
//     : gridItems
// }
