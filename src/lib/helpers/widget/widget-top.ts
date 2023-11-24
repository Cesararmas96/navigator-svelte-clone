import { setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

type WidgetTop = {
  component: string,
  props: Record<string, any>
}

export const initWidgetTop = (): Writable<WidgetTop[]> => {
  const widgetTop = writable([])
  setContext('WidgetTop', widgetTop)
  return widgetTop
}

export const setWidgetTop = (widgetTop: Writable<WidgetTop[]>, component: string, props: Record<string, any>) => {
	const newTopConfig = { component, props}

	widgetTop.update((m: WidgetTop[]) => {
    m.push(newTopConfig)
    return m
  })
}

