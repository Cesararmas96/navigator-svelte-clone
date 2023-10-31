import type { Writable } from 'svelte/store'
import { getApiData } from '$lib/services/getData'
import { merge } from 'lodash-es'
import { sendSuccessNotification } from '$lib/stores/toast'

const urlBase = import.meta.env.VITE_API_URL

export const saveWidgetSettings = (widgetSettings: Writable<unknown>, payload) => {
	widgetSettings.update((widget) => {
		const widgetBD = merge({}, widget, payload, { saved: true })

		updateChangesBD(widgetBD)
		sendSuccessNotification('Updated widget')

		return widgetBD
	})
}

async function updateChangesBD(widgetSettings) {
	const response = await getApiData(
		`${urlBase}/api/v2/widgets/${widgetSettings.widget_id}`,
		'POST',
		widgetSettings
	)

	if (response) {
		console.log(response)
	}
}
