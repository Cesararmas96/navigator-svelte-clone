import { setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

type WidgetBottom = {
	component: string
	props: Record<string, any>
}

export const initWidgetBottom = (): Writable<WidgetBottom[]> => {
	const widgetBottom = writable([])
	setContext('WidgetBottom', widgetBottom)
	return widgetBottom
}

export const setWidgetBottom = (
	widgetBottom: Writable<WidgetBottom[]>,
	component: string,
	props: Record<string, any>
) => {
	const newBottomConfig = { component, props }
	widgetBottom.update((m: WidgetBottom[]) => {
		m = m.filter((item) => item.component !== component)
		m.push(newBottomConfig)
		return m
	})
}
