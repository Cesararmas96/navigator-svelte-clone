/* eslint-disable @typescript-eslint/no-explicit-any */
export enum AlertType {
	INFO = 'info',
	ERROR = 'error',
	WARNING = 'warning',
	SUCCESS = 'success'
}

export interface AlertMessage {
	id?: string
	type: AlertType
	title: string
	message?: string
	dashboardId?: string
	callbackBtn?: string
	callback?: string
	callback1Btn?: string
	props?: Record<string, any>
	callback1?: () => void
	callback2Btn?: string
	callback2?: () => void
}
