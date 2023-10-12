import { getApiData } from "$lib/services/getData"
import { redirect } from "@sveltejs/kit"

export const load = async ({cookies, locals, fetch}) => {
  console.log('cookies', cookies)
  if (!locals.user) {
    throw redirect(302, '/')
  }

  const programs = await getApiData(`programs`, 'GET', {}, {}, {}, fetch) 
  return { programs }
}