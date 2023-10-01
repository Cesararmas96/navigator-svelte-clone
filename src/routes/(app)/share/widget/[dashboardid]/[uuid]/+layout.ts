import { getApiData } from "$lib/services/getData"

export const load = async ({ params, url }) => {
  const urlBase = import.meta.env.VITE_API_URL
  try {
    const token = url.searchParams.get('token')
    const headers = token ? { authorization: `Bearer ${token}` } : {}
    const widgets = await getApiData(`${urlBase}/api/v2/widgets?dashboard_id=${params.dashboardid}`, 'GET', {}, {}, headers)
    const widget = widgets.find((item: any) => item.uid === params.uuid);
    return { widget }
  } catch (error) {
    throw new Error(`Request error: ${error}`)
  }
}