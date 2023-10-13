import { getApiData } from "$lib/services/getData"
import { redirect } from "@sveltejs/kit"

export const load = async ({locals, fetch}) => {
  if (!locals.user) throw redirect(302, '/')

  const headers = { authorization: `Bearer ${locals.user.token}` }
  const programs = await getApiData(`programs`, 'GET', {}, {}, { headers }, fetch) 
  return { programs, user: locals.user }
}