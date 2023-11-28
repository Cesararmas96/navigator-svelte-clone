import type { OptColumn, OptGrid } from 'tui-grid/types/options'
import type { AlignType } from 'tui-grid/types/store/column'
import { capitalizeWord } from '../common/common'
import { CustomRowRenderer } from '$lib/components/widgets/type/ApiTable/CustomRowRenderer'
import { CustomHeaderRenderer } from '$lib/components/widgets/type/ApiTable/CustomHeaderRenderer'

export const loadGridOptions = (widget: any, data: any[]): OptGrid => {
  const columnsDef = generateColumnDefsByData(widget, true)
  let gridOptions: OptGrid = {
    el: document.getElementById(`grid-${widget.widget_id}`)!,
    data: data,
    scrollX: false,
    scrollY: false,
    keyColumnName: 'rowKey',
    selectionUnit: 'row',
    columns: columnsDef.columns,
    rowHeight: 25,
    minRowHeight: 25,
    columnOptions: {
      resizable: true
    },
    header: {
      height: 32,
      // complexColumns: columnsDef.headers
    },
  }

  if (widget.params?.table?.roll_up?.total_col) {
    const rollUp = widget.params.table.roll_up

    const columnContent = {
      [rollUp.total_col]: {
        template: function (valueMap) {
          return `<div class='px-2 font-semibold'>TOTAL:</div>`
        }
      }
    }
    rollUp.sum.map((field) => {
      columnContent[field] = {
        template: function (valueMap) {
          return `<div class='px-2 text-right font-semibold'>${valueMap.sum}</div>`
        }
      }
    })
    gridOptions['summary'] = {
      height: 32,
      position: 'bottom', // or 'top'
      columnContent: columnContent
    }
  }
  console.log(widget, gridOptions)
  return gridOptions
}

export const generateColumnDefsByData = (widget: any, simpleTable: boolean) => {
  const data = widget.data && widget.data.length > 0 ? widget.data[0] : {}
  const definitions = widget.format_definition || {}
  const columns: any[] = []
  const headers: any[] = []

  Object.entries(data).map(([key, value]: [string, any], idx: number) => {
    if (Object.keys(definitions).map((key: string) => key).includes(key)) return
    const align = alignCellSimpleTable(definitions, idx, value)
    const headerName = capitalizeWord(key).replace('_', ' ')
    const columnDef: OptColumn = {
      header: headerName,
      name: key,
      resizable: true,
      align: align,
      hidden: Array.isArray(value) || typeof value === 'object',
      renderer: {
        type: CustomRowRenderer,
        options: {
          definitions,
          idx
        }
      }
    }
    const complexColumn = {
      renderer: CustomHeaderRenderer
    }
    columns.push(columnDef)
    headers.push(complexColumn)
  })
  return {columns, headers}
}

export const alignCellSimpleTable = (formatDefinition: any, idx: number, value: any): AlignType => {
  let align: 'left' | 'center' | 'right' = 'left'
  if (typeof value !== 'string')
    align = 'right'
  if (
    formatDefinition &&
    formatDefinition['fnFormatNumberInteger'] &&
    formatDefinition['fnFormatNumberInteger'].includes(idx)
  )
    align = 'right'
  if (
    formatDefinition &&
    formatDefinition['fnFormatPercent'] &&
    formatDefinition['fnFormatPercent'].includes(idx)
  )
    align = 'right'
  return align
}

export const creaHeaderSimpleTable = (headreName: string, align: string): HTMLElement => {
  const el = document.createElement('div')
  el.classList.add('py-2')
  el.classList.add(`text-${align}`)
  el.innerHTML = headreName
  return el
}