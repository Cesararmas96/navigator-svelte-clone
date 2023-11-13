import { getApiData } from "$lib/services/getData"
import { redirect } from "@sveltejs/kit"

export const load = async ({locals, fetch, url}) => {
  if (!locals.user) throw redirect(302, '/')
  if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')

  const headers = { authorization: `Bearer ${locals.user.token}` }
  const programs = await getApiData(`programs`, 'GET', {}, {}, { headers }, fetch) 

  const tenant = url.hostname.split('.')[0]

  return { programs, user: locals.user, tenant }
}