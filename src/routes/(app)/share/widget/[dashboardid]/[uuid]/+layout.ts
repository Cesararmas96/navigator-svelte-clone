import { getApiData } from "$lib/services/getData"

export const load = async ({ params, url }) => {
  const urlBase = import.meta.env.VITE_API_URL
  try {
    const token = url.searchParams.get('token')
    const headers = token ? { authorization: `Bearer ${token}` } : {}
    const widgets = await getApiData(`${urlBase}/api/v2/widgets?dashboard_id=${params.dashboardid}`, 'GET', {}, {}, headers)
    const widget = widgets.find((item: any) => item.uid === params.uuid);
    // http://nav-api.dev.local:5000/api/v2/widgets/f88ae5b7-2b03-44b0-b8db-bf85b63be0f1
    // const widget = await getApiData(`${urlBase}/api/v2/widgets/${params.uuid}`, 'GET', {}, {}, {})
    return { widget }
  } catch (error) {
    throw new Error(`Request error: ${error}`)
  }
}