import { getApiData } from "$lib/services/getData"
import { sendSuccessNotification } from "$lib/stores/toast"
import html2canvas from "html2canvas"

const urlBase = import.meta.env.VITE_API_URL

export const togglePin = async (status: boolean, widgetId: string, userId: string) : Promise<boolean> => {
  const endpoint = `${urlBase}/api/v1/interactions/pin`
  status = !status
  try {
    const method = !status ? 'DELETE' : 'PUT'
    await getApiData(endpoint, method, {
      widget_id: widgetId,
      user_id: userId
    })
    return status
  } catch (error: any) {
    throw error
  }
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
  }, 700)
}