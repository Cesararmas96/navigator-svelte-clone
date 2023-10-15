import { getApiData } from "$lib/services/getData"
import { redirect } from "@sveltejs/kit"

// export const ssr = false;

export const load = async ({params, fetch, locals}) => {
  if (!locals.user)  throw redirect(302, '/login')

  const urlBase = import.meta.env.VITE_API_URL

  const headers = { authorization: `Bearer ${locals.user.token}` }

  const programs = await getApiData(`programs`, 'GET', {}, {}, {headers}, fetch) 
  const modules = await getApiData(`${urlBase}/api/v2/modules?program_slug=${params.programs}`, 'GET', {}, {}, {headers}, fetch) 
  const moduleName = (params.dashboard) ? params.dashboard : params.programs;
  const trocModule = modules.find((item: any) => item.module_name === moduleName || item.module_slug === moduleName);
  const menu = modules.filter((item: any) => item.program_id === trocModule?.program_id);
  const dashboards = await getApiData(`${urlBase}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${trocModule?.module_id}`, 'GET', {}, {}, {headers}, fetch)

  return { programs, trocModule, dashboards, menu, user: locals.user }
}