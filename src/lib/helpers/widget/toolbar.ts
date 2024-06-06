import { getApiData } from '$lib/services/getData'
import { sendSuccessNotification } from '$lib/stores/toast'
import html2canvas from 'html2canvas'

const urlBase = import.meta.env.VITE_API_URL

export const pin = async (status: boolean, widgetId: string, userId: string): Promise<boolean> => {
	const endpoint = `${urlBase}/api/v1/interactions/pin`
	status = !status

	const method = !status ? 'DELETE' : 'PUT'
	console.log('method', method)
	await getApiData(endpoint, method, {
		widget_id: widgetId,
		user_id: userId
	})
	return status
}

export const screenshot = async (widgetId: string, title: string) => {
	sendSuccessNotification('Generating the screenshot, please wait...')
	setTimeout(async () => {
		const mainContent = document.getElementById(`widget-${widgetId}`)!

		mainContent.querySelector(`#widget-toolbar-${widgetId}`)!.classList.add('hidden')
		const spinner = mainContent.querySelector(`#spinner`)
		if (spinner) spinner.classList.add('hidden')

		mainContent.querySelectorAll('.animate__animated').forEach((element) => {
			element.classList.remove('animate__animated')
		})
		mainContent.querySelectorAll('.widget-toolbar').forEach((element) => {
			element.classList.add('hidden')
		})

		const canvas = await html2canvas(mainContent)
		sendSuccessNotification('Preparing to download...')
		const link = document.createElement('a')
		link.href = canvas.toDataURL('image/png')
		link.download = `${title}.png`
		link.click()

		mainContent.querySelector(`#widget-toolbar-${widgetId}`)!.classList.remove('hidden')
	}, 700)
}

export const like = async (status: boolean, widgetId: string) => {
	status = !status
	const method = status ? 'PUT' : 'DELETE'
	const response = await getApiData(`${urlBase}/api/v1/interactions/likes`, method, {
		object_uuid: widgetId,
		object_type: 'widget'
	})
	console.log(response)
	return status
}
