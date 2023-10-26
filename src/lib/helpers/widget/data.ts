import { setContext } from "svelte"
import { writable, type Writable } from 'svelte/store';

export const initWidgetData = (data?: any[]) => {
  const widgetData = writable(data ? data : null)
  setContext('widgetData', widgetData)
}

export const addWidgetData = (widgetData: Writable<any>, data: any) => {
  widgetData.update((d: any) => {
    d = data
    return d
  })
}
