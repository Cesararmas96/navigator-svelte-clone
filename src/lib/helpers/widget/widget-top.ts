import { setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

type WidgetTop = {
  component: string,
  props: Record<string, any>
}

export const initWidgetTop = (): Writable<any> => {
  const widgetTop = writable(null)
  setContext('WidgetTop', widgetTop)
  return widgetTop
}

export const setWidgetTop = (widgetTop: Writable<any>, component: string, props: Record<string, any>) => {
	const newTopConfig = { component, props}
	widgetTop.update((m) => (m = newTopConfig))
}

