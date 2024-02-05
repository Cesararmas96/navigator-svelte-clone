import { ToastType, type Toast } from '$lib/interfaces/Toast'
import { writable } from 'svelte/store'

export const toasts = writable<Toast[]>([])

export const sendNotification = (toast: Toast) => {
	toast.dismissable = false
	toasts.update((all) => [{ ...toast }, ...all])
	if (toast.timeout) setTimeout(() => dismissNotification(toast.id), toast.timeout)
}

export const dismissNotification = (id: number) => {
	toasts.update((all) => all.filter((t: Toast) => t.id !== id))
}

const generateId = () => Math.floor(Math.random() * 10000)

export const sendSuccessNotification = (message: string, timeout = 3000) => {
	sendNotification({
		id: generateId(),
		type: ToastType.SUCCESS,
		message,
		timeout
	})
}

export const sendWarningNotification = (message: string, timeout = 3000) => {
	sendNotification({
		id: generateId(),
		type: ToastType.WARNING,
		message,
		timeout
	})
}

export const sendErrorNotification = (error: any, timeout = 3000) => {
	const message = error.message || error
	sendNotification({
		id: generateId(),
		type: ToastType.ERROR,
		message,
		timeout
	})
	console.error(error)
}

export const sendInfoNotification = (message: string, timeout = 3000) => {
	sendNotification({
		id: generateId(),
		type: ToastType.INFO,
		message,
		timeout
	})
}
