import { getApiData } from "$lib/services/getData"

export const load = async ({params, fetch}) => {
  const urlBase = import.meta.env.VITE_API_URL
  const modules = await getApiData(`${urlBase}/api/v2/modules?program_slug=${params.programs}`, 'GET') 
  const moduleName = (params.dashboard) ? params.dashboard : params.programs;
  const trocModule = modules.find((item: any) => item.module_slug === moduleName);
  const menu = modules.filter((item: any) => item.program_id === trocModule?.program_id);
  const dashboards = await getApiData(`${urlBase}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${trocModule?.module_id}`, 'GET')
  const widgets = await getApiData(`${urlBase}/api/v2/widgets?dashboard_id=${dashboards[0]?.dashboard_id}`, 'GET')
  return { trocModule, dashboards, widgets, menu }
}