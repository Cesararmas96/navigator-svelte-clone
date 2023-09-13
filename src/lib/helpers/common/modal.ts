import { setContext, getContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

export function initModal() {
	const modal = writable(null)

	setContext('modal', modal)
}

// export const openExportDataModal = () => {
// 	// context = writable({ title: 'Export Modal', component: 'ExportData' })
// 	// return context

// 	const modal = getContext<Writable<any>>('modal')

// 	modal.update(() => {
// 		return { title: 'Export Modal', component: 'ExportData' }
// 	})
// }

export const openExportDataModal = (modal: Writable<any>) => {
	const instanceConfig = { title: 'Export Modal', component: 'ExportData' }

	modal.update((m) => (m = instanceConfig))
}
