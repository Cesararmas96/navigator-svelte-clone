import { getApiData } from "$lib/services/getData"
import { redirect } from "@sveltejs/kit"

// export const ssr = false;

export const load = async ({params, fetch, locals, url}) => {
  console.log('locals.user', locals.user)
  if (!locals.user)  throw redirect(302, '/login')

  const urlBase = import.meta.env.VITE_API_URL

  const token = url.searchParams.get("token") || locals.user?.token;
  const headers = token ? {authorization: `Bearer ${token}`} : {};

  const dashboards = await getApiData(`${urlBase}/api/v2/dashboards?program_id=${params.program_id}&module_id=${params.module_id}`, 'GET', {}, {}, {headers}, fetch)
  const dashboard = dashboards.find((item: any) => item.duid === params.uuid);
  return { dashboard, user: locals.user }
}