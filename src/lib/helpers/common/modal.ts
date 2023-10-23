import { setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

export const modal = writable<any>(null);

export function initModal() {
	// modal = writable(null)
	setContext('modal', modal)
}

export const openExportDataModal = (modal: Writable<any>, _props: any) => {
	console.log('openExportDataModal', _props)
	const props = {
		title: 'Export Modal',
		..._props
	}
	const instanceConfig = { component: 'ExportData', props}
	modal.update((m) => (m = instanceConfig))
}

export const openModal = (title: string, component: string, _props: any) => {
	const props = {
		title,
		..._props
	}
	const instanceConfig = { component, props}
	modal.update((m) => (m = instanceConfig))
}


export const openConfirmModal = (
	props: {
		title?: string, 
		description: string,
		type: string, 
		confirmCallback: (props?: any) => void,
		confirmButtonText?: string,
		cancelButtonText?: string,
	}
) => {
	const instanceConfig = { component: 'Confirm', props }
	modal.update((m) => (m = instanceConfig))
}
